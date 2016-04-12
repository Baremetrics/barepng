var page = require('webpage').create();
var system = require('system');
var address = 'https://dashboard.baremetrics.com/chart?'+ system.args[1];
// var address = 'http://localhost:3000/chart?'+ system.args[1];

page.viewportSize = {
  width: system.args[2],
  height: system.args[3]
}

page.clipRect = {
  top: 0, 
  left: 0, 
  width: system.args[2],
  height: system.args[3]
};

page.open(address, function(status) {
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