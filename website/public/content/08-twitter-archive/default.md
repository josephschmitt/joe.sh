Title: Keeping an Up-to-date Twitter Archive
----
Short: Simplebird
----
Subtitle: A faster, simpler way to browse your ([embarrassing](https://twitter.com/josephschmitt/statuses/50338182)) tweet [history](https://twitter.com/josephschmitt/statuses/202098392)
----
Theme: yellow
----
Date: Mar 20, 2013 9:25pm
----
Status: Published
----
Text:

(forkme: josephschmitt/simplebird ribbon: yellow)

Twitter, while a great source of real-time or quasi-recent information, is pretty terrible at showing you anything much older than a few weeks. Most of the time this isn't an issue since the likely use case is simply an answer to the question they ask when composing a tweet: _what's happening [right now]?_. However, if you're fascinated by history or are just curious as to how awful and embarrassing you sounded 5 years ago, Twitter's search isn't of much help.

Luckily, I'm not the only one with the morbid fascination of finding old embarrassing/fascinating tweets. Hosted services like Manton Reece's [Tweet Library][tweet-library] or self-hosted solutions like [Tweet Nest][tweet-nest] did a stellar job of scratching this itch. I had a spare server lying around and am a fan of owning my data whenever possible, so I opted for a nice [Tweet Nest install][js-tweets] that I've been running happily for the last few years.


## The Twitpocalypse Cometh... Again

Unfortunately, for various reasons that I won't get into nor pretend to fully understand, Twitter is [retiring][twitter-api-shutdown] the unauthenticated version of their API that my beloved Tweet Nest relies on. This means that, come late March, I'll no longer have an up-to-date backup of my tweets on a server that I own. So, what's a Twitter archivist like myself to do?

I found a few options. First, there's the aforementioned Tweet Library. Again, while Manton has made a great app and service, I want my publicly viewable tweet archive to be on a server that I own and manage so I don't have to worry about the service running out of money or shutting down[^1]. The second solution I found was [Dr. Drang's][dr-drang-twitter]: a pretty good solution that's completely in his control wherein he saves all his tweets to a large text file on Dropbox. This is neat in that it's completely format agnostic and makes searching pretty quick and painless, but it's not easily shareable nor viewable from the public web.

However, the closest solution I found to my original Tweet Nest setup was from an unexpected source: Twitter itself. A few months ago, Twitter announced a [downloadable Twitter Archive][twitter-archive] for your tweets. At first I thought this was merely a convenient way for me to get a local copy of tweets older than [3,200 tweets ago][3200-limit]. However, after opening my archive up, I found not only the aforementioned local copy of tweets as wonderfully formatted JSON, but also an HTML page with a nice design to browse said tweets in. A quick FTP upload up to my server, and I was in business!


## So, so, so close

But all was not sunshine and rainbows. While I finally had a nice, publicly accessible webpage of _all_ of my tweets since joining the service[^2], it wouldn't auto-update, meaning I would have to periodically request a new version of the archive from Twitter if I wanted to see all of my latest tweets.

_Sigh._

All is not lost! The magnanimous [Dannel Jurado][de-marko] took it upon himself to write a ruby gem called [Grailbird Updater][grailbird-updater] that will fetch your latest tweets and fill them in with the same JSON format that the original Twitter archive came in. And best of all, after [a little prodding][gb-update], the gem even works with API v1.1. So now I had a publicly viewable, always up-to-date, _complete_ archive of my tweets on a server I owned: victory is mine!

Or so I thought...


## Slightly out of _touch_

The tweet browsing experience on desktop browsers is fantastic. It's clear the designers and developers who worked on it put some amazing time and effort into a pet project that I bet very few people at the company cared anything about. However, the experience on mobile devices was... sub-par. Lots of uses of `position: fixed` and JavaScript scrolling events made things slow, buggy, and just plain unusable. I tried writing some CSS on top of the ones they shipped with to see if it could be saved, but that effort ended in futility.

So I said: “to hell with it, I'm a web developer: [how hard can this be][how-hard]?”. I set out to re-write the front-end to the tweet archive from scratch with a focus on speed, simplicity, and most of all, touch-compatibility. A week and a half and a 6-hour Internet-enabled flight later I had [Simplebird][simplebird].


## The Simplest Bird

[Simplebird][simplebird] is a complete replacement to Twitter's Twitter Archive front-end, while keeping 100% compatibility with their JSON archive format. It uses a relatively small amount of [jQuery][jquery] and a templating framework called [Mustache][mustache] to loop through all the JSON and write out your tweets on the page grouped by month. It's far from complete[^3] and I'm sure has some bugs, but it's pretty easy to try out and use with your own tweets: just drop in your `data/` folder from your tweet archive in the `tweets/` directory, upload it to a server, and you're good to go. This will even work with Jurado's updater: pass the `tweets/` directory in as the archive location instead of the one you got from Twitter and it should auto-magically keep your tweets up-to-date!

Finally: I have my ideal Twitter archive solution, which you can [check out here][my-simplebird].


[^1]:	There seems to be [enough of that][reader-shutdown] going around lately.
[^2]:	A feat even Tweet Nest couldn't manage since I set it up after I already had more than 3,200 tweets.
[^3]:	I already have a [GitHub Issues][simplebird-issues] list going with features I want to work on. If you have any requests feel free to add them, or if you're a developer with a kind soul and want to help out, feel free to get in touch.


[tweet-library]: 			http://www.riverfold.com/software/tweetlibrary/
[js-tweets]: 				http://tweets.josephschmitt.net/
[tweet-nest]: 				http://pongsocket.com/tweetnest/
[twitter-api-shutdown]:		http://dev.twitter.com/blog/planning-for-api-v1-retirement
[reader-shutdown]:			http://googlereader.blogspot.com/2013/03/powering-down-google-reader.html
[dr-drang-twitter]:			http://www.leancrew.com/all-this/2012/07/archiving-tweets/
[de-marko]:					http://twitter.com/DeMarko
[gb-update]:				http://twitter.com/josephschmitt/status/308022895169376257
[how-hard]:					http://en.wikipedia.org/wiki/Top_Gear_challenges#How_hard_can_it_be.3F
[twitter-archive]: 			http://blog.twitter.com/2012/12/your-twitter-archive.html
[grailbird-updater]: 		http://github.com/DeMarko/grailbird_updater
[simplebird]:				http://github.com/josephschmitt/simplebird/
[simplebird-issues]:		http://github.com/josephschmitt/simplebird/issues
[jquery]:					http://jquery.com
[mustache]:					http://github.com/janl/mustache.js
[my-simplebird]:			http://joe.sh/tweets
[3200-limit]:				http://dev.twitter.com/discussions/276