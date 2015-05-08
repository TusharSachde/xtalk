angular.module('starter.services', [])

.factory('MyServices', function () {
    var contacts = [{
        id: 0,
        name: 'Chintan Shah',
        company: 'Wohlig Technology',
        area: 'Mumbai',
        image: 'http://i.imgur.com/1Ncgq84.jpg',
        logo: 'http://www.apic4u.com/wp-content/uploads/2014/05/New-Being-Human-Collections18.jpg',
        number: '+919819222221',
        email: 'chintan@wohlig.com',
        designation: 'Director'
    }, {
        id: 1,
        name: 'Chirag Shah',
        company: 'Wohlig Technology',
        area: 'Mumbai',
        image: 'http://image.gala.de/v1/cms/AU/shahrukh-khan-ge_6276006-square-02_top_square.jpg?v=8176344',
        logo: 'http://upload.wikimedia.org/wikipedia/en/3/31/Red_Chillies.JPG',
        number: '+919820045678',
        email: 'chirag@wohlig.com',
        designation: 'Director'
    }, {
        id: 2,
        name: 'Tushar Sachde',
        company: 'Wohlig Technology',
        area: 'Mumbai',
        image: 'http://www.masala.com/sites/default/files/styles/4_columns_gutter_size_638px_wide_square/public/images/2014/10/26/DSC_0186.jpg?itok=B3gcHWe_',
        logo: 'http://upload.wikimedia.org/wikipedia/commons/2/22/Aamir_khan_productions.png',
        number: '+919029796018',
        email: 'tushar@wohlig.com',
        designation: 'Director'
    }, {
        id: 3,
        name: 'Nayan Bheda',
        company: 'Roots2Wings Ideas',
        area: 'Mumbai',
        image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg',
        logo: 'http://www.apic4u.com/wp-content/uploads/2014/05/New-Being-Human-Collections18.jpg',
        number: '+919004121212',
        email: 'nayan@9004121212.com',
        designation: 'Director'
    }, {
        id: 4,
        name: 'Nilesh Halde',
        company: 'Roots2Wings Ideas',
        area: 'Mumbai',
        image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg',
        logo: 'http://www.apic4u.com/wp-content/uploads/2014/05/New-Being-Human-Collections18.jpg',
        number: '+919820752510',
        email: 'nileshhalde@gmail.com',
        designation: 'Director'
    }];

    var returnfunction = {};
    returnfunction.all = function () {
        return contacts;
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
            var opt = data.substring(data.length - 6, data.length);
            callback(otp);
        }
        var failureCallback = function () {
            callback();
        }
        smsplugin.startReception(successCallback, failureCallback);
    };


    return returnfunction;
});