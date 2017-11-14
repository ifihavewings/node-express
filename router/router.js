const formidable = require('formidable');
const db = require('../models/db.js');
const md5 = require('../models/md5.js');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');


// 渲染首页
exports.showIndex = function(req,res,next) {
    console.log('showIndex -- working --');
    console.log('******************** --');
    res.render('index',{});
};
// 首页列表数据
exports.getHomePageList = function(req,res,next) {
    db.find('houseList',{'type' : '新房'},function(err,result){
        // '-1',数据读取失败
        if(err) {console.log('首页房源列表-数据读取失败');res.json({'status': '-1'});}
        var obj = {'status': '1','list' : result};
        var strList = JSON.stringify(obj);
        res.json(strList);
    });
};
exports.detail = function(req,res,next) {
    res.render('detail',{});
}
exports.getDetail = function(req,res,next) {
    var urlParse = url.parse(req.url);
    var query = urlParse.query;
    var queryStr = query.split('=')[1];
    console.log(queryStr);
    db.find('houseList',{'id' : queryStr},function(err,result) {
        if(err) {console.log('详情页-数据读取失败');res.json({'status': '-1'});}
        var obj = {'status': '1','detail' : result};
        var strDetail = JSON.stringify(obj);
        res.json(strDetail);
    })
}
exports.doRegister = function(req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files) {
        var username = fields.username;
        var password = fields.password;
        password = md5(md5(password)+'sv2017');
        /**
         *  status:'-3'  连接数据库失败
         *  status:'-1'  用户名被占用
         *  status:'-4'  写入书入库失败
         *  status:'1'   注册成功
         *  req.session.login = '1'  登录状态
         *  req.session.login = '-1' 未登录状态
         */
        db.find('houseUser',{'username' : username},function(err,result){
            if(err) {
                //连接数据库失败
                var obj = {status: '-3',msg : '连接数据库失败'};
                var strJ = JSON.stringify(obj);
                return;
            }
            if(result.length != 0) {
                //用户名被占用
                var obj = {status: '-1',msg : '用户名被占用'};
                var strJ = JSON.stringify(obj);
                res.json(strJ);
                // 一定不要忘了这个return，否则后边res继续返回数据会报错
                // Error: Can't set headers after they are sent.
                return;
            }
            db.insertOne('houseUser',{
                'username' : username,
                'password' :password
                // 'email' : email,
                // 'avatar' : 'defaultHead.jpg'

            }, function (err,result) {
                if(err) {  
                    var obj = {status: '-4',msg : '写入失败'};
                    var strJ = JSON.stringify(obj);
                    res.json(strJ);
                }
                req.session.login = '1';
                req.session.username = username;
                // req.session.avatar = 'defaultHead.jpg';
                // console.log('插入陈宫')
                var obj = {status: '1',msg : '注册成功',username : username,login : '1'};
                var strJ = JSON.stringify(obj);
                res.json(strJ);

            });
        })
         
    })
}
exports.UserNameCheckR = function(req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files) {
        var username = fields.username;
        db.find('houseUser',{'username' : username},function(err,result){
            if(err) {
                //连接数据库失败
                var obj = {status: '-3',msg : '连接数据库失败'};
                var strJ = JSON.stringify(obj);
                return;
            }else
            if(result.length != 0) {
                //用户名被占用
                var obj = {status: '-1',msg : '用户名被占用'};
                var strJ = JSON.stringify(obj);
                res.json(strJ);
                // 一定不要忘了这个return，否则后边res继续返回数据会报错
                // Error: Can't set headers after they are sent.
                return;
            }else {
                var obj = {status: '1',msg : '用户名可用',username : username};
                var strJ = JSON.stringify(obj);
                res.json(strJ);
            }
        });
    });
}
exports.checkLoginAccount = function(req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files) {
        var username = fields.username;
        var password = '';
        if(fields.username) {
            password = fields.username;
        }
        db.find('houseUser',{'username' : username},function(err,result) {
            var obj = {};
            var strJ = '';
            if(err) {
                //连接数据库失败
                obj = {status: '-3',msg : '连接数据库失败'};
                strJ = JSON.stringify(obj);
                res.json(strJ);
            }else if(result.length === 0) {
                // 用户名未注册，请检查
                obj = {status: '-2',msg : '用户名未注册'};
                strJ = JSON.stringify(obj);
                res.json(strJ);
            }else if(result.length === 1) {
                // 登录用户名可用
                obj = {status: '1',msg : '登录用户名可用'};
                strJ = JSON.stringify(obj);
                res.json(strJ);
            }
        });
    });
}

