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

    // FIRST API
    $scope.phoneSubmit = function() {
        $scope.startloading();
        MyServices.register($scope.personal, function(data) {
            console.log(data);
            if (data.value != false) {
                $ionicSlideBoxDelegate.next();
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

    // function getProfile() {
    //     MyServices.getProfile(function(data, status) {
    //         console.log(data);
    //         if (data.value === true) {
    //             $location.path("/profile/mycard");
    //         } else {
    //             var alertPopup = $ionicPopup.alert({
    //                 title: 'Oops!',
    //                 template: 'Something went wrong'
    //             });
    //         }
    //     });
    // }

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
                console.log('OTP Resent !');
            }

        );
    };
})

.controller('ProfileCtrl', function($scope, $ionicLoading, MyServices, $location, $ionicPopup, $state) {
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

    MyServices.getProfile(function(data, status) {
        console.log(data);
        if (data.value === false) {
            $state.go('enter');
        } else {

        }
    });

    MyServices.getUserDetails($scope.userid, function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.mycard = data.data;
            $scope.personal = data.data;
        } else if (data.value == false && data.data == "User not logged in") {
            $state.go('enter');
        }
        $ionicLoading.hide();
    })

    $scope.submitMyCard = function() {
        console.log($scope.mycard);
        MyServices.saveUser($scope.mycard, function(data, status) {
            console.log(data);
            if (data.value === true) {
                $ionicLoading.hide();
                $location.path("/profile/personal");
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Oops!',
                    template: 'Something went wrong'
                });
            }
        });
    };

    $scope.personalDetails = function() {
        $scope.personal._id = $scope.user;
        MyServices.saveUser($scope.personal, function(data, status) {
            console.log("second submitted");
            console.log(data);
            if (data.value === true) {
                $ionicLoading.hide();
                $location.path("/profile/sharewith");
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Oops!',
                    template: 'Something went wrong'
                });
            }
        });

    };
    // GET PROFILE
})

.controller('Circle1Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('Circle2Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('Circle3Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('TabCtrl', function($scope, $location, $ionicLoading, MyServices) {

})

.controller('ProfileShareCtrl', function($scope, MyServices, $ionicLoading) {
    // $scope.contacts = MyServices.all();

    var options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;
    var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.organizations, navigator.contacts.fieldType.photos];
    navigator.contacts.find(fields, function(contacts) {
        console.log(contacts);
        if (contacts) {
            _.each(contacts, function(z) {
                var myval = {
                    name: "",
                    email: "",
                    contact: "",
                    photo: "",
                };
                if (z.phoneNumbers && z.name && z.name.formatted && z.name.formatted != "") {
                    if (z.emails) {
                        myval.email = z.emails[0].value;
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
                        myval.photo = z.photos[0].value;
                    }
                    if (z.phoneNumbers) {
                        _.each(z.phoneNumbers, function(n) {
                            myval.contact = n.value;
                            myval.contact = myval.contact.replace(/[ -]/g, '');
                            myval.contact = myval.contact.replace(/[']/g, '');
                            myconarr.push(_.cloneDeep(myval));
                        });
                    }

                }
            })
            console.log(myconarr.length);
            myconarr = _.uniq(myconarr, function(n) {
                return (n.name + "-" + n.contact);
            });
            console.log(myconarr.length);
            console.log(myconarr);
            // callback(myconarr);
        }
    }, function(contactError) {
        console.log(contactError);
    }, options);
})

.controller('ProfileGetCtrl', function($scope, MyServices, $ionicLoading) {
    $scope.contacts = MyServices.all();
})

.controller('DashCtrl', function($scope, $ionicLoading, MyServices) {})

.controller('ChatsCtrl', function($scope, $ionicLoading, MyServices) {})

.controller('SpingbookCtrl', function($scope, MyServices, $ionicPopover, $ionicModal, $location, $ionicLoading) {

    $scope.search = false;
    $scope.filterbtn = false;
    $scope.showsearch = function() {
        console.log('Search Clicked');
        $scope.search = !$scope.search;
    };

    $scope.filtertoggle = function(keyEvent) {
        if (keyEvent.which === 13) {
            console.log('Filter Enter Clicked');
            $scope.filterbtn = true;
        } else {
            $scope.filterbtn = false;
        }
    };

    $scope.contacts = MyServices.all();
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
    };
    $scope.phoneback = function() {
        $scope.phone.number = $scope.phone.number.slice(0, -1);
    };

    $scope.phonedelete = function() {
        $scope.phone.number = "";
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

})

.controller('InSpingbookCtrl', function($scope, MyServices, $stateParams, $ionicLoading) {
    $scope.contact = MyServices.get($stateParams.Id);
})

.controller('NewsCtrl', function($scope, $ionicLoading, MyServices) {
    $scope.settings = {
        enableNews: true
    };
});
