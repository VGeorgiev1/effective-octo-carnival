const express = require('express');
const app = express();
const bodyParser=require('body-parser');

var Kinvey = require('kinvey-node-sdk');
Kinvey.init({
    appKey: 'kid_Hysl0EpqZ',
    appSecret: '37974eed0a6d46e79f318a4629f5f203'
});

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res) {
    console.log('wtf');
    res.render('home');
});
app.get('/register', function(req, res) {
    res.render('register');

});
app.post('/register', function (req,res) {
    console.log(req.body);
    let user = new Kinvey.User();
    let promise;
    switch (req.body.role){
        case 'student':
             promise=user.signup({
                username: req.body.user_email,
                password: req.body.user_password,
                role: req.body.role,
                class: req.body.class,
                grade: req.body.grade
            }).then(function (user) {
                res.render('main')
            });
            break;
        case 'teacher':
             promise=user.signup({
                username: req.body.user_email,
                password: req.body.user_password,
                role: req.body.role,
                subject: req.body.subject1,
            }).then(function (user) {
                 res.render('main')
            });
            break;
        case 'parent':
            promise=user.signup({
                username: req.body.user_email,
                password: req.body.user_password,
                role: req.body.role,
                childmail: req.body.childmail1,
            }).then(function (user) {
                res.render('main')
            });
            break;
    }

});
app.post('/login', function (req,res) {
    console.log('zxr');
    console.log(req.body);
    let promise = Kinvey.User.login({
        username: `${req.body.user_email}`,
        password: `${req.body.user_password}`
    }).then(function (user) {
        res.render('main')
    })
});
app.get('/logout', function (req,res) {
    let promise = Kinvey.User.logout()
        .then(function () {
            res.render('home');
        })
});
app.listen(300, function() {
    console.log('Ready!');
});

//app.use(express.static(path.join(path.normalize(path.join(__dirname, '/../')), 'public')));
app.use(express.static('public'));