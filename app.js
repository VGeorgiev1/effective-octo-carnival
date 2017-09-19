const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const auth=require('./authentication.js');
const forum=require('./forum.js');
var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res) {
    res.render('home');
});
app.get('/main', function(req, res) {
    let threadStore = Kinvey.DataStore.collection('threads');
    let stream = threadStore.find();
    let ent;
    stream.subscribe(function onNext(entities) {
        ent = entities;
    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        res.render('main', {
            ent: ent
        })
    });
});
app.get('/register', auth.registerGET);
app.post('/register', auth.registerPOST);
app.post('/login', auth.login);
app.post('/post', forum.postthread);
app.get('/logout', auth.logout);
app.get('/addclass', function(req, res) {
    res.render('addclass');
});

app.post('/addclass', function(req, res) {
    classesDataStore.save({
        grade: req.body.grade,
        class: req.body.class
    }).then(function onSuccess(entity) {
        res.send("created " + req.body.grade + req.body.class);
    }).catch(function onError(error) {
        console.log(error);
    });

});

app.get('/addgrade', function(req, res) {
    res.render('addgrade');
});

app.post('/addgrade', function(req, res) {
    var classQuery = new Kinvey.Query();
    classQuery.equalTo('grade', req.body.grade).and().equalTo('class', req.body.class);
    let classesDataStore = Kinvey.DataStore.collection('threads');
    let stream = classesDataStore.find();
    stream.subscribe(function onNext(entities) {
        console.log(entities);
        matchingClass = entities[0];
        matchingStudent = matchingClass.students.filter(s => s.name = req.body.studentname)[0];
        if (!matchingClass.subjects.hasOwnProperty(req.body.subject)) {
            matchingClass.subjects[req.body.subject] = {};
        }
        if (!matchingClass.subjects[req.body.subject].hasOwnProperty(matchingStudent._id)) {
            matchingClass.subjects[req.body.subject] = [];
        }
        matchingClass.subjects[req.body.subject][matchingStudent._id].push({
            name: req.body.name,
            value: req.body.value,
            weight: 1
        });
        classesDataStore.save(matchingClass).then(function onSuccess(entity) {
            // ...
        }).catch(function onError(error) {

        });
    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        res.render('addgrade');
    });
});

app.listen(300, function() {
    console.log('Ready!');
});
app.use(express.static('public'));