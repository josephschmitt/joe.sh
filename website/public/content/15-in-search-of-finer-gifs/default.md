Title: In Search of Finer Gifs
----
Short: finer-gifs
----
Subtitle: Return to another age: a time of refinement and civility... and gifs.
----
Date: May 21, 2018 10:51pm
----
Status: Published
----
Text:

Today I'm really excited to release a little side project I’ve been working on for the past couple of weeks: [The Finer Gifs Club]

(figure: https://media.thefinergifs.club/04x10-1223103.gif alt: Are you inviting me to the Finer Things Club? width: 400)

The Finer Gifs Club is a search engine for gifs based on lines of dialogue from The Office (US), one of my all-time favorite shows. The Office is an incredibly quotable show, and in the past I’ve found myself not only wanting to quote a joke from the show, but to do so by sharing it via an animated gif, the Internet’s own lingua franca. Gifs are the perfect medium for a show like this: they’re self-contained, viewable pretty much anywhere, can contain both dialogue and visual gags, and best of all they loop forever.

(figure: https://media.thefinergifs.club/02x04-542609.gif alt: for the rest of your life! Forever! width: 400)

The problem was using tools like [Google Image search] or even a gif-specific search engine like [Giphy] was kind of a pain. There’s no easy way to filter down to only searching for lines from just The Office, and worse if the line you want to quote is particularly obscure, it might not have ever been made into a gif. The Finer Gifs Club was my attempt at solving these problems.

(figure: https://media.thefinergifs.club/03x01-451051.gif alt: No problem. width: 400)

## Why did you do this?

A couple of years ago, I read [a blog post][Unfundable Slacks Blog Post] by [Bertrand Fan] who had managed to create [a Slack command][Vandelay Industries] to return animated gifs from episodes of Seinfeld. In his post, Bertrand explained he was able to automate creating his gifs by using the subtitles that came with the videos. You look through all the subtitles for an episode — noting the start and end time of that section — then draw the text on top. Run this approximately 100,000 times and _presto_ you have animated gifs of an entire show without breaking a sweat.

(figure: https://media.thefinergifs.club/06x20-427986.gif alt: Why do you keep repeating width: 400)

I was really awe-struck by this idea. I thought it’d be fun to try it out for myself someday, but soon forgot about it and moved on to other distractions (like video games). Then, a few weeks ago I started listening to this great new podcast about The Office called [Somehow I Manage]. It reminded me of both how _many_ great jokes are in the show, and also how _difficult_ it is to find some of the jokes in gif format. I looked around the Internet, assuming _someone_ must have copied Bertrand’s idea by now, but found nothing. I’d been searching for a fun side-project to put my skills to the test, and so I settled on it: I’d make the best gif search engine for The Office I could muster.

(figure: https://media.thefinergifs.club/02x09-616183.gif alt: Oh, it’s the best. It is the best. width: 400)

## How does it work?
I’ll follow up with a series of posts that dig into the technical details of this project and the issues I ran into, but for now I’ll give a high-level overview of how it all works. I’ll confess that I mostly stood on the [open source][ffmpeg] [shoulders][nodejs] of [giants][aws]: most of the creativity of this project was really in gluing it all together.

(figure: https://media.thefinergifs.club/07x22-147914.gif alt: Was thinking I might glue a stapler on top width: 400)

### Making the gifs
I didn’t really re-invent the wheel here. I took Bertrand’s basic concept and wrote my own code that followed a similar formula. I would loop through episodes of The Office and look at their subtitle files (srt’s in my case). The format is quite simple: it has timecode for where the text starts and ends, and then the actual text content itself. Looping through these sections, I fed the start time and duration to [ffmpeg], and drew the subtitle text on top. It took a few dozen tries, but after a day or two of tinkering I had a full episode’s worth of gifs I was pretty happy with. Armed with moderate success, I threw my whole collection of episodes of The Office at it, and 90,279 gifs and 52 hours later, it was done[^1].

(figure: https://media.thefinergifs.club/02x14-776176.gif alt: Is it done? No. width: 400)

### Indexing
Now that I had a ridiculous number of gifs on my computer, it was time to make them searchable. First, I had to make the gifs reachable from the Internet, which was actually the easy part. [Amazon’s S3][s3] storage service makes it crazy cheap to host a lot of files. I pointed their command-line tool at the folder with my gifs and, thanks to my gigabit Fios connection, was able to get them all uploaded in an hour or two.

(figure: https://media.thefinergifs.club/04x01-115096.gif alt: It all happened so fast. width: 400)

Next up: search. I’m a front-end developer at my [day job][Compass] ([we’re hiring!][greenhouse]) and don’t really know anything about writing a search backend, so I once again turned to the Internet’s favorite web services crutch, [Amazon Web Services][aws]. And sure enough, they had a [CloudSearch] service I could use, no back-end code required!

(figure: https://media.thefinergifs.club/07x08-834634.gif alt: I will require beer and pizza to think this over. width: 400)

I skimmed CloudSearch’s documentation and found it only needed me to submit a list of what they called “documents.” Each document needs a unique ID, followed by any number of arbitrary fields you’d want to search for. So, after building the gifs for each episode I wrote out a file that contained the text of the subtitle (which I’d use to search against) and a file id (which I would use to link to the matching gif). After all the gifs were done, I uploaded the indexes to AWS and _BOOM_, I had a working search engine!

(figure: https://media.thefinergifs.club/06x25-125641.gif alt: Yea, that works. That works. width: 400)

### Searching
Now that I had a search engine I could address via a web API provided by Amazon, I needed a way for users to be able to perform their own searches. This, mercifully, finally brought me to my comfort zone. Over the course of a few days I built out a [VueJS]-based static website that contained just a search field and a list of results. The search field would hit my AWS search engine and return a list of matching documents from CloudSearch, and I’d use the file id field to build out a URL to the gifs on S3. I uploaded the site to S3 and, before I knew it, holy moly I was done!

(figure: https://media.thefinergifs.club/05x21-926459.gif alt: There’s the rundown you asked for. width: 400)

## Wrapping it all up
I’m obviously glossing over a lot of details[^2], but in broad strokes that’s all there is to it. I want others to be able to fork, build on, and improve on my work, just like I did on Bertrand's, and so I've also open-sourced all the code that I wrote for this project:

- [`sub-gif-gen`](https://github.com/josephschmitt/sub-gif-gen) My terrible name for the script to create the gifs
- [`thefinergifs.club`](https://github.com/josephschmitt/thefinergifs.club) The VueJS-based web front-end
- [`finer-gifs-lambda`](https://github.com/josephschmitt/finer-gifs-lambda) My lambda function that integrates Finer Gifs with Slack

I was able to take something from crazy idea in my head to a fully working, cloud-based, infinitely scalable, and even [Slack-integrated][add to slack] service in the matter of a few weeks. I was blown away by what I was able to accomplish, and I hope you have as much fun finding finer gifs as I did building them.

(figure: https://media.thefinergifs.club/08x11-352852.gif alt: You know what? Go. Have fun. width: 400)

[Google Image search]: https://images.google.com
[Giphy]: https://giphy.com
[Unfundable Slacks Blog Post]: https://medium.freecodecamp.org/unfundable-slack-bots-9369a75fdd
[The Finer Gifs Club]: https://thefinergifs.club
[Somehow I Manage]: https://www.theincomparable.com/sim/
[Bertrand Fan]: https://medium.freecodecamp.org/@bertrandom
[ffmpeg]: https://ffmpeg.org
[nodejs]: https://nodejs.org
[aws]: https://aws.amazon.com
[Dinner Party]: https://en.wikipedia.org/wiki/Dinner_Party_(The_Office)
[Compass]: https://compass.com
[greenhouse]: https://grnh.se/5ee332231
[VueJS]: https://vuejs.org
[CloudSearch]: https://aws.amazon.com/cloudsearch/
[s3]: https://aws.amazon.com/s3
[add to slack]: https://slack.com/oauth/authorize?client_id=2171669066.363245088081&scope=commands
[Vandelay Industries]: https://vandelayindustries.online

[^1]: And by done, I mean I messed up these gifs _loads_ of times. I think I re-generated all of the gifs at least a dozen times, finding weird typos, mistakes, and corruptions each time. This was probably the most painful part of the entire process, and there's still weird issues I find all the time.
[^2]: And pain. Lots and lots of pain. Have I mentioned I had to re-make the gifs a _lot_ of times?
