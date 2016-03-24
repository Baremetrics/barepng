var page = require('webpage').create();
page.settings.userAgent = 'SpecialAgent';
page.open('http://f.cl.ly/items/0G0i2C140I1e2C3I1k3j/index.html', function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
    var doc = page.evaluate(function() {
      return document.querySelector('body').innerHTML;
    });

    return doc;
  }
  phantom.exit();
});