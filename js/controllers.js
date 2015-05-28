angular.module('starter.controllers', ['contactsync', 'ngCordova'])

.controller('AppCtrl', function ($scope, $ionicPopup, $location, MyServices) {

})

.controller('EnterCtrl', function ($scope, $ionicSlideBoxDelegate, $ionicPopup, MyServices, $location, contactSync, $ionicLoading) {
    $scope.startloading = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    $scope.startloading();
    contactSync.drop();
    var readsmsCallback = function (otp) {
        if (!otp) {
            conole.log("No Otp");
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
    //Popup for dint get OTP
    $scope.showAlert = function () {
        console.log('Dint get OTP?');
        var alertPopup = $ionicPopup.alert({
            title: "Didn't get the OTP ?",
            template: 'Please try resending the OTP.',
            buttons: [{
                text: 'Try Again',
                type: 'button-positive button-outline'
            }],
        });
        alertPopup.then(function (res) {
            console.log('OTP Resent !');
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
        MyServices.register(phoneno.phone).success(registerSuccess);
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
                template: 'Please enter the correct OTP'
            });
        }


    };
    var errorCallback = function () {
        $ionicLoading.hide();
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'INCORRECT OTP',
                template: 'Please enter the correct OTP'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

    }
    $scope.checkotp = function () {
        $scope.startloading();
        MyServices.verifyOTP($scope.otp.number, personalcontact).success(verifyCallback).error(errorCallback);
    }
    $ionicLoading.hide();
})

.controller('ProfileCtrl', function ($scope, $location, MyServices, contactSync, $cordovaCamera, $cordovaFileTransfer, $ionicLoading, $timeout) {
    $scope.startloading = function () {
        $ionicLoading.show({
            template: 'Loading...'
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
    var contactCallback = function (myconarr) {
        _.each(myconarr, function (n) {
            contactSync.create(n);
        });
    }
    n++;
    if (n == 1) {
        console.log("Hey");
        MyServices.getallcontacts(contactCallback);
    }

    $scope.mergecard = {};
    $scope.personal = {};
    $scope.CardDetails = function (card) {
        mycard1 = card;
        $location.path("/profile/personal");
    };
    $scope.PersonalDetails = function (card) {
        $scope.startloading();
        $scope.mycard2 = card;
        console.log(mycard1);
        console.log($scope.mycard2);
        $scope.mergecard = angular.extend(mycard1, angular.copy($scope.mycard2));
        $scope.mergecard.personelcontact = personalcontact;
        console.log("heycgyi" + personalcontact);
        console.log($scope.mergecard);

        var createCardSucess = function (data, status) {
            console.log("HEy" + data);
            $location.path("/tab/spingbook");
        }
        MyServices.createCard($scope.mergecard).success(createCardSucess);
        //        console.log($scope.mycard);
        //        $location.path("/profile/sharewith");
    };
    $ionicLoading.hide();
})

.controller('Circle1Ctrl', function ($scope) {})

.controller('Circle2Ctrl', function ($scope) {})

.controller('Circle3Ctrl', function ($scope) {})

.controller('TabCtrl', function ($scope, $location) {

})

.controller('ProfileShareCtrl', function ($scope, MyServices) {
    $scope.contacts = contact;
    $scope.$apply();
})

.controller('ProfileGetCtrl', function ($scope, MyServices) {
    //$scope.contacts = MyServices.all();
    console.log($scope.contacts);
    $scope.$apply();
})

.controller('DashCtrl', function ($scope) {

})

.controller('ChatsCtrl', function ($scope) {})

.controller('SpingbookCtrl', function ($scope, MyServices, $ionicPopover, $ionicModal, $location, contactSync, $ionicLoading, $ionicScrollDelegate) {

    $scope.startloading = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    $scope.startloading();

    $scope.keepscrolling = true;
    $scope.noresult = false;
    $scope.page = 1;
    abc.scope = $scope;
    $scope.myarr = [];
    var populate = 0;
    if (!$.jStorage.get("user")) {
        console.log("Jstorage not set");
        $location.url('/enter');
    }

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
        console.log(contacts);
        console.log(flag);
        console.log(pop);
        if (pop == populate) {
            if (contacts.length == 0) { // nothing in contact
                console.log("Section1");
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
            } else { // things in contacts
                console.log("Section2");
                $scope.noresult = false;
                if (flag) { // new search with things in contact
                    console.log("Section3");
                    $scope.myarr = [];
                    $scope.keepscrolling = true;
                }
                $scope.myarr = $scope.myarr.concat(contacts);
            }
        }

        $ionicScrollDelegate.scrollTop();
        console.log(flag);
        console.log(contacts);
        console.log($scope.keepscrolling);
        $scope.$apply();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
    };


    console.log("Get Contacts is called first time.");
    contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);

    $scope.loadMoreContacts = function () {
        console.log("Loading More " + ($scope.page + 1));
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, ++$scope.page, populatecontacts, populate);
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
        $scope.page = 0;
        $scope.searchquery.search = "";
        $scope.advanced = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate);
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

})

.controller('InSpingbookCtrl', function ($scope, MyServices, $stateParams) {
    $scope.contact = MyServices.get($stateParams.Id);
})

.controller('NewsCtrl', function ($scope) {
    $scope.settings = {
        enableNews: true
    };
});