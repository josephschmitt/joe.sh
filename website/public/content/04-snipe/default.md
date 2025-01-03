Title: Say Hello To Snipe
----
Short: Snipe
----
Subtitle: I've got 99 problems but a lost browser tab ain't one.
----
Date: Feb 23, 2011 3:31pm
----
Status: Published
----
Text:

(forkme: josephschmitt/Snipe)

Over the past few weeks I've taken it upon myself to [learn Python](http://docs.python.org/tutorial/index.html). Learning a new programming language is fun and all, but it requires a ton of work and a ton of research. All of this research has left me with a lot of open tabs and windows that look a bit like this:

(figure: safari-tabs.png alt: Lots of tabs in Safari)

Or if you're a [crazy Chrome user](http://craigiam.tumblr.com/), like this:

(figure: chrome-tabs.png alt: Lots of tabs in Chrome)

Finding a specific tab in that mess is no fun, especially when you have multiple tabs open from the same site, leaving all your tabs looking the exact same, starting with the same words. I thought there must be a better way to handle this when it occurred to me that the same problem exists on your operating system when looking for Apps, and OS makers have come up with [some](http://www.apple.com/macosx/what-is-macosx/spotlight.html) [great](http://quicksilver.en.softonic.com/mac) [solutions](http://windows.microsoft.com/en-US/windows7/Whats-new-with-the-Start-menu).

Since this solution is so natural and intuitive, I thought it would be a perfect fit to apply the same idea to searching your browser tabs and windows, and Snipe is the product of that:

(figure: snipe-ui.jpg alt: Snipe User Interface)

To bring up Snipe, you simply press Ctrl + Alt + Space [^1] on any open tab[^2], and up pops the input field. Begin typing and, automagically, results from your open tabs (in any window!) start appearing. Use your keyboard to select which tab you'd like, and Snipe will switch you to that tab and get out of your way. Snipe searches both the title and the url of your tabs, so fear not if you're looking for your Facebook tab but don't remember what page it's on. Also, searching is "fuzzy", meaning you don't have to get the content exactly right to get a result, and the results are smartly sorted by which one Snipe thinks is the most relevant based on your key words.

I've shared this extension with some people around the office and they really seem to like it. I know I've found myself using it constantly throughout the day, so I'm excited to see if other people find Snipe as useful as I do. Check out the download links below to install the extension (Chrome and Safari only) and, like all the projects I post on Reusable Bits, Snipe is also available for you to [fork on Github](https://github.com/josephschmitt/Snipe) to make your own additions and contributions. I'd love to hear about any feature ideas you have on the extension (there's already a couple ideas I have in a todo on the Github page) so feel free to leave any brainstorms in the comments.

[Snipe for Safari](https://s3.amazonaws.com/gosnipe.in/Snipe.safariextz) | Snipe for Chrome ([Web Store](https://chrome.google.com/webstore/detail/glmjakogmemenallddiiajdgjfoogegl)) ([Direct Download](https://s3.amazonaws.com/gosnipe.in/Snipe.crx)) | [Source on Github](https://github.com/josephschmitt/Snipe)

[^1]: For Chrome users of Snipe, you have a couple other options as well. Snipe will work as a popup window with the regular Ctrl + Alt + Space shortcut, but it also shows up as a button in your toolbar and clicking that button will invoke the Snipe UI. Also, for the super-savy Chrome users, you can take advantage of Chrome's [Omnibox](http://blog.chromium.org/2011/02/extending-omnibox.html). Simple type "tabs" into the Omnibox and then hit the TAB key, and begin searching for your tabs as normal. You'll see your Snipe results show up built right in to Chrome.

[^2]: After you first install the extension you'll have to either refresh all of your open tabs or restart your browser to get the keyboard shortcut to work. Sorry, but I don't think there's a way around this!