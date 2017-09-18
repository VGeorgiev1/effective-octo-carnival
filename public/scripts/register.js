var radios = document.getElementsByName("role");
var teacherForm = document.getElementById("teacherForm");
var studentForm = document.getElementById("studentForm");
var parentForm = document.getElementById("parentForm");

function hide() {
    teacherForm.style.display = 'none';
    studentForm.style.display = 'none';
    parentForm.style.display = 'none';
}

hide();

for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = function() {
        var val = this.value;
        console.log(val);
        hide();
        if (val == 'teacher') {
            teacherForm.style.display = 'block';
        } else if (val == 'student') {
            studentForm.style.display = 'block';
        } else {
            parentForm.style.display = 'block';
        }
    }
}


var subjectsCount = 1;
var subject = $("#subject1");

subject.on('input', function() {
    var len = $(this).attr('id').length;
    var next = 'subject' + (Number($(this).attr('id').substring('subject'.length, len)) + 1);
    console.log(next);
    if (!$('#' + next).length) {
        $(this).clone(true, true).prop({
            name: next,
            id: next,

        }).val('').appendTo($(this).parent());
        subjectsCount++;
    }
});

var childEmailsCount = 1;
var childemail = $("#childemail1");

childemail.on('input', function() {
    var len = $(this).attr('id').length;
    var next = 'childemail' + (Number($(this).attr('id').substring('childemail'.length, len)) + 1);
    console.log(next);
    if (!$('#' + next).length) {
        $(this).clone(true, true).prop({
            name: next,
            id: next,

        }).val('').appendTo($(this).parent());
        childEmailsCount++;
    }
});