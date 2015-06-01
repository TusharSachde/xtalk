var serveradmin = "http://wohlig.co.in/spingr/";
var adminurl = serveradmin + "index.php/json/";
var imgpath = serveradmin + "uploads/";
var mycard1 = {};
var personalcontact = '';
var contact = [];
var userid = 0;
var userotp = '';
var myconarr = [];
var level2id = [];
var n = 0;
var x = 0;
//{
//    name: "Dhaval Gala",
//    number: "9029145077",
//    email:"dhaval@wohlig.com",
//    company:"Wohlig Technology",
//    area:"Grant Road"
//}, {
//    name: "Vishal",
//    number: "9819653210",
//    email:"dhaval@wohlig.com",
//    company:"",
//    area:""
//}, {
//    name: "Dhairya",
//    number: "9598113025",
//    email:"dhaval@wohlig.com",
//    company:"",
//    area:""
//}, {
//    name: "Yash",
//    number: "9325689741",
//    email:"dhaval@wohlig.com",
//    company:"",
//    area:""
//}];
angular.module('starter.services', [])

.factory('MyServices', function ($http) {
    //
    //    var db = openDatabase('spingr', '1.0', 'Test DB', 2 * 1024 * 1024);
    //    db.transaction(function (tx) {
    //        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id INTEGER PRIMARY KEY ASC, "log" VARCHAR(255))');
    //        tx.executeSql('CREATE TABLE IF NOT EXISTS MYCONTACTS (id INTEGER PRIMARY KEY ASC, "user" VARCHAR(255), "name" VARCHAR(255), "email" VARCHAR(255), "contactno" VARCHAR(255))');
    //    });
    //    var contacts = [{
    //        id: 0,
    //        name: 'Chintan Shah',
    //        company: 'Wohlig Technology',
    //        area: 'Mumbai',
    //        image: 'http://i.imgur.com/1Ncgq84.jpg',
    //        logo: 'http://www.apic4u.com/wp-content/uploads/2014/05/New-Being-Human-Collections18.jpg',
    //        number: '+919819222221',
    //        email: 'chintan@wohlig.com',
    //        designation: 'Director'
    //    }, {
    //        id: 1,
    //        name: 'Chirag Shah',
    //        company: 'Wohlig Technology',
    //        area: 'Mumbai',
    //        image: 'http://image.gala.de/v1/cms/AU/shahrukh-khan-ge_6276006-square-02_top_square.jpg?v=8176344',
    //        logo: 'http://upload.wikimedia.org/wikipedia/en/3/31/Red_Chillies.JPG',
    //        number: '+919820045678',
    //        email: 'chirag@wohlig.com',
    //        designation: 'Director'
    //    }, {
    //        id: 2,
    //        name: 'Tushar Sachde',
    //        company: 'Wohlig Technology',
    //        area: 'Mumbai',
    //        image: 'http://www.masala.com/sites/default/files/styles/4_columns_gutter_size_638px_wide_square/public/images/2014/10/26/DSC_0186.jpg?itok=B3gcHWe_',
    //        logo: 'http://upload.wikimedia.org/wikipedia/commons/2/22/Aamir_khan_productions.png',
    //        number: '+919029796018',
    //        email: 'tushar@wohlig.com',
    //        designation: 'Director'
    //    }, {
    //        id: 3,
    //        name: 'Nayan Bheda',
    //        company: 'Roots2Wings Ideas',
    //        area: 'Mumbai',
    //        image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg',
    //        logo: 'http://www.apic4u.com/wp-content/uploads/2014/05/New-Being-Human-Collections18.jpg',
    //        number: '+919004121212',
    //        email: 'nayan@9004121212.com',
    //        designation: 'Director'
    //    }, {
    //        id: 4,
    //        name: 'Nilesh Halde',
    //        company: 'Roots2Wings Ideas',
    //        area: 'Mumbai',
    //        image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg',
    //        logo: 'http://www.apic4u.com/wp-content/uploads/2014/05/New-Being-Human-Collections18.jpg',
    //        number: '+919820752510',
    //        email: 'nileshhalde@gmail.com',
    //        designation: 'Director'
    //    }];

    var returnfunction = {};
    returnfunction.getallcontacts = function (callback) {

        var onSuccess = function (contacts) {
            if (contacts) {
                for (var i = 0; i < contacts.length; i++) {
                    var myval = {
                        name: "",
                        email: "",
                        contact: "",
                        photo: "",
                    };
                    if (contacts[i].phoneNumbers && contacts[i].name.formatted && contacts[i].name.formatted != "") {
                        if (contacts[i].emails) {
                            myval.email = contacts[i].emails[0].value;
                        }

                        if (contacts[i].phoneNumbers) {
                            myval.contact = contacts[i].phoneNumbers[0].value;
                            myval.contact = myval.contact.replace(/[ -]/g, '');
                            myval.contact = myval.contact.replace(/[']/g, '');
                        }
                        if (contacts[i].name.formatted) {
                            myval.name = contacts[i].name.formatted;
                            myval.name = myval.name.replace(/['"]/g, '');
                        }
                        if (contacts[i].photos) {
                            myval.photo = contacts[i].photos[0].value;
                        }
                        myconarr.push(myval);
                    }
                }
                myconarr = _.uniq(myconarr, function (n) {
                    return n.name + n.contact;
                });
                callback(myconarr);
            }
        };

        var onError = function (contactError) {
            alert('onError!');
            callback();
        };

        var options = new ContactFindOptions();
        //        options.filter = "A";
        options.multiple = true;
        //        options.desiredFields = [navigator.contacts.fieldType.id];
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.organizations, navigator.contacts.fieldType.photos];
        navigator.contacts.find(fields, onSuccess, onError, options);
    };
    returnfunction.query = function (querystr, callback) {
        db.transaction(function (tx) {
            tx.executeSql(querystr, [], function (tx, results) {
                var len = results.rows.length;
                if (callback) {
                    callback(results.rows, len);
                }
            }, null);
        });
    };
    returnfunction.get = function (Id) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].id === parseInt(Id)) {
                return contacts[i];
            }
        }
        return null;
    };
    returnfunction.readsms = function (callback) {

        var successCallback = function (data) {
            console.log(data);
            var otp = data.substring(data.length - 4, data.length);
            console.log(otp);
            callback(otp);
        }
        var failureCallback = function () {
            callback();
        }
        if (smsplugin) {
            smsplugin.startReception(successCallback, failureCallback);
        }
    };
    returnfunction.verifyOTP = function (userotp, personalcontact) {
        return $http.get(adminurl + "verifyotp", {
            params: {
                newotp: userotp,
                phone: personalcontact
            }
        });
    };
    returnfunction.register = function (phone) {
        return $http.get(adminurl + "register", {
            params: {
                phone: phone
            }
        });
    };
    returnfunction.createCard = function (card) {
        return $http.post(adminurl + "mycard", card);
    }
    returnfunction.sendContacts = function (contacts) {
        console.log(contacts);
        return $http.post(adminurl + "sendcontacts", contacts)
    }
    returnfunction.getlevel2contacts = function () {
        console.log("In level2 service");
        console.log(level2id);
        return $http.post(adminurl + "level2search", level2id)
    }

    return returnfunction;
});