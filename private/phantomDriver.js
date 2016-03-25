var page = require('webpage').create();
var args = require('system').args;
var address = 'http://baremetrics.dev/chart?data='+ args[1];
var output = 'image.png';

page.viewportSize = {
  width: 800, 
  height: 400 
}

page.clipRect = {
  top: 0, 
  left: 0, 
  width: 800, 
  height: 400 
};

page.open(address, function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
    window.setTimeout(function() {
      page.render(output);
      phantom.exit();
    }, 10);
  }
});