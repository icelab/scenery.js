/**
 * Utilities
 */

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
