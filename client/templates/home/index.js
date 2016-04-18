Template.home.rendered = function() {
  var titles = $('.entry .title');

  var widths = titles.map(function() {
    return $(this).width();
  });

  titles.width(d3.max(widths));
}

Template.home.events({
  'click .generate': function(e) {
    $('.generate, .image').addClass('loading');
    Meteor.setTimeout(function() {
      $('.generate, .image').removeClass('loading');
    }, 3000);

    var object = {};

    $('.entry .field').each(function() {
      var key = $(this).data('key');

      if ($(this).hasClass('field--select')) {
        object[key] = $(this).val();
      } else {
        var value = $(this).html();

        if (value.indexOf(',') != -1) {
          value = JSON.parse('['+ value +']');
        } else if (key != 'style' && key != 'symbol') {
          value = Number(value);
        }

        object[key] = value;
      }
    });

    var query_string = '';
    _.each(object, function(d, k) {
      if (query_string != '') query_string += '&';
      query_string += k + '=' + (typeof d != 'string' ? JSON.stringify(d) : d);
    });

    $('.image img').attr('src', window.location.origin +'/api?v=3&'+ query_string);
  },
  'change .field--select': function(e) {
    var value = $(e.currentTarget).val();

    if (value == 'default') {
      $('.goal').hide();
      $('.symbol').show();
    } else {
      $('.goal').show();
      $('.symbol').hide();
    }
  }
});

Template.home.helpers({
  
});