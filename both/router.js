Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'home'});

Router.route('/svg', function() {
  this.render('svg', {
    data: function () {
      return this.params.query.data || '[[0,0],[1,1]]';
    }
  });
});

Router.route('/png', {
  where: 'server'
})
.get(function() {
  this.response.writeHead(200, {
    'access-control-allow-origin': '*',
    'Content-Type': 'image/png'
  });

  var file = Meteor.call('phantom', this.request.query.data);
  this.response.end(file, 'base64');
});