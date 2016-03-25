var phantomjs = Meteor.npmRequire('phantomjs');
var Future = Npm.require('fibers/future');
var fs = Npm.require('fs');
var spawn = Npm.require('child_process').spawn;

Meteor.methods({
  phantom: function(data) {
    var future = new Future;

    command = spawn(phantomjs.path, ['assets/app/phantomDriver.js', data]);

    command.stdout.on('data', function(data) {
      // console.log('stdeout: '+ data);
    });
    command.stderr.on('data', function(data) {
      // console.log('stderr: '+ data);
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