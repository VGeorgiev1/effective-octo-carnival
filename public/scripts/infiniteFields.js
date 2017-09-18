function infiniteFields(keyword) {
    var count = 1;
    var first = $(`#${keyword}1`);

    first.on('input', function() {
        var len = $(this).attr('id').length;
        var next = keyword + (Number($(this).attr('id').substring(keyword.length, len)) + 1);
        console.log(next);
        if (!$('#' + next).length) {
            $(this).clone(true, true).prop({
                name: next,
                id: next,

            }).val('').appendTo($(this).parent());
            count++;
        }
    });
}