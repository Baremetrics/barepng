Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/chart', {name: 'chart'});

Router.route('/', {
  where: 'server'
})
.get(function() {
  // var start = new Date().getTime();
  var query = "";

  for (var key in this.request.query) {
    if (query != "") query += "&";
    query += key + "=" + this.request.query[key];
  }

  var file = Meteor.call('phantom', query, this.request.query.w || 800, this.request.query.h || 400);

  // console.log(new Date().getTime() - start +'/ms');
  this.response.writeHead(200, {
    'access-control-allow-origin': '*',
    'Content-Type': 'image/png'
  });
  this.response.end(file, 'base64');
});