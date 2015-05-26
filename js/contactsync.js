//var adminurl = "http://localhost/syncbackend/index.php/welcome/";
var config = {};
var abc = {};
var user = 3;
var contactsync = angular.module('contactsync', []);

contactsync.factory('contactSync', function ($http) {

    var returnval = {};

    config = $.jStorage.get("config");
    if (!config) {
        config = {
            user: {}
        };
        $.jStorage.set("config", config);
    }

    function setconfig() {
        $.jStorage.set("config", config);
    };

    function changeservertimestamp(timestamp) {
        config.user.servertimestamp = timestamp;
        setconfig();
    };

    function changelocaltimestamp(timestamp) {
        config.user.localtimestamp = timestamp;
        setconfig();
    };

    var db = openDatabase('sync', '1.0', 'SyncTestDatabase', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS `contacts` (`id` INTEGER PRIMARY KEY ASC, `name` VARCHAR(255),`email` VARCHAR(255),`designation` VARCHAR(255) , `lineOfBusiness` VARCHAR(255), `companyname` VARCHAR(255), `officeAddress` VARCHAR(255), `officeCity` VARCHAR(255), `officeState` VARCHAR(255), `officePin` VARCHAR(255), `officeCountry` VARCHAR(255), `officeMobile` INTEGER, `officeLandline` INTEGER, `officeEmail` VARCHAR(255), `officeWebsite` VARCHAR(255), `officeGPS` VARCHAR(255), `DOB` VARCHAR(255), `anniversary` VARCHAR(255), `bloodGroup` VARCHAR(255), `personalAddress` VARCHAR(255), `personalCity` VARCHAR(255), `personalState` VARCHAR(255), `personalPin` VARCHAR(255), `personalCountry` VARCHAR(255), `personalMobile`  INTEGER, `personalLandline` INTEGER, `personalWebsite` VARCHAR(255), `personalGPS` VARCHAR(255), `serverid` INTEGER  )');
    });
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS `userslog` (`id` INTEGER PRIMARY KEY ASC, `timestamp` TIMESTAMP,`type` INTEGER,`user` INTEGER,`table` INTEGER,`serverid` INTEGER)');
    });

    returnval.query = function (querystr, callback) {
        //console.log(querystr);
        db.transaction(function (tx) {
            tx.executeSql(querystr, [], function (tx, results) {
                var len = results.rows.length;
                if (callback) {
                    callback(results.rows, len, results);
                }
            }, function (tx, error) {
                console.log(error);
            });
        });
    };

    abc.query = function (querystr, callback) {
        db.transaction(function (tx) {
            tx.executeSql(querystr, [], function (tx, results) {

                var len = results.rows.length;
                console.log(results);


                console.log(results.rows);
                abc.result = results.rows;
                console.log(len);
                for (var i = 0; i < len; i++) {
                    console.log(abc.result.item(i));
                }

            }, function (tx, error) {

                console.log(error);
            });
        });
    };

    function updatelocal(data, status, callback) {
        switch (data.type) {
        case "1":
            {
                returnval.query("INSERT INTO `contacts ` (`id`, `name`,`email`,`serverid`) VALUES (null,'" + data.name + "','" + data.email + "','" + data.id + "')", function (result, len) {
                    if (callback) {
                        callback();
                    }
                });
            }
            break;
        case "2":
            {
                returnval.query("SELECT * FROM `contacts ` WHERE `serverid`='" + data.id + "' ", function (result, len) {
                    if (len == 0) {
                        data.type = "1";
                        return updatelocal(data, status, callback);
                    } else {
                        returnval.query("UPDATE `contacts ` SET `name`='" + data.name + "',`email`='" + data.email + "' WHERE `id`='" + result.item(0).id + "'");
                    }
                });
            }
            break;
        case "3":
            {
                returnval.query("DELETE FROM `contacts ` WHERE `serverid`='" + data.id + "'");
            }
            break;
        }
        changeservertimestamp(data.timestamp);
    }

    returnval.drop = function () {
        returnval.query("DROP TABLE IF EXISTS `contacts`");

        returnval.query("DROP TABLE IF EXISTS `userslog`");
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS `contacts` (`id` INTEGER PRIMARY KEY ASC, `name` VARCHAR(255),`email` VARCHAR(255),`designation` VARCHAR(255) , `lineOfBusiness` VARCHAR(255), `companyname` VARCHAR(255), `officeAddress` VARCHAR(255), `officeCity` VARCHAR(255), `officeState` VARCHAR(255), `officePin` VARCHAR(255), `officeCountry` VARCHAR(255), `officeMobile` INTEGER, `officeLandline` INTEGER, `officeEmail` VARCHAR(255), `officeWebsite` VARCHAR(255), `officeGPS` VARCHAR(255), `DOB` VARCHAR(255), `anniversary` VARCHAR(255), `bloodGroup` VARCHAR(255), `personalAddress` VARCHAR(255), `personalCity` VARCHAR(255), `personalState` VARCHAR(255), `personalPin` VARCHAR(255), `personalCountry` VARCHAR(255), `personalMobile`  INTEGER, `personalLandline` INTEGER, `personalWebsite` VARCHAR(255), `personalGPS` VARCHAR(255), `serverid` INTEGER  )');
        });
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS `userslog` (`id` INTEGER PRIMARY KEY ASC, `timestamp` TIMESTAMP,`type` INTEGER,`user` INTEGER,`table` INTEGER,`serverid` INTEGER)');
        });

    }


    returnval.getcontact = function (str, number, advance, pageno, callback,populate) {


        var where = '';
        if (str) {
            where += " AND `name` LIKE  '%" + str + "%' ";
        }

        if (number) {
            where += " AND `personalMobile` LIKE  '%" + number + "%' ";
        }


        if (advance.name) {
            where += " AND `name` LIKE  '%" + advance.name + "%' ";
            console.log(where);
        } else {
            where += '';
        }

        if (advance.org) {
            where += " AND `companyname` LIKE '%" + advance.org + "%' ";
            console.log(where);
        } else {
            where += '';
        }
        if (advance.designation) {
            where += " AND `designation` LIKE '%" + advance.designation + "%'";

        } else {
            where += '';
        }
        if (advance.city) {
            where += " AND `personalCity` LIKE '%" + advance.city + "%'";

        } else {
            where += '';
        }
        if (advance.blood) {
            where += " AND `bloodGroup` LIKE '%" + advance.blood + "%'";

        } else {
            where += '';
        }
        if (advance.country) {
            where += " AND `personalCity` LIKE '%" + advance.country + "%'";

        } else {
            where += '';
        }
        if (advance.occupatipon) {
            where += " AND `lineOfBusiness` LIKE '%" + advance.occupatipon + "%'";

        } else {
            where += '';
        }
                //        if (advance.keyword) {
                //            where += " AND personalCity LIKE '%" + advance.city + "%'";
                //          
                //        } else {
                //            where += '';
                //        }

        var data=[];
        var dataflag=false;
        if(pageno==0)
        {
            dataflag=true;
        }
        returnval.query("SELECT * FROM `contacts` WHERE 1 " + where + " ORDER BY `name` ASC LIMIT " + pageno + ",10 ",function(result,len) {
            
            for(var i=0;i<len;i++)
            {
                data.push(result.item(i));
            }
            callback(data,dataflag,populate);
        });



    }



    returnval.create = function (data, callback) {
        //       console.log(data.name);
        //     console.log(data);

        returnval.query("INSERT INTO `contacts` (`id`, `name`,`email`,`personalMobile`) VALUES (null,'" + data.name + "','" + data.email + "','" + data.contact + "')", function (result, len, id) {
            id = id.insertId;
            var d = new Date();
            var n = d.getTime();

            returnval.query("INSERT INTO `userslog` (`id`,`timestamp`,`type`,`user`,`table`) VALUES (null,'" + n + "','" + 1 + "','" + user + "','" + id + "')", null);
            //           console.log(id);
            if (callback) {
                callback();
            }
        });
    };
    returnval.update = function (data, callback) {

        returnval.query("UPDATE `contacts` SET `name`='" + data.name + "',`email`='" + data.email + "' WHERE `id`='" + data.id + "'", function (result, len) {

            var d = new Date();
            var n = d.getTime();
            returnval.query("INSERT INTO `userslog` (`id`,`timestamp`,`type`,`user`,`table`) VALUES (null,'" + n + "','" + 2 + "','" + user + "','" + data.id + "')", null);
            callback();
        });

    };
    returnval.delete = function (data, callback) {
        var d = new Date();
        var n = d.getTime();
        returnval.query("SELECT * FROM `contacts` WHERE `id` = '" + data.id + "'", function (result, len) {
            var row = result.item(0);
            if (row.serverid == null) {
                console.log("DELETE ALL THE RECORDS FROM LOGS AND OTHER");
                returnval.query("DELETE FROM `contacts ` WHERE `id`='" + data.id + "'");
                returnval.query("DELETE FROM `userslog` WHERE `table`='" + data.id + "'");

            } else {
                console.log("STORE SERVER ID " + row.serverid);
                returnval.query("DELETE FROM `contacts` WHERE `id`='" + data.id + "'");
                returnval.query("INSERT INTO `userslog` (`id`,`timestamp`,`type`,`user`,`table`,`serverid`) VALUES (null,'" + n + "','" + 3 + "','" + user + "','" + data.id + "','" + row.serverid + "')", null);
            }
            callback();

        });

        //        returnval.query("DELETE FROM `contacts ` WHERE `id`='" + data.id + "'", function (result, len) {
        //            var d = new Date();
        //            var n = d.getTime();
        //            returnval.query("INSERT INTO `userslog` (`id`,`timestamp`,`type`,`user`,`table`) VALUES (null,'" + n + "','" + 3 + "','" + user + "','" + data.id + "')", null);
        //            callback();
        //        });
    };

    returnval.getone = function (callback) {
        //console.log("CHECKING");
        if (!config.user.localtimestamp) {
            config.user.localtimestamp = 0;
        }
        returnval.query("SELECT `table` as `id`,'" + user + "' as `user`,`serverid`,`name`,`email`,`timestamp` ,`type`,`serverid2` FROM (SELECT `userslog`.`table`,`contacts `.`name`,`contacts `.`email`, `userslog`.`timestamp`, `userslog`.`type`,`contacts `.`serverid`,`userslog`.`serverid` as `serverid2` FROM `userslog` LEFT OUTER JOIN `contacts ` ON `contacts `.`id`=`userslog`.`table` WHERE `userslog`.`timestamp`>'" + config.user.localtimestamp + "' ORDER BY `userslog`.`timestamp` DESC) as `tab1` GROUP BY `tab1`.`table` ORDER BY `tab1`.`timestamp` LIMIT 0,1", callback);
    };

    returnval.synclocaltoserver = function (callback) {
        console.log("LOCAL TO SERVER");
        returnval.getone(function (result, len) {
            console.log(len);
            if (len > 0) {
                console.log("Server Submisssion");
                //on success change localtimestamp
                var row = result.item(0);
                $http.post(adminurl + "localtoserver", row).success(function (data) {
                    if (data.id) {
                        returnval.query("UPDATE `contacts ` SET `serverid`='" + data.id + "' WHERE `id`='" + row.id + "'");
                    }
                    console.log(row);
                    changelocaltimestamp(row.timestamp);
                    changeservertimestamp(data.timestamp);
                    returnval.synclocaltoserver();
                });
            } else {
                if (callback) {
                    callback();
                }
            }

        });
    }





    returnval.servertolocal = function () {
        $http.get(adminurl + "servertolocal", {
            params: {
                timestamp: config.user.servertimestamp
            }
        }).success(function (data, status) {
            if (data == "false") {
                console.log("Data Upto date");
            } else {
                for (var i = 0; i < data.length; i++) {
                    updatelocal(data[i], "sync");
                }
                console.log("run again");
                return returnval.servertolocal();
            }
        });
    };
    return returnval;
});