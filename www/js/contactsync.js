// var adminurl = "http://localhost/syncbackend/index.php/welcome/";
var config = {};
var abc = {};
var user = $.jStorage.get("user");
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS `contacts` (`id` INTEGER PRIMARY KEY ASC, `name` VARCHAR(255),`email` VARCHAR(255),`designation` VARCHAR(255) , `lineOfBusiness` VARCHAR(255), `companyname` VARCHAR(255), `officeAddress` VARCHAR(255), `officeCity` VARCHAR(255), `officeState` VARCHAR(255), `officePin` VARCHAR(255), `officeCountry` VARCHAR(255), `officeMobile` VARCHAR(255), `officeLandline` VARCHAR(255), `officeEmail` VARCHAR(255), `officeWebsite` VARCHAR(255), `officeGPS` VARCHAR(255), `DOB` VARCHAR(255), `anniversary` VARCHAR(255), `bloodGroup` VARCHAR(255), `personalAddress` VARCHAR(255), `personalCity` VARCHAR(255), `personalState` VARCHAR(255), `personalPin` VARCHAR(255), `personalCountry` VARCHAR(255), `personalMobile`  VARCHAR(255), `personalLandline` VARCHAR(255), `personalWebsite` VARCHAR(255), `personalGPS` VARCHAR(255), `serverid` INTEGER, `photoUrl` VARCHAR(255), `companylogo` VARCHAR(255), `userid` VARCHAR(255))');
    });
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS `userslog` (`id` INTEGER PRIMARY KEY ASC, `timestamp` TIMESTAMP,`type` INTEGER,`user` INTEGER,`table` INTEGER,`serverid` INTEGER)');
    });

    returnval.query = function (querystr, callback) {
        //        console.log(querystr);
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
            tx.executeSql('CREATE TABLE IF NOT EXISTS `contacts` (`id` INTEGER PRIMARY KEY ASC, `name` VARCHAR(255),`email` VARCHAR(255),`designation` VARCHAR(255) , `lineOfBusiness` VARCHAR(255), `companyname` VARCHAR(255), `officeAddress` VARCHAR(255), `officeCity` VARCHAR(255), `officeState` VARCHAR(255), `officePin` VARCHAR(255), `officeCountry` VARCHAR(255), `officeMobile` VARCHAR(255), `officeLandline` VARCHAR(255), `officeEmail` VARCHAR(255), `officeWebsite` VARCHAR(255), `officeGPS` VARCHAR(255), `DOB` VARCHAR(255), `anniversary` VARCHAR(255), `bloodGroup` VARCHAR(255), `personalAddress` VARCHAR(255), `personalCity` VARCHAR(255), `personalState` VARCHAR(255), `personalPin` VARCHAR(255), `personalCountry` VARCHAR(255), `personalMobile`  VARCHAR(255), `personalLandline` VARCHAR(255), `personalWebsite` VARCHAR(255), `personalGPS` VARCHAR(255), `serverid` INTEGER, `photoUrl` VARCHAR(255), `companylogo` VARCHAR(255), `userid` VARCHAR(255))');
        });
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS `userslog` (`id` INTEGER PRIMARY KEY ASC, `timestamp` TIMESTAMP,`type` INTEGER,`user` INTEGER,`table` INTEGER,`serverid` INTEGER)');
        });

    }


    returnval.getcontact = function (str, number, advance, pageno, callback, populate, filter) {

        var rowcount = 1000;
        pageno = pageno * rowcount;
        var where = '';
        var noregex = false;


        if (number || number != "") {
            var regex = "AND ( `name` REGEXP '(.*?)";
            _.each(number + "", function (n) {
                switch (n) {
                case "1":
                    {
                        regex += "[1]";
                    };
                    break;
                case "2":
                    {
                        regex += "[ABCabc2]";
                    };
                    break;
                case "3":
                    {
                        regex += "[DEFdef3]";
                    };
                    break;
                case "4":
                    {
                        regex += "[GHIghi4]";
                    };
                    break;
                case "5":
                    {
                        regex += "[JKLjkl5]";
                    };
                    break;
                case "6":
                    {
                        regex += "[MNOmno6]";
                    };
                    break;
                case "7":
                    {
                        regex += "[PQRSpqrs7]";
                    };
                    break;
                case "8":
                    {
                        regex += "[TUVtuv8]";
                    };
                    break;
                case "9":
                    {
                        regex += "[WXYZwxyz9]";
                    };
                    break;
                default:
                    {
                        noregex = true;
                    }

                }
            });
            if (!noregex) {
                regex += "(.*?)' ";
            } else {
                regex = "AND ( 0 ";
            }
            where += regex;
            where += " OR `personalMobile` LIKE  '%" + number + "%' ) ";
        }


        if (number) {

        }

        var filtercount = {};

        //        var filter={
        //            name: ["chintan","chirag","china"];
        //        }

        if (str) {
            where += " AND `name` LIKE '%" + str + "%'";
            where += " OR `companyname` LIKE '%" + str + "%'";
            where += " OR `designation` LIKE '%" + str + "%'";
            where += " OR `personalCity` LIKE '%" + str + "%'";
            where += " OR `bloodGroup` LIKE '%" + str + "%'";
            where += " OR `personalCountry` LIKE '%" + str + "%'";
            where += " OR `lineOfBusiness` LIKE '%" + str + "%'";

            returnval.query("SELECT count(*) as `count` from `contacts` WHERE `name` LIKE '%" + str + "%'", function (result, len) {
                filtercount.name = result[0].count;
            });
            returnval.query("SELECT count(*) as `count` from `contacts` WHERE `companyname` LIKE '%" + str + "%'", function (result, len) {
                filtercount.company = result[0].count;
            });
            returnval.query("SELECT count(*) as `count` from `contacts` WHERE `personalCity` LIKE '%" + str + "%'", function (result, len) {
                filtercount.location = result[0].count;
            });
            returnval.query("SELECT count(*) as `count` from `contacts` WHERE `designation` LIKE '%" + str + "%'", function (result, len) {
                filtercount.designation = result[0].count;
            });
        }
        if (filter.name) {
            where += " AND `name` IN ( ";
            _.each(filer.name, function (n) {
                where += n
            });
            where += " ) ";
        }
        if (filter.company) {
            where += " AND `companyname` IN ( ";
            _.each(filer.company, function (n) {
                where += n
            });
            where += " ) ";
        }
        if (filter.location) {
            where += " AND `personalCity` IN ( ";
            _.each(filer.location, function (n) {
                where += n
            });
            where += " ) ";
        }
        if (filter.designation) {
            where += " AND `designation` IN ( ";
            _.each(filer.designation, function (n) {
                where += n
            });
            where += " ) ";
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
            where += " AND `personalCountry` LIKE '%" + advance.country + "%'";

        } else {
            where += '';
        }
        if (advance.occupatipon) {
            where += " AND `lineOfBusiness` LIKE '%" + advance.lineofbusiness + "%'";

        } else {
            where += '';
        }
        //        if (advance.keyword) {
        //            where += " AND personalCity LIKE '%" + advance.city + "%'";
        //          
        //        } else {
        //            where += '';
        //        }

        var data = [];
        var dataflag = false;
        if (pageno == 0) {
            dataflag = true;
        }
        returnval.query("SELECT * FROM `contacts` WHERE 1 " + where + " ORDER BY `name` ASC LIMIT " + pageno + "," + rowcount, function (result, len) {

            for (var i = 0; i < len; i++) {
                data.push(result.item(i));
            }
            callback(data, dataflag, populate, filtercount);
        });



    }
    returnval.iscontactpresent = function (n, callback) {
        var query = "SELECT * FROM `contacts` WHERE `personalMobile` = '" + n.contact + "' LIMIT 0,1";
        console.log(query);
        console.log(n);
        returnval.query(query, function (result, len) {
            console.log(len);
            callback(len, n);
        });
    }

    returnval.contactcount = function (callback) {
        var query = "SELECT count(*) as count FROM `contacts`";
        returnval.query(query, function (result, len) {
            console.log(result);
            callback(result.item(0).count, len);
        });
    }

    returnval.getqueryresult = function (filterby, callback) {
        returnval.query(filterby, function (result, len) {
            console.log(result);
            callback(result, len);
        });
    }

    returnval.getallcontactnames = function (callback) {
        returnval.query("SELECT `id`,`name` from `contacts` ORDER BY `name`", function (result, len) {
            callback(result, len);
        });
    }

    returnval.create = function (data, callback) {

        if (data.userid == null || !data.userid) {
            data.userid = "";
        }
        if (data.name == null || !data.name) {
            data.name = "";
        }
        if (data.email == null || !data.email) {
            data.email = "";
        }
        if (data.designation == null || !data.designation) {
            data.designation = "";
        }
        if (data.lineofbusiness == null || !data.lineofbusiness) {
            data.lineofbusiness = "";
        }
        if (data.companyname == null || !data.companyname) {
            data.companyname = "";
        }
        if (data.companyaddress == null || !data.companyaddress) {
            data.companyaddress = "";
        }
        if (data.companycity == null || !data.companycity) {
            data.companycity = "";
        }
        if (data.companystate == null || !data.companystate) {
            data.companystate = "";
        }
        if (data.companypincode == null || !data.companypincode) {
            data.companypincode = "";
        }
        if (data.companycountry == null || !data.companycountry) {
            data.companycountry = "";
        }
        if (data.personalprofilecontact == null || !data.personalprofilecontact) {
            data.personalprofilecontact = "";
        }
        if (data.companyemail == null || !data.companyemail) {
            data.companyemail = "";
        }
        if (data.companywebsite == null || !data.companywebsite) {
            data.companywebsite = "";
        }
        if (data.birthdate == null || !data.birthdate || data.birthdate == "0000-00-00") {
            data.birthdate = "";
        }
        if (data.anniversary == null || !data.anniversary || data.anniversary == "0000-00-00") {
            data.anniversary = "";
        }
        if (data.bloodgroup == null || !data.bloodgroup) {
            data.bloodgroup = "";
        }
        if (data.personeladdress == null || !data.personeladdress) {
            data.personeladdress = "";
        }
        if (data.personelcity == null || !data.personelcity) {
            data.personelcity = "";
        }
        if (data.personelstate == null || !data.personelstate) {
            data.personelstate = "";
        }
        if (data.personelcountry == null || !data.personelcountry) {
            data.personelcountry = "";
        }
        if (data.personelcontact == null || !data.personelcontact) {
            data.personelcontact = "";
        }
        if (data.homelandline == null || !data.homelandline) {
            data.homelandline = "";
        }
        if (data.personelwebsite == null || !data.personelwebsite) {
            data.personelwebsite = "";
        }
        if (data.image == null || !data.image) {
            data.image = "";
        }
        if (data.companylogo == null || !data.companylogo) {
            data.companylogo = "";
        }
        returnval.query("INSERT INTO `contacts` (`id`, `name`, `email`, `designation`, `lineOfBusiness`, `companyname`,  `officeAddress`, `officeCity`, `officeState`, `officePin`, `officeCountry`, `officeMobile`,`officeEmail`, `officeWebsite`, `DOB`, `anniversary`, `bloodGroup`, `personalAddress`, `personalCity`, `personalState`, `personalCountry`, `personalMobile`, `personalLandline`, `personalWebsite`, `photoUrl`, `companylogo`,`userid`) VALUES (null,'" + data.name + "','" + data.email + "','" + data.designation + "','" + data.lineofbusiness + "','" + data.companyname + "','" + data.companyaddress + "','" + data.companycity + "','" + data.companystate + "','" + data.companypincode + "','" + data.companycountry + "','" + data.personalprofilecontact + "','" + data.companyemail + "','" + data.companywebsite + "','" + data.birthdate + "','" + data.anniversary + "','" + data.bloodgroup + "','" + data.personeladdress + "','" + data.personelcity + "','" + data.personelstate + "','" + data.personelcountry + "','" + data.personelcontact + "','" + data.homelandline + "','" + data.personelwebsite + "','" + data.image + "','" + data.companylogo + "','" + data.userid + "')", function (result, len, id) {
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
    abc.create = returnval.create;
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
        console.log("user timestamp=" + config.user.localtimestamp);
        returnval.query("SELECT `table` as `id`,'" + user + "' as `name` ,`email` ,`designation`  , `lineOfBusiness` , `companyname` , `officeAddress` , `officeCity` , `officeState` , `officePin` , `officeCountry` , `officeMobile` , `officeLandline` , `officeEmail` , `officeWebsite` , `officeGPS` , `DOB` , `anniversary` , `bloodGroup` , `personalAddress` , `personalCity` , `personalState` , `personalPin` , `personalCountry` , `personalMobile`  , `personalLandline` , `personalWebsite` , `personalGPS` , `serverid` , `photoUrl` ,`type`,`timestamp`   FROM (SELECT `userslog`.`table`,`contacts`.`name`,`contacts`.`id` ,`contacts`.`email` ,`contacts`.`designation` ,`contacts`.`lineOfBusiness` , `contacts`.`companyname` ,`contacts`.`officeAddress` ,`contacts`.`officeCity` ,`contacts`.`officeState` ,`contacts`.`officePin` ,`contacts`.`officeCountry` ,`contacts`.`officeMobile` , `officeLandline` , `officeEmail` ,`contacts`.`officeWebsite` ,`contacts`.`officeGPS` ,`contacts`.`DOB` ,`contacts`.`anniversary` ,`contacts`.`bloodGroup` ,`contacts`.`personalAddress` ,`contacts`.`personalCity` ,`contacts`.`personalState` ,`contacts`.`personalPin` ,`contacts`.`personalCountry` ,`contacts`.`personalMobile`  , `contacts`.`personalLandline` , `contacts`.`personalWebsite` ,`contacts`.`personalGPS` ,`contacts`.`serverid` , `contacts`.`photoUrl`    , `userslog`.`timestamp`, `userslog`.`type`,`contacts`.`serverid`,`userslog`.`serverid` as `serverid2` FROM `userslog` LEFT OUTER JOIN `contacts` ON `contacts`.`id`=`userslog`.`table` WHERE `userslog`.`timestamp`>'" + config.user.localtimestamp + "' ORDER BY `userslog`.`timestamp` DESC) as `tab1` GROUP BY `tab1`.`table` ORDER BY `tab1`.`timestamp` LIMIT 0,1", callback);
    };

    returnval.synclocaltoserver = function (callback) {
        console.log("LOCAL TO SERVER");
        returnval.getone(function (result, len) {
            console.log(result);
            console.log("Len=" + len);
            if (len > 0) {
                console.log("Server Submisssion");
                //on success change localtimestamp
                var row = result.item(0);
                $http.post(adminurl + "localtoserver", row).success(function (data) {
                    if (data.id) {
                        console.log("if******data.id=" + data.id);
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