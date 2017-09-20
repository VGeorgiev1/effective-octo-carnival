var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});
function calcTime(dateIsoFormat) {
    let diff = new Date - (new Date(dateIsoFormat));
    diff = Math.floor(diff / 60000);
    if (diff < 1) return 'less than a minute';
    if (diff < 60) return diff + ' minute' + pluralize(diff);
    diff = Math.floor(diff / 60);
    if (diff < 24) return diff + ' hour' + pluralize(diff);
    diff = Math.floor(diff / 24);
    if (diff < 30) return diff + ' day' + pluralize(diff);
    diff = Math.floor(diff / 30);
    if (diff < 12) return diff + ' month' + pluralize(diff);
    diff = Math.floor(diff / 12);
    return diff + ' year' + pluralize(diff);
    function pluralize(value) {
        if (value !== 1) return 's';
        else return '';
    }
}
module.exports = {
    show: (req, res) => {
        res.render('chat', {
            id: req.params.id
        });
    },
    chatMain: (req,res)=>{
        let messageStore = Kinvey.DataStore.collection('messages');
        let query=new Kinvey.Query();
        var activeUser = Kinvey.User.getActiveUser();
        let promiseUser = Promise.resolve(activeUser);
        promiseUser.then(function(activeuser) {
            let username=activeUser.data.username
            showView(username)
        }).catch(function(error){
            
        })
        function showView(username){
            query.equalTo('to', username);
            let stream = messageStore.find(query);
            let msgs;
            stream.subscribe(function onNext(entities) {
                console.log(`Before ${entities}`)
                entities.map(x=>x.time=calcTime(x._kmd.ect));
                entities.reverse();
                msgs=entities
                console.log(`After ${entities}`)
               // console.log(msgs);
            }, function onError(error) {
                console.log(error);
            }, function onComplete() {
                res.render('find', {msgs: msgs})
            });
        }
    },
    sendMessage: (req,res)=>{
        let messageStore = Kinvey.DataStore.collection('messages');
        var activeUser = Kinvey.User.getActiveUser();
        let promiseUser = Promise.resolve(activeUser);
        promiseUser.then(function(activeuser) {
            let promise = messageStore.save({
                text: `${req.body.text}`,
                from: `${activeuser.data.name}`,
                to: req.body.search 
            }).then(function onSuccess(entity) {
                res.redirect('/main');
            }).catch(function(err) {
                console.log(err);
            });
        });
    }
};