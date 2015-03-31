// Polyfill function.bind
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

// Config
var TIMING_THRESHOLD_IN_MILLISECONDS = 50;

test('It should play a single act', {timeout: 10000}, function(t) {
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
    t.equal(style.left, "500px");
    tearDown();
  }, 3000 + TIMING_THRESHOLD_IN_MILLISECONDS);

});
