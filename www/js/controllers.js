angular.module('starter.controllers', ['ngCordova'])

.controller('EnterCtrl', function($scope, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, MyServices, $state) {

    $scope.personal = {};
    $scope.verify = {};

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    $scope.disableSwipe = function() {
        $ionicSlideBoxDelegate.enableSlide(false);
    }

    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    function readSMS() {
        if (smsplugin) {
            smsplugin.startReception(function(data) {
                console.log(data);
                $scope.personal.otp = data.substring(data.length - 4, data.length);
                console.log($scope.personal.otp);
                $scope.checkotp();
                smsplugin.stopReception(function(result) {}, function(error) {});
            }, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    // FIRST API
    $scope.phoneSubmit = function() {
        $scope.startloading();
        MyServices.register($scope.personal, function(data) {
            console.log(data);
            if (data.value != false) {
                $ionicSlideBoxDelegate.next();
                $scope.personal.otp = data.data.otp;
                $scope.checkotp();
                // readSMS();
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'INCORRECT DATA',
                    template: 'Incorrect number'
                });
            }
            $ionicLoading.hide();
        })
    };

    // SECOND API FOR OTP
    $scope.checkotp = function() {
        $scope.startloading();
        MyServices.verifyOTP($scope.personal, function(data, status) {
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

    MyServices.getProfile(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $state.go('tab.spingbook');
        }
    });

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: "Didn't get the OTP ?",
            template: 'Please try resending the OTP.',
            buttons: [{
                text: 'Resend',
                type: 'button-positive button-outline'
            }],
        });
        alertPopup.then(function(res) {
            $scope.phoneSubmit();
            console.log('OTP Resent !');
        });
    };
})

