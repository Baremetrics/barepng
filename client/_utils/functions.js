Utils = function() {

}

Utils.prototype.insertImage = function() {
  var start;

  var data = _.map(_.range(30), function(d, i) {
    if (start) {
      start = start + _.random(-100, 100);
    } else {
      start = _.random(-1000, 1000);
    }

    return start;
  });

  return $('<img src="'+ window.location.origin +'?v=3&data=['+ data +']&symbol=$^&w=800&h=400">');
}

Utils.prototype.insertImages = function(i) {
  var self = this;
  
  _.each(_.range(i), function() {
    $('body').after(self.insertImage());
  });
}

BarePNG = new Utils();