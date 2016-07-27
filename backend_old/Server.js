var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var app = express();

process.env.dbHost = 'localhost';
process.env.dbUser = 'root';
process.env.dbPass = 'omega125';
process.env.database = 'pla';
process.env.serverPort = '3000';

function REST() {
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: process.env.dbHost,
        user: process.env.dbUser,
        password: process.env.dbPass,
        database: process.env.database,
        debug: false
    });
    pool.getConnection(function(err, connection) {
        if (err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
    var self = this;
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    var rest_router = new rest(router, connection, md5);
    self.startServer();
}

REST.prototype.startServer = function() {
    app.listen(process.env.serverPort, function() {
        console.log(md5("CesarP"));
        console.log("All right ! I am alive at Port ." + process.env.serverPort);
    });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

//-----------------------------------------------------------------------------------------------------------------------------------------
var sendgrid = require('sendgrid')('njitplamaster', 'plamaster123');
var schedule = require('node-schedule');


var Sequelize = require("sequelize");
var dateFormat = require('dateformat');
var Guid = require('guid');
var models = require('./Model');
var Manager = require('./WorkFlow/Manager.js');
var Allocator = require('./WorkFlow/Allocator.js');
var sequelize = require("./Model/index.js").sequelize;

var User = models.User;
var UserLogin = models.UserLogin;
var UserContact = models.UserContact;
var Course = models.Course;
var Section = models.Section;
var SectionUser = models.SectionUser;
var Semester = models.Semester;
var TaskInstance = models.TaskInstance;
var TaskActivity = models.TaskActivity;
var Assignment = models.Assignment;
var AssignmentInstance = models.AssignmentInstance;
var WorkflowInstance = models.WorkflowInstance;
var WorkflowActivity = models.WorkflowActivity;
var ResetPasswordRequest = models.ResetPasswordRequest;


sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function(){
    return sequelize.sync({
      //force: true
    });
})
.then(function(){
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
})
.then(function(){
    console.log('Database synchronised.');
}, function(err){
    console.log(err);
});



/*var rule = new schedule.RecurrenceRule();
rule.minute = 00;
//'1 * * * * *' 1 minute.
var job = schedule.scheduleJob('1 * * * * *', function(time) {
    console.log('Automated Checking For Expiring Assignments');

    var now = new Date();

    Task.findAll({
        attributes: ['UserID', 'StartDate', 'EndDate']
    }).then(function(response) {
        console.log(response.TaskID)
        response.forEach(function(result) {
            //console.log(result.UserID);

            var endDate = result.EndDate;
            var emailLastSent = new Date(result.Email_Last_Sent);

            console.log(result.Email_Last_Sent);

            if (Math.abs(now.getTime() - emailLastSent.getTime()) <= (86400 * 1000)) {

                console.log('An email was sent in last 24 hours.');

            } else if (Math.abs(now.getTime() - endDate.getTime()) <= (86400 * 1000)) {

                sendgrid.send({
                        from: 'njit.plamaster@gmail.com',
                        to: 'njit.plamaster@gmail.com',
                        subject: '[Auto] PLA System Notification',
                        text: 'Your Assignment is about the expire. \n Name: ' + result.UserID + '\n EndDate: ' + result.EndDate
                    }),
                    function(err, info) {
                        if (err) {
                            return console.log(err);
                        }
                    }

                console.log('Message Sent');
                Task.update({
                    Email_Last_Sent: now
                  },{
                    where:{
                      UserID: result.UserID
                    }
                });

            }
        });
    });
});

*/

//-----------------------------------------------------------------------------------------------------------------------------------------








new REST();
