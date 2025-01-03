Title: Un-UTM Browser Extension
----
Short: Un-UTM
----
Subtitle: Prettify your URLs... or at least un-uglify them.
----
Code: true
----
Date: April 3, 2014 11:32am
----
Status: Published
----
Text:

(forkme: josephschmitt/un-utm)

I've been waiting to write this browser extension for a little while now, hoping the problem would just go away on its own. Unfortunately, that hasn't happened yet, so here we are. What problem am I speaking of? That of ugly UTM URLs, of course!

So, what is this UTM nonsense you sometimes see in your URLs? Miguel Leiva-Gomez has [a good explanation](http://www.maketecheasier.com/what-is-utm-source/), but here's the gist:

>UTM stood for the Urchin Traffic Monitor, which was part of a software called “Urchin WebAnalytics Software” released in 1998. Google eventually purchased its technology in 2005 and sold the software for almost seven years until it was discontinued in March 28, 2012. Although it’s no longer selling, Google continues to use its URL conventions in its own analytics software to create campaigns, hence the “utm” in “utm_source” and many other variables. Simply put, the “utm” variables are tracking mechanisms that help companies gauge on how successful their campaigns are.

Basically, it helps website owners track how you got to their page. That's all well and good, but if you're a purist like myself, it makes URLs quite ugly, especially when you copy/paste a URL from your browser window to send to someone else. This extension helps with this: it cleans up the URLs by removing the UTM parameters (without touching any other parameters that the page might need to load), but does so in a way that maintains the site's ability to use their tracking data by using the `window.history` JavaScript API. The URL change is completely cosmetic and happens after the page has loaded: the site still gets their data, and you get pretty URLs. Win-win.

The extension source is pretty simple, so I thought I'd walk through it quickly. The meat and potatoes happens inside the `page.js` file that lives inside each of the extensions. `page.js` is a JavaScript file that gets loaded by the browser on every page load. The file is made up of three main functions, two of them utilities:

1. `getParams` – This function looks at the window or tab's URL and extracts the query parameters from it and turns it into a native JavaScript Object. This will make it easier to parse out the properties we don't want.
2. `serialize` - Pretty much the exact opposite of getParams: it turns our native JavaScript object back into a URL-safe string for re-inserting back into the browser window or tab.
3. `doReplace` - The main function that does the URL replacing, which waits to run until we get the window's load event.

Since `getParams` and `serialize` are utility functions, we can treat them as magic black boxes and just assume they work as intended. Here's the source for `doReplace`, the interesting part:
<pre style="overflow-x: auto;"><code style="width: 1040px; display: block;" data-language="javascript">function doReplace() {
	var params = getParams();
	var utm_keys = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
	if (params) {
		utm_keys.forEach(function(key) {
			delete params[key];
		});
	}

	var query = serialize(params);
	window.history.replaceState(params, null, window.location.origin + window.location.pathname + (query ? '?' + query : '') );
}
</code></pre>
First we use our `getParams` utility function to get an object of our parameters. Next, we define an array of all the parameter types that we don't want[^1]. After we've got both of these, we check to see if the URL has any parameters, and if it does, we loop through each of our utm_keys and delete them from the parameters object. We turn the new `params` object, sans utm keys, back into a string using our `serialize` utility, and then use the `replaceState` of the JavaScript `window.history` API to update the URL, sans any utm keys. It's important that we use `replaceState` and not `pushState`. `pushState` creates a new entry in the window's history, meaning if you clicked on the back button, we'd go back to the URL with all the utm parameters in it.

And that's the whole script. If your site currently uses utm codes to do campaign tracking, I highly recommend you include this type of JavaScript in your page so you deliver your users a clean URL. Don't make your problems (the need to track users for revenue purposes) our problem (ugly URLs).

(file: un-utm.safariextz text: Un-UTM Safari Extension) | (file: un-utm.chromeextension.crx text: Un-UTM Chrome Extension)[^2]

[^1]: I got the list of UTM params from here: [https://support.google.com/analytics/answer/1033867?hl=en](https://support.google.com/analytics/answer/1033867?hl=en)

[^2]: Note for Chrome users: this extension is small enough that I didn't feel like adding it to the store. Unfortunately, Chrome no longer lets you install extensions from any old page automatically. To install this extension, download the linked .crx file, then go to [chrome://extensions/](chrome://extensions/) in your Chrome browser, and drag and drop that .crx file in to the window.