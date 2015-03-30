(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Scenery = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var arrival = require("arrival");

/**
 * Expose 'Scenery'
 * Initialise with a set of `elements`
 *
 * @param  {Elements}  elements
 */

function Scenery(elements) {
  this.elements = elements;
  this.queue = [];
  this.playhead = -1;
  this.looping = false;
  this.lastAppliedClassName;
};

/**
 * Add a scene "state" to the animation cue. Scenes are essentially just
 * class names that are expected to trigger CSS transitions or animations
 *
 * @param  {String} sceneClassName
 * @param  {Number} duration
 * @return {Instance}
 */

Scenery.prototype.act = function(sceneClassName, duration) {
  this.queue.push({ scene: sceneClassName, duration: duration });
  return this;
};

/**
 * Play the animation queue
 *
 * @return {Instance}
 */

Scenery.prototype.play = function() {

  this.playhead += 1;
  if (this.playhead >= this.queue.length) {
    if (this.looping) {
      this.playhead = 0;
    } else {
      return;
    }
  };

  var action = this.queue[this.playhead];

  if (action.delay) {
    setTimeout(this.play.bind(this), action.delay);
  }

  if (action.then) {
    action.then();
    this.play();
  }

  if (action.scene) {
    Array.prototype.forEach.call(this.elements, function modifySceneClassNames(el) {
      el.classList.remove(this.lastAppliedClassName);
      el.classList.add(action.scene);
    }.bind(this));

    this.lastAppliedClassName = action.scene;

    if (action.duration) {
      setTimeout(this.play.bind(this), action.duration);
    } else {
      arrival(this.elements, this.play.bind(this));
    }
  }
  return this;
};

/**
 * Add a delay to the animation queue.
 *
 * @param  {Number} delay
 * @return {Instance}
 */

Scenery.prototype.delay = function(delay) {
  this.queue.push({ delay: delay });
  return this;
};

/**
 * Add a callback function to the animation queue.
 *
 * @param  {Function} callback
 * @return {Instance}
 */

Scenery.prototype.then = function(callback) {
  this.queue.push({ then: callback.bind(this) });
  return this;
};

/**
 * Set `this.looping` value
 *
 * @param  {Boolean} looping
 * @return {Instance}
 */

Scenery.prototype.loop = function(looping) {
  this.looping = (looping === false) ? false : true;
  return this;
};

module.exports = Scenery;

},{"arrival":2}],2:[function(require,module,exports){
/**
 * Utilities
 */

var style = getComputedStyle;
var transitionend = require("transitionend-property");


/**
 * Return a floating point number from a string
 */

function ms(str) {
  return parseFloat(str) * 1000;
}


/**
 * Take a node and return it's computed transition
 * 'duration' and 'delay' style values
 *
 * @param  {Element} node
 * @return {Number}
 */

function getDuration(node) {
  var duration = ms(style(node).transitionDuration);
  var delay = ms(style(node).transitionDelay);
  return duration + delay;
}


/**
 * Return an element with the longest transition duration
 *
 * @param  {Element/s} els
 * @param  {String} childSelector
 * @return {Element} longest
 */

function getLongestTransitionElement(els, childSelector) {
  var longest;
  var duration = 0;
  var selectedElements = [].slice.call(els);

  Array.prototype.forEach.call(els, function findDescendants(node, i) {
    var descendants = [].slice.call(node.querySelectorAll(childSelector));
    selectedElements = selectedElements.concat(descendants);
  });

  Array.prototype.forEach.call(selectedElements, function checkDuration(node) {
    var total = getDuration(node);
    if(total > duration) {
      longest = node;
      duration = total;
    }
  });

  return longest;
}


/**
 * Expose 'Arrival'
 * Define a target to add an event listener to.
 *
 * @param  {Element/s}  els
 * @param  {Function}  callback
 * @param  {String}  childSelector
 */

module.exports = function(els, callback, childSelector) {
  childSelector = childSelector || "*";

  if (els.length) {
    els = [].slice.call(els);
  } else {
    els = [els];
  }

  var target = getLongestTransitionElement(els, childSelector);
  if(!target) return callback();

  target.addEventListener(transitionend, function end(){
    callback();
    target.removeEventListener(transitionend, end);
  });
};

},{"transitionend-property":3}],3:[function(require,module,exports){
/**
 * Transition-end mapping
 */

var map = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition' : 'transitionend',
  'OTransition' : 'oTransitionEnd',
  'msTransition' : 'MSTransitionEnd',
  'transition' : 'transitionend'
};

/**
 * Expose `transitionend`
 */

var el = document.createElement('p');

for (var transition in map) {
  if (null != el.style[transition]) {
    module.exports = map[transition];
    break;
  }
}

},{}]},{},[1])(1)
});