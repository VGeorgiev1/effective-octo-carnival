const express=require('express');
const app=express();
app.set('view engine', 'pug');
const path=require('path');
app.use(express.static(path.join(path.normalize(path.join(__dirname, '/../')), 'public')));

app.get('/', function (req,res) {
    res.render('home');
});
app.get('/register', function (req,res) {
    res.render('register');
});
app.listen(3000, function () {
    console.log('Ready!');
});
