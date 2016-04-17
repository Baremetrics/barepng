Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'home'});

Router.route('/chart', {name: 'chart'});

Router.route('/api', {
  where: 'server'
})
.get(function() {
  var file = Meteor.call('phantom', {
    query: this.request.query,
    proto: this.request.headers['x-forwarded-proto'],
    host: this.request.headers.host
  });

  this.response.writeHead(200, {
    'access-control-allow-origin': '*',
    'Content-Type': 'image/png'
  });
  this.response.end(file, 'base64');
});