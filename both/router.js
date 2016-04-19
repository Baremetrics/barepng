Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  data: {
    start: 14578940,
    step: 864,
    data: [45000,100,40,65,-25,-15,-5,15,10,-5],
    symbol: '$^',
    w: 780,
    h: 380,
  }
});

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