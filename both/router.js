Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/chart', {name: 'chart'});

Router.route('/', {
  where: 'server'
})
.get(function() {
  this.response.writeHead(200, {
    'access-control-allow-origin': '*',
    'Content-Type': 'image/png'
  });
  var start = new Date().getTime();
  var file = Meteor.call('phantom', this.request.query.data);

  console.log(new Date().getTime() - start +'/ms');
  this.response.end(file, 'base64');
});