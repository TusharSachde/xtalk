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
                $.jStorage.set("personalcontact", personalcontact);
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
    .controller('PersonalProfileCtrl', function ($scope, $location, MyServices, contactSync, $cordovaImagePicker, $cordovaFileTransfer, $ionicLoading, $timeout, $cordovaCamera) {

        if ($.jStorage.get('user')) {
            userid = $.jStorage.get("user");
        }


        $scope.startloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-light"></ion-spinner>'
            });
        };
        //        var options = {
        //            maximumImagesCount: 1,
        //            width: 800,
        //            height: 800,
        //            quality: 80
        //        };

        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };
        $scope.mycard = {};

        var getprofilesuccess = function (data, status) {
            console.log(data);
            if (data != "false") {
                $scope.mycard = data;
                $scope.mycard.profilelogo = data.image;
                if (!$scope.mycard.personalprofilecontactextension || $scope.mycard.personalprofilecontactextension == "") {
                    $scope.mycard.personalprofilecontactextension = "+91";
                }
                if (!$scope.mycard.homelandlineextension || $scope.mycard.homelandlineextension == "") {
                    $scope.mycard.homelandlineextension = "+91";
                }
                if (!$scope.mycard.personelcountry || $scope.mycard.personelcountry == "") {
                    $scope.mycard.personelcountry = "India";
                }
                if (!$scope.mycard.profilelogo || $scope.mycard.profilelogo == "") {
                    $scope.mycard.profilelogo = 'img/logo.jpg';
                }
                if (!$scope.mycard.birthdate || $scope.mycard.birthdate == "" || $scope.mycard.birthdate == "0000-00-00") {
                    $scope.mycard.birthdate = null;
                }
                if (!$scope.mycard.anniversary || $scope.mycard.anniversary == "" || $scope.mycard.anniversary == "0000-00-00") {
                    $scope.mycard.anniversary = null;
                }
            } else {
                $scope.mycard.personalprofilecontactextension = "+91";
                $scope.mycard.landlineextension = "+91";
                $scope.mycard.country = "India";
                $scope.mycard.profilelogo = 'img/logo.jpg';
            }
        }
        $ionicLoading.hide();

        if ($.jStorage.get("mycard")) {
            $scope.mycard = $.jStorage.get("mycard");
            if (!$scope.mycard.birthdate || $scope.mycard.birthdate == "" || $scope.mycard.birthdate == "0000-00-00") {
                $scope.mycard.birthdate = null;
            }
            if (!$scope.mycard.anniversary || $scope.mycard.anniversary == "" || $scope.mycard.anniversary == "0000-00-00") {
                $scope.mycard.anniversary = null;
            }
            console.log($scope.mycard);
        } else {
            $scope.startloading();
            MyServices.getprofile(userid).success(getprofilesuccess);
        }


        var changeproflogo = function (result) {
            console.log(result);
            $scope.mycard.profilelogo = result.value;
        }
        $scope.changeprofilelogo = function () {

            //            console.log("take picture");
            //            $cordovaImagePicker.getPictures(options).then(function (resultImage) {
            //                // Success! Image data is here
            //                console.log("here in upload image");
            //
            //                console.log(resultImage);
            //
            //                $scope.cameraimage = resultImage[0];
            //                $scope.uploadPhoto(adminurl + "imageuploadprofile?user=" + userid, changeproflogo);
            //
            //            }, function (err) {
            //                // An error occured. Show a message to the user
            //            });

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
                $scope.uploadPhoto(adminurl + "imageuploadprofile?user=" + userid, changeproflogo);
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

        if (editprofile) {
            $scope.mycard = $.jStorage.get("mycard");
        }
        $scope.CardDetails = function () {
            console.log($scope.mycard);
            $.jStorage.set("mycard", $scope.mycard);
            MyServices.createCard($scope.mycard).success(createCardSucess);
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
    })
    .controller('ProfileCtrl', function ($scope, $location, MyServices, contactSync, $cordovaImagePicker, $cordovaFileTransfer, $ionicLoading, $timeout, $cordovaCamera) {
        $scope.startloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-light"></ion-spinner>'
            });
        };
        //        $scope.startloading();

        $scope.mycard = {};
        $scope.number = {};
        $scope.number.companycontactextension = "+91";
        $scope.number.companycontact = $.jStorage.get("personalcontact");

        //        var options = {
        //            maximumImagesCount: 1,
        //            width: 800,
        //            height: 800,
        //            quality: 80
        //        };
        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };

        //Contacts Sending
        var changecmpylogo = function (result) {
            console.log(result);
            $scope.mycard.companylogo = result.value;
        }
        $scope.changecompanylogo = function () {
            //            console.log("take picture");
            //
            //            $cordovaImagePicker.getPictures(options).then(function (resultImage) {
            //                // Success! Image data is here
            //                console.log("here in upload image");
            //                console.log(resultImage);
            //                $scope.cameraimage = resultImage[0];
            //                $scope.uploadPhoto(adminurl + "imageuploadcompany?user=" + userid, changecmpylogo);
            //            }, function (err) {
            //                // An error occured. Show a message to the user
            //            });

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
                $scope.uploadPhoto(adminurl + "imageuploadcompany?user=" + userid, changecmpylogo);
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


        var getprofilesuccess = function (data, status) {
            console.log(data);
            if (data != "false") {
                $scope.mycard = data;
                if (!$scope.mycard.companylogo || $scope.mycard.companylogo == "") {
                    $scope.mycard.companylogo = 'img/logo.jpg';
                }
                $scope.number.companycontactextension = "+91";
                if (!$scope.mycard.directlandlineextension || $scope.mycard.directlandlineextension == "") {
                    $scope.mycard.directlandlineextension = "+91";
                }
                if (!$scope.mycard.boardlandlineextension || $scope.mycard.boardlandlineextension == "") {
                    $scope.mycard.boardlandlineextension = "+91";
                }
                if (!$scope.mycard.companycountry || $scope.mycard.companycountry == "") {
                    $scope.mycard.companycountry = "India";
                }

            } else {
                $scope.mycard.companylogo = 'img/logo.jpg';
                $scope.mycard.companycontactextension = "+91";
                $scope.mycard.directlandlineextension = "+91";
                $scope.mycard.boardlandlineextension = "+91";
                $scope.mycard.companycountry = "India";
            }
            $ionicLoading.hide();
        }
        if (!$.jStorage.get("mycard")) {
            $scope.startloading();
            MyServices.getprofile(userid).success(getprofilesuccess);
        } else {
            $scope.mycard = $.jStorage.get("mycard");
        }

        $scope.CardDetails = function (card, k) {
            console.log(card);
            $scope.allvalidation = [{
                field: $scope.mycard.name,
                validation: ""
        }, {
                field: $scope.mycard.companyemail,
                validation: ""
        }];
            var check = formvalidation($scope.allvalidation);
            if (check && k == 0) {
                card.id = userid;
                $.jStorage.set("mycard", card);
                $location.path("/profile/personal");
            } else if (check && k == 1) {
                card.id = userid;
                $.jStorage.set("mycard", card);
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

    $scope.mainLoader = false;

    var tobeShared = {
        userid: userid,
        tobeSharedArr: []
    }

    var maxcontact = 0;
    var contactcreatecomplete = 1;
    var completeCreate = function () {
        contactcreatecomplete++;
        console.log("contactcreatecomplete=" + contactcreatecomplete);
        if (contactcreatecomplete == maxcontact) {
            contactSync.contactcount(contactcountcallback);
            checktoskip();
        }
    }

    var sendcontactssuccess = function (data, status) {
        console.log(data);
        _.each(data, function (n) {
            contactSync.create(n, completeCreate);
        });
        contact = data;
        $scope.spingrcontacts = contact;

        $scope.spingrcontactcount = $scope.spingrcontacts.length;
        console.log("spingrcontactcount=" + $scope.spingrcontactcount);
        for (var i = 0; i < contact.length; i++) {
            $scope.spingrcontacts[i].isShared = true;
            //    level2id[i] = $scope.spingrcontacts[i].userid;
        }
    }
    var checkto = 0;
    var checktoskip = function () {
        checkto++;
        if (checkto == 2) {
            $ionicLoading.hide();
            $scope.mainLoader = true;

            if (contact.length == 0) {
                $location.path("/profile/get");
            }
            $scope.$apply();
        }
    }

    var contactCallback = function (myconarr) {
        $scope.usercontacts = {
            user: userid,
            contact: myconarr
        }
        MyServices.sendContacts($scope.usercontacts).success(sendcontactssuccess);
        maxcontact = myconarr.length;
        console.log("maxcontact=" + maxcontact);
        //        _.each(myconarr, function (n) {
        //            contactSync.create(n, completeCreate);
        //        });
    }
    n++;
    if (n == 1) {
        console.log("Hey");
        MyServices.getallcontacts(contactCallback);
    }

    var contactcountcallback = function (result, len) {
        console.log(result);
        console.log("contactcount=" + result);
        $scope.contactcount = result;
        checktoskip();
        $scope.$apply();
    }

    $scope.sendShare = function () {
        tobeShared.tobeSharedArr = [];
        tobeShared.tobeSharedArr = _.pluck(_.filter($scope.spingrcontacts, function (n) {
            return n.isShared;
        }), 'id');
        tobeShared.tobeSharedArr = _.filter(tobeShared.tobeSharedArr, function (n) {
            return n != null;
        })
        console.log(tobeShared);
        var sharewithSuccess = function (data, status) {
            $location.path("/tab/news");
        }
        if (tobeShared.tobeSharedArr.length != 0) {
            //            $location.path("/profile/get");
            MyServices.sharewith(tobeShared).success(sharewithSuccess);
        } else
            $location.path("/tab/news");
    }

    //    $scope.$apply();
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
    MyServices.getShared($.jStorage.get("user")).success(getSharedSuccess);

    //    $scope.changeAdd = function (contact) {
    //        if (contact.add == "Add") {
    //            contact.add = "Added";
    //        } else {
    //            contact.add = "Add";
    //        }
    //    }
    //    $scope.changeAddShare = function (contact) {
    //        if (contact.addShare == "Add & Share") {
    //            contact.addShare = "Added & Shared";
    //        } else {
    //            contact.addShare = "Add & Share";
    //        }
    //    }
    //    var UserAddShareSubmitSuccess = function (data, status) {
    //        console.log(data);
    //        $location.url('/tab/spingbook');
    //    }
    //
    $scope.UserAddShareSubmit = function () {
        $location.url('/tab/spingbook');
    }

    var newsfeedaddSuccess = function (data, contact) {
        console.log(data);

        if (data != "" && data) {
            console.log(data)
            $scope.getcontacts.splice($scope.getcontacts.indexOf(contact), 1);
        }
        console.log($scope.getcontacts);
    }
    $scope.changeAdd = function (contact) {
        MyServices.newsfeedadd(contact.id, contact, newsfeedaddSuccess);
        if (contact.add == "Add") {
            contact.add = "Added";
        } else {
            contact.add = "Add";
        }
    }
    var newsfeedaddShareSuccess = function (data, contact) {
        console.log(data);

        if (data != "" && data) {
            console.log(data)
            $scope.getcontacts.splice($scope.getcontacts.indexOf(contact), 1);
        }
        console.log($scope.getcontacts);
    }
    $scope.changeAddShare = function (contact) {
        MyServices.newsfeedaddShare(contact.id, contact, newsfeedaddShareSuccess);
        if (contact.addShare == "Add & Share") {
            contact.addShare = "Added & Shared";
        } else {
            contact.addShare = "Add & Share";
        }
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
    $scope.filter = {};
    $scope.allfiltercount = {};

    var populatecontacts = function (contacts, flag, pop, filtercount) {
        $scope.allfiltercount = filtercount;
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


    contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);

    $scope.loadMoreContacts = function () {
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, ++$scope.page, populatecontacts, populate, $scope.filter);
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
    var isnew = 0;
    $scope.syncnewcontacts = function () {
        isnew++;
        console.log("Hey");
        contactSync.synclocaltoserver();
        //        if (isnew == 1) {
        //            MyServices.getallcontacts(contactCallback);
        //        }
    }

    $scope.namesearch = function () {
        $scope.page = 0;
        $scope.phone.number = "";
        $scope.advanced = {};
        $scope.filter = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);
    }

    $scope.search = false;
    $scope.filterbtn = false;
    $scope.showsearch = function (z) {
        console.log('Search Clicked');
        //        $scope.search = !$scope.search;
        console.log($scope.search);
        if (z == 1) {
            if ($scope.search == true)
                $scope.search = false;
        } else if (z == 0) {
            $location.url("/circle/circle1");
        }
    };
    $scope.showcirclesearch = function () {
        //        console.log('Search Clicked');
        $scope.search = !$scope.search;
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
        if (number.length > 10) {
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
                contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);
            }
        }, 100);
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
        $scope.filter = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);
    };

    $scope.phonedelete = function () {
        $scope.searchquery.search = "";
        $scope.phone.number = "";
        $scope.page = 0;
        $scope.advanced = {};
        $scope.filter = {}
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);
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
        $scope.getfilterresults(1);
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
    };
    $scope.closeadvance = function () {
        $scope.oModal2.hide();
    };

    var advancesuccess = function (data) {
        $scope.myarr = data;
        console.log(data);
    };
    $scope.advancesearch = function () {
        //        contactSync.advancesearch($scope.advanced, advancesuccess);
        $scope.page = 0;
        $scope.searchquery.search = "";
        $scope.phone.number = "";
        $scope.filter = {};
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);
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



    $scope.openeditprofile = function () {
        editprofile = true;
        $scope.closePopover();
        $location.url("/profile/mycard");
    };
    var isAddedSuccess = function (data) {
        console.log(data);
        if (data != "false") {
            console.log("if");
            $.jStorage.set("isadded", 1);
            data.aliasname = contactDetail.name;
            contactDetail = data;
            console.log(contactDetail);
            $location.url("tab/spingbook-detail");
        } else {
            $.jStorage.set("isadded", 0);
            console.log("else");
            $location.url("tab/spingbook-detail");
        }
    }
    $scope.showDetail = function (contact) {
        contactDetail = contact;
        MyServices.isadded(contact.personalMobile, isAddedSuccess);
    }

    var isAddedCircle1Success = function (data) {
        console.log(data);
        if (data != "false") {
            console.log("if");
            $.jStorage.set("isadded", 1);
            data.aliasname = contactDetail.name;
            contactDetail = data;
            console.log(contactDetail);
            $location.url("circle/circle1detail");
        } else {
            $.jStorage.set("isadded", 0);
            console.log("else");
            $location.url("circle/circle1detail");
        }
    }
    $scope.showDetailCircle1 = function (contact) {
        contactDetail = contact;
        MyServices.isadded(contact.personalMobile, isAddedCircle1Success);
    }

    var filterresultcallback = function (data, len) {
        console.log(data);
        $scope.filterresults = [];
        _.each(data, function (n) {
            $scope.filterresults.push(n);
            $scope.filterresults.isFiltered = false;
        });
        console.log($scope.filterresults);
        $ionicLoading.hide();
    }
    $scope.getfilterresults = function (filtertype) {
        $scope.startloading();
        if (filtertype == 1) {
            $scope.class1 = true;
            $scope.class2 = false;
            $scope.class3 = false;
            $scope.class4 = false;
            $scope.filterby = "SELECT * FROM `contacts` WHERE `name` LIKE '%" + $scope.searchquery.search + "%' GROUP BY `name`";
        } else if (filtertype == 2) {
            $scope.class1 = false;
            $scope.class2 = true;
            $scope.class3 = false;
            $scope.class4 = false;
            $scope.filterby = "SELECT * FROM `contacts` WHERE `companyname` LIKE '%" + $scope.searchquery.search + "%' GROUP BY `companyname`";
        } else if (filtertype == 3) {
            $scope.class1 = false;
            $scope.class2 = false;
            $scope.class3 = true;
            $scope.class4 = false;
            $scope.filterby = "SELECT * FROM `contacts` WHERE `personalCity` LIKE '%" + $scope.searchquery.search + "%' GROUP BY `personalCity`";
        } else if (filtertype == 4) {
            $scope.class1 = false;
            $scope.class2 = false;
            $scope.class3 = false;
            $scope.class4 = true;
            $scope.filterby = "SELECT * FROM `contacts` WHERE `designation` LIKE '%" + $scope.searchquery.search + "%' GROUP BY `designation`";
        }
        contactSync.getqueryresult($scope.filterby, filterresultcallback);
    }
    $scope.applyFilter = function (filterresult) {
        $scope.myarr = _.filter(filterresult, function (n) {
            return n.isFiltered == true;
        })
        $scope.closefilter();
    }
    $scope.clearFilter = function () {
        contactSync.getcontact($scope.searchquery.search, $scope.phone.number, $scope.advanced, $scope.page, populatecontacts, ++populate, $scope.filter);
        $scope.closefilter();
    }

    $scope.level2search = function () {
//        MyServices.getlevel2contacts($scope.searchquery.search).success(level2callback);
    }
    $scope.level3search = function () {
//        MyServices.getlevel3contacts($scope.searchquery.search).success(level3callback);
    }
    var level2callback = function (data, status) {
        $scope.circle2contacts = data;
        console.log($scope.circle2contacts);
    };