// db.find('houseUser',{'username' : username},function(err,result){
//     if(err) {
//         //服务器错误
//         console.log('详情页-数据读取失败');res.json({'status': '-3'})
//     }
//     if(result.length != 0) {
//         //用户名被占用
//         res.json({'status': '-1'})
//     }
//     db.insertOne('houseUser',{
//         'username' : username,
//         'password' :password
//         // 'email' : email,
//         // 'avatar' : 'defaultHead.jpg'

//     }, function (err,result) {
//         if(err) {res.json({'status': '-4'})}
//         req.session.login = '1';
//         req.session.username = username;
//         // req.session.avatar = 'defaultHead.jpg';
//         res.json({'status': '1'});
//     });
// })




// //注册页面
// exports.showRegister = function(req,res,next) {
//     res.render('register',{
//         'login' : req.session.login == '1' ? true :false,
//         'nickname' : req.session.login == '1' ? req.session.nickname : '',
//         'active' : 'register'

//     });
// };
// //注册业务
// exports.doRegister = function(req,res,next) {
//     /*
//     * 获取用户输入的信息
//     * 是否存在相同用户名
//     * 保存这个人
//     */
//     var form = new formidable.IncomingForm();
//     form.parse(req,function(err,fields,files) {
//         var email = fields.email;
//         var nickname = fields.nickname;
//         var password = fields.password;
//         //加密密码
//         password = md5(md5(password)+'sv2017');
//         console.log(email);
//         db.find('user',{'nickname' : nickname},function(err,result){
//             console.log(result);
//             if(err) {
//                 //服务器错误
//                 res.send('-3');
//                 return;
//             }
//             if(result.length != 0) {
//                 //用户名被占用
//                 res.send('-1');
//                 return;
//             }
//             db.insertOne('user',{
//                 'nickname' : nickname,
//                 'password' :password,
//                 'email' : email,
//                 'avatar' : 'defaultHead.jpg'

//             }, function (err,result) {
//                 if(err) {
//                     res.send('-3');
//                     return;
//                 }
//                 req.session.login = '1';
//                 req.session.nickname = nickname;
//                 req.session.avatar = 'defaultHead.jpg';
//                 res.send('1');
//             });
//         })
//     })
// };
// exports.showLogin = function (req,res,next) {
//   res.render('login',{
//       'login' : req.session.login == '1' ? true :false,
//       'nickname' : req.session.login == '1' ? req.session.nickname : '',
//       'active' : 'login'
//   });
// };
// //登录
// exports.doLogin = function (req,res,next) {
//   var form = new formidable.IncomingForm();
//     form.parse(req, function (err,fields,files) {
//         var nickname = fields.nickname;
//         var password = fields.password;
//         password = md5(md5(password)+'sv2017');
//         db.find('user',{'nickname' : nickname}, function (err,result) {
//             if(err) {res.send('-3'); return;}
//             if(result.length === 0) {
//                 res.send('0');
//                 return;
//             }
//             if(result[0].password === password){
//                 req.session.login = '1';
//                 req.session.nickname = nickname;
//                 req.session.avatar = result[0].avatar;
//                 res.send('1');
//                 return;
//             }else {
//                 res.send('-1');
//             }

//         })
//     });
// };
// //设置头像
// exports.showSetAvatar = function(req,res,next) {
//     /*if(req.session.login !== '1') {
//         res.end('Illegal');
//         return;
//     }*/
//     res.render('setAvatar',{
//         'login' : true,
//         'nickname' : req.session.nickname,
//         'active' : '修改头像'
//     })
// };
// exports.doSetAvatar = function (req,res,next) {
//     var form = new formidable.IncomingForm();
//     form.uploadDir =path.normalize( __dirname + '/../avatar');
//     console.log( form.uploadDir);
//     form.parse(req, function (err,fields,files) {
//         console.log(files);
//         var oldPath = files.userAvatar.path;
//         var newPath = path.normalize(__dirname+'/../avatar/')+req.session.nickname + '.jpg';
//         console.log(oldPath);
//         console.log(newPath);
//         fs.rename(oldPath,newPath, function (err) {
//             if(err) {
//                 console.log('upload avatar failed');
//                 return;
//             }
//             console.log('OK');
//         });
//     });
// };
// exports.showCutPic = function (req,res,next) {

