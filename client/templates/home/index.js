Template.home.rendered = function() {
  $('.int').autoNumeric('init', {
    aSep: '',
    mDec: 0
  });
}

Template.home.events({
  'click .generate': function(e) {
    $('.generate, .image').addClass('loading');

    var object = {};

    $('.entry .field').each(function() {
      var key = $(this).attr('name');
      var value = $(this).val();

      if (value.indexOf(',') != -1) {
        value = JSON.parse('['+ value +']');
      } else if (key != 'style' && key != 'symbol') {
        value = Number(value);
      }

      object[key] = value;
    });

    var query_string = '';
    _.each(object, function(d, k) {
      if (query_string != '') query_string += '&';
      query_string += k + '=' + (typeof d != 'string' ? JSON.stringify(d) : d);
    });

    var url = window.location.origin +'/api?v=3&'+ query_string;

    $('.image img').load( function(){
      $('.generate, .image').removeClass('loading');
    }).attr('src', url);

    Meteor.call('googleURL', url, function(error, result) {
      if (error) { 
        console.log(error); 
      } else {
        console.log(result);
        $('.url').html(result);
      } 
    });
  },
  'change .style .field': function(e) {
    var value = $(e.currentTarget).val();

    if (value == 'default') {
      $('.goal').hide();
      $('.symbol').show();
    } else {
      $('.goal').show();
      $('.symbol').hide();
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