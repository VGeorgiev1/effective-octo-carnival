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
app.post('/login', function (req,res) {

});
app.listen(300, function() {
    console.log('Ready!');
});

//app.use(express.static(path.join(path.normalize(path.join(__dirname, '/../')), 'public')));
app.use(express.static('public'));