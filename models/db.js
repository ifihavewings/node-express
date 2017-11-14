var MongoClient = require('mongodb').MongoClient; 
var settings = require('../settings.js');
function _connectDb(callback) {
    var url = settings.dburl;
    MongoClient.connect(url,function(err,db) {
        console.log('连接数据库成功');
        callback(err,db);
    });
}
// _connectDb();
// 插入数据
exports.insertOne = function(collectionName,json,callback) {
    _connectDb(function(err,db) {
        if(err) {console.log('连接数据库失败'); db.close();}
        db.collection(collectionName).insertOne(json,function(err,result) {
            callback(err,result);
            db.close(); 
        })
    })
}
// 查找数据，包含封装分页
exports.find = function ( collectionName , json ,c,d){
    var result = [];// 防止callback被多次调用，把结果返回到数组中，供callback使用
    if(arguments.length === 3) {
        var callback = c;
        // limit 和 skip 函数的参数如果为0，则相当于没有传入参数，仍然会读取全部
        var limit = 0;
        var skip = 0;
    }else if(arguments.length === 4) {
        var callback = d;
        var limit = c.pageAmount;
        var skip = c.page * c.pageAmount;
    }else {
        throw new Error('参数个数为 3 或者 4');
    }
    _connectDb(function(err,db) {
        if(err) {
            console.log(err);
        }
        var cursor = db.collection(collectionName).find(json).limit(limit).skip(skip);
        cursor.each(function(err,doc) {
            if(err) {
                callback(err,null);
                db.close();
                return;
            }
            if(doc !== null) {
                result.push(doc);
                db.close();
            }else {
                callback(null,result);
                db.close();
            }
        });
    });
}
// 删除
exports.deleteMany = function(collectionName,json,callback) {
    _connectDb(function(err,db){
        db.collection(collectionName).deleteMany(json,function(err,result) {
            callback(err,result);
            db.close();
        });
    });
}
// 修改
exports.updateMany = function(collectionName,json1,json2,callback) {
    _connectDb(function(err,db) {
        db.collection(collectionName).updateMany(json1,json2,function(err,result) {
            callback(err,result);
            db.close();
        });
    });
}
















// // 查找数据，包含封装分页
// exports.find = function ( collectionName , json , callback){
//     var result = [];// 防止callback被多次调用，把结果返回到数组中，供callback使用
//     if(arguments.length !== 3) {
//         callback('find 函数需要3个参数',null);
//         return;
//     }
//     _connectDb(function(err,db) {
//         var cursor = db.collection(collectionName).find(json);
//         cursor.each(function(err,doc) {
//             if(err) {
//                 callback(err,null);
//                 return;
//             }
//             if(doc !== null) {
//                 result.push(doc)
//             }else {
//                 callback(null,result);
//             }
//         })
//     })
// }