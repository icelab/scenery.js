s = new Scenery(document.querySelectorAll('.animal'));

setTimeout(function() {
  var afterDelay = function() {
    console.debug("after delay");
  }

  s.act('middle').delay(1e3).then(afterDelay).act('end').loop();

}, 13);