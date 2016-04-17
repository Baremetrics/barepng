var phantomjs = Meteor.npmRequire('phantomjs-prebuilt'),
    Future = Npm.require('fibers/future'),
    fs = Npm.require('fs'),
    spawn = Npm.require('child_process').spawn;

Meteor.methods({
  phantom: function(query, header) {
    var future = new Future,
        width = query.w || 800,
        height = query.h || 400,
        query_string = "",
        address;

    for (var key in query) {
      if (query_string != "") query_string += "&";
      query_string += key + "=" + query[key];
    }

    if (query.url && header) {
      address = header['x-forwarded-proto'] +'://'+ header.host +'/chart';
    } else {
      address = 'https://dashboard.baremetrics.com/chart';
    }

    if (query.v == 2) {
      address += '/v2?'+ query_string;
    } else {
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