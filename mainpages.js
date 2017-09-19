var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});

module.exports={
    home:(req,res)=>{
        res.render('home');
    },
    main:(req, res)=>{
        let threadStore = Kinvey.DataStore.collection('threads');
        let stream = threadStore.find();
        let ent;
        stream.subscribe(function onNext(entities) {
            ent = entities;
        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            res.render('main', {ent: ent})
        });
    }
};
