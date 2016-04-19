Template.home.rendered = function() {
  $('.int').each(function() {
    var max = $(this).data('max');

    $(this).autoNumeric('init', {
      aSep: '',
      vMin: 0,
      vMax: max
    });
  });

  $('.image img').load(function() {
    $('.generate, .image').removeClass('loading');
  }).attr('src', 'http://goo.gl/xZvZwR');
}

Template.home.events({
  'click .generate': function(e) {
    var object = {},
        query_string = '',
        url;

    $('.generate, .image').addClass('loading');
    $('.url').html('');

    $('.entry .field').each(function() {
      var key = $(this).attr('name');
      var value = $(this).val();

      if (value.indexOf(',') != -1) {
        value = JSON.parse('['+ value +']');
      } else if (key != 'symbol') {
        value = Number(value);
      }

      object[key] = value;
    });

    _.each(object, function(d, k) {
      if (query_string != '') query_string += '&';
      query_string += k + '=' + (typeof d != 'string' ? JSON.stringify(d) : d);
    });

    console.log(query_string);

    url = window.location.origin +'/api?'+ query_string;

    $('.image img').load(function() {
      Meteor.call('gurl', url, function(error, result) {
        $('.generate, .image').removeClass('loading');
        
        if (error) {
          $('.url').html(url);
        } else {
          $('.url').html(result);
        }
      });
    }).attr('src', url);
  },
  'keyup input': function(e) {
    if (e.keyCode == 13) {
      $('.generate').trigger('click');
    }
  },
  'click .url': function(e) {
    var range = document.createRange();
    var selection = window.getSelection();

    range.selectNodeContents(e.currentTarget);
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

Template.home.helpers({
  
});