Title: Simple Class-based Function Pattern for JavaScript
----
Short: Simple JS Pattern
----
Subtitle: Prototype, shmototype
----
Code: true
----
Date: Jul 18, 2011 6:56pm
----
Status: Published
----
Text:

One of our greatest concerns while working on the new [HTML Player](http://vimeo.com/blog:391) over at Vimeo HQ was that of file size. When your JavaScript code gets loaded tens of thousands of times a minute, every little byte counts. Therefore, right at the outset we wanted to come up with a simple pattern around which we could structure our code that would allow us great flexibility (we'd be developing 3 players, afterall: Desktop, Mobile, and Touch) but would also lend itself to good compression before deployment (in our case via Google's [Closure Compiler](http://code.google.com/closure/compiler/)).

Now, there are many, many *many* things that we did to bring our video player source code to its svelte ~25k, but one of the techniques was to be extremely precise in scope for our class methods. Below you can see some stubbed-out code that illustrates the three different types of class methods we used: Private, Privileged, and Public.

<pre><code style="min-width: 630px;" data-language="javascript">var MethodScopeExample = new Class({
    initialize: function() {
        var self = this,
            myPrivateVariable = "private";

// Private Methods ____________________________________________________________
        function draw(state, params) {
            console.log('private var:', myPrivateVariable); //"private"
        }
        
// Privileged Methods _________________________________________________________
        self.updateLayout = function(params) {
            console.log('private var:', myPrivateVariable); //"private"
            
            draw(params);
        };
    },

// Public methods _____________________________________________________________
    refresh: function() {
        console.log('private var:', myPrivateVariable); //undefined
    }
});
</code></pre>

## Private Methods

Private methods are just what they sound like: *private*. What does that mean in JavaScript? It means that their scope is enclosed to only its encapsulated method. In plain English, if you don't share a parent, you can't talk to it. What's really nice about private methods is when you run them through Closure Compiler, since the compiler knows every single place that this function can be called, its name can be fully optimized and compressed. This could end up being a huge file-size savings, especially if you come from an Objective-C background and your methods names describeEverySingleStepOfWhatYouDo() (which Closure would compress to something like "zB()").

Private methods are great for compressibility, so we want to use them as much as possible. When writing code for JavaScript frameworks that emulate Classes (Mootools, Prototype, etc.) this means writing as many functions as feasible in your initialize method. It might seem weird at first, but it could end up being a huge savings.

*Note: this goes for variables too. Private variables will compress better than declaring a variable on your class object. If the variable doesn't need to be accessed from outside your class, just declare it inside your init method.*

## Public Methods

Private methods sound great, but sometimes you really do need access to a method from outside a class or you might need to override a super method, and that's where public methods come in. Public methods are methods declared on your Class object itself. Because the function can be called from anywhere, it's likely that Closure will not compress these method names down, so try to keep them short and sweet and use them sparingly.

## Privileged Methods

There is one other downside to public methods and it shows up if you followed the advice in the note above and started declaring most of your variables as locally scoped within your init method: you don't have access to those variables in any other method other than the init! Well, that sucks! You may very well need that variable, and you shouldn't have to sacrifice the advantage of locally scoped variables just to gain access. Privileged methods to the rescue!

Privileged methods behave like public methods in that they can be called from outside your Class, but they have one huge advantage: since they're defined within your init method, they get access to all your local variables; you get the benefits of locally scoped variables which you then still get access to from outside your class (leading to some pretty powerful stuff).

Of course there are still some disadvantages; privileged methods aren't completely magical, and since they're accessed externally Closure tends to not compress its names. Also, if you're using inheritance for Classes, you'll only be able to override privileged methods and not get access to their super method.

And that's my quick overview of a relatively simple pattern that, if used correctly (ie. use local scope as much as humanly possible), should be able to shave some bytes here and there. If you have any suggestions for awesome ideas to add to this pattern (or if I've said something completely wrong, which I've been known to do in the past) let's get a discussion going in the comments.

Script on!