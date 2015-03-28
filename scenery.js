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

  var act = function(sceneName, duration) {
    var el;
    queue.push({ scene: sceneName, duration: duration });

    return this;
  };

  var play = function() {
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
    };

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
        arrival(document.body, play);
      }
    }

    return this;
  };

  var delay = function(delayLength) {
    queue.push({ delay: delayLength });

    return this;
  }

  var then = function(callback) {
    queue.push({ then: callback.bind(this) });
    return this;
  }

  var loop = function() {
    looping = true;
    play();
  }

  _init();

  return {
    act: act,
    play: play,
    delay: delay,
    loop: loop,
    then: then
  };

});