.controller('ProfileCtrl', function($scope, $ionicLoading, MyServices, $location, $ionicPopup, $state, $cordovaImagePicker, $cordovaFileTransfer, $cordovaDatePicker, $filter) {
    $scope.mycard = {};
    $scope.officeAddress = {};
    $scope.contactDetails = {};
    $scope.residentialAddress = {};
    $scope.contactPersonalDetails = {};
    $scope.personal = {};
    $scope.overAllProfile = {};
    $scope.userid = {};

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    $scope.startloading();
    MyServices.getUserDetails(function(data, status) {
        console.log(data);
        if (data.value === false) {
            $statxe.go('enter');
        } else {
            delete data.data._id;
            $scope.mycard = data.data;
            $scope.personal = data.data;
            $scope.mycard.contactDetails.mobileNumber = data.data.contact;
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

    $scope.submitMyCard = function() {
        MyServices.saveUser($scope.mycard, function(data, status) {
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

    $scope.personalDetails = function() {
        MyServices.saveUser($scope.personal, function(data, status) {
            console.log("second submitted");
            console.log(data);
            if (data.value === true) {
                $ionicLoading.hide();
                if (!$.jStorage.get('toSpingbook') || $.jStorage.get('toSpingbook') == false) {
                    $state.go('sharewith');
                } else {
                    $.jStorage.set('toSpingbook', false);
                    $state.go('tab.spingbook');
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

    $scope.uploadProfilePic = function() {
        $cordovaImagePicker.getPictures(options).then(function(resultImage) {
            // Success! Image data is here
            console.log(resultImage);
            $scope.imagetobeup = resultImage[0];
            $scope.uploadPhoto(adminurl + "upload/", function(data) {
                console.log(data);
                console.log(JSON.parse(data.response));
                var parsedImage = JSON.parse(data.response);
                $scope.personal.profilePicture = parsedImage.data[0];
            });
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

    $scope.uploadCompanyLogo = function() {
        $cordovaImagePicker.getPictures(options).then(function(resultImage) {
            // Success! Image data is here
            console.log(resultImage);
            $scope.imagetobeup = resultImage[0];
            $scope.uploadPhoto(adminurl + "upload/", function(data) {
                console.log(data);
                console.log(JSON.parse(data.response));
                var parsedImage = JSON.parse(data.response);
                $scope.mycard.companyLogo = parsedImage.data[0];
            });
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

    $scope.uploadPhoto = function(serverpath, callback) {
        console.log("function called");
        if ($scope.imagetobeup) {
            $scope.startloading();
        }
        $cordovaFileTransfer.upload(serverpath, $scope.imagetobeup, options)
            .then(function(result) {
                console.log(result);
                callback(result);
                $ionicLoading.hide();
                //$scope.addretailer.store_image = $scope.filename2;
            }, function(err) {
                // Error
                console.log(err);
            }, function(progress) {
                // constant progress updates
            });
    };
    var newDate = new Date()
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

.controller('Circle1Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('Circle2Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('Circle3Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('TabCtrl', function($scope, $location, $ionicLoading, MyServices) {

})

.controller('ProfileShareCtrl', function($scope, MyServices, $ionicLoading, $state) {

    $scope.contacts = contacts;
    $scope.total = {};
    $scope.total.myContacts = 0;
    $scope.total.spingrContacts = 0;
    var myconarr = [];

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    $scope.startloading();
    if (!$.jStorage.get("contactSynced") || $.jStorage.get("contactSynced") == false) {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.hasPhoneNumber = true;
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.organizations, navigator.contacts.fieldType.photos];
        navigator.contacts.find(fields, function(contacts) {
            if (contacts) {
                _.each(contacts, function(z) {
                    var myval = {
                        name: "",
                        contactDetails: {
                            email: ""
                        },
                        contact: "",
                        profilePicture: "",
                    };
                    if (z.phoneNumbers && z.name && z.name.formatted && z.name.formatted != "") {
                        if (z.emails) {
                            myval.contactDetails.email = z.emails[0].value;
                        }
                        if (z.name.formatted) {
                            myval.name = z.name.formatted;
                            myval.name = myval.name.replace(/['"]/g, '');
                            myval.name = myval.name.trim();
                        } else {
                            myval.name = z.displayName;
                            myval.name = myval.name.trim();
                        }
                        if (z.photos) {
                            myval.profilePicture = z.photos[0].value;
                        }
                        if (z.phoneNumbers) {
                            _.each(z.phoneNumbers, function(n) {
                                myval.contact = n.value;
                                myval.contact = myval.contact.replace(/[ -]/g, '');
                                myval.contact = myval.contact.replace(/[']/g, '');
                                myval.contact = myval.contact.trim();
                                myval.contact = myval.contact.split(" ").join('');
                                if (myval.contact.length > 10)
                                    myval.contact = myval.contact.substring(myval.contact.length - 10);
                                myconarr.push(_.cloneDeep(myval));
                            });
                        }
                    }
                })
                myconarr = _.uniq(myconarr, 'contact');
                $scope.total.myContacts = myconarr.length;
                saveContacts(myconarr)
            }
        }, function(contactError) {
            $ionicLoading.hide();
            console.log(contactError);
        }, options);
    } else {
        MyServices.getSpingrContacts(function(data) {
            console.log(data);
            if (data.value != false) {
                $scope.total.spingrContacts = data.data.length;
                $scope.spingrContacts = data.data;
                _.each(data.data, function(n) {
                    n.share = true;
                });
            } else if (data.value == false && data.data && data.data.length == 0) {
                $scope.spingrContacts = [];
                // $state.go('profileget');
            }
            $ionicLoading.hide();
        })
    }

    function saveContacts(contacts) {
        MyServices.saveContacts(contacts, function(data) {
            $ionicLoading.hide();
            console.log(data);
            if (data.value != false) {
                $.jStorage.set("contactSynced", true);
                $scope.total.spingrContacts = data.data.length;
                $scope.spingrContacts = data.data;
                _.each(data.data, function(n) {
                    n.share = true;
                });
            } else if (data.value == false && data.data && data.data.length == 0) {
                $.jStorage.set("contactSynced", true);
                $scope.spingrContacts = [];
                // $state.go('profileget');
            }
        })
    }

    // saveContacts([{
    //     "contact": "9029145077",
    //     "contactDetails": {
    //         "email": "dhaval@wohlig.com"
    //     },
    //     "name": "Dhaval Gala",
    //     "profilePicture": ""
    // }]);

    $scope.shareContacts = function() {
        var shareArr = [];
        _.each($scope.spingrContacts, function(n) {
            if (n.share == true) {
                shareArr.push(n.user);
            }
        })
        console.log(shareArr);
        if (shareArr.length > 0) {
            MyServices.sendNotification(shareArr, function(data) {
                console.log(data);
                if (data.value != false) {
                    $state.go('profileget');
                }
            });
        } else {
            $state.go('profileget');
        }
    }

})

.controller('ProfileGetCtrl', function($scope, MyServices, $ionicLoading, $state) {
    // $scope.contacts = MyServices.all();

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    MyServices.getMyRequests(function(data) {
        console.log(data);
        if (data.value != false) {
            $scope.myRequests = data.data;
            if ($scope.myRequests.length == 0) {
                $scope.myRequests = [];
                // $state.go('tab.spingbook');
            }
        }
        $ionicLoading.hide();
    })

    $scope.addContact = function(contact, $index) {
        $scope.startloading();
        var obj = {};
        obj._id = contact._id;
        obj.user = contact.from._id;
        obj.name = contact.from.name;
        obj.contact = contact.from.contact;
        MyServices.acceptShare(obj, function(data) {
            console.log(data);
            if (data.value != false) {
                $scope.myRequests.splice($index, 1);
                if ($scope.myRequests.length == 0) {
                    $state.go('tab.spingbook');
                }
            }
            $ionicLoading.hide();
        });
    }

})

.controller('DashCtrl', function($scope, $ionicLoading, MyServices) {})

.controller('ChatsCtrl', function($scope, $ionicLoading, MyServices) {})

.controller('SpingbookCtrl', function($scope, MyServices, $ionicPopover, $ionicModal, $location, $ionicLoading, $filter, $state) {

    $scope.search = false;
    $scope.filterbtn = false;
    $scope.searchquery = {};
    $scope.searchquery.user = {};

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    $scope.nameSearch = function() {
        console.log("here", $scope.searchquery.search);
        $scope.phone.number = '';
        $scope.searchquery.user.contact = '';
    }

    MyServices.getContacts(function(data) {
        console.log(data);
        if (data.value != false) {
            $scope.myContacts = data.data;
        } else if (data.value == false && data.data == "User not logged in") {
            $state.go('enter');
        }
        $ionicLoading.hide();
    });

    $scope.goToMyCard = function() {
        $.jStorage.set('toSpingbook', true);
        $scope.closePopover();
        $state.go('profile.mycard');
    }

    $scope.showsearch = function() {
        console.log('Search Clicked');
        $scope.search = !$scope.search;
        if ($scope.search) {
            setTimeout(function() {
                document.getElementById("focusme").focus();
            }, 500);
        }
    };

    $scope.filtertoggle = function(keyEvent) {
        if (keyEvent.which === 13) {
            console.log('Filter Enter Clicked');
            $scope.filterbtn = true;
        } else {
            $scope.filterbtn = false;
        }
    };

    // $scope.contacts = MyServices.all();
    $scope.showdailer = false;
    $scope.hidedialer = function() {
        $scope.showdailer = false;
        console.log('Dialer Hidden');
    };
    $scope.call = function(number) {
        phonedialer.dial(
            number,
            function(err) {
                if (err == "empty") console.log("Unknown phone number");
                else console.log("Dialer Error:" + err);
            },
            function(success) {
                console.log('Dialing succeeded');
            }
        );
        //document.location.href = "tel:" + number;
        console.log('Calling');
    };
    $scope.sms = function(number) {
        document.location.href = "sms:" + number;
        console.log('SMS');
    };
    $scope.mail = function(email) {
        document.location.href = "mailto:" + email;
        console.log('Mail');
    };
    $scope.phone = {};
    $scope.phone.number = "";

    $scope.phonenum = function(number) {
        console.log("number presses " + number);
        $scope.phone.number += "" + number;
        $scope.searchquery.$ = '';
        $scope.searchquery.user.contact = $scope.phone.number;
    };
    $scope.phoneback = function() {
        $scope.phone.number = $scope.phone.number.slice(0, -1);
        $scope.searchquery.$ = '';
        $scope.searchquery.user.contact = $scope.phone.number;
    };

    $scope.phonedelete = function() {
        $scope.phone.number = "";
        $scope.searchquery.user.contact = $scope.phone.number;
    };


    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });


    //Filter Modal
    $ionicModal.fromTemplateUrl('templates/modal-filter.html', {
        id: '1',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal1 = modal;
    });

    $scope.openfilter = function() {
        $scope.oModal1.show();
    }
    $scope.closefilter = function() {
        $scope.oModal1.hide();
    };

    //Advanced Search Modal
    $ionicModal.fromTemplateUrl('templates/modal-advanced.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal2 = modal;
    });

    $scope.openadvance = function() {
        $scope.closePopover();
        $scope.oModal2.show();
    }
    $scope.closeadvance = function() {
        $scope.oModal2.hide();
    };

    $scope.searchpage = function() {
        $location.url('/circle/circle1');
        console.log('searchpage');
    }

    $scope.spingpage = function() {
        $location.url('/tab/spingbook');
        console.log('spingpage');
    }

    $scope.clearAdvance = function() {
        $scope.searchquery = {};
        $scope.searchquery.user = {};
        $scope.closeadvance();
    }

})

.controller('InSpingbookCtrl', function($scope, MyServices, $stateParams, $ionicLoading, $ionicPlatform, $state, $ionicHistory) {
    // $scope.contact = MyServices.get($stateParams.Id);
    console.log($state.current.name);
    $ionicPlatform.registerBackButtonAction(function(e) {
        if ($state.current.name == "tab.spingbook-detail") {
            $ionicHistory.goBack();
        } else {
            e.preventDefault();
        }
    }, 100);

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
    $scope.startloading();

    MyServices.getDetail($stateParams.id, function(data) {
        console.log(data);
        if (data.value != false)
            $scope.contactDetail = data.data;
        $ionicLoading.hide();
    })
})

.controller('NewsCtrl', function($scope, $ionicLoading, MyServices) {

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };

    function getNewsLetter() {
        $scope.startloading();
        MyServices.getNewsLetter(function(data) {
            console.log(data);
            if (data.value != false) {
                $scope.newsLetter = data.data;
            }
            $ionicLoading.hide();
        })
    }
    getNewsLetter();

    $scope.addContact = function(contact, $index) {
        $scope.startloading();
        var obj = {};
        obj._id = contact._id;
        obj.user = contact.obj._id;
        obj.name = contact.obj.name;
        obj.contact = contact.obj.contact;
        MyServices.acceptShare(obj, function(data) {
            console.log(data);
            if (data.value != false) {
                getNewsLetter();
            }
            $ionicLoading.hide();
        });
    }

    $scope.settings = {
        enableNews: true
    };
});
