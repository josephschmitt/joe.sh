Title: Shiori Keyboard Maestro Shortcut
----
Short: Shiori Shortcut
----
Subtitle: Macro-ty Mac... don't talk back.
----
Date:  Aug 9, 2013 12:26pm
----
Status: Published
----
Text:

I recently discovered a fantastic Mac [Pinboard][pinboard] client called [Shiori][shiori]. It provides a simple, clean, and best of all _fast_ user interface for accessing and adding bookmarks to Pinboard (and Delicious). Bookmark retreival uses a wonderful little UI reminiscient of Alfred/Quicksilver that makes bookmark search ridiculously easy:

(figure: shiori-search.png width:100% alt:Search Bookmarks in Shiori)

Adding a bookmark is similarly nice, and replaces the functional (yet not always delightful) default Pinboard [bookmarklet][bookmarklet]:

(figure: shiori-add.png width:100% alt:Add Bookmark in Shiori)

However, one feature I really miss from the bookmarklet is the ability to automatically add any selected text on the web page you're saving as the description of the bookmark. This is a huge timesaver for me, as I like pull-quoting large sections of websites and using them as descriptions; makes finding said web sites later on a bit easier. Bummer.

However, after a few minutes in Keyboard Maestro[^1], I was able to whip up a shortcut that gets me exactly what I need:

(figure: km-macro.png width:auto alt:Keyboard Maestro Macro align: left)

The logic behind the script is actually pretty straightforward.

Whenever a hot key is triggerd (in my case, Ctrl+Cmd+S), perform the following actions:

1. Get the current clipboard contents and save it to a variable.
2. Perform a copy of whatever is currently selected.
3. Save the new clipboard contents and save that to another variable.
4. Trigger Shiori (in my case, with Ctrl+Shift+Cmd+S).
5. Compare the newly copied clipboard text to the previous clipboard:
	1. If they don't match, it means text in your browser was selected and we should use that text to fill in the description field (by pressing Tab[^2] and then pasting. The last Shift+Tab's is for focusing the keyboard back on the Tag field).
	2. If they do match, then nothing was copied from the browser, so just Tab to the description field and don't do anything else.
6. Set the clipboard back to its original contents (so you don't lose anything you had in there before you ran this macro).

<br />You can (link:Save to Pinboard.kmmacros.zip text: download the macro here). Don't forget to change the hotkeys in the macro to match your setup/preferences. Let me know if you have any suggestions on how to make it better!

[^1]: I actually adapted this macro from a very similar one I wrote a year or so ago that does the exact same thing in [Reeder for Mac][reeder-mac]. If you're interested, you can (link:Save to Pinboard - Reeder.kmmacros.zip text: download that version here). Will be useful assuming Reeder for Mac returns eventually.

[^2]: This macro will need a slight update if you have the Full Keyboard Access option in System Preferences set to "All controls". You'll need to Tab and Shift+Tab twice, otherwise it'll only select the plus button when run. Thanks to [Dave Overton][dave-overton] for pointing this out.

[shiori]: 		http://aki-null.net/shiori/
[pinboard]:		http://pinboard.in
[bookmarklet]: 	https://pinboard.in/howto/
[reeder-mac]:	http://reederapp.com/mac/
[dave-overton]:	https://twitter.com/daveove/status/365952980505206784