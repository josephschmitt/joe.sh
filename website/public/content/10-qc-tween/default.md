Title: The Tween Patch for Quartz Composer
----
Short: Tween Patch
----
Subtitle: It's time for the Interpolater.
----
Date:  May 21, 2013 10:35am
----
Status: Published
----
Text:

After making a few compositions in Quartz Composer, I realized that I needed the ability to perform what's called a "tween" on some values. A tween (short for in-between) is a computation (known as an interpolation) performed on a value over time. So, if I wanted to change the Alpha value of a Sprite and have it animate from 0 to 1 over the course of 1 second, I would need to use a tween, so it would fade smoothly instead of instantly snapping to the new value.

There's no Tween patch built-in to Quartz Composer, but there is an Interpolation patch. The Interpolation patch interpolates between a Start Value and an End Value over a Duration, which is exactly what tweens are supposed to do. Off to a good start! This patch even allows you to define custom Interpolation equations so that you animations of easing instead of just linear transformations. The problem with this patch is, there's no easy to just have it start interpolating over time, it'll either use the parent document's timebase (meaning it'll start playing as soon as you open the document), or you need to manage the timebase yourself using a stopwatch. Also, unlike tweening in languages like ActionScript or JavaScript, you need to give it both a starting value and ending value, meaning you just can't throw it a value of where you want it to end it up and have it figure out how to get there from the current value on its own.

(link:Tween.qtz text: My Tween patch) aims to solve both of these problems. It comes with its own Stop Watch patch and time management, and it also remembers its current value. This means that all you need to do is give it a duration, an (optional) interpolation equation, and a value and it'll do the rest. The best part is, you can keep modifying that value, and it'll make sure to tween between the last value you had and the new one, so no need to store previous values. Just pass it the new ones and it'll figure it out.

(figure: tween-patch.png width:100%)

I've already started using this in a project and it seems to be working pretty well, but I'd appreciate it if you guys could let me know of any issues you run into while using this patch. I think you'll find it's pretty useful for adding animation to properties without using inertia (especially for values where inertia doesn't make sense, like Alpha).

You can download the patch from here: (link:Tween.qtz text: Tween.qtz). To install it, add the Tween.qtz file to /Library/Graphics/Quartz Composer Patches/ (make that folder if it doesn't already exist). Then right-click, Open With, Quartz Composer.

Let me know if you have questions or feedback!