$('td.marks').on('click', function() {
    var $this = $(this);
    var $input = $('<input>', {
        value: $this.text(),
        type: 'number',
        blur: function() {
           $this.text(this.value);
        },
        keyup: function(e) {
           if (e.which === 13) $input.blur();
        }
    }).appendTo( $this.empty() ).focus();
});