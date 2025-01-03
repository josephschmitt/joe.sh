Title: Using the Pebble to Control Your Mac (and iPad)
----
Short: Pebble/Mac
----
Subtitle: For fun and profit.
----
Theme: blue
----
Date: Mar 4, 2014 5:55pm
----
Status: Published
----
Text:

[Federico Viticci][macstories], ever the [master of wokflows][macstories-url-schemes], posted a [neat bookmarklet][command-c-bookmarklet] that uses Safari and Command-C on iOS. Here's the gist:

[macstories]: http://macstories.net/
[macstories-url-schemes]: http://www.macstories.net/tag/url-scheme/
[command-c-bookmarklet]: http://www.macstories.net/tutorials/command-c-browser-actions/

>The bookmarklet is part made for myself, part proof of concept (as always) for others to iterate upon. It doesn't only send URLs from Safari on another device with Command-C – it sends the webpage you're currently viewing in Safari to another app on another device with Command-C.

Pretty clever — and useful — stuff. At the end of the article, however, Federico posits whether you'd be able to trigger such a workflow from a Pebble, [Bond-style][bond-style]. He linked to a tweet of mine from a while back in which I rejoiced at being able to control my Mac mini server via my Pebble, and so he figured this was all possible. Well, I'm here to tell you he's right, and here's the proof...

[bond-style]: http://www.macstories.net/tutorials/command-c-browser-actions/#fn2

(vimeo:https://vimeo.com/88208604)

It worked so well, that it was done running before my camera even had a chance to focus.

## So how does this black magic work?

The workflow for this type of thing isn't so much complicated as it is just convoluted, so I'll go over it in plain English first, and then I'll actually show how to build one of your own. Here's the short version:

1. Use the Smartwatch+ Pebble app and its HTTP Request feature to call a URL on your phone.
2. That URL points to a Mac mini server, and more specifically to a public Keyboard Maestro macro.
3. The Keyboard Maestro macro, shown in the video, responds to that URL by launching Safari and typing Cmd+1
4. The Cmd+1 keyboard shortcut triggers the first bookmark in my bookmarks bar, which is Federico's javascript bookmarklet
5. The bookmarklet grabs the URL of the current page and then calls the URL scheme for Command-C, with the current page's URL as a parameter
6. Command-C beams that URL over bluetooth to Command-C on my iPad.
7. Upon receiving the URL, Command-C for iPad automatically opens it in Safari.

All told, this little gimmick involved a smart watch, HTTP, a server, a macro engine, bluetooth, and a tablet. WE LIVE IN THE FUTURE.

## Ok, I sort of get it, but how can I get me one of these?

The list of requirements to get this all working is nothing to be sneezed at. I don't recommend you try this if you don't enjoy hacking around with unstable pieces of technology, and especially if you don't already have the following:

1. A Pebble.
2. An iPhone.
3. A Mac that's always on.
4. A router with some ports open that forward to said Mac.
5. Some free time for the inevitable de-bugging.
6. Some working knowledge of HTML and how the Webkit Inspector works.
7. $42.98 of spare cheddar to spend on Keyboard Maestro, Smartwatch+ and Command-C.

However, if you *do* possess all these things, and I haven't scared you away yet, here's how to get this all going:

1. Open up the Pebble app on your iPhone[^1] and install Smartwatch+ from the Apps category (it should be right on the front page).
2. Install the [Smartwatch+ companion app][smartwatch-plus] from the App Store, it's $2.99.
3. Open up the Smartwatch+ app on your phone.
4. Drag the HTTPRequest Screen item up to "Enabled Watch Screens"
5. Go into the HTTPRequest Screen option, and tap the plus button to add a new request
6. Put your phone aside for now.
7. Install Keyboard Maestro on your Mac, [it's $36][keyboard-maestro]
8. Open Keyboard Maestro, go to Preferences > Web Server, and enable it
9. Choose an open port on your network for Keyboard Maestro to run on
10. Set up your router and your Mac so that it's publicly reachable outside your network (I used port-forwarding. If you don't know how to do this, the answers are but a [Google search][port-forwarding] away. Make sure to forward the port you set in Keyboard Maestro in the step above).
11. Back in Keyboard Maestro, add a new Macro
12. For "Triggered by any of the following", either set it to or add "The public web entry is executed".
13. Under "Will execute the following actions", add what you want to happen when you run this Macro. For example, in the video I had it open Safari and type a keystroke. This is where the real power is, the world is your oyster. Anything you can get Keyboard Maestro to do here will be trigger-able from your Pebble.
14. Save your Macro.
15. Open up your web browser, and enter in the web address you access your computer from, along with the port you chose for Keyboard Maestro (by default that port is 4490, but you might've changed it in step 9).
16. Now here's the kinda hacky part. The way this page works is, you choose a Macro from the Public Macros dropdown, and a URL is called. That URL is http://your-server:4490/action.html?macro=MACROID. Where do you get this MACROID value? Well, I haven't found a way to get it from Keyboard Maestro direclty, so we'll have to do a big of web inspecting. If you inspect the dropdown and take a look at the HTML behind this page, you'll notice the dropdown is a `<select>` element with a bunch of `<option>` elements. Each `<option>` element has a label (the name of the macro) and a value. This value attribute is what you want. Copy that and place it as the macro parameter in the URL (where I had MACROID).
17. Grab this now complete URL and send it on over to your phone (hint: [Command-C][command-c] is your friend here, $3.99 on the App Store)
18. Paste the URL into the URL field in Smartwatch+ on your phone, name it, and hit save.

[port-forwarding]: http://lmgtfy.com/?q=port+forwarding
[keyboard-maestro]: http://www.keyboardmaestro.com/main/
[smartwatch-plus]: https://itunes.apple.com/us/app/smartwatch+-for-pebble/id711357931?mt=8
[command-c]: https://itunes.apple.com/us/app/command-c/id692783673?mt=8

Aaaaand, that's it! Now you can trigger one-off macro's from your Pebble. This has actually been quite useful for me, since I have a Mac mini server that runs headless (i.e. without a monitor hooked up) and sometimes I want to tell it to do something without having to remote in. I have workflows that will (file:Pause Backblaze.kmmacros.zip text:pause) or (file:Resume Backblaze.kmmacros.zip text:resume) [Backblaze](http://backblaze.com) (helpful when it's clogging my Internet connection), (file:Restart iTunes.kmmacros.zip text:restart iTunes) (when it misbehaves with the Apple TV, which is _a lot_), (file:Restart Hazel.kmmacros.zip text:restart Hazel) (which for some reason never re-opens after installing an update), and (file:Start Plex.kmmacros.zip text:start Plex).

If you have any other cool workflow ideas for this, send me a tweet, I'd love to hear about them!

[^1]: This is an iPhone-specific walkthrough for 2 reason: once, that's what I have, and two, the 2.0 Pebble app for Android isn't out yet. Once that's out, you should be able to do this on Android, too.