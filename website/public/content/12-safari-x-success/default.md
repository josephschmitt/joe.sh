Title: Safari X-Success
----
Short: xsuc.es
----
Subtitle: Back, back, back it up!
----
Date: Mar 3, 2014 10:29am
----
Status: Published
----
Text:

(forkme: josephschmitt/safari-x-success)

My favorite feature in Chrome for iOS is its [support](chrome-ios-dev) for a part of the [x-callback-url protocol][x-callback-url] called x-success. The x-success parameter is used to tell an application that conforms to the protocol what to do after the primary action has been performed. For example, if you launch [Tweetbot][tweetbot] from an app like [Drafts][drafts-app], you can tell Tweetbot to return to Drafts once the tweet has been posted. What Chrome does that is so clever is it uses this parameter to give the browser a back button to return to the app it was launched from. So, if you open a link in Chrome from Tweetbot or a mail client like [Mailbox][mailbox-app], you'll get a back button in the browser to return to that app (it'll even close that now unused window). This ends up being a much nicer and quicker flow than tapping on the tabs manager, closing the tab, double-tapping the home button, switching apps, etc.

[chrome-ios-dev]: https://developers.google.com/chrome/mobile/docs/ios-links
[x-callback-url]: http://x-callback-url.com/
[tweetbot]: http://tapbots.com/tweetbot/
[mailbox-app]: http://www.mailboxapp.com

This is by far my single favorite thing about Chrome for iOS. I [like it][tweet-1] so much, in fact, that although I've switched back to Safari on OS X[^1], I've stuck with Chrome on iOS. I even [champion][tweet-2] the [inclusion][tweet-3] of this [feature][tweet-4] with app developers after I notice they've added Chrome support, but not support for x-success. It's **that** important to me.

[tweet-1]: http://twitter.com/josephschmitt/statuses/403591672031752192
[tweet-2]: http://twitter.com/josephschmitt/statuses/374735711712194560
[tweet-3]: http://twitter.com/josephschmitt/statuses/294615626884972544
[tweet-4]: https://twitter.com/josephschmitt/status/433511033471111168

However, not using the same browser across OS X and iOS is annoying enough that I notice it on a daily basis. Wouldn't it be great if Safari supported Chrome's back button behavior? It sure would. However, Apple's laissez faire attitude towards inter-app communication keeps me from holding my breath on this front. Therefore, I was truly excited when I saw this post by the father of x-callback-url himself, [Greg Pierce][safari-hack-post], wherein he launches a simple HTML page in Safari and uses JavaScript to add x-success links to the page on his own. Woah, awesome!

[safari-hack-post]: http://agiletortoise.com/blog/2014/02/28/mimic-x-callback-url-in-mobile-safari/

However, Greg's technique depends on loading a full-screen iframe on the page and overlaying a back button on top to trigger the x-success url. That gets the job done, but I really prefer how Chrome handles this: make the last page jump to the previous app. I brainstormed for a bit and figured I could probably replicate Chrome's behavior's using Greg's idea, and I was right: [xsuc.es][xsuc.es] was born.

[xsuc.es]: http://xsuc

## The Anatomy of an xsuc.es URL

Here's how xsuc.es expects URLs:

````
http://xsuc.es/#
	url={{http://your-url.com}}
	&x-success={{tweetbot://}}
	&x-source={{Source Friendly Name}}
````

The URL scheme used by xsuc.es is very similar to Greg's. Instead of directly opening a URL in Safari, you link to xsuc.es and pass in a few parameters:

1. **url**: This is the url of the page you actually want to visit in Safari.

2. **x-success**: Where the rubber meets the road, this is the URL you want to load when the user taps on the back button (usualy an app's URL scheme, but I guess it could be a normal HTTP URL too if you really wanted).

3. **x-source** _(Optional)_: The "friendly" name of the app you'll be going back to. This is displayed in your browser history.

Overall, it's very close to Greg's original format, with one major difference: the use of a hash (#) character after the base URL instead of a question mark. The reason for this is, unlike in Chrome, we can't automatically close the window when jumping back to the x-success app. Therefore, if we submitted all the parameters using normal query strings, we could potentially end up with a Safari browser littered with empty xsuc.es pages that were never closed. However, hash characters are not considered part of the actual URL in a browser (it doesn't even get sent to the backend server). Therefore, Safari will think all xsuc.es urls are the same and will just re-use the same tab over and over again, meaning we'll only have up to 1 tab open at a time. Not perfect, but a decent work-around to this limitation.

So there you have it, we now have x-success support in Safari, and it works pretty damn well if you ask me! Go ahead, load up your iOS device and try it out. If you have Tweetbot, view [this tweet][tweetbot-test-tweet] in Tweetbot, open the link in Safari, and then tap the back button to instantly be dropped back into Tweetbot. MAGICAL.

[tweetbot-test-tweet]: https://twitter.com/josephschmitt/status/440557347589459968

## But Wait, There's Bad News

Wait a minute, this all sounds like it's working great! How can there be bad news?!

Well, the world isn't all [sunshine and rainbows](http://cornify.com). Unfortunately, forcing all URLs to open via another URL brings with it a host of issues. First, there's app support. To get this working in an app like Tweetbot, Tapbots would have to make tapping on a URL in their app open up xsuc.es and submit the right parameters. Second, while integration is easy enough, what happens if the xsuc.es site goes away? or gets overloaded with traffic? or I become evil and decide to start serving ads to everyone to make some $$$? Do all URLs in Tweetbot suddenly break? 

These are valid concerns, and would certainly get me to think twice about integrating the scheme if it were **my** app. So, for now, this lives as an experiment and proof of concept. You *can* use this scheme in apps that allow you to define your own URL schemes for launching, such as Greg's own [Drafts][drafts-app] app or Contrast's [Launch Center Pro][launch-center]. But any support or use beyond that looks unlikely at best.

[drafts-app]: http://agiletortoise.com/drafts/
[launch-center]: http://contrast.co/launch-center-pro/

Regardless, I think this is pretty cool, and I at least hope any attention this hack gets is either useful to your specific situation, or gets Apple thinking about integrating this kind of communication in their own apps in the future. If you have any questions, concerns, or suggestions, feel free to leave an Issue on the [GitHub project page][proj-page].

[proj-page]: https://github.com/josephschmitt/safari-x-success

[^1]: Safari on Mavericks is ludicrously smooth and fast.