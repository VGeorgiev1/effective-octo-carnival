var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});
var http=require('http');
module.exports={
    materialsGet: (req,res)=>{
        let materialsStore=Kinvey.DataStore.collection('materials');
        let stream=materialsStore.find();
        let materialsContainer;
        stream.subscribe(function onNext(entities) {
            materialsContainer=entities;
        },function onError(error) {
            console.log(error.message)
        },function onComplete() {
            res.render('materials', {mats: materialsContainer})
        })
    },
    upload: (req,res)=>{
        console.log(req.files.name.data);
        let materialsStore=Kinvey.DataStore.collection('materials');
        var activeUser = Kinvey.User.getActiveUser();
        let promiseUser = Promise.resolve(activeUser);
        promiseUser.then(function(activeuser) {
            let metadata={
                filename: req.files.name,
                mimeType: req.files.name.mimetype,
                size: req.files.name.data.length
            };
            let promise1 = Kinvey.Files.upload(req.files.name.data,metadata)
                .then(function onSuccess(entity) {
                    let promise=materialsStore.save({
                        author: `${activeuser.data.name}`,
                        name: req.files.name.name,
                        cstId: entity._id
                    }).then((entity) =>{
                       res.redirect(`/materials`);
                    }).catch(function(err) {
                        console.log(err);
                    })
                }).catch(function(err) {
                    console.log(err);
                });


        });
    },
    download:(req,res)=>{
        console.log(req.param('id'));
        var promise = Kinvey.Files.stream(`${req.param('id')}`)
            .then(function(file) {
                console.log(file._downloadURL);
               let url=file._downloadURL;
               res.redirect(url);

            })
            .catch(function(error) {
                console.log(error.message);
            });
    }
};