//    MyServices.getlevel2contacts($scope.searchquery.search).success(level2callback);

    var level3callback = function (data, status) {
        $scope.circle3contacts = data;
        console.log($scope.circle3contacts);
    };
//    MyServices.getlevel3contacts($scope.searchquery.search).success(level3callback);

    $scope.backtospingbook = function () {
        $location.url('/tab/spingbook');
    }
})

.controller('InSpingbookCtrl', function ($scope, MyServices, $stateParams, $ionicModal, contactSync, $ionicPopup, $ionicLoading) {

    $scope.circleid = $stateParams.Id;
    console.log($scope.circleid);
    $scope.user1name = $stateParams.u1name;
    $scope.user2name = $stateParams.u2name;
    console.log($scope.user1name);
    console.log($scope.user2name);
    var getproilecallback = function (data, status) {
        console.log(data);
        $scope.contactdetails = data;
    }

    if ($scope.circleid) {
        MyServices.getprofile($scope.circleid).success(getproilecallback);
    }
    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    if ($.jStorage.get("isadded") == 1) {
        $scope.showAll = 1;
    } else {
        $scope.showAll = 0;
    }
    $scope.contact = contactDetail;
    console.log(contactDetail);

    //Forwarding Modal
    $ionicModal.fromTemplateUrl('templates/modal-forward.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal3 = modal;
    });

    var getallcontactnamescallback = function (data, len) {
        console.log(data);
        $scope.allcontacts = [];
        _.each(data, function (n) {
            $scope.allcontacts.push(n);
        })
        $ionicLoading.hide();
    }
    $scope.openforwardmodal = function () {
        contactSync.getallcontactnames(getallcontactnamescallback);
        $scope.oModal3.show();
        $scope.startloading();
    };
    $scope.closeforwardmodal = function () {
        $scope.oModal3.hide();
    };

    $scope.forward = function (contact) {
        console.log("Forward");
        var alertPopup = $ionicPopup.show({
            title: 'CONFIRM FORWARD',
            template: 'Are you sure you want to forward this contact?',
            buttons: [{
                text: 'NO',
                type: 'button-positive button-outline',
                onTap: function () {
                    return "No";
                }
                        }, {
                text: 'YES',
                type: 'button-positive button-outline',
                onTap: function () {
                    return "Yes";
                }
                        }],
        });

        alertPopup.then(function (res) {
            console.log(res);
            if (res == "Yes") {
                console.log("userfrom=" + $scope.contact.userid + " \n touser=" + contact.userid);
                console.log("Oh Yes !!");
            }
        })
    }
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
    MyServices.getShared($.jStorage.get("user")).success(getSharedSuccess);

    var newsfeedaddSuccess = function (data, contact) {
        console.log(data);

        if (data != "" && data) {
            console.log(data)
            $scope.newsfeed.splice($scope.newsfeed.indexOf(contact), 1);
        }
        console.log($scope.newsfeed);
    }
    $scope.changeAdd = function (contact) {
        MyServices.newsfeedadd(contact.id, contact, newsfeedaddSuccess);
        if (contact.add == "Add") {
            contact.add = "Added";
        } else {
            contact.add = "Add";
        }
    }
    var newsfeedaddShareSuccess = function (data, contact) {
        console.log(data);

        if (data != "" && data) {
            console.log(data)
            $scope.newsfeed.splice($scope.newsfeed.indexOf(contact), 1);
        }
        console.log($scope.newsfeed);
    }
    $scope.changeAddShare = function (contact) {
        MyServices.newsfeedaddShare(contact.id, contact, newsfeedaddShareSuccess);
        if (contact.addShare == "Add & Share") {
            contact.addShare = "Added & Shared";
        } else {
            contact.addShare = "Add & Share";
        }
    }
});