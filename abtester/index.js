/*
This was a great exercise. I learned a lot, was challenged a bit, and am excited
to be in this application process and even more excited to potentially be a
Cloudflare intern this semester.

This is an orientation to the coding style choices that I made for this
project and to the comments and additional information that I am submitting with
the code. The code itself begins at line 87, if you would like to skip ahead.

Choices re Style:
I looked through the examples in the template gallery and followed your generally
observable conventions, as follows:
I used single quotes rather than double quotes to denote strings.
I left out all ending semicolons.
I capitalized narrative comments and ended them with a period.

Other style-related conventions that I followed:
In html code, I used double quotes in the code and single quotes to denote the string
containing said code.

I used template literals to describe constructions that would have required using
the + operator to concatenate a string.

Choices re Comments:
//Denotes a permanent, generally narrative, comment.
// Denotes an autocommented comment, generally diagnostic, designed to be
easily uncommented and recommented in blocks of commented and uncommented code
with Ctrl-/ if that has a standard implementation in the reader's software.

Functions are commented in JSDoc style, although I did not create a JSDoc file.
I used Response instead of Promise as the type in comments. I believe this is
most correct even though a successful Response is preceded by a Promise because
the project works asyncronously.

I have left all of my diagnostic comments as comments in the code so you can get a
better idea of my thought/troubleshooting/testing processes.

Choices re References:
If I copied, or copied and modified, a large block of code, I included a reference
to the source of the original code above the block.

I have included a list of references at the very bottom of this document.
Those link to the template gallery resources that I found helpful.
I thought that information might be useful to someone.

Work Completed:
1) Deployed a single page website based on a randomly chosen URL from the provided
JSON data.
See https://abtester.hiroinaprotagonist.workers.dev/

2) Modified the web page's title, the main title on the page, the description paragraph
on the page, and the text and url of the Call to Action link on the page.

3) Set the initially chosen random URL to persist in a cookie so that the user
sees that variant of the site (when appropriate, see 4). The user must visit the
site once every 30 days or the cookie will expire.

4.a) Extended the implementation of the cookie so that the application either sets,
does not set, or removes the cookie based on the browser's Do Not Track setting
(retrieved from the appropriate header).

This feature works as expected in the tested versions of Firefox and Chrome.
It works in Microsoft Edge, but requires a restart after changing the Do Not Track
 setting in order to properly set (or remove) the cookie.

4.b) Added text to the description paragraph on the page that indicates whether
or not the browser has Do Not Track enabled and is, or is not, using cookies.

I do not have a registered domain or zone, so I did not implement that feature.

Testing:
Works as expected in the following browsers:
1) Firefox 75.0 64-bit
2) Microsoft Edge 44.18362.449.0 (See notes at item 4 of Work Completed)
3) Chrome Version 81.0.4044.113 (Official Build) (64-bit)

Potential Issues for Improvement:
There are browser warnings about document type (Edge) and encoding (Firefox).

Add error handling, especially to gatherResponse function.

Understand asyncronous javascript more fluently, particularly so that I could be
more comfortable writing detailed comments and explanations.

Have a wonderful day.
*/

//Supplied url to use to retrieve JSON data.
const URLToUse = 'https://cfw-takehome.developers.workers.dev/api/variants'

//Set up event listener to handle request.
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Asyncronously fetches URL data, then page associated with appropriate URL,
 * handles cookies, and manipulates page so that edited page is ultimately displayed
 * @param {Request} request - Request object
 * @returns {Response} Response object
 */
