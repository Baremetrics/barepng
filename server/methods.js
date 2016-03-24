var Future = Npm.require('fibers/future');
var fs = Npm.require('fs');

Meteor.methods({
  phantom: function(data) {
    var future = new Future;

    var path = 'http://localhost:3000/svg';
    // var path = 'https://demo.baremetrics.com';
    // var path = 'http://f.cl.ly/items/43282f0N0j2n3h223a0o/index.html';
    // var path = 'http://localhost:3000/index.html';
    var options = {
      windowSize: {
        width: 800,
        height: 400
      },
      shotSize: {
        width: 800,
        height: 400
      },
      renderDelay: 5000,
      takeShotOnCallback: true,
      onLoadFinished: function() {
        var svg = document.getElementsByTagName('svg')[0];
        var h1 = document.getElementsByTagName('h1')[0];

        h1.innerHTML = svg.innerHTML;
      }
    }

    webshot(path, 'image.png', options, function(err) {
      if (err)
        future.throw(error);

      console.log("Image generated.");
      var png = fs.readFileSync('image.png');
      future.return(new Buffer(png).toString('base64'));
    });

    // webshot(path, options, function(err, renderStream) {
    //   if (err)
    //     future.throw(error);

    //   var file = fs.createWriteStream('image.png', {encoding: 'binary'});

    //   renderStream.on('data', function(data) {
    //     file.write(data.toString('binary'), 'binary');
    //   }).on('end', function() {
    //     console.log("generated");
    //     var png = fs.readFileSync('image.png');
    //     future.return(new Buffer(png).toString('base64'));
    //   });
    // });

    return future.wait();
  }
});