// Polyfill function.bind for phantomjs
require('pbind');

var test = require("tape");
var Scenery = require("../index.js");

// Set up some basic HTML and CSS for testing transitions
var wrapperElement;
var styleElement;
var cssString = ".animal { \
  height: 50px; \
  width: 50px; \
  position: absolute; \
  left: 0; \
  transition: 3s; \
} \
.hare { \
  background: #ccc; \
  -webkit-transition: 0.2s; \
  -moz-transition: 0.2s; \
  transition: 0.2s; \
} \
.tortoise { \
  background: green; \
  -webkit-transition: 1000ms; \
  -moz-transition: 1000ms; \
  transition: 1000ms; \
  top: 100px; \
} \
.tortoise.middle { \
  background: green; \
  -webkit-transition: 3s; \
  -moz-transition: 3s; \
  transition: 3s; \
} \
.animal.middle { \
  left: 500px; \
} \
.animal.end { \
  left: 0; \
}";


// Config
var TIMING_THRESHOLD_IN_MILLISECONDS = 50;
var PX_ACCURACY_THRESHOLD = 10;

function withinThreshold(value, expected, threshold) {
  return Math.abs(expected - value) <= threshold;
}

// Set up for each test
function setUp() {
  // Inject CSS
  styleElement = document.createElement("style");
  styleElement.appendChild(document.createTextNode(cssString));
  document.head.appendChild(styleElement);
  // Build HTML
  wrapperElement = document.createElement("div");
  var hare = document.createElement("div")
  // Add .hare
  hare.className = "animal hare";
  wrapperElement.appendChild(hare);
  // Add .tortoise
  var tortoise = document.createElement("div")
  tortoise.className = "animal tortoise";
  wrapperElement.appendChild(tortoise);
  document.body.appendChild(wrapperElement);
}

// Set up for each test
function tearDown() {
  styleElement.parentNode.removeChild(styleElement);
  wrapperElement.parentNode.removeChild(wrapperElement);
}

test('It should play a single act', {timeout: 5000}, function(t) {
  setUp();
  t.plan(1);
  var start = Date.now();
  var s = new Scenery(wrapperElement.querySelectorAll('.animal'));
  s.act('middle');

  // Kick things off, but give the DOM time to rerender
  setTimeout(function() {
    s.play();
  }, 0);

  // 3000 = 3s in .tortoise.middle
  setTimeout(function() {
    var style = window.getComputedStyle(wrapperElement.querySelector(".tortoise"))
    t.ok(
      withinThreshold(parseFloat(style.left), 500, PX_ACCURACY_THRESHOLD),
      ".tortoise is at 500px"
    );
    tearDown();
  }, 3000);

});

test('It should play a single act with a specific element selector', {timeout: 5000}, function(t) {
  setUp();
  t.plan(1);
  var start = Date.now();
  var s = new Scenery(wrapperElement.querySelectorAll('.animal'));
  s.act('middle', {endSelector: '.hare'});

  // Kick things off, but give the DOM time to rerender
  setTimeout(function() {
    s.play();
  }, 0);

  // 200 = 0.2s in .hare.middle
  setTimeout(function() {
    var style = window.getComputedStyle(wrapperElement.querySelector(".hare"))
    t.ok(
      withinThreshold(parseFloat(style.left), 500, PX_ACCURACY_THRESHOLD),
      ".hare is at 500px"
    );
    tearDown();
  }, 200);

});

test('It should play multiple acts', {timeout: 10000}, function(t) {
  setUp();
  t.plan(2);
  var start = Date.now();
  var s = new Scenery(wrapperElement.querySelectorAll('.animal'));
  var tortoise = wrapperElement.querySelector(".tortoise");
  s.act('middle').act('end');

  // Kick things off, but give the DOM time to rerender
  setTimeout(function() {
    s.play();
    var start = Date.now();
    var watchPosition = true;
    var positions = [
      {timing: 3000, position: 500, elapsed: 0},
      {timing: 4000, position: 0, elapsed: 3000}
    ]
    var checkPosition = function() {
      var elapsed = Date.now() - start;
      var style = window.getComputedStyle(tortoise);
      var left = parseFloat(style.left);

      var nextPosition = positions[0];
      if (elapsed > nextPosition.elapsed && withinThreshold(left, nextPosition.position, PX_ACCURACY_THRESHOLD)) {
        var metTimingThreshold = withinThreshold(elapsed, nextPosition.timing, TIMING_THRESHOLD_IN_MILLISECONDS);
        if (metTimingThreshold) {
          t.ok(true, ".tortoise at "+nextPosition.position+"px at "+nextPosition.timing+"s");
          positions.shift();
        }
      }
      if (positions.length > 0) {
        setTimeout(checkPosition, 0);
      }
    }
    setTimeout(checkPosition, 0);
  }, 0);

});
