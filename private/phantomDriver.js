var page = require('webpage').create();
var args = require('system').args;
var address = 'https://dashboard.baremetrics.com/chart?'+ args[1];
// var address = 'http://localhost:3000/chart?'+ args[1];

page.viewportSize = {
  width: args[2],
  height: args[3]
}

page.clipRect = {
  top: 0, 
  left: 0, 
  width: args[2],
  height: args[3]
};

page.open(address, function(status) {
  // console.log(args);

  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
    window.setTimeout(function() {
      page.render('image.png', {format: 'png', quality: 0});
      page.close();
      phantom.exit();
    }, 10);
  }
});