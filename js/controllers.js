angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPopup, $location, MyServices) {
    var readsmsCallback = function (otp) {
        if (!otp) {
            conole.log("No Otp");
        } else {
            $scope.otp = otp;
            $scope.$apply();
            $location.path("/profile");
        }
    };
    MyServices.readsms(readsmsCallback);
})

.controller('EnterCtrl', function ($scope, $ionicSlideBoxDelegate, $ionicPopup, MyServices) {

    $scope.personal={};
    $scope.next = function () {
        $ionicSlideBoxDelegate.next();
    };
    
    $scope.phonesubmit=function(p){
        personalcontact=p.phone;
        var registerSucces = function(data,status)
        {
            console.log(" Registered"+ data);
        }
        MyServices.register(p.phone).success(registerSucces);
    }
    var logload = function (data, length) {
        for (var i = 0; i < length; i++) {
            console.log(data.item(i));
        }
    };

    MyServices.query("SELECT * FROM LOGS", logload);

    $scope.previous = function () {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
    };

    $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: "Didn't get the OTP ?",
            template: 'Please try resending the OTP.',
            buttons: [{
                text: 'Resend',
                type: 'button-positive button-outline'
            }],
        });
        alertPopup.then(function (res) {
            console.log('OTP Resent !');
        })
    };

    //    var readsmsCallback = function (otp) {
    //        if (!otp) {
    //            conole.log("No Otp");
    //        } else {
    //            $scope.otp = otp;
    //        }
    //    };
    //    MyServices.readsms(readsmsCallback);
})

.controller('ProfileCtrl', function ($scope, $location,MyServices) {

//Contacts Sending    
    var myconarr = [];
    var contactCallback = function (contact) {
        if (contact) {
            $scope.contacts = contact;
            $scope.$apply();
            for (var i = 0; i < $scope.contacts.length; i++) {
                myconarr[i] = {
                    name: $scope.contacts[i].displayName,
                    email: $scope.contacts[i].emails[0].value,
                    contact: $scope.contacts[i].phoneNumbers[0].value
                };
            }
            console.log(myconarr);
        }
        var sendContactsSuccess = function(data,success)
        {
            console.log("Contact already Registered"+ data);
            contact = data;
            console.log(contact);
        }
        Myservices.sendContacts(myconarr).success(sendContactsSuccess);
    };
    MyServices.getallcontacts(contactCallback);

    $scope.mergecard = {};
    $scope.personal = {};
    $scope.CardDetails = function (card) {
        mycard1 = card;
        //        console.log($scope.mycard);
        $location.path("/profile/personal");
    };
    $scope.PersonalDetails = function (card) {
        $scope.mycard2 = card;
        console.log(mycard1);
        console.log($scope.mycard2);
        $scope.mergecard = angular.extend(mycard1, angular.copy($scope.mycard2));
        $scope.mergecard.personelcontact=personalcontact;
        console.log("heycgyi"+ personalcontact);
        console.log($scope.mergecard);
         
        var createCardSucess =function(data,status)
        {
           console.log("HEy"+ data) 
        }
        MyServices.createCard($scope.mergecard).success(createCardSucess);
        //        console.log($scope.mycard);
        //$location.path("/profile/sharewith");
    };
})

.controller('Circle1Ctrl', function ($scope) {})

.controller('Circle2Ctrl', function ($scope) {})

.controller('Circle3Ctrl', function ($scope) {})

.controller('TabCtrl', function ($scope, $location) {

})

.controller('ProfileShareCtrl', function ($scope, MyServices) {
    //
    //    $scope.mycon = [{
    //        address: "sfjk",
    //        displayName: "Dhaval",
    //        emails: [{
    //            id: "66",
    //            value: "dhaval@wohlig.com"
    //        }, {
    //            id: "66",
    //            value: "dhaval@gmail.com"
    //        }],
    //        phoneNumbers: [{
    //            id: "66",
    //            value: "9029145077"
    //        }, {
    //            id: "66",
    //            value: "8080567909"
    //        }]
    //    }, {
    //        address: "",
    //        displayName: "Dhairya",
    //        emails: [{
    //            id: "66",
    //            value: "dhairya@wohlig.com"
    //        }, {
    //            id: "66",
    //            value: "dhairya@gmail.com"
    //        }],
    //        phoneNumbers: [{
    //            id: "66",
    //            value: "7845124520"
    //        }, {
    //            id: "66",
    //            value: "9658743252"
    //        }]
    //    }, {
    //        address: "",
    //        displayName: "Yash",
    //        emails: [{
    //            id: "66",
    //            value: "yash@wohlig.com"
    //        }, {
    //            id: "66",
    //            value: "dhairya@gmail.com"
    //        }],
    //        phoneNumbers: [{
    //            id: "66",
    //            value: "5897456321"
    //        }, {
    //            id: "66",
    //            value: "9658743252"
    //        }]
    //    }];
    //    console.log("Length=" + $scope.mycon.length);
    //    for (var i = 0; i < ($scope.mycon.length); i++) {
    //        console.log("for=" + i);
    //        myconarr[i] = {
    //            name: $scope.mycon[i].displayName,
    //            email: $scope.mycon[i].emails[0].value,
    //            contact: $scope.mycon[i].phoneNumbers[0].value
    //        };
    //    }
    //    console.log(myconarr);
    //var tempCon = [{displayName:"vishal",id:"1"},{displayName:"vishal"},{displayName:"vishal"}];
//    //$scope.contacts=tempCon;
//    var myconarr = [];
//    var contactCallback = function (contact) {
//        if (contact) {
//            $scope.contacts = contact;
//            $scope.$apply();
//            for (var i = 0; i < $scope.contacts.length; i++) {
//                myconarr[i] = {
//                    name: $scope.contacts[i].displayName,
//                    email: $scope.contacts[i].emails[0].value,
//                    contact: $scope.contacts[i].phoneNumbers[0].value
//                };
//            }
//            console.log(myconarr);
//        }
//    };
//    MyServices.getallcontacts(contactCallback);
    $scope.contacts = contact;
})

.controller('ProfileGetCtrl', function ($scope, MyServices) {
    $scope.contacts = MyServices.all();
    console.log($scope.contacts);
    $scope.$apply();
})

.controller('DashCtrl', function ($scope) {

})

.controller('ChatsCtrl', function ($scope) {})

.controller('SpingbookCtrl', function ($scope, MyServices, $ionicPopover, $ionicModal, $location) {

    $scope.search = false;
    $scope.filterbtn = false;
    $scope.showsearch = function () {
        console.log('Search Clicked');
        $scope.search = !$scope.search;
    };

    $scope.filtertoggle = function (keyEvent) {
        if (keyEvent.which === 13) {
            console.log('Filter Enter Clicked');
            $scope.filterbtn = true;
        } else {
            $scope.filterbtn = false;
        }
    };

    $scope.contacts = MyServices.all();
    $scope.showdailer = false;
    $scope.hidedialer = function () {
        $scope.showdailer = false;
        console.log('Dialer Hidden');
    };
    $scope.call = function (number) {
        phonedialer.dial(
            number,
            function (err) {
                if (err == "empty") console.log("Unknown phone number");
                else console.log("Dialer Error:" + err);
            },
            function (success) {
                console.log('Dialing succeeded');
            }
        );
        //document.location.href = "tel:" + number;
        console.log('Calling');
    };
    $scope.sms = function (number) {
        document.location.href = "sms:" + number;
        console.log('SMS');
    };
    $scope.mail = function (email) {
        document.location.href = "mailto:" + email;
        console.log('Mail');
    };
    $scope.phone = {};
    $scope.phone.number = "";

    $scope.phonenum = function (number) {
        console.log("number presses " + number);
        $scope.phone.number += "" + number;
    };
    $scope.phoneback = function () {
        $scope.phone.number = $scope.phone.number.slice(0, -1);
    };

    $scope.phonedelete = function () {
        $scope.phone.number = "";
    };


    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });


    //Filter Modal
    $ionicModal.fromTemplateUrl('templates/modal-filter.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal1 = modal;
    });

    $scope.openfilter = function () {
        $scope.oModal1.show();
    }
    $scope.closefilter = function () {
        $scope.oModal1.hide();
    };

    //Advanced Search Modal
    $ionicModal.fromTemplateUrl('templates/modal-advanced.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal2 = modal;
    });

    $scope.openadvance = function () {
        $scope.oModal2.show();
    }
    $scope.closeadvance = function () {
        $scope.oModal2.hide();
    };


    $scope.searchpage = function () {
        $location.url('/circle/circle1');
        console.log('searchpage');
    }

    $scope.spingpage = function () {
        $location.url('/tab/spingbook');
        console.log('spingpage');
    }

})

.controller('InSpingbookCtrl', function ($scope, MyServices, $stateParams) {
    $scope.contact = MyServices.get($stateParams.Id);
})

.controller('NewsCtrl', function ($scope) {
    $scope.settings = {
        enableNews: true
    };
});