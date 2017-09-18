const express=require('express');
const app=express();
app.set('view engine', 'pug');

app.get('/', function (req,res) {
    res.render('home');
});
app.get('/register', function (req,res) {
    res.render('register');
});

app.listen(3000, function () {
    console.log('Ready!');
});