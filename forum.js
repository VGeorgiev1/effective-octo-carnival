var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});

module.exports={

    postthread: (req, res)=>{
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
    },
    details: (req,res)=>{

        let threadStore = Kinvey.DataStore.collection('threads');
        let query = new Kinvey.Query();
        query.equalTo('_id', req.param('id'));
        let stream=threadStore.find(query);
        let entityHolder;
        stream.subscribe(function onNext(entity) {
            entityHolder=entity;
        },function onError(error) {
            console.log(error);
        },function onComplete() {
            console.log(entityHolder);
            res.render('details', {entit: entityHolder[0]})
        })
    },
    postComment: (req,res)=>{
        let commentStore = Kinvey.DataStore.collection('comments');
        var activeUser = Kinvey.User.getActiveUser();
        let promiseUser = Promise.resolve(activeUser);
        promiseUser.then(function(activeuser) {
            let promise = commentStore.save({
                text: `${req.body.text}`,
                author: `${activeuser.data.name}`,
                post:`${req.param('id')}`
            }).then(function onSuccess(entity) {
                res.redirect(`/details/${req.param('id')}`);
            }).catch(function(err) {
                console.log(err);
            });
        });

    }
};