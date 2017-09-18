const express = require('express');
const app = express();
const appKey=''
app.set('view engine', 'pug');
const path = require('path');
const bodyParser=require('body-parser');
let $ = require('jquery');
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
   console.log(req.body);
});
app.listen(300, function() {
    console.log('Ready!');
});

//app.use(express.static(path.join(path.normalize(path.join(__dirname, '/../')), 'public')));
app.use(express.static('public'));