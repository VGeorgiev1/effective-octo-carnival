const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});

var classesDataStore = Kinvey.DataStore.collection('classes');

function harvestInfiniteFields(data, keyword) {
    return Object.keys(data).filter(function(k) {
        return k.indexOf(keyword) == 0;
    }).reduce(function(newData, k) {
        newData.push(data[k]);
        return newData;
    }, []);
}


app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function(req, res) {
    res.render('home');
});
app.get('/register', function(req, res) {
    res.render('register');
});
app.post('/register', function(req, res) {
    let user = new Kinvey.User();
    let promise;

    switch (req.body.role) {
        case 'student':
            promise = user.signup({
                username: req.body.user_email,
                name: req.body.user_name,
                password: req.body.user_password,
                role: req.body.role,
                class: req.body.class,
                grade: req.body.grade
            }).then(function(user) {
                var classQuery = new Kinvey.Query();
                classQuery.equalTo('grade', req.body.grade).and().equalTo('class', req.body.class);
                var stream = classesDataStore.find();
                stream.subscribe(function onNext(entities) {
                    if (entities.length > 0) {
                        let matchingClass = entities[0];
                        if (!matchingClass.hasOwnProperty('students')) {
                            matchingClass.students = [];
                        }
                        matchingClass.students.push(req.body.user_email);
                        classesDataStore.save(matchingClass).then(function onSuccess(entity) {
                            console.log("saved: " + entitity);
                        }).catch(function onError(error) {
                            console.log(error);
                        });
                        res.send(matchingClass);
                    }
                }, function onError(error) {
                    console.log(error);
                }, function onComplete() {
                    //res.send(user);
                });
            }).catch(function catcher(error) {
                console.log(error);
            });
            break;
        case 'teacher':
            promise = user.signup({
                username: req.body.user_email,
                password: req.body.user_password,
                name: req.body.user_name,
                role: req.body.role,
                subjects: harvestInfiniteFields(req.body, 'subject')
            }).then(function(user) {

                res.redirect('/main');
            });
            break;
        case 'parent':
            promise = user.signup({
                username: req.body.user_email,
                password: req.body.user_password,
                name: req.body.user_name,
                role: req.body.role,
                childmail: harvestInfiniteFields(req.body, 'childmail')
            }).then(function(user) {
                res.redirect('/main');
            });
            break;
    }

});
app.post('/login', function(req, res) {
    let promise = Kinvey.User.login({
        username: `${req.body.user_email}`,
        password: `${req.body.user_password}`
    }).then(function(user) {
        res.redirect('/main');
    }).catch(function(err) {
        console.log(err);
    });
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
app.get('/logout', function(req, res) {
    let promise = Kinvey.User.logout()
        .then(function() {
            res.render('home');
        })
});
app.post('/post', function(req, res) {
    let threadStore = Kinvey.DataStore.collection('threads');
    var activeUser = Kinvey.User.getActiveUser();
    let promiseUser = Promise.resolve(activeUser);
    promiseUser.then(function(activeuser) {
        let promise = threadStore.save({
            text: `${req.body.text}`,
            author: `${activeuser.data.name}`
        }).then(function onSuccess(entity) {
            res.redirect('/main');
        }).catch(function(err) {
            console.log(err);
        });
    });


    let promise = Kinvey.User.login({
        username: `${req.body.user_email}`,
        password: `${req.body.user_password}`
    }).then(function(user) {
        res.send(user);
    }).catch(function onError(error) {
        console.log(error);
    });
});

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
        if (entities.length > 0) {
            let matchingClass = entities[0];
            let studentEmail = req.body.studentname;
            if (!matchingClass.hasOwnProperty('subjects')) {
                matchingClass.subjects = [];
            }
            if (!matchingClass.subjects.hasOwnProperty(req.body.subject)) {
                matchingClass.subjects[req.body.subject] = {};
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
                console.log("saved: " + entitity);
            }).catch(function onError(error) {
                console.log(error);
            });
        }
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