angular.module('starter.controllers', ['ngCordova'])

.controller('EnterCtrl', function ($scope, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, MyServices, $state) {

        $scope.personal = {};
        $scope.verify = {};

        $scope.startloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-light"></ion-spinner>'
            });
        };

        $scope.disableSwipe = function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        };

        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };

        function readSMS() {
            if (smsplugin) {
                smsplugin.startReception(function (data) {
                    console.log(data);
                    $scope.personal.otp = data.substring(data.length - 4, data.length);
                    console.log($scope.personal.otp);
                    $scope.checkotp();
                    smsplugin.stopReception(function (result) {}, function (error) {});
                }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }

        // FIRST API
        $scope.phoneSubmit = function () {
            $scope.startloading();
            MyServices.register($scope.personal, function (data) {
                console.log(data);
                if (data.value !== false) {
                    $ionicSlideBoxDelegate.next();
                    // $scope.personal.otp = data.data.otp;
                    // $scope.checkotp();
                    // readSMS();
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'INCORRECT DATA',
                        template: 'Incorrect number'
                    });
                }
                $ionicLoading.hide();
            });
        };

        // SECOND API FOR OTP
        $scope.checkotp = function () {
            $scope.startloading();
            MyServices.verifyOTP($scope.personal, function (data, status) {
                if (data.value === true) {
                    $state.go("profile.mycard");
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'INCORRECT OTP',
                        template: 'Please enter the correct OTP'
                    });
                }
                $ionicLoading.hide();
            });
        };

        MyServices.getProfile(function (data, status) {
            console.log(data);
            if (data.value !== false) {
                $state.go('tab.spingbook');
            }
        });

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
                $scope.phoneSubmit();
                console.log('OTP Resent !');
            });
        };
    })
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        // $ionicModal.fromTemplateUrl('templates/login.html', {
        //   scope: $scope
        // }).then(function(modal) {
        //   $scope.modal = modal;
        // });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

