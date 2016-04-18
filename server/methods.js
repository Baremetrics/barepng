var gURL = Meteor.npmRequire('google-url'),
    phantomJS = Meteor.npmRequire('phantomjs-prebuilt'),
    Future = Npm.require('fibers/future'),
    fs = Npm.require('fs'),
    spawn = Npm.require('child_process').spawn,
    gurl = new gURL({key:'AIzaSyC5t3jmwQcMBOr1PLTcyxD9pwwt2dFAl-4'});

Meteor.methods({
  phantom: function(request) {
    var future = new Future,
        width = request.query.w || 800,
        height = request.query.h || 400,
        query_string = "",
        address;

    for (var key in request.query) {
      if (query_string != "") query_string += "&";
      query_string += key + "=" + request.query[key];
    }

    address = request.proto +'://'+ request.host +'/chart?'+ query_string;

    var command = spawn(phantomJS.path, ['assets/app/phantomDriver.js', address, width, height]);

    command.stdout.on('data', function(data) {
      console.log('stdeout: '+ data);
    });
    command.stderr.on('data', function(data) {
      console.log('stderr: '+ data);
      future.throw(data);
    });
    command.on('exit', function(code) {
      var png = fs.readFileSync('image.png');
      future.return(new Buffer(png).toString('base64'));
    });

    return future.wait();
  },
  gurl: function(url) {
    var future = new Future();
    
    gurl.shorten(url, function(err, shortURL) {
      if (err) {
        future.throw(err);
      } else {
        future.return(shortURL);
      }
    });

    return future.wait();
  }
});