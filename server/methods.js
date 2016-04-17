var phantomjs = Meteor.npmRequire('phantomjs-prebuilt'),
    Future = Npm.require('fibers/future'),
    fs = Npm.require('fs'),
    spawn = Npm.require('child_process').spawn;

Meteor.methods({
  phantom: function(request) {
    var future = new Future,
        width = request.query.w || 800,
        height = request.query.h || 400,
        query_string = "",
        address = 'https://dashboard.baremetrics.com/chart';

    for (var key in request.query) {
      if (query_string != "") query_string += "&";
      query_string += key + "=" + request.query[key];
    }

    if (request.query.v == 3) { // Self contained version
      address = request.proto +'://'+ request.host +'/chart?'+ query_string;
    } else if (request.query.v == 2) { // New Email version
      address += '/v2?'+ query_string;
    } else { // Old Slack version
      address += '?'+ query_string;
    }

    var command = spawn(phantomjs.path, ['assets/app/phantomDriver.js', address, width, height]);

    command.stdout.on('data', function(data) {
      console.log('stdeout: '+ data);
    });
    command.stderr.on('data', function(data) {
      console.log('stderr: '+ data);
      future.throw(error);
    });
    command.on('exit', function(code) {
      // console.log('child process exited with code '+ code);
      var png = fs.readFileSync('image.png');
      future.return(new Buffer(png).toString('base64'));
    });

    return future.wait();
  }
});