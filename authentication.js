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

module.exports = {

    registerPOST: (req, res) => {
        let user = new Kinvey.User();
        let promise;

        switch (req.body.role) {
            case 'student':
                console.log("43");
                promise = user.signup({
                    username: req.body.user_email,
                    name: req.body.user_name,
                    password: req.body.user_password,
                    role: req.body.role,
                    class: req.body.class,
                    grade: req.body.grade
                }).then(function(user) {
                    console.log("51");
                    var classQuery = new Kinvey.Query();
                    var classesDataStore = Kinvey.DataStore.collection('classes');
                    classQuery.equalTo('grade', req.body.grade).and().equalTo('class', req.body.class);
                    var stream = classesDataStore.find();
                    stream.subscribe(function onNext(entities) {
                        if (entities.length > 0) {
                            console.log("entities: " + entities);
                            console.log("56");
                            let matchingClass = entities[0];
                            console.log(matchingClass);
                            console.log("58");
                            if (!matchingClass.hasOwnProperty('students')) {
                                console.log("60");
                                matchingClass.students = [];
                            }
                            console.log("62");
                            matchingClass.students.push(user.username);
                            console.log("64");
                            classesDataStore.save(matchingClass).then(function onSuccess(entity) {
                                console.log(entitity);
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
    },
    registerGET: (req, res) => {
        res.render('register');
    },
    login: (req, res) => {
        let promise = Kinvey.User.login({
            username: `${req.body.user_email}`,
            password: `${req.body.user_password}`
        }).then(function(user) {
            
            res.redirect('/main')
        }).catch(function onError(error) {
            console.log(error);
        });
    },
    logout: (req, res) => {
        let promise = Kinvey.User.logout()
            .then(function() {
                res.render('home');
            })
    }
};