async function handleRequest(request) {
  //Get DNT header value if exists.
  //DNT-0 is allow tracking, 1 is don't allow tracking.
  const DNT = request.headers.get('DNT') || null
  // console.log(`DNT: ${DNT}`)

  //Send request and receive response.
  const response = await fetch(URLToUse)

  //Check for variant cookie and set URL index based on cookie or random number.
  let cookies = request.headers.get('Cookie') || ''
    if(getCookie(cookies, 'variant') != null) {
    var URLNum = parseInt(getCookie(cookies, 'variant'), 10)

    //Flag that a cookie does already exist.
    var variantCookieExists = true
    // console.log('Cookie retrieved')
  } else {
    var URLNum = Math.floor(Math.random() * 2)

    //Flag that there is no existing cookie. Not currently used if false.
    var variantCookieExists = false
    // console.log('No cookie present')
  }

  //Process JSON response into array of URLs.
  const URLsRetrieved = await gatherResponse(response)

  //Get single URL based on cookie or random number.
  const URL = URLsRetrieved[URLNum]
  // console.log(`URL: ${URL}`)
  // console.log(`URLNum: ${URLNum}`)

  //Get the page associated with the appropriate URL.
  let oldFetch = await fetch(URL)

  //Variables to transform page.
  //Convert arithmetically from array index to number for display.
  const titleNum = URLNum + 1
  // console.log(`TitleNum: ${titleNum}`)

  const newTitle = `Cloudflare App Ver ${titleNum}`
  const newH1 = `URL variation #${titleNum}`
  const newP = 'This is the completed take home project!!'
  const newA = 'https://hiroinaprotagonist.com/'
  const newATxt = 'Visit my website'

  //check for DNT settings and display an appropriate message.
  //DNT-0 is allow tracking, 1 is don't allow tracking.
  const trackingAllowed = '<br/><br/>Cookies are allowed: using cookies.'
  const noTrackingAllowed = '<br/><br/>Respecting DNT settings: not using cookies.'

  //Choose the appropriate DNT message to display.
  const DNTTxt = (DNT == '0' || DNT == null) ? trackingAllowed : noTrackingAllowed

  let newFetch = new HTMLRewriter()
    //Replace title.
    .on('title', new ElementHandler('title',newTitle))

    //Replace h1#title.
    .on('h1#title', new ElementHandler('h1#title',newH1))

    //Replace p#description.
    .on('p#description', new ElementHandler('p#description',newP))

    //Replace a#url with link to my site and update text.
    .on('a#url', new ElementHandler('href',newA, 'setAttribute'))
    .on('a#url', new ElementHandler('a#url',newATxt))

    //Add DNT message.
    .on('p#description', new ElementHandler('p#description',DNTTxt,'append'))

    //Apply changes.
    .transform(oldFetch)

  //DNT-0 is allow tracking, 1 is don't allow tracking.
  //If tracking not allowed (DNT=1) and a variant cookie exists, set cookie to expired.
  if(DNT == '1' && variantCookieExists){
     //Recreate transformed final fetch to make headers mutable so cookie can be set.
    newFetch = new Response(newFetch.body, newFetch)

    //Set existing cookie to expired.
    newFetch.headers.set('Set-Cookie', `variant=''; Expires=Sun 01 Jan 1995 01:00:00 GMT; HttpOnly; SameSite=Lax`)
    // console.log('Cookie set as expired.')

  //If tracking allowed (DNT=0 or not set) and no variant cookie is present, set a new session cookie.
  //If tracking allowed (DNT=0 or not set) and variant cookie exists, reset the cookie to extend its date.
  } else if(DNT != '1') {
    newFetch = new Response(newFetch.body, newFetch)

    // console.log(`URLNum for cookie: ${URLNum}`)

    //Set new cookie with appropriate data and expiration setting (30 days from date set).
    let dateNow = Date.now()

    //Increment date 30 days in milliseconds.
    const dateToSet = dateNow + (30 * 24 * 60 * 60 * 1000)
    // console.log(`Date - Now, To Set: ${dateNow}, ${dateToSet}`)
    newFetch.headers.set('Set-Cookie', `variant=${URLNum}; Expires=${dateToSet}; HttpOnly; SameSite=Lax`)
    // console.log('Cookie set as session.')
  }

  return newFetch
} //End of handleRequest function.

/**
 * Processes JSON data from Response object into array of URLs
 * @param {Response} response - Response object
 * @returns {Array} Array of URLs
 */
async function gatherResponse(response) {
  //Process JSON and return an array of URLs.
  const JSONString = JSON.stringify(await response.json())
  var URLs = JSON.parse(JSONString).variants
  return URLs
}

/**
 * Splits a string of cookies and checks for a cookie that matches the given name
 * @param {String} cookieString - String of cookies to search
 * @param {String} name - Name of cookie to retrieve
 * @returns {String} Null or value of found cookie
 */
//Reference: https://developers.cloudflare.com/workers/templates/pages/cookie_extract/
function getCookie(cookieString, name) {
  //Account for conditions where there are no cookies.
  if(cookieString == null){ return null; }

  //Split string of cookies into names and values and return value if name param present.
  let result = null
  let cookies = cookieString.split(';')
  cookies.forEach(cookie => {
    let cookieName = cookie.split('=')[0].trim()
    if (cookieName == name) {
      let cookieVal = cookie.split('=')[1]
      result = cookieVal
      console.log('Cookie was retrieved')
    }
  })
  return result
}

/**
 * Handles methods that act on document HTML elements as accessory class for HTMLRewriter
 * @param {String} name - Name of element/text/comment or attribute
 * @param {String} newValue - Value to which to set element/text/comment
 * @param {String} action - Directs which element/text/comment manipulation function to apply
 * @returns {void} Nothing
 */
class ElementHandler {
  //Add parameters as necessary to direct data manipulation.
  constructor(name, newValue, action) {
    this.name = name
    this.newValue = newValue
    this.action = action
  }

  //Set up element-related methods here.
  element(element) {
    const attributeToChange = element.getAttribute(this.name)

    // console.log(`Name: ${this.name}`)
    // console.log(`Incoming element: ${element.tagName}`)
    // console.log(`action: ${this.action}`)
    // console.log(`attribute to change: ${attributeToChange}`)

    //Add additional cases as needed to make more element-related methods available.
    switch(this.action){
      case 'setAttribute':
        //Diagnostic block to observe attribute names.
        // var attr = element.attributes
        // for(let at of attr){
          // console.log(`Attribute: ${at}`)
        // }
        element.setAttribute(this.name,this.newValue,  { html: Boolean })
        break

      case 'append':
        // console.log(`Incoming element: ${element.tagName}`)
        element.append(this.newValue, { html: Boolean })
        break

      //Defaults to setInnerContent.
      default:
        // console.log(`Incoming: ${this.name}`)
        element.setInnerContent(this.newValue,  { html: Boolean })
        break
    }
  }

  //Stub for comments - uncomment console.log to view any incoming comments.
  //Add support for methods to manipulate comments here.
  comments(comment) {
    // console.log(`Incoming comment: ${comment.text}`)
  }

  //Stub for text - uncomment console.log to view any incoming text.
  //Add support for methods to manipulate text here.
  text(text) {
    // console.log(`Incoming text: ${text.text}`)
  }
}

/*
References:
Fetch JSON: https://developers.cloudflare.com/workers/templates/pages/fetch_json/
A/B Testing: https://developers.cloudflare.com/workers/templates/pages/ab_testing/
Extract Cookie Value: https://developers.cloudflare.com/workers/templates/pages/cookie_extract/
Alter Headers: https://developers.cloudflare.com/workers/templates/pages/alter_headers/
*/
