var page = require('webpage').create(),
    system = require('system');

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

page.open(system.args[1], function(status) {
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