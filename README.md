# Scenery

Scenery is an animation library of sorts. It’s not for _defining_ your animations, rather it’s for coordinating CSS-defined animations. Scenery will infer the timing of each "act" in your animation from the `transition-duration` and `transition-delay` properties you’ve written in your CSS.

## Usage

Scenery has a simple chainable API for constructing stages of animation. Given this HTML/CSS:

```html
<style>
  .stage {
    position: relative;
    width: 100%;
  }
  /* Starting positions */
  .lead {
    background-color: #c00;
    position: absolute;
    left: 0;
  }
  .chorus {
    background-color: #090;
    position: absolute;
    left: 0;
  }
  /* Act .one */
  .one .lead {
    transition-duration: 300ms;
    transform: translate(400px, 0);
  }
  .one .chorus {
    transition-duration: 500ms;
    transform: translate(200px, 0);
  }
  /* Act .two */
  .two .lead {
    transition-duration: 400ms;
    transform: translate(500px, 0);
  }
  .two .chorus {
    transition-duration: 200ms;
    transform: translate(400px, 0);
  }
  /* Act .three */
  .three .lead {
    transition-duration: 400ms;
    transform: translate(800px, 0);
  }
  .three .chorus {
    transition-duration: 200ms;
    transform: translate(0, 0);
  }
</style>
<div class="stage">
  <div class="actor lead"></div>
  <div class="actor chorus"></div>
</div>
```

You can trigger the moves between "acts" thusly:

```js
var stage = document.querySelector(".stage");
var s = new Scenery(stage);
var intermission = function() { console.log("Intermission"); }

// Build up an animation queue
s.act("one").act("two").then(intermission).delay(2000).act("three");

// Start the animation queue
s.play();
```

Scenery will figure out which element has the longest transition duration/delay length and progressively trigger the each "act" as the longest element fires its `transitionend` event.

You can pass a set of nodes in to the instance if you want to coordinate animations across different elements:

```js
var actors = document.querySelectorAll(".actor");
var s = new Scenery(actors);
var intermission = function() { console.log("Intermission"); }

// Build up an animation queue
s.act("one").act("two").then(intermission).delay(2000).act("three");

// Start the animation queue
s.play();
```

And you can add an act/callback/delay to the queue any time you want:

```js
var addNewActs = function() {
  s.act("three");
};

// Build up the animation queue
s.act("one").act("two").then(addNewActs);

// Start the animation queue
s.play();

```

## API

```js
var stage = document.querySelector(".stage");
var s = new Scenery(stage);

// Register an "act" by passing a string of the CSS class name you’d like
// to apply
s.act("act-one-class-name");

// Add a callback to the animation queue
s.then(function() { console.log("callback") });

// Add a delay (in millisecond) to the animation queue
s.delay(3000);

// Start the animation queue
s.play();

// Specify the animation as a loop
s.loop();

// Stop the animation at the _end_ of the current queue item
s.stop();

// Set a specific duration for an "act" in milliseconds. This won’t be
// affected by `transition-duration` or `transition-delay` properties.
s.act("act-two-class-name", 2000);
```

## Limitations

Scenery uses the [Arrival](https://github.com/icelab/arrival) helper to determine when an act has finished, so all [its limitations](https://github.com/icelab/arrival#limitations) apply to Scenery as well.


## TODO

* Allow selector-scoping per act.
* Remove acts from the queue.

## Building

You’ll need to:

```
npm install
```

Then you can:

```
npm run build
npm run build-min
npm run build-dist # Runs the two above commands
```

## License

The MIT License (MIT)

Copyright (c) 2015, Jonathon Bellew, Max Wheeler

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
