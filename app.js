const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const auth = require('./authentication.js');
const forum = require('./forum.js');
const dir = require('./director');
const grades = require('./grades');
const chat = require('./chat');
const mainpages = require('./mainpages');
const materials = require('./materials');
const fileUpload = require('express-fileupload');
var io = require('socket.io').listen(app.listen(300));

var Kinvey = require('kinvey-node-sdk');
Kinvey.initialize({
    appKey: 'kid_SJg4EY6cW',
    appSecret: 'e3b622e5dd8e468da97e3fcc2366860a'
});

io.on('connection', function(socket) {
    socket.emit('message', {
        username: "server",
        message: "hello"
    });
    var promise = Kinvey.User.update({
            "socket_id": socket.id
        })
        .then(function(user) {
            // ...
        })
        .catch(function(error) {
            // ...
        });
    socket.on('send', function(data) {
        console.log("aaa");
        var activeUser = Kinvey.User.getActiveUser();
        let promiseUser = Promise.resolve(activeUser);
        promiseUser.then(function(activeuser) {
            var query = new Kinvey.Query();
            query.equalTo('_id', data.id);
            var stream = Kinvey.User.lookup(query)
                .subscribe(function(users) {
                    socket.to(users[0].socket_id).emit('message', {
                        username: !activeuser ? "anon" : `${activeuser.data.name} ( ${activeuser.data._id} )`,
                        message: data.message
                    });
                });
        });
    });

});

app.set('view engine', 'pug');
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', mainpages.home);
app.get('/main', mainpages.main);
app.get('/register', auth.registerGET);
app.post('/register', auth.registerPOST);
app.post('/login', auth.login);
app.post('/post', forum.postthread);
app.get('/logout', auth.logout);
app.get('/addclass', dir.addClassGet);
app.post('/addclass', dir.addClassPOST);
app.get('/details/:id', forum.details);
app.get('/grades/:grade/:class/:subject', grades.show);
app.get('/chat/:id', chat.show);
app.post('/postComment/:id', forum.postComment)
app.post('/upload', materials.upload);
app.get('/download/:id', materials.download)
app.get('/materials', materials.materialsGet);
app.post('/searchMaterial', materials.search);
app.get('/addgrade', function(req, res) {
    res.render('addgrade');
});
app.post('/search', forum.search);
app.post('/addgrade', grades.addgrade);

/*app.listen(300, function() {
    console.log('Ready!');
});*/
app.use(express.static('public'));