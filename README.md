# Cloudflare Workers Internship Application - Full-Stack: Applicant Comments

## Deployment

The project is deployed to https://abtester.hiroinaprotagonist.workers.dev

I realized after submitting that the repo is the project folder and a subfolder is not needed and fixed the file structure to match that. I also removed the following from a comment in my script file and moved it to this file. The project instructions are available in the PROJECT_REQS.md file. The project code has not been modified after submission except to remove my comment about the project, which now makes up this file.


## General Information on Coding Style and The Project

This is an orientation to the coding style choices that I made for this project and to the comments and additional information that I am submitting with the code.

### 1. Style Choices:

I looked through the examples in the template gallery and followed your generally observable conventions, as follows:

I used single quotes rather than double quotes to denote strings.

I left out all ending semicolons.

I capitalized narrative comments and ended them with a period.

Other style-related conventions that I followed:

In html code, I used double quotes in the code and single quotes to denote the string containing said code.

I used template literals to describe constructions that would have required using the `+` operator to concatenate a string.

### 2. Commenting Choices:

`//`Denotes a permanent, generally narrative, comment.

`// `Denotes an auto-commented comment, generally diagnostic, designed to be easily un- and re-commented in blocks of commented and uncommented code using `Ctrl-/`, if that has a standard implementation in the reader's software.

Functions are commented in JSDoc style, although I did not create a JSDoc file.

I used Response instead of Promise as the type in comments. I believe this is most correct even though a successful Response is preceded by a Promise because the project works asynchronously.

I have left all of my diagnostic comments as comments in the code so you can get a better idea of my thought/troubleshooting/testing processes.

### 3. Choices regarding References:

If I copied, or copied and modified, a large block of code, I included a reference to the source of the original code above the block.

I have included a list of references at the very bottom of this document. Those link to the template gallery resources that I found helpful. I thought that information might be useful to someone.

### 4. Work Completed:

1) Deployed a single page website based on a randomly chosen URL from the provided JSON data.
See https://abtester.hiroinaprotagonist.workers.dev/

2) Modified the web page's title, the main title on the page, the description paragraph on the page, and the text and URL of the Call to Action link on the page.

3) Set the initially chosen random URL to persist in a cookie so that the user sees that variant of the site depending on their Do Not Track settings, as specified in 4. The user must visit the site once every 30 days or the cookie will expire.

4) Extended the implementation of the cookie so that the application either sets, does not set, or removes the cookie based on the browser's Do Not Track setting (retrieved from the appropriate header). This feature works as expected in the tested versions of Firefox and Chrome.
It works in Microsoft Edge, but requires a restart after changing the Do Not Track setting in order to properly set (or remove) the cookie.

5) Added text to the description paragraph on the page that indicates whether or not the browser has Do Not Track enabled and is, or is not, using cookies.

I do not have a registered domain or zone, so I did not implement that feature.

### 5. Testing:

Works as expected in the following browsers:
1) Firefox 75.0 64-bit
2) Microsoft Edge 44.18362.449.0 (See notes at item 4 of Work Completed)
3) Chrome Version 81.0.4044.113 (Official Build) (64-bit)

### 6. Potential Issues for Improvement:

Resolve browser warnings about document type (Edge) and encoding (Firefox).

Add error handling, especially to the gatherResponse function.

Understand asynchronous JavaScript more fluently, particularly so that I could be more comfortable writing detailed comments and explanations.

## Final Thoughts

This was a great exercise. I learned a lot, was challenged a bit, and I am excited to be in this application process and even more excited to potentially become a Cloudflare intern.

Have a wonderful day.
