var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function addGrade(req, res) {
    var classQuery = new Kinvey.Query();
    classQuery.equalTo('grade', req.body.grade).and().equalTo('class', req.body.class);
    let classesDataStore = Kinvey.DataStore.collection('classes');
    let stream = classesDataStore.find(classQuery);
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
        res.render('addgrade');
    });
}

module.exports = {
    show: (req, res) => {
        var classQuery = new Kinvey.Query();
        classQuery.equalTo('grade', req.params.grade).and().equalTo('class', req.params.class);
        let classesDataStore = Kinvey.DataStore.collection('classes');
        let stream = classesDataStore.find(classQuery);
        stream.subscribe(function onNext(entities) {
            if (entities.length > 0) {
                let matchingClass = entities[0];
                let topicsSet = new Set();
                let studentNames = [];
                let subj = matchingClass.subjects[req.params.subject];
                console.log();
                for (let student in subj) {
                    studentNames.push(student);
                    for (let j = 0; j < subj[student].length; j++) {
                        topicsSet.add(subj[student][j].name);
                    }
                }
                let topics = Array.from(topicsSet);
                let table = createArray(studentNames.length + 1, topics.length + 1);
                for (let i = 0; i < studentNames.length + 1; i++) {
                    for (let j = 0; j < topics.length + 1; j++) {
                        table[i][j] = {};
                        if (i > 0 && j > 0) {
                            let mark = subj[studentNames[i - 1]].filter((a) => a.name == topics[j - 1])[0];
                            table[i][j].content = mark === undefined ? "" : mark.value;
                            table[i][j].email = studentNames[i - 1];
                            table[i][j].class = req.params.class;
                            table[i][j].grade = req.params.grade;
                        } else if (i > 0 && j == 0) {
                            table[i][j].content = studentNames[i - 1];
                        } else if (i == 0 && j > 0) {
                            table[i][j].content = topics[j - 1];
                        } else {
                            table[i][j].content = "";
                        }
                    }
                }

                res.render('table', {
                    Table: table
                });
            }
        }, function onError(error) {
            console.log(error);
        }, function onComplete() { });
    },
    addgrade: addGrade,
    listgrades: (req, res) => {
        var classQuery = new Kinvey.Query();
        var activeUser = Kinvey.User.getActiveUser();
        let promiseUser = Promise.resolve(activeUser);
        promiseUser.then(function (activeuser) {
            classQuery.equalTo('grade', activeuser.data.grade).and().equalTo('class', activeuser.data.class);
            let classesDataStore = Kinvey.DataStore.collection('classes');
            let stream = classesDataStore.find(classQuery);
            stream.subscribe(function onNext(entities) {
                if (entities.length > 0) {
                    let matchingClass = entities[0];
                    if (!matchingClass.hasOwnProperty('subjects')) {
                        matchingClass.subjects = {};
                    }
                    console.log(activeuser.data.class)
                    res.render('listgrades', { subjects: Object.keys(matchingClass.subjects), grade: activeuser.data.grade, clas: activeuser.data.class });
                }
            }, function onError(error) {
                console.log(error);
            }, function onComplete() {
            });
        });
    }
};