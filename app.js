var express = require('express');
var mysql = require('mysql');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//test mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});


connection.connect();

connection.query('SELECT 1+1 AS solution', function (err, rows, fields) {
        if (err) throw err;
        console.log('The solution is:', rows[0].solution);
    }
)
connection.end();


//sequelize


var Sequelize = require('sequelize');

var co = require('co');

co(function*() {
    // code here
}).catch(function (e) {
    console.log(e);
});

//打开数据库
var sequelize = new Sequelize(
    'test',
    'root',
    '123456',
    {
        'dialect': 'mysql',
        'dialectOptions': {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
            supportBigNumbers: true,
            bigNumberStrings: true
        },
        'host': 'localhost',
        'port': 3306,
        'define': {
            'underscored': true,
            'charset':'utf8mb4'
        }

    }
);

// 定义一个表
var User = sequelize.define(
    'user',
    {
        'emp_id': {
            'type': Sequelize.CHAR(10),
            'allowNULL': false,
            'unique': true
        },
        'nick': {
            'type': Sequelize.CHAR(10),
            'allowNULL': false
        },
        'department': {
            'type': Sequelize.STRING(64),
            'allowNULL': false
        },
    }
);

//创建一个表 （加force:true，会先删掉表后再建表）
//插入一条数据
// 暂时没有搞定中文问题,插入中文报错
User.sync({force: true}).then(function () {
    return User.create({
        emp_id: '2',
        nick: 'zyx2',
        department: '技术'
    });
}).then(function (user) {

    console.log(user.get(
        {
            plain: true
        }
    ));

    // 查找一条数据
    User.findOne(
        {
            where:{
                emp_id: '2'
            }
        }
    ).then(function(result){
        console.log('after create find  user');
        console.log(result);
    });

//修改一条数据
    user.update(
        {
            department: 'IT2'
        },{
            where:
            {
                emp_id: '2'
            }
        }
    ).then(function (jane) {
        console.log(jane.get(
            {
            plain: true
            }
        ));
//删除一条数据
        User.destroy(
            {
                where:{
                    emp_id: '2'
                }

            }
        ).then(function(result){
            console.log('destroy user');
            console.log(result);

// 查找一条数据
            User.findOne(
                {
                    where:{
                        emp_id: '2'
                    }
                }
            ).then(function(result){
                console.log('after delete find  user');
                console.log(result);
            });

        });

    });
});





module.exports = app;
