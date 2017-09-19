var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});

module.exports={
    addClassPOST: (req, res) => {
        classesDataStore.save({
            grade: req.body.grade,
            class: req.body.class
        }).then(function onSuccess(entity) {
            res.send("created " + req.body.grade + req.body.class);
        }).catch(function onError(error) {
            console.log(error);
        });
    },
    addClassGet:(req, res)  => {
    res.render('addgrade');
    }

};