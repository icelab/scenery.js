var Scenery = (function(_els) {

  var els;
  var queue = [];
  var playhead = -1;
  var looping = false;
  var last_applied_class;

  var _init = function() {
    els = _els;
    return this;
  };

  var act = function(scene_name, duration) {
    var el;
    queue.push({ scene: scene_name, duration: duration });

    console.debug('act', queue);

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


        el.classList.remove(last_applied_class);
        el.classList.add(action.scene);

      }

      last_applied_class = action.scene;

      if (action.duration) {
        setTimeout(play, action.duration);
      } else {
        arrival(document.body, play);
      }
    }

    return this;
  };

  var delay = function(delay_length) {
    queue.push({ delay: delay_length });

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