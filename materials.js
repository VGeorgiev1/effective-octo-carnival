var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});
var http=require('http');
module.exports={
    search: (req,res)=>{
        let materials=Kinvey.DataStore.collection('materials');
        let query=new Kinvey.Query();
        let tags=req.body.search.split(' ');
        tags=tags.filter(x=>x!='');
        if(tags.length==0){
            res.redirect('/materials');
        }
        query.contains('tags',tags);
        let stream=materials.find(query);
        stream.subscribe(function onNext(entity) {
            entity.map(x=> {
                if (x.tags) {
                    x.tagsText = x.tags.join(', ')
                }
            });
            console.log(entity);
            res.render('materials', {mats:entity})
        },function onError(){

        },function onComplete() {

        })

    },
    materialsGet: (req,res)=>{
        let materialsStore=Kinvey.DataStore.collection('materials');
        let stream=materialsStore.find();
        let materialsContainer;
        stream.subscribe(function onNext(entities) {
            entities.reverse();
            entities.map(x=> {
                if (x.tags) {
                    x.tagsText = x.tags.join(', ')
                }
            });
            materialsContainer=entities;
        },function onError(error) {
            console.log(error.message)
        },function onComplete() {
            var activeUser = Kinvey.User.getActiveUser();
            let promiseUser = Promise.resolve(activeUser);
            promiseUser.then(function(activeuser) {
                if(activeUser.data.role=='teacher'){
                    res.render('materials', {mats: materialsContainer,
                                             teacher: true})
                }
                else{
                    res.render('materials', {mats: materialsContainer})
                }
            })
            
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
                    let tags=req.body.tags.split(' ');
                    let promise=materialsStore.save({
                        author: `${activeuser.data.name}`,
                        name: req.files.name.name,
                        cstId: entity._id,
                        tags: tags
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
               let url=file._downloadURL;
               res.redirect(url);
            })
            .catch(function(error) {
                console.log(error.message);
            });
    }
};
