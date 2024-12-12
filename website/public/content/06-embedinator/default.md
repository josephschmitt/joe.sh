Title: Embedinator
----
Subtitle: The HTML 5 alchemy to your Flash video woes.
----
Date: Aug 4, 2011 7:43pm
----
Status: Published
----
Text:

(forkme: josephschmitt/Embedinator)

One of the first decisions I made after getting my MacBook Air was that I would try running it without Adobe's Flash player installed for a while and see how it would do. After all, Apple wasn't even installing Flash on its computers anymore, so the open web must be doing pretty well, right? I ran with this setup for a couple of reasons other than Apple's refusal to install it on my system. First, I'm a fan of performance and all evidence points to Flash taking performance out back, putting a shotgun to its head, and going all Old Yeller on it's ass (err, head). Second, I was curious to see how much of the web had moved over to using HTML5-compatible video standards now that the iPad had been out for almost 18 months.

The experiment worked pretty well, actually. With Vimeo videos, since we [released the Universal Embed Code](http://vimeo.com/blog:334) and [Desktop HTML5 Player](http://vimeo.com/blog:391) last year, the vast majority of new videos played fine. YouTube, however, was a different story. They also have an [embeddable HTML5 player](http://www.youtube.com/html5), but they're certainly in no rush to promote it, so most YouTube embeds are of the Flash <object> embed variety. To get around this, there's a neat Safari extension called [YouTube5](http://www.verticalforest.com/youtube5-extension/) that replaces YouTube Flash video players with a nice, simple HTML5 player that plays great on the desktop. Life was good.

Then, a couple of days ago, YouTube changed something on their end and inadvertently (or not so inadvertently) broke YouTube5. I'm sure the extension author will get around to fixing the extension at some point, but what's to stop it from breaking again in the future? There has to be a better way.

As it turns out there *is* a better way, and I actually wrote it myself when we originally announced our Universal Embed player at Vimeo. When the Universal Embed first came out, we had deal with the fact that while all *future* embedded videos would be able to display HTML5 or Flash video players, we still had millions and millions of embedded videos that were embedded the old-fashioned way with Flash (which is true to this day). The solution was a snippet of JavaScript I wrote that would search the page for any old Flash embed code, grab all of the important information we needed from it, and replace it with the updated Universal Embed. The original intention was for site authors to use on their own websites, but there's no reason this couldn't be (quite easily) turned into a browser extension.

So, without further ado, I give you the [Embedinator](https://github.com/josephschmitt/Embedinator). It'll scan the page for embeds and update them where necessary. By default it automatically runs every time you load a page in your browser, but you can turn that off and run it manually by clicking on the button in the toolbar. It of course supports Vimeo videos, but I've also added support for our friends over at YouTube, using their own iframe embed player to replace all of their old embeds. As well as supporting YouTube, I've structured the extension so that it's easy to add more services, so if you think of any other video players that have an HTML5-compatible version, feel free to contact me with the details and I'll try and add support for it.

Like all of my projects here on Reusable Bits, Embedinator is open source and [available on GitHub](https://github.com/josephschmitt/Embedinator). Feel free to check out the source, give suggestions, or fix any bugs for me :-). If you're just interested in downloading and installing the extension itself, you can find it below.

Cheers!

[Download Embedinator for Safari](https://s3.amazonaws.com/reusebits/embedinator/Embedinator.safariextz).

**Update**: Latest version (Embedinator 1.1) works with (most) videos on YouTube.com. Unfortunately, since it's using embed code, any video whose settings don't allow the video to be embedded won't be playable. Such is life.