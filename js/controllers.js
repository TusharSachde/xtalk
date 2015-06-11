angular.module('starter.controllers', ['contactsync', 'ngCordova'])

.controller('AppCtrl', function ($scope, $ionicPopup, $location, MyServices) {

})

.controller('EnterCtrl', function ($scope, $ionicSlideBoxDelegate, $ionicPopup, MyServices, $location, contactSync, $ionicLoading) {
    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };


    $scope.onenter = function (keyEvent, callback, object) {
        //        console.log(keyEvent);
        if (keyEvent.which == 13) {
            callback(object);
        };

    };

    $scope.startloading();
    contactSync.drop();
    var readsmsCallback = function (otp) {
        if (!otp) {
            //            console.log("No Otp");
        } else {
            $scope.otp = {
                number: otp
            };
            $scope.$apply();

        }
    };
    $scope.otp = {
        number: ""
    };


    $scope.personal = {};
    $scope.personal.countrycode = "+91";
    //Popup for dint get OTP
    $scope.showAlert = function () {
        //        console.log('Dint get OTP?');
        var alertPopup = $ionicPopup.alert({
            title: "Didn't get the OTP ?",
            template: 'Please try resending the OTP.',
            buttons: [{
                text: 'Try Again',
                type: 'button-positive button-outline'
            }],
        });
        alertPopup.then(function (res) {
            $ionicSlideBoxDelegate.previous();
            //           console.log('OTP Resent !');
        })
    };


    var registerSuccess = function (data, status) {
        console.log(data);
        //userid = parseInt(data.id);
        $ionicSlideBoxDelegate.next();
        MyServices.readsms(readsmsCallback);
    };
    $scope.phonesubmit = function (phoneno) {
        personalcontact = phoneno.phone;
        if (personalcontact.match(/^\d+$/)) {
            console.log(true);
            MyServices.register(personalcontact, phoneno.countrycode).success(registerSuccess);
        } else {
            console.log(false);
            var alertPopup = $ionicPopup.alert({
                title: 'INVALID PHONE NUMBER',
                template: 'Please enter the correct phone number',
                buttons: [{
                    text: 'Okay',
                    type: 'button-positive button-outline'
                }],
            });
        }
    }

    $scope.disableSwipe = function () {
        $ionicSlideBoxDelegate.enableSlide(false);
    };

    $scope.previous = function () {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
    };

    var verifyCallback = function (data, status) {
        // console.log("verify");
        if (data != "false") {
            console.log(data);
            userid = data.id;
            $.jStorage.set("user", userid);
            userid = $.jStorage.get("user");
            $ionicLoading.hide();
            $location.path("/profile/mycard");

        } else {
            console.log(data);
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'INCORRECT OTP',
                template: 'Please enter the correct OTP',
                buttons: [{
                    text: 'Okay',
                    type: 'button-positive button-outline'
                }],
            });
        }


    };
    var errorCallback = function () {
        $ionicLoading.hide();
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'INCORRECT OTP',
                template: 'Please enter the correct OTP',
                buttons: [{
                    text: 'Okay',
                    type: 'button-positive button-outline'
                }],
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

    }
    $scope.checkotp = function () {
        if ($scope.otp.number.match(/^\d+$/)) {
            $scope.startloading();
            MyServices.verifyOTP($scope.otp.number, personalcontact).success(verifyCallback).error(errorCallback);
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'INVALID OTP',
                template: 'Please enter only numbers',
                buttons: [{
                    text: 'Okay',
                    type: 'button-positive button-outline'
                }],
            });
        }
    }
    $ionicLoading.hide();
})

