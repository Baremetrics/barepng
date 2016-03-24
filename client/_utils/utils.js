Graph.svg2png = function(callback) {

  // Snag all the documents stylesheets
  var styleDefs = "";
  var sheets = document.styleSheets;

  // Look through stylesheets and find any attributes that apply to this svg
  if (sheets) {
    _.each(sheets, function(d) {
      var rules = d.cssRules;

      if (rules) {
        _.each(rules, function(rule) {
          if (rule.selectorText) {
            var selectorText = rule.selectorText;
            var elems = document.querySelectorAll(selectorText);

            if (elems.length) {
              var raw = selectorText.split(',');
              var clean = [];

              _.each(raw, function(d) {
                if (d.indexOf('svg') != -1)
                  clean.push(d.substring(d.indexOf('svg') + 3).trim());
              });

              $.unique(clean);

              if (clean.length)
                styleDefs += clean.join() +'{'+ rule.style.cssText +'}\n';
            }
          }
        });
      }
    });
  }

  // Create new mini style group off of the styleDefs and apply it to the svg clone
  var s = document.createElement('style');
  s.innerHTML = '<![CDATA[\n' + styleDefs + '\n]]>';

  $('svg')[0].insertBefore(s, $('svg')[0].firstChild);

  var html = d3.select('svg')
    .attr("version", 1.1)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .node().outerHTML;

  // Create an image from the svg
  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(html)));
  var image = new Image;
      image.src = imgsrc;

  // Create a blank canvas
  var canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;

  // Apply svg to canvas then pull it all out as a png
  var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      
  var pngData = canvas.toDataURL("image/png");

  // If resulting png data is valid, good, otherwise run it again
  // This fixes an odd Safari bug which was generating a bugged blank image
  // Running it again always fixed it, so.. do it programatically
  if (pngData.length <= 20000) {
    Graph.svg2png(callback);
  } else {
    callback(pngData);
  }
}