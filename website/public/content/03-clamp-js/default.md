Title: Introducing Clamp.js
----
Short: Clamp.js
----
Subtitle: JavaScript for when experimental, undocumented CSS properties just aren't getting it done.
----
Date: Jan 7, 2011 5:43pm
----
Status: Published
----
Text:

(forkme: josephschmitt/Clamp.js)

Recently, while working on some last-minute fixes for the Vimeo HTML player, I ran into a limitation of current-gen browsers that really frustrated me. It seems that there is no standardized, supported way to clamp an HTML element. What do I mean by clamp? If you have a design which limits your text to be only 2 or 3 lines long, but the text is dynamic and so can be any length it damn well pleases, clamping will ensure the text gets chopped off at the appropriate height and will add ellipsis at the end to denote that the content has been interrupted.

I did some research and found [Dave DeSandro's entry](http://dropshado.ws/post/1015351370/webkit-line-clamp) about `-webkit-line-clamp` which, through applying some seemingly unrelated and random CSS styles, does achieve this effect... sort of... most of the time. Here's an example of some properly clamped text in our wonderful video player:


(figure: working-css-clamp.jpg alt: Properly clamped text)


Great! That works! Well... sort of. Here's what happens if your HTML element just happens to have a link as the last node of the element:

(figure: failed-css-clamp.jpg alt: Failure when there's a link at the end)


Whoops. It's actually inserting the link from the very end of the paragraph even though it should be getting cut off. As [Dave explained](http://twitter.com/#!/desandro/status/23381458039078912) to me, -webkit-line-clamp is not only vendor-specific, it's completely undocumented and experimental, so it can't really be used reliably.

Instead of admitting defeat I decided to write my own solution (I mean how hard can it be, right?). Well, it turns out it wasn't that difficult at all, and the results are [hosted over on Github](https://github.com/josephschmitt/Clamp.js). You can give it how many number of lines you want your content to be, how many pixels high you want it to be, or a setting of "auto" where it'll fit as much as it can in a given area and then automatically clamp itself. If you're using a browser that supports the wonderful -webkit-line-clamp it'll attempt to use it (though you can force to turn it off as well), otherwise it'll fall back to a JavaScript-based solution.

There are, of course, some caveats with using it. First, it can be a little expensive performance-wise if used incorrectly. Clamp.js works by removing one character at a time from the end of the content until it fits inside a designated area. That means that if your content is 30 lines long and it needs to get down to 2 lines, it's going to loop hundreds and hundres of times until it gets from 30 to 2 lines. This is something I want to improve on at some point, but for now just be aware of this. Second, I haven't done too much extensive testing (that's what you guys are for!) so there are bound to be bugs. Don't use this in mission critical projects just yet.

Other than that feel free to use the heck out of it and give me some feedback. I would love to know what you think!

**Update:** [Performance updates](http://reusablebits.com/post/2980974411/clamp-js-v0-2-explanations-and-performance-updates) released with v0.2.