.controller('ProfileCtrl', function ($scope, $ionicLoading, MyServices, $location, $ionicPopup, $state, $cordovaImagePicker, $cordovaFileTransfer, $cordovaDatePicker, $filter) {
    $scope.mycard = {};
    $scope.officeAddress = {};
    $scope.contactDetails = {};
    $scope.residentialAddress = {};
    $scope.contactPersonalDetails = {};
    $scope.personal = {};
    $scope.overAllProfile = {};
    $scope.userid = {};

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    $scope.startloading();
    MyServices.getUserDetails(function (data, status) {
        console.log(data);
        if (data.value === false) {
            $state.go('enter');
        } else {
            $.jStorage.set("id", data.data._id);
            console.log($.jStorage.get("id"));
            delete data.data._id;
            console.log(data.data._id);

            $scope.mycard = data.data;
            $scope.personal = data.data;
            $scope.mycard.contactDetails.mobileNumber = data.data.contact;
            $.jStorage.set("mobilenumber", data.data.contact);
            $scope.mycard.contactPersonalDetails.mobileNumber = data.data.contact;
            if (data.data && data.data.birthDate) {
                $scope.personal.birthDate = $filter('date')(data.data.birthDate, 'MM/dd/yyyy');
            }
            if (data.data && data.data.anniversary) {
                $scope.personal.anniversary = $filter('date')(data.data.anniversary, 'MM/dd/yyyy');
            }
        }
        $ionicLoading.hide();
    });

    $scope.submitMyCard = function () {
        MyServices.saveUser($scope.mycard, function (data, status) {
            console.log(data);
            if (data.value === true) {
                $ionicLoading.hide();
                $state.go("profile.personal");
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Oops!',
                    template: 'Something went wrong'
                });
            }
        });
    };
    $scope.contacts = contacts;
    $scope.total = {};
    $scope.total.myContacts = 0;
    $scope.total.spingrContacts = 0;
    var myconarr = [];

    // $scope.startloading = function() {
    //     $ionicLoading.show({
    //         template: '<ion-spinner class="spinner-light"></ion-spinner>'
    //     });
    // };
    //
    $scope.startloading();
    if (!$.jStorage.get("contactSynced") || $.jStorage.get("contactSynced") === false) {
        console.log("loading");

        // var options = new ContactFindOptions();
        // options.multiple = true;
        // options.hasPhoneNumber = true;
        // var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.organizations, navigator.contacts.fieldType.photos];
        // navigator.contacts.find(fields, function(contacts) {
        //     if (contacts) {
        //       console.log("loading1");
        //
        //         _.each(contacts, function(z) {
        //             var myval = {
        //                 name: "",
        //                 contactDetails: {
        //                     email: ""
        //                 },
        //                 contact: "",
        //                 profilePicture: "",
        //             };
        //             if (z.phoneNumbers && z.name && z.name.formatted && z.name.formatted !== "") {
        //                 if (z.emails) {
        //                     myval.contactDetails.email = z.emails[0].value;
        //                 }
        //                 if (z.name.formatted) {
        //                     myval.name = z.name.formatted;
        //                     myval.name = myval.name.replace(/['"]/g, '');
        //                     myval.name = myval.name.trim();
        //                 } else {
        //                     myval.name = z.displayName;
        //                     myval.name = myval.name.trim();
        //                 }
        //                 if (z.photos) {
        //                     myval.profilePicture = z.photos[0].value;
        //                 }
        //                 if (z.phoneNumbers) {
        //                     _.each(z.phoneNumbers, function(n) {
        //                         myval.contact = n.value;
        //                         myval.contact = myval.contact.replace(/[ -]/g, '');
        //                         myval.contact = myval.contact.replace(/[']/g, '');
        //                         myval.contact = myval.contact.trim();
        //                         myval.contact = myval.contact.split(" ").join('');
        //                         if (myval.contact.length > 10) {
        //                             myval.contact = myval.contact.substring(myval.contact.length - 10);
        //                         }
        //                         if (myval.name != "Identified As Spam") {
        //                             myconarr.push(_.cloneDeep(myval));
        //                         }
        //                     });
        //                 }
        //             }
        //         });
        //         myconarr = _.uniq(myconarr, 'contact');
        //         $scope.total.myContacts = myconarr.length;
        //         saveContacts(myconarr);
        //     }
        // }, function(contactError) {
        //     $ionicLoading.hide();
        //     console.log(contactError);
        // }, options);
    } else {
        console.log("loading2");

        MyServices.getSpingrContacts(function (data) {
            console.log(data);
            if (data.value !== false) {
                $scope.total.spingrContacts = data.data.length;
                $scope.spingrContacts = data.data;
                _.each(data.data, function (n) {
                    n.share = true;
                });
            } else if (data.value === false && data.data && data.data.length === 0) {
                $scope.spingrContacts = [];
                // $state.go('profileget');
            }
            $ionicLoading.hide();
        });
    }

    function saveContacts(contacts) {
        MyServices.saveContacts(contacts, function (data) {
            $ionicLoading.hide();
            console.log(data);
            if (data.value) {
                // $.jStorage.set("contactSaved", data.data);
                $.jStorage.set("myContacts", data.data);
                $.jStorage.set("contactSynced", true);
                console.log("All contacts: " + $.jStorage.get("myContacts"));
                $scope.total.spingrContacts = data.data.length;
                $scope.spingrContacts = data.data;
                _.each(data.data, function (n) {
                    n.share = true;
                });
            } else if (data.value === false && data.data && data.data.length === 0) {
                $.jStorage.set("contactSynced", true);
                $scope.spingrContacts = [];
                // $state.go('profileget');
            }
        });
    }

    // saveContacts([{
    //     "contact": "9029145077",
    //     "contactDetails": {
    //         "email": "dhaval@wohlig.com"
    //     },
    //     "name": "Dhaval Gala",
    //     "profilePicture": ""
    // }]);

    function shareContacts() {
        console.log("loading3");

        var shareArr = [];
        _.each($scope.spingrContacts, function (n) {
            if (n.share === true) {
                shareArr.push(n.user);
                console.log("loading8");

            }
        });
        console.log(shareArr);
        if (shareArr.length > 0) {
            MyServices.sendNotification(shareArr, function (data) {
                console.log(data);
                if (data.value !== false) {
                    $state.go('tab.spingbook');
                    console.log("loading9");
                }
            });
        } else {
            $state.go('tab.spingbook');
        }
    }

    $scope.personalDetails = function () {
        MyServices.saveUser($scope.personal, function (data, status) {
            console.log("second submitted");
            console.log(data);
            if (data.value === true) {
                console.log("loading4");

                $ionicLoading.hide();
                if (!$.jStorage.get('toSpingbook') || $.jStorage.get('toSpingbook') === false) {
                    // console.log("loading5");
                    $state.go('tab.spingbook');
                    // shareContacts();
                } else {
                    $.jStorage.set('toSpingbook', false);
                    $state.go('tab.spingbook');
                    console.log("loading6");
                }
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Oops!',
                    template: 'Something went wrong'
                });
            }
        });
    };

    var options = {
        maximumImagesCount: 1,
        quality: 100
    };

    $scope.uploadProfilePic = function () {
        $cordovaImagePicker.getPictures(options).then(function (resultImage) {
            // Success! Image data is here
            console.log(resultImage);
            $scope.imagetobeup = resultImage[0];
            $scope.uploadPhoto(adminurl + "upload/", function (data) {
                console.log(data);
                console.log(JSON.parse(data.response));
                var parsedImage = JSON.parse(data.response);
                $scope.personal.profilePicture = parsedImage.data[0];
            });
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

    $scope.uploadCompanyLogo = function () {
        $cordovaImagePicker.getPictures(options).then(function (resultImage) {
            // Success! Image data is here
            console.log(resultImage);
            $scope.imagetobeup = resultImage[0];
            $scope.uploadPhoto(adminurl + "upload/", function (data) {
                console.log(data);
                console.log(JSON.parse(data.response));
                var parsedImage = JSON.parse(data.response);
                $scope.mycard.companyLogo = parsedImage.data[0];
            });
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

    $scope.uploadPhoto = function (serverpath, callback) {
        console.log("function called");
        if ($scope.imagetobeup) {
            $scope.startloading();
        }
        $cordovaFileTransfer.upload(serverpath, $scope.imagetobeup, options)
            .then(function (result) {
                console.log(result);
                callback(result);
                $ionicLoading.hide();
                //$scope.addretailer.store_image = $scope.filename2;
            }, function (err) {
                // Error
                console.log(err);
            }, function (progress) {
                // constant progress updates
            });
    };
    var newDate = new Date();
    $scope.maxAllowedDate = $filter('date')(newDate, 'yyyy-MM-dd');
    console.log($scope.maxAllowedDate);

    // $scope.changeFormatA = function() {
    //     if ($scope.personal && $scope.personal.anniversary) {
    //         $scope.personal.anniversary = $filter('date')($scope.personal.anniversary, 'dd-MM-yyyy');
    //     }
    // }
    //
    // $scope.changeFormatB = function() {
    //     if ($scope.personal && $scope.personal.birthDate) {
    //         $scope.personal.birthDate = $filter('date')($scope.personal.birthDate, 'dd-MM-yyyy');
    //     }
    // }

})

.controller('Circle1Ctrl', function ($scope, $ionicLoading, MyServices) {})

.controller('Circle2Ctrl', function ($scope, $ionicLoading, MyServices) {})

.controller('Circle3Ctrl', function ($scope, $ionicLoading, MyServices) {})

.controller('TabCtrl', function ($scope, $location, $ionicLoading, MyServices) {

    })
    .controller('SpingbookDetailNewCtrl', function ($scope, $location, $ionicLoading, MyServices, $ionicHistory) {
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };
    })
    .controller('Spingbook1Ctrl', function ($scope, $location, $ionicLoading, MyServices) {
        $scope.user = [{
            name: "Amit Shah",
            company: "img/snapdeal.png",
            designation: "Marketing Manager",
            email: "sping@app.com",
            image: "img/a.png",
            phone: "9876543210"

        }, {
            name: "Priya Mishra",
            company: "img/snapdeal.png",
            designation: "Sales Manager",
            email: "sping@app.com",
            image: "img/b.png",
            phone: "9876543210"

        }, {
            name: "Sudip Singh",
            company: "img/snapdeal.png",
            designation: "Marketing Manager",
            email: "sping@app.com",
            image: "img/c.png",
            phone: "9876543210"

        }, {
            name: "Raj Mahajan",
            company: "img/snapdeal.png",
            designation: "Sales Manager",
            email: "sping@app.com",
            image: "img/d.png",
            phone: "9876543210"

        }];
    })

.controller('ProfileShareCtrl', function ($scope, MyServices, $ionicLoading, $state) {

    $scope.contacts = contacts;
    $scope.total = {};
    $scope.total.myContacts = 0;
    $scope.total.spingrContacts = 0;
    var myconarr = [];

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    $scope.startloading();
    if (!$.jStorage.get("contactSynced") || $.jStorage.get("contactSynced") === false) {
        console.log("share1");
        //
        // var options = new ContactFindOptions();
        // options.multiple = true;
        // options.hasPhoneNumber = true;
        // var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.organizations, navigator.contacts.fieldType.photos];
        // navigator.contacts.find(fields, function(contacts) {
        //     if (contacts) {
        //       console.log("share2");
        //
        //         _.each(contacts, function(z) {
        //             var myval = {
        //
        //                 name: "",
        //                 contactDetails: {
        //                     email: ""
        //                 },
        //                 contact: "",
        //                 profilePicture: "",
        //             };
        //             if (z.phoneNumbers && z.name && z.name.formatted && z.name.formatted !== "") {
        //                 if (z.emails) {
        //                      myval.name = myval.name.replace(/['"]/g, '');
        //                      myval.name = myval.name.replace(/['"]/g, '');
        //                     myval.name = myval.name.trim();
        //                 } else {
        //                     myval.name = z.displayName;
        //                     myval.name = myval.name.trim();
        //                 }
        //                 if (z.photos) {
        //                     myval.profilePicture = z.photos[0].value;
        //                 }
        //                 if (z.phoneNumbers) {
        //                     _.each(z.phoneNumbers, function(n) {
        //                         myval.contact = n.value;
        //                         myval.contact = myval.contact.replace(/[ -]/g, '');
        //                         myval.contact = myval.contact.replace(/[']/g, '');
        //                         myval.contact = myval.contact.trim();
        //                         myval.contact = myval.contact.split(" ").join('');
        //                         if (myval.contact.length > 10) {
        //                             myval.contact = myval.contact.substring(myval.contact.length - 10);
        //                         }
        //                         if (myval.name != "Identified As Spam") {
        //                             myconarr.push(_.cloneDeep(myval));
        //                         }
        //                     });
        //                 }
        //             }
        //         });
        //         console.log("share6");
        //
        //         myconarr = _.uniq(myconarr, 'contact');
        //         $scope.total.myContacts = myconarr.length;
        //         saveContacts(myconarr);
        //     }
        // }, function(contactError) {
        //     $ionicLoading.hide();
        //     console.log(contactError);
        // }, options);
    } else {
        console.log("share4");

        MyServices.getSpingrContacts(function (data) {
            console.log(data);
            if (data.value !== false) {
                $scope.total.spingrContacts = data.data.length;
                $scope.spingrContacts = data.data;
                _.each(data.data, function (n) {
                    n.share = true;
                });
            } else if (data.value === false && data.data && data.data.length === 0) {
                $scope.spingrContacts = [];
                // $state.go('profileget');
            }
            $ionicLoading.hide();
        });
    }

    function saveContacts(contacts) {
        console.log("share5");

        MyServices.saveContacts(contacts, function (data) {
            $ionicLoading.hide();
            console.log(data);
            if (data.value !== false) {
                console.log("share7");

                $.jStorage.set("contactSynced", true);
                $scope.total.spingrContacts = data.data.length;
                $scope.spingrContacts = data.data;
                _.each(data.data, function (n) {
                    n.share = true;
                });
            } else if (data.value === false && data.data && data.data.length === 0) {
                $.jStorage.set("contactSynced", true);
                $scope.spingrContacts = [];
                // $state.go('profileget');
            }
        });
    }

    // saveContacts([{
    //     "contact": "9029145077",
    //     "contactDetails": {
    //         "email": "dhaval@wohlig.com"
    //     },
    //     "name": "Dhaval Gala",
    //     "profilePicture": ""
    // }]);

    $scope.shareContacts = function () {
        var shareArr = [];
        _.each($scope.spingrContacts, function (n) {
            console.log("share8");

            if (n.share === true) {
                console.log("share9");

                shareArr.push(n.user);
            }
        });
        console.log(shareArr);
        if (shareArr.length > 0) {
            console.log("share10");

            MyServices.sendNotification(shareArr, function (data) {
                console.log(data);
                if (data.value !== false) {
                    console.log("share11");

                    $state.go('profileget');
                }
            });
        } else {
            $state.go('profileget');
        }
    };

})

.controller('ProfileGetCtrl', function ($scope, MyServices, $ionicLoading, $state) {
    // $scope.contacts = MyServices.all();

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    MyServices.getMyRequests(function (data) {
        console.log(data);
        if (data.value !== false) {
            $scope.myRequests = data.data;
            if ($scope.myRequests.length === 0) {
                $scope.myRequests = [];
                // $state.go('tab.spingbook');
            }
        }
        $ionicLoading.hide();
    });

    $scope.addContact = function (contact, $index) {
        $scope.startloading();
        var obj = {};
        obj._id = contact._id;
        obj.user = contact.from._id;
        obj.name = contact.from.name;
        obj.contact = contact.from.contact;
        MyServices.acceptShare(obj, function (data) {
            console.log(data);
            if (data.value !== false) {
                $scope.myRequests.splice($index, 1);
                if ($scope.myRequests.length === 0) {
                    $state.go('tab.spingbook');
                }
            }
            $ionicLoading.hide();
        });
    };

    $scope.addShareContact = function (contact, $index) {
        $scope.startloading();
        var obj = {};
        obj._id = contact._id;
        obj.user = contact.from._id;
        obj.name = contact.from.name;
        obj.contact = contact.from.contact;
        MyServices.addAndShare(obj, function (data) {
            console.log(data);
            if (data.value !== false) {
                $scope.myRequests.splice($index, 1);
                if ($scope.myRequests.length === 0) {
                    $state.go('tab.spingbook');
                }
            }
            $ionicLoading.hide();
        });
    };

})

.controller('DashCtrl', function ($scope, $ionicLoading, MyServices) {})

.controller('ChatsCtrl', function ($scope, $ionicLoading, MyServices) {})

.controller('SpingbookCtrl', function ($scope, MyServices, $ionicPopover, $ionicModal, $location, $ionicLoading, $filter, $state, $ionicScrollDelegate, $cordovaInAppBrowser) {
    $scope.user = [{
        name: "Amit Shah",
        company: "img/snapdeal.png",
        designation: "Marketing Manager",
        email: "sping@app.com",
        image: "img/a.png",
        phone: "9876543210",
        index: "1"

    }, {
        name: "Priya Mishra",
        company: "img/snapdeal.png",
        designation: "Sales Manager",
        email: "sping@app.com",
        image: "img/b.png",
        phone: "9876543210",
        index: "2"

    }, {
        name: "Sudip Singh",
        company: "img/snapdeal.png",
        designation: "Marketing Manager",
        email: "sping@app.com",
        image: "img/c.png",
        phone: "9876543210",
        index: "3"

    }, {
        name: "Raj Mahajan",
        company: "img/snapdeal.png",
        designation: "Sales Manager",
        email: "sping@app.com",
        image: "img/d.png",
        phone: "9876543210",
        index: "4"


    }];
    $scope.openCard = false;
    $scope.toggleSpingrCard = function (index) {
        $scope.openCardNo = index;
        $scope.openCard = !$scope.openCard;
    };

    $scope.profileDetail = -1;
    $scope.openprofile = function (index) {
        console.log(index);
        if ($scope.profileDetail !== index) {
            $scope.profileDetail = index;
        } else {
            $scope.card = "";
            $scope.profileDetail = -1;
        }
    };

    $scope.search = false;
    $scope.filterbtn = false;
    $scope.searchquery = {};
    $scope.searchquery.user = {};

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    $scope.nameSearch = function () {
        console.log("here", $scope.searchquery);
        $scope.phone.number = '';
        $scope.searchquery.user.contact = '';
        $ionicScrollDelegate.scrollTop();
    };

    $scope.startsWith = function (actual, expected) {
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
    };

    $scope.contact = {};
    $scope.contact.height = 100;
    var cheight = 140;
    var last_expanded = {},
        last_index = -1;

    $scope.toggleHeight = function (contact) {
        contact.height = contact.height === cheight ? 190 : cheight;
        if (last_expanded) {
            last_expanded.height = cheight;
        }
        last_expanded = contact.height === cheight ? {} : contact;
        $ionicScrollDelegate.resize();
    };

    if ($.jStorage.get("myContacts")) {
        $scope.myContacts = $.jStorage.get("myContacts");
        $scope.myContacts = $.jStorage.get("myContacts").map(function (contact) {
            contact.height = cheight;
            return contact;
        });
        $ionicLoading.hide();
    } else {
        MyServices.getContacts(function (data) {
            $state.reload();
            console.log('Get Contacts');
            console.log(data);
            if (data.value) {
                console.log("in conatcts got all ");
                $scope.myContacts = data.data;
                $.jStorage.set("myContacts", $scope.myContacts);
                $scope.myContacts = data.data.map(function (contact) {
                    contact.height = cheight;
                    return contact;
                });
            } else if (data.value === false && data.data === "User not logged in") {
                console.log("in conatcts nothing");
                $state.go('enter');
            }
            $ionicLoading.hide();
        });
    }

    $scope.goToMyCard = function () {
        $.jStorage.set('toSpingbook', true);
        $scope.closePopover();
        $state.go('profile.mycard');
    };

    $scope.goToDetail = function (contact) {
        console.log(contact);
        var id = 0;
        if (contact.request && contact.accepted) {
            id = 1;
        } else if (contact.request) {
            id = 2;
        }
        $state.go("tab.spingbook-detail", {
            id: contact.user._id,
            show: id
        });
    };

    $scope.showsearch = function () {
        console.log('Search Clicked');
        $scope.search = !$scope.search;
        if ($scope.search) {
            setTimeout(function () {
                document.getElementById("focusme").focus();
            }, 500);
        }
    };

    $scope.filtertoggle = function (keyEvent) {
        if (keyEvent.which === 13) {
            console.log('Filter Enter Clicked');
            $scope.filterbtn = true;
        } else {
            $scope.filterbtn = false;
        }
    };

    // $scope.contacts = MyServices.all();
    $scope.showdailer = false;
    $scope.hidedialer = function () {
        $scope.showdailer = false;
        console.log('Dialer Hidden');
    };
    $scope.call = function (number) {
        // phonedialer.dial(
        //     number,
        //     function(err) {
        //         if (err == "empty") console.log("Unknown phone number");
        //         else console.log("Dialer Error:" + err);
        //     },
        //     function(success) {
        //         console.log('Dialing succeeded');
        //     }
        // );
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
        $scope.searchquery.$ = '';
        $scope.searchquery.user.contact = $scope.phone.number;
        $ionicScrollDelegate.scrollTop();
    };
    $scope.phoneback = function () {
        $scope.phone.number = $scope.phone.number.slice(0, -1);
        $scope.searchquery.$ = '';
        $scope.searchquery.user.contact = $scope.phone.number;
    };

    $scope.phonedelete = function () {
        $scope.phone.number = "";
        $scope.searchquery.user.contact = $scope.phone.number;
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
    };
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
        $scope.closePopover();
        $scope.oModal2.show();
    };
    $scope.closeadvance = function () {
        $scope.oModal2.hide();
    };

    $scope.searchpage = function () {
        $location.url('/circle/circle1');
        console.log('searchpage');
    };

    $scope.spingpage = function () {
        $location.url('/tab/spingbook');
        console.log('spingpage');
    };

    $scope.clearAdvance = function () {
        $scope.searchquery = {};
        $scope.searchquery.user = {};
        $scope.closeadvance();
    };

    $scope.openInBrowser = function (link) {
        console.log(link);
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };

        $cordovaInAppBrowser.open(link, '_blank', options)
            .then(function (event) {
                // success
            })
            .catch(function (event) {
                // error
            });
    };

})

.controller('InSpingbookCtrl', function ($scope, MyServices, $stateParams, $ionicLoading, $ionicPlatform, $state, $ionicHistory) {
    // $scope.contact = MyServices.get($stateParams.Id);
    console.log($state.current.name);
    $ionicPlatform.registerBackButtonAction(function (e) {
        if ($state.current.name == "tab.spingbook-detail") {
            $ionicHistory.goBack();
        } else {
            e.preventDefault();
        }
    }, 100);

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    MyServices.getDetail($stateParams.id, function (data) {
        console.log(data);
        if (data.value !== false)
            $scope.contactDetail = data.data;
        $ionicLoading.hide();
    });
})

.controller('NewsCtrl', function ($scope, $ionicLoading, MyServices) {

    $scope.startloading = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    function getNewsLetter() {
        $scope.startloading();
        MyServices.getNewsLetter(function (data) {
            console.log(data);
            if (data.value !== false) {
                $scope.newsLetter = data.data;
            }
            $ionicLoading.hide();
        });
    }
    getNewsLetter();

    $scope.addContact = function (contact, $index) {
        $scope.startloading();
        var obj = {};
        obj._id = contact._id;
        obj.user = contact.obj._id;
        obj.name = contact.obj.name;
        obj.contact = contact.obj.contact;
        MyServices.acceptShare(obj, function (data) {
            console.log(data);
            if (data.value !== false) {
                getNewsLetter();
            }
            $ionicLoading.hide();
        });
    };

    $scope.addShareContact = function (contact, $index) {
        $scope.startloading();
        var obj = {};
        obj._id = contact._id;
        obj.user = contact.obj._id;
        obj.name = contact.obj.name;
        obj.contact = contact.obj.contact;
        MyServices.addAndShare(obj, function (data) {
            console.log(data);
            if (data.value !== false) {
                getNewsLetter();
            }
            $ionicLoading.hide();
        });
    };

    $scope.settings = {
        enableNews: true
    };
});