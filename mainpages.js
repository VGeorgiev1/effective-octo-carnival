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
            ent.map(x=>x.time=calcTime(x._kmd.ect));

            ent.map(x=> {
                if (x.tags) {
                    x.tagsText = x.tags.join(', ')
                }
            });
            ent.reverse();
        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            res.render('main', {ent: ent})
        });
    }
};
