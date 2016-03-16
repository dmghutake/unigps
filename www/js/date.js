/*if ( $('[type="date"]').prop('type') != 'date' ) {
} */

if ( $('html').hasClass('no-touch') ) {
  var $input, $btn;
  $( ".date-wrapper" ).each(function( index ) {
    $input = $(this).find('input');
    $btn = $(this).find('.calendar-btn');
    $input.attr('type', 'text');
    var pickerStart = new Pikaday({
      field: $input[0],
      trigger: $btn[0],
      container: $(this)[0],
      format: 'DD/MM/YYYY',
      firstDay: 1
    });
    $btn.show();
  });
} else {
  $('.date-wrapper input').attr('type', 'date');
  $('.calendar-btn').hide();
}
