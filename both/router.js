Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  data: {
    start: Math.round(new Date().getTime() / 100000) - (865 * 12),
    step: 864,
    data: [4500,20,35,5,-20,15,-5,20,15,-5,10,-15,5],
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