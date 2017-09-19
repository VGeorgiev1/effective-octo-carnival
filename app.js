const express = require('express');
const app = express();
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./authentication.js');
const forum = require('./forum.js');
const dir = require('./director');
const grades = require('./grades');
const mainpages = require('./mainpages');
const materials=require('./materials');
const fileUpload = require('express-fileupload');
var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', mainpages.home);
app.get('/main', mainpages.main);
app.get('/register', auth.registerGET);
app.post('/register', auth.registerPOST);
app.post('/login', auth.login);
app.post('/post', forum.postthread);
app.get('/logout', auth.logout);
app.get('/addclass', dir.addClassGet);
app.post('/addclass', dir.addClassPOST);
app.get('/details/:id', forum.details);
app.get('/grades/:grade/:class/:subject', grades.show);
app.post('/postComment/:id', forum.postComment)
app.post('/upload', materials.upload);
app.get('/download/:id', materials.download)
app.get('/materials', materials.materialsGet);
app.get('/addgrade', function(req, res) {
    res.render('addgrade');
});

app.post('/addgrade', function(req, res) {
    var classQuery = new Kinvey.Query();
    classQuery.equalTo('grade', req.body.grade).and().equalTo('class', req.body.class);
    let classesDataStore = Kinvey.DataStore.collection('classes');
    let stream = classesDataStore.find();
    stream.subscribe(function onNext(entities) {
        if (entities.length > 0) {
            let matchingClass = entities[0];
            let studentEmail = req.body.studentname;
            if (!matchingClass.hasOwnProperty('subjects')) {
                matchingClass.subjects = {};
            }
            if (!matchingClass.subjects.hasOwnProperty(req.body.subject)) {
                matchingClass.subjects[req.body.subject] = {}; // DO NOT TOUCH THIS IT WILL EXPLODE!!!!
            }
            if (!matchingClass.subjects[req.body.subject].hasOwnProperty(studentEmail)) {
                matchingClass.subjects[req.body.subject][studentEmail] = [];
            }
            matchingClass.subjects[req.body.subject][studentEmail].push({
                name: req.body.name,
                value: req.body.value,
                weight: 1
            });
            classesDataStore.save(matchingClass).then(function onSuccess(entity) {
                console.log("entity:");
                console.log(entity);
            }).catch(function onError(error) {
                console.log(error);
            });
        }
    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        res.render('addclass');
    });
});

app.listen(300, function() {
    console.log('Ready!');
});
app.use(express.static('public'));