.controller('ProfileCtrl', function ($scope, $location, MyServices, contactSync, $cordovaCamera, $cordovaFileTransfer, $ionicLoading, $timeout) {
    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    $scope.companylogo = 'img/logo.jpg';
    $scope.profilelogo = 'img/logo.jpg';
    var options = {
        quality: 40,
        destinationType: Camera.DestinationType.NATIVE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG
    };

    //Contacts Sending
    var changecmpylogo = function (result) {
        console.log(result);
        $scope.companylogo = result.value;
    }
    $scope.changecompanylogo = function () {
        console.log("take picture");

        $cordovaCamera.getPicture(options).then(function (imageData) {
            // Success! Image data is here
            console.log("here in upload image");
            console.log(imageData);
            $scope.companylogo = imageData;

            if (imageData.substring(0, 21) == "content://com.android") {
                var photo_split = imageData.split("%3A");
                imageData = "content://media/external/images/media/" + photo_split[1];
            }
            $scope.cameraimage = imageData;
            $scope.uploadPhoto(adminurl + "imageuploadcompany?user=" + user.id, changecmpylogo);
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

    var changeproflogo = function (result) {
        console.log(result);
        $scope.profilelogo = result.value;
    }
    $scope.changeprofilelogo = function () {
        console.log("take picture");

        $cordovaCamera.getPicture(options).then(function (imageData) {
            // Success! Image data is here
            console.log("here in upload image");
            console.log(imageData);

            if (imageData.substring(0, 21) == "content://com.android") {
                var photo_split = imageData.split("%3A");
                imageData = "content://media/external/images/media/" + photo_split[1];
            }
            $scope.cameraimage = imageData;
            $scope.uploadPhoto(adminurl + "imageuploadprofile?user=" + user.id, changeproflogo);
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

    $scope.uploadPhoto = function (serverpath, callback) {

        //        console.log("function called");
        $cordovaFileTransfer.upload(serverpath, $scope.cameraimage, options)
            .then(function (result) {
                console.log(result);
                var data = JSON.parse(result.response);
                callback(data);
                $ionicLoading.hide();
                //$scope.addretailer.store_image = $scope.filename2;
            }, function (err) {
                // Error
                console.log(err);
            }, function (progress) {
                // constant progress updates
                $ionicLoading.show({
                    //        template: 'We are fetching the best rates for you.',

                    content: 'Uploading Image',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: '0'
                });
            });
    };
    var sendcontactssuccess = function (data, status) {
        console.log(data);
        contact = data;
    }
    var contactCallback = function (myconarr) {
        $scope.usercontacts = {
            user: userid,
            contact: myconarr
        }
        MyServices.sendContacts($scope.usercontacts).success(sendcontactssuccess);

        _.each(myconarr, function (n) {
            contactSync.create(n);
        });
    }
    n++;
    if (n == 1 && !$.jStorage.get("profilesaved")) {
        console.log("Hey");
        MyServices.getallcontacts(contactCallback);
    }

    $scope.mergecard = {};
    $scope.personal = {};
    $scope.mycard = {};
    if (editprofile) {
        $scope.personal = $.jStorage.get("userpersonalcard");
        $scope.mycard = $.jStorage.get("usermycard");
    } else {
        $scope.mycard.companycontact = personalcontact;
    }
    $scope.mycard.companycountry = "India";
    $scope.CardDetails = function (card, k) {
        $scope.allvalidation = [{
            field: $scope.mycard.name,
            validation: ""
        }, {
            field: $scope.mycard.companycontact,
            validation: ""
        }, {
            field: $scope.mycard.companyemail,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        if (check && k == 0) {
            card.id = userid;
            $.jStorage.set("usermycard", card);
            mycard1 = card;
            $location.path("/profile/personal");
        } else if (check && k == 1) {
            card.id = userid;
            $.jStorage.set("usermycard", card);
            $.jStorage.set("userpersonalcard", "");
            MyServices.createCard(card).success(createCardSucess);
        }
    };
    var createCardSucess = function (data, status) {
        console.log(data);
        $.jStorage.set("profilesaved", 1);
        if (editprofile) {
            $location.path("/tab/spingbook");
        } else {
            $.jStorage.set("user", userid);
            $location.path("/profile/sharewith");
        }
    }
    $scope.PersonalDetails = function (card) {
        $.jStorage.set("userpersonalcard", card);
        $scope.startloading();
        $scope.mycard2 = card;
        console.log(mycard1);
        console.log($scope.mycard2);
        $scope.mergecard = angular.extend(mycard1, angular.copy($scope.mycard2));
        console.log($scope.mergecard);
        MyServices.createCard($scope.mergecard).success(createCardSucess);

    };
    $ionicLoading.hide();
})

.controller('Circle1Ctrl', function ($scope) {})

.controller('Circle2Ctrl', function ($scope) {})

.controller('Circle3Ctrl', function ($scope) {})

.controller('TabCtrl', function ($scope, $location) {

})

.controller('ProfileShareCtrl', function ($scope, MyServices, $ionicLoading, $location, contactSync) {

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    var tobeShared = {
        userid: userid,
        tobeSharedArr: []
    }
    $scope.startloading();
    $scope.spingrcontacts = contact;
    if ($scope.spingrcontacts.length == 0) {
        $location.path("/profile/get");
    }
    //	$scope.spingrcontacts = [{
    //		userid: 1,
    //		name: 'vishal'
    //    }, {
    //		userid: 2,
    //		name: 'dhaval'
    //    }];
    for (var i = 0; i < $scope.spingrcontacts.length; i++) {
        $scope.spingrcontacts[i].isShared = false;
        //    level2id[i] = $scope.spingrcontacts[i].userid;
    }
    console.log($scope.spingrcontacts);

    var contactcountcallback = function (result, len) {
        console.log(result);
        console.log("contactcount=" + result);
        $scope.contactcount = result;
    }
    contactSync.contactcount(contactcountcallback);

    $scope.spingrcontactcount = $scope.spingrcontacts.length;
    console.log("spingrcontactcount=" + $scope.spingrcontactcount);

    $scope.sendShare = function () {

        tobeShared.tobeSharedArr = [];
        for (var i = 0; i < $scope.spingrcontacts.length; i++) {
            if ($scope.spingrcontacts[i].isShared == true) {
                console.log($scope.spingrcontacts[i].isShared)
                tobeShared.tobeSharedArr.push($scope.spingrcontacts[i].userid)
            }
            //    level2id[i] = $scope.spingrcontacts[i].userid;
        }
        var sharewithSuccess = function (data, status) {
            $location.path("/profile/get");
        }
        if (tobeShared.tobeSharedArr.length != 0)
            MyServices.sharewith(tobeShared).success(sharewithSuccess);
        else
            $location.path("/profile/get");

    }

    //    $scope.$apply();
    $ionicLoading.hide();
})

.controller('ProfileGetCtrl', function ($scope, MyServices, $location, $ionicLoading) {

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    var getSharedSuccess = function (data, status) {
        if (data.length == 0) {
            $location.url('/tab/spingbook');
        }
        $scope.getcontacts = data;
        console.log($scope.getcontacts);
        _.each($scope.getcontacts, function (n) {
            n.addShare = "Add & Share";
            n.add = "Add";
        });

    }
    MyServices.getShared(userid).success(getSharedSuccess);

    $scope.changeAdd = function (contact) {
        if (contact.add == "Add") {
            contact.add = "Added";
        } else {
            contact.add = "Add";
        }
    }
    $scope.changeAddShare = function (contact) {
        if (contact.addShare == "Add & Share") {
            contact.addShare = "Added & Shared";
        } else {
            contact.addShare = "Add & Share";
        }
    }
    var UserAddShareSubmitSuccess = function (data, status) {
        console.log(data);
        $location.url('/tab/spingbook');
    }

    $scope.UserAddShareSubmit = function () {
        //        $scope.startloading();
        MyServices.UserAddShareSubmit($scope.getcontacts).success(UserAddShareSubmitSuccess);
    }


    //    $scope.spingrcontacts = contact
    //    console.log($scope.spingrcontacts);
    //    $scope.$apply();
})

.controller('DashCtrl', function ($scope) {

})

.controller('ChatsCtrl', function ($scope) {})

.controller('SpingbookCtrl', function ($scope, MyServices, $ionicPopover, $ionicModal, $location, contactSync, $ionicLoading, $ionicScrollDelegate) {

    if (!$.jStorage.get("user")) {
        console.log("Jstorage not set");
        $location.url('/enter');
    }
    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    $scope.keepscrolling = true;
    $scope.noresult = false;
    $scope.page = 1;
    abc.scope = $scope;
    $scope.myarr = [];
    var populate = 0;

    if ($scope.search == true && $scope.showdailer == true) {
        $scope.search = false;
    }
    $scope.advanced = {};
    $scope.page = 0;
    $scope.searchquery = {};
    $scope.searchquery.search = "";
    $scope.phone = {};
    $scope.phone.number = "";



    var populatecontacts = function (contacts, flag, pop) {

        if (pop == populate) {
            if (contacts.length == 0) { // nothing in contact

                $scope.page = 0;
                $scope.keepscrolling = false;
                if (flag) { // its new search and there is nothing in contacts
                    $scope.myarr = [];
                    $scope.noresult = true;
                } else // is old search new page but nothign in contact
                {
                    $scope.noresult = false;
                    $scope.keepscrolling = false;
                }
                $ionicLoading.hide();
            } else { // things in contacts

                $scope.noresult = false;
                if (flag) { // new search with things in contact
                    //                    console.log("Section3");
                    $scope.myarr = [];
                    $ionicScrollDelegate.scrollTop();
                    $scope.keepscrolling = true;
                }
                $scope.myarr = $scope.myarr.concat(contacts);
                //                for (var i = 0; i < $scope.myarr.length; i++) {
                //                    MyServices.getlogos($scope.myarr.personalMobile).success(getlogossuccess)
                //                }
                //                var getlogossuccess = function (data, status) {
                //                    console.log(data);
                //                }
                $ionicLoading.hide();
            }
        }
        $scope.$apply();
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };


    contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);

    $scope.loadMoreContacts = function () {
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, ++$scope.page, populatecontacts, populate);
    }

    var recordcallback = function (len, n) {
        if (len == 0) {
            contactSync.create(n);
        } else {

        }
    };

    var contactCallback = function (myconarr) {
        _.each(myconarr, function (n) {
            contactSync.iscontactpresent(n, recordcallback);
        });
    }
    $scope.syncnewcontacts = function () {
        console.log("Hey");
        //        contactSync.synclocaltoserver();
        //        MyServices.getallcontacts(contactCallback);
    }

    $scope.namesearch = function () {
        $scope.page = 0;
        $scope.phone.number = "";
        $scope.advanced = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);
    }

    $scope.search = false;
    $scope.filterbtn = false;
    $scope.showsearch = function (n) {
        console.log('Search Clicked');
        $scope.search = !$scope.search;
        console.log($scope.search);
        if (n == 1) {
            if ($scope.search == true)
                $scope.search = false;
        } else if (n == 0) {
            $location.url("/circle/circle1");
        }
    };
    $scope.searchquery = "";
    $scope.filtertoggle = function (keyEvent) {
        if (keyEvent.which === 13) {
            console.log($scope.searchquery);
            $scope.filterbtn = true;
        } else {
            $scope.filterbtn = false;
        }
    };

    $scope.searchquery = {
        search: ""
    };

    //  $scope.contacts = MyServices.all();
    $scope.showdailer = false;
    $scope.hidedialer = function (num) {
        console.log(num);
        //        if(num)
        //        {
        //            console.log(num);
        //            $scope.call(num);
        //        }
        $scope.showdailer = false;
        console.log('Dialer Hidden');
    };
    $scope.call = function (number) {
        number = number + "";
        if (number.length >= 10) {
            number = "+" + number;
        }
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
    var lastphone = 0;
    var lastcheck = 0;

    function delaygetcontact(id) {
        setTimeout(function () {
            console.log(id);
            console.log(lastcheck);
            if (id == lastcheck) {
                console.log("Going In");
                contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);
            }
        }, 2000);
    }

    $scope.phonenum = function (number) {
        lastcheck++;
        $scope.phone.number += "" + number;
        $scope.page = 0;
        $scope.searchquery.search = "";
        $scope.advanced = {};
        lastphone = $scope.phone.number;
        delaygetcontact(lastcheck);
    };


    $scope.phoneback = function () {
        $scope.phone.number = $scope.phone.number.slice(0, -1);
        $scope.page = 0;
        $scope.searchquery.search = "";
        $scope.advanced = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);
    };

    $scope.phonedelete = function () {
        $scope.searchquery.search = "";
        $scope.phone.number = "";
        $scope.page = 0;
        $scope.advanced = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);
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
    var advancesuccess = function (data) {
        $scope.myarr = data;
        console.log(data);
    };
    $scope.closeadvance = function () {
        $scope.oModal2.hide();
    };
    $scope.advancesearch = function () {
        //        contactSync.advancesearch($scope.advanced, advancesuccess);
        $scope.page = 0;
        $scope.searchquery.search = "";
        $scope.phone.number = "";
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);
        $scope.closeadvance();
        $scope.closePopover();
    }
    $scope.searchpage = function () {
        $location.url('/circle/circle1');
        console.log('searchpage');
    }

    $scope.spingpage = function () {
        $location.url('/tab/spingbook');
        console.log('spingpage');
    }

    var level2callback = function (data, status) {
        console.log("Level2");
        console.log(data);
    };
    MyServices.getlevel2contacts().success(level2callback);

    $scope.openeditprofile = function () {
        editprofile = true;
        $scope.closePopover();
        $location.url("/profile/mycard");
    };
    var isAddedSuccess = function (data, status) {
        console.log(data);
        if (data != false) {
            console.log("if");
            $.jStorage.set("isadded", 1);
            contactDetail = data;
            console.log(contactDetail);
            $location.url("tab/spingbook-detail");
        } else {
            $.jStorage.set("isadded", 0);
            console.log("else");
        }
    }
    $scope.showDetail = function (contact) {
        MyServices.isadded(contact.personalMobile).success(isAddedSuccess);
        contactDetail = contact;
        //        console.log(contact);
    }
    var level2callback = function (data, status) {
        $scope.circle2contacts = data;
        console.log($scope.circle2contacts);
    };
    MyServices.getlevel2contacts().success(level2callback);

    var level3callback = function (data, status) {
        $scope.circle3contacts = data;
        console.log($scope.circle3contacts);
    };
    MyServices.getlevel3contacts().success(level3callback);

})

.controller('InSpingbookCtrl', function ($scope, MyServices, $stateParams) {
    if ($.jStorage.get("isadded") == 1) {
        $scope.showAll = 1;
    } else {
        $scope.showAll = 0;
    }
    $scope.contact = contactDetail;
    console.log(contactDetail);
})

.controller('NewsCtrl', function ($scope, MyServices, $ionicLoading) {

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    var getSharedSuccess = function (data, status) {
        $scope.newsfeed = data;
        console.log($scope.newsfeed);
        _.each($scope.newsfeed, function (n) {
            n.addShare = "Add & Share";
            n.add = "Add";
        });
        $ionicLoading.hide();
    }
    MyServices.getShared(userid).success(getSharedSuccess);

    var newsfeedaddSuccess = function (data, status) {
        console.log(data);
        console.log($scope.newsfeed);

        if (data != "" && data) {
            _.remove($scope.newsfeed, {
                id: JSON.parse(data)
            });
        }
        console.log($scope.newsfeed);
    }
    $scope.changeAdd = function (contact) {
        MyServices.newsfeedadd(contact.id).success(newsfeedaddSuccess);
        if (contact.add == "Add") {
            contact.add = "Added";
        } else {
            contact.add = "Add";
        }
    }
    var newsfeedaddShareSuccess = function (data, status) {
        console.log(data);
        if (data != "" && data) {
            console.log(data)
            _.remove($scope.newsfeed, {
                id: JSON.parse(data)
            });
        }

        console.log($scope.newsfeed);
    }
    $scope.changeAddShare = function (contact) {
        MyServices.newsfeedaddShare(contact.id).success(newsfeedaddShareSuccess);
        if (contact.addShare == "Add & Share") {
            contact.addShare = "Shared";
        } else {
            contact.addShare = "Add & Share";
        }
    }
});