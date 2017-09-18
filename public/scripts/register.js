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

infiniteFields('subject');
infiniteFields('childemail');