var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});
module.exports={
    search: (req,res)=>{
        let threads=Kinvey.DataStore.collection('threads');
        let query=new Kinvey.Query();
        let tags=req.body.search.split(' ');
        tags=tags.filter(x=>x!='');
        if(tags.length==0){
            res.redirect('/main');
        }
        query.contains('tags',tags);
       let stream=threads.find(query);
       stream.subscribe(function onNext(entity) {
           entity.map(x=> {
               if (x.tags) {
                   x.tagsText = x.tags.join(', ')
               }
           });
           res.render('main', {ent:entity})
       },function onError(){

       },function onComplete() {

       })
    },
    postthread: (req, res)=>{
           let threadStore = Kinvey.DataStore.collection('threads');
           var activeUser = Kinvey.User.getActiveUser();
           let promiseUser = Promise.resolve(activeUser);
           promiseUser.then(function(activeuser) {
               let tags=req.body.tags.split(' ');
               console.log(tags);
               let promise = threadStore.save({
                   text: `${req.body.text}`,
                   author: `${activeuser.data.name}`,
                   tags: tags
               }).then(function onSuccess(entity) {
                   res.redirect('/main');
               }).catch(function(err) {
                   console.log(err);
               });
           });
    },
    details: (req,res)=>{
        let threadStore = Kinvey.DataStore.collection('threads');
        let commentStore= Kinvey.DataStore.collection('comments');
        let query2=new Kinvey.Query();
        query2.equalTo('post', req.param('id'));
        let query = new Kinvey.Query();
        query.equalTo('_id', req.param('id'));
        let stream=threadStore.find(query);
        let entityHolder;
        let commentsHolder;
        let stream2=commentStore.find(query2);
        stream.subscribe(function onNext(entity) {
            entityHolder=entity;
        },function onError(error) {
            console.log(error);
        },function onComplete() {
            stream2.subscribe(function onNext(entities) {
               commentsHolder=entities
            },function onError(error){
                console.log(error);
            },function onComplete() {
                res.render('details', {entit: entityHolder[0],
                                       comments: commentsHolder})
            });
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