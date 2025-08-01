# ScrollMagic <a href='https://github.com/janpaepke/ScrollMagic/blob/master/CHANGELOG.md' class='version' title='Whats New?'>v2.0.8</a> [![Build Status](https://api.travis-ci.org/janpaepke/ScrollMagic.svg?branch=master)](https://travis-ci.org/janpaepke/ScrollMagic)

### The javascript library for magical scroll interactions.

[![Donate](https://scrollmagic.io/assets/img/btn_donate.svg 'Shut up and take my money!')](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8BJC8B58XHKLL 'Shut up and take my money!')

**Quicklinks:** [About](#about-the-library) | [Download](#availability) | [Installation](#installation) | [Usage](#usage) | [Help](#help) | [Compatibility](#browser-support) | [Author](#about-the-author) | [License](#license) | [Thanks](#thanks)

---

### 🚨 **ScrollMagic 3.0 is on the horizon.** [Helpers & Testers wanted](https://github.com/janpaepke/ScrollMagic/issues/982)! 🚨

---

ScrollMagic helps you to easily react to the user's current scroll position.  
It's the perfect library for you, if you want to ...

- animate based on scroll position – either trigger an animation or synchronize it to the scrollbar movement (like a playback scrub control).
- pin an element starting at a specific scroll position – either indefinitely or for a limited amount of scroll progress (sticky elements).
- toggle CSS classes of elements on and off based on scroll position.
- effortlessly add parallax effects to your website.
- create an infinitely scrolling page (ajax load of additional content).
- add callbacks at specific scroll positions or while scrolling past a specific section, passing a progress parameter.

Check out [the demo page](http://scrollmagic.io), browse [the examples](http://scrollmagic.io/examples/index.html) or read [the documentation](http://scrollmagic.io/docs/index.html) to get started.  
If you want to contribute please [get in touch](mailto:e-mail@janpaepke.de) and let me know about your specialty and experience.

## About the Library

ScrollMagic is a scroll interaction library.

It's a complete rewrite of its predecessor [Superscrollorama](https://github.com/johnpolacek/superscrollorama) by [John Polacek](http://johnpolacek.com).  
A plugin-based architecture offers easy customizability and extendability.

To implement animations, ScrollMagic can work with multiple frameworks.
The recommended solution is the [Greensock Animation Platform (GSAP)](http://www.greensock.com/gsap-js/) due to its stability and feature richness. For a more lightweight approach, the [VelocityJS](http://VelocityJS.org) framework is also supported. Alternatively, custom extensions can be implemented or the necessity of a framework can be completely avoided by animating simply using CSS and class toggles.

ScrollMagic was developed with these principles in mind:

- optimized performance
- lightweight (6KB gzipped)
- flexibility and extendibility
- mobile compatibility
- event management
- support for responsive web design
- object-oriented programming and object chaining
- readable, centralized code, and intuitive development
- support for both x and y direction scrolling (even both on one page)
- support for scrolling inside div containers (even multiple on one page)
- extensive debugging and logging capabilities
- detailed documentation
- many application examples

**Is ScrollMagic the right library for you?**  
ScrollMagic takes an object-oriented approach using a controller for each scroll container and attaching multiple scenes defining what should happen at what part of the page. While this offers a great deal of control, it might be a little confusing, especially if you're just starting out with javascript.  
If the above points are not crucial for you and you are just looking for a simple solution to implement css animations I would strongly recommend taking a look at the awesome [skrollr](http://prinzhorn.github.io/skrollr/) project. It almost solely relies on element attributes and thus requires minimal to no javascript knowledge.

## Availability

To get your copy of ScrollMagic you have the choice between four options:

**Option 1: GitHub**  
Download a zip file containing the source code, demo page, all examples and documentation from the [GitHub releases page](https://github.com/janpaepke/ScrollMagic/releases) or clone the package to your machine using the git command line interface:

```bash
git clone https://github.com/janpaepke/ScrollMagic.git
```

**Option 2: Bower**  
ScrollMagic is also [available on bower](http://bower.io/search/?q=scrollmagic) and will only install the necessary source code, ignoring all example and documentation files.  
Please mind that since they are not core dependencies, you will have to add frameworks like GSAP, jQuery or Velocity manually, should you choose to use them.

```bash
bower install scrollmagic
```

**Option 3: npm**  
If you prefer the [node package manager](https://www.npmjs.com/package/scrollmagic), feel free to use it.  
Keep in mind that like with bower non-crucial files will be ignored (see above).

```bash
npm install scrollmagic
```

**Option 4: CDN**  
If you don't want to host ScrollMagic yourself, you can include it from [cdnjs](https://cdnjs.com/libraries/ScrollMagic):

```
https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/ScrollMagic.min.js
```

All plugins and uncompressed files are also available on cdnjs.  
For example:

```
https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/plugins/debug.addIndicators.js
https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/plugins/debug.addIndicators.min.js
```

## Installation

Include the **core** library in your HTML file:

```html
<script src="js/scrollmagic/uncompressed/ScrollMagic.js"></script>
```

And you're ready to go!  
For deployment use the minified version **instead**:

```html
<script src="js/scrollmagic/minified/ScrollMagic.min.js"></script>
```

_**NOTE:** The logging feature is removed in the minified version due to file size considerations._

To use **plugins** like the indicators visualization, simply include them in addition to the main library:

```html
<script src="js/scrollmagic/uncompressed/plugins/debug.addIndicators.js"></script>
```

To learn how to configure **RequireJS**, when using AMD, please [read here](https://github.com/janpaepke/ScrollMagic/wiki/Getting-Started-:-Using-AMD).

## Usage

The basic ScrollMagic design pattern is one controller, which has one or more scenes attached to it.  
Each scene is used to define what happens when the container is scrolled to a specific offset.

Here's a basic workflow example:

```javascript
// init controller
var controller = new ScrollMagic.Controller()

// create a scene
new ScrollMagic.Scene({
  duration: 100, // the scene should last for a scroll distance of 100px
  offset: 50, // start this scene after scrolling for 50px
})
  .setPin('#my-sticky-element') // pins the element for the the scene's duration
  .addTo(controller) // assign the scene to the controller
```

To learn more about the ScrollMagic code structure, please [read here](https://github.com/janpaepke/ScrollMagic/wiki/Getting-Started-:-How-to-use-ScrollMagic).

## Help

To get started, check out the available learning resources [in the wiki section](https://github.com/janpaepke/ScrollMagic/wiki).  
Be sure to have a look at the [examples](http://janpaepke.github.io/ScrollMagic/examples/index.html) to get source code pointers and make use of the [documentation](http://janpaepke.github.io/ScrollMagic/docs/index.html) for a complete reference.

If you run into trouble using ScrollMagic please follow the [Troubleshooting guide](https://github.com/janpaepke/ScrollMagic/wiki/Troubleshooting-Guide).

**Please do not post support requests in the github issue section**, as it's reserved for issue and bug reporting.
If all the above options for self-help fail, please use [Stack Overflow](https://stackoverflow.com/questions/tagged/scrollmagic) or the [ScrollMagic Premium Support](https://support.scrollmagic.io/?utm_source=github&utm_medium=link).

## Browser Support

ScrollMagic aims to support all major browsers even in older versions:  
Firefox 26+, Chrome 30+, Safari 5.1+, Opera 10+, IE 9+

## About the Author

I am a creative coder based in Vienna, Austria.

[Learn more on my website](http://www.janpaepke.de) or [Follow me on Twitter](http://twitter.com/janpaepke)

## License

ScrollMagic is dual licensed under the MIT license and GPL.  
For more information click [here](https://github.com/janpaepke/ScrollMagic/blob/master/LICENSE.md).

## Thanks

This library was made possible by many people who have supported it with passion, donations, or advice. Special thanks go out to [John Polacek](https://github.com/johnpolacek), [Jack Doyle](https://github.com/greensock), [Paul Irish](https://github.com/paulirish), [Nicholas Cerminara](https://github.com/ncerminara), [Kai Dorschner](https://github.com/krnlde), [Petr Tichy](https://github.com/petr-tichy) and [Dennis Gaebel](https://github.com/grayghostvisuals).
