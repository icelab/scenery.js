var Scenery = (function(_els) {

  var els;
  var queue = [];
  var playhead = -1;
  var looping = false;
  var lastAppliedClass;

  var _init = function() {
    els = _els;
    return this;
  };

  // CSS-inspection tools

  function ms(str) {
    return parseFloat(str) * 1000;
  }

  function getDuration(node) {
    var duration;
    var delay;

    duration = ms(getComputedStyle(node).transitionDuration);
    delay = ms(getComputedStyle(node).transitionDelay);

    return duration + delay;
  }

  function getLongestTransitionElement(els, childSelector) {
    var longest;
    var duration = 0;
    var selectedElements;

    var descendants;
    var total;

    selectedElements = [].slice.call(els);

    Array.prototype.forEach.call(els, function findDescendants(node, i) {
      descendants = [].slice.call(node.querySelectorAll(childSelector));
      selectedElements = selectedElements.concat(descendants);
    });

    Array.prototype.forEach.call(selectedElements, function checkDuration(node) {
      total = getDuration(node);
      if (total > duration) {
        longest = node;
        duration = total;
      }
    });

    return longest;
  }

  function callAfterTransition(els, callback, childSelector) {
    childSelector = childSelector || "*";

    if (els.length) {
      els = [].slice.call(els);
    } else {
      els = [els];
    }

    var target = getLongestTransitionElement(els, childSelector);
    if(!target) return callback();

    target.addEventListener('transitionend', function end(){
      callback();
      target.removeEventListener('transitionend', end);
    });
  }

  //  Public interface

  function act(sceneName, duration) {
    var el;
    queue.push({ scene: sceneName, duration: duration });

    return this;
  }

  function delay(delayLength) {
    queue.push({ delay: delayLength });

    return this;
  }

  function loop() {
    looping = true;
    play();
  }

  function play() {
    var el;
    var action;

    playhead += 1;

    if (playhead >= queue.length) {
      if (looping) {
        playhead = 0;
      }
      else {
        return;
      }
    }

    action = queue[playhead];

    if (action.delay) {
      setTimeout(play, action.delay);
    }

    if (action.then) {
      action.then();
      play();
    }

    if (action.scene) {
      for (var i = 0; i < els.length; i++) {
        el = els[i];

        el.classList.remove(lastAppliedClass);
        el.classList.add(action.scene);
      }

      lastAppliedClass = action.scene;

      if (action.duration) {
        setTimeout(play, action.duration);
      } else {
        callAfterTransition(document.body, play);
      }
    }

    return this;
  }

  function then(callback) {
    queue.push({ then: callback.bind(this) });
    return this;
  }

  _init();

  return {
    act: act,
    delay: delay,
    loop: loop,
    play: play,
    then: then
  };

});