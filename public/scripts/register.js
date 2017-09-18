var radios = document.getElementsByName("role");
var teacherForm = document.getElementById("teacherForm");
var studentForm = document.getElementById("studentForm");
var parentForm = document.getElementById("parentForm");

/* If Credit Card is selected by default, add these two lines of code.
cardpayment.style.display = 'block';   // show
internetpayment.style.display = 'none';// hide
*/

for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = function() {
        var val = this.value;
        if (val == 'radio1' || val == 'radio2') { // Assuming your value for radio buttons is radio1, radio2 and radio3.
            cardpayment.style.display = 'block'; // show
            internetpayment.style.display = 'none'; // hide
        } else if (val == 'radio3') {
            cardpayment.style.display = 'none';
            internetpayment.style.display = 'block';
        }

    }