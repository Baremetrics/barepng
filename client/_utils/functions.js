Utils = function() {

}

Utils.prototype.insertImage = function(version) {
  var start;

  var data = _.map(_.range(30), function(d, i) {
    if (start) {
      start = start + _.random(-100, 100);
    } else {
      start = _.random(-1000, 1000);
    }

    return start;
  });

  if (version == 3) {
    return $('<img src="'+ window.location.origin +'/api?v=3&data=['+ data +']&symbol=$^&w=800&h=400">');
  } else {
    return $('<img src="https://chart.baremetricscdn.com/?v=2&data=['+ data +']&symbol=$^&w=800&h=400">');
  }
}

Utils.prototype.insertImages = function(i, version) {
  var self = this;

  _.each(_.range(i), function() {
    $('.images').prepend(self.insertImage(version));
  });
}

BarePNG = new Utils();