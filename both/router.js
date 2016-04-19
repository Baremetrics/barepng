Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  data: {
    start: 14578940,
    step: 864,
    data: [43991,101,47,78,-14,-30,-5,12,9,-3],
    symbol: '$^',
    style: 'default',
    w: 780,
    h: 380,
    goal: [14578940,43891,14586716,44271]
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