
var express = require('express');
var app = express();
var router = require('./router/router.js');
var session = require('express-session');

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    //cookie: { secure: true }
}));
//模板引擎
app.set('view engine','ejs');
//静态资源
app.use(express.static('./public'));
// app.use(express.static('./avatar'));

//路由表
app.get('/',router.showIndex);
app.get('/getHomePageList',router.getHomePageList);
app.get('/detail',router.detail);
app.get('/getDetail',router.getDetail);
app.post('/doRegister',router.doRegister);
app.post('/UserNameCheckR',router.UserNameCheckR);
app.get('/checkLoginAccount',router.checkLoginAccount);
// app.get('/register',router.showRegister);
// app.post('/doRegister',router.doRegister);
// app.get('/login',router.showLogin);
// app.post('/doLogin',router.doLogin);
// app.get('/setAvatar',router.showSetAvatar);
// app.post('/doSetAvatar',router.doSetAvatar);
// app.get('/cutPic',router.showCutPic)
app.listen(3000);
