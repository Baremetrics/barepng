Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/chart', {name: 'chart'});

Router.route('/', {
  where: 'server'
})
.get(function() {
  // var start = new Date().getTime();
  var file = Meteor.call('phantom', {
    query: this.request.query,
    proto: this.request.headers['x-forwarded-proto'],
    host: this.request.headers.host
  });

  // console.log(new Date().getTime() - start +'/ms');

  this.response.writeHead(200, {
    'access-control-allow-origin': '*',
    'Content-Type': 'image/png'
  });
  this.response.end(file, 'base64');
});