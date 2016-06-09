angular.module('starter.controllers', [])

.controller('EnterCtrl', function($scope, $ionicSlideBoxDelegate, $ionicPopup, $ionicLoading, MyServices, $location) {

    $scope.startloading = function() {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-light"></ion-spinner>'
        });
    };
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

    // SECOND API FOR OTP
    $scope.verifyOtpDetail = {};
    // var profileCallback = function(data, status) {
    //     console.log(data);
    //     if (data.value == true) {
    //         $.jStorage.set("user", data.data);
    //         $scope.verifyOtpDetail.otp = $scope.otp.number;
    //         $scope.verifyOtpDetail.contact = data.data.contact;
    //         MyServices.verifyOTP($scope.verifyOtpDetail).success(verifyCallback).error(errorCallback);
    //     } else {
    //         var alertPopup = $ionicPopup.alert({
    //             title: 'INCORRECT DATA',
    //             template: 'Incorrect number '
    //         });
    //           $ionicLoading.hide();
    //     }
    //
    // };
    var errorCallback = function() {
        console.log("In err");

        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'INCORRECT OTP',
                template: 'Please enter the correct OTP'
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

    };
    var getProfileCallback = function(data, status) {
        console.log(data);
        if (data.value === true) {
            $.jStorage.set("user", data);
            $location.path("/profile/mycard");
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Oops!',
                template: 'Something went wrong'
            });
        }

    };
    var verifyCallback = function(data, status) {
        console.log("verify");
        console.log(data);
        if (data.value === true) {
            MyServices.getProfile().success(getProfileCallback).error(errorCallback);
            $ionicLoading.hide();
            $location.path("/profile/mycard");
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'INCORRECT OTP',
                template: 'Please enter the correct OTP'
            });
        }
    };
    $scope.sendObj = {};
    $scope.checkotp = function(otp) {
        $scope.otp = otp;
        $scope.sendObj.contact = $scope.contact.contact;
        $scope.sendObj.otp = $scope.otp;
        //         $scope.startloading();
        MyServices.verifyOTP($scope.sendObj).success(verifyCallback).error(errorCallback);
        // MyServices.getProfile().success(profileCallback).error(errorCallback);

    };
    $ionicLoading.hide();

    // FIRST API
    var registerSuccess = function(data, status) {
        console.log(data);
        console.log($scope.contact.contact);
        $.jStorage.set("usercontact", $scope.contact.contact);
        if ($.jStorage.get("usercontact") !== null) {
            $ionicSlideBoxDelegate.next();
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'INCORRECT DATA',
                template: 'Incorrect number '
            });
        }
        //userid = parseInt(data.id);
        //
        // MyServices.readsms(readsmsCallback);
    };
    $scope.contact = {};
    $scope.phonesubmit = function(phoneno) {
        personalcontact = phoneno.phone;
        $scope.contact.contact = personalcontact;
        console.log($scope.contact);
        MyServices.register($scope.contact).success(registerSuccess);
    }
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

        )
    };
})

.controller('ProfileCtrl', function($scope, $ionicLoading, MyServices) {
    $scope.mycard = {};
    $scope.officeAddress = {};
    $scope.contactDetails = {};
    $scope.residentialAddress = {};
    $scope.contactPersonalDetails = {};
    $scope.personal = {};
    $scope.overAllProfile = {};
    $scope.user = $.jStorage.get("user").data._id;
    $scope.mycard._id = $scope.user;
    var errorCallback = function() {
        console.log("In err");
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Oops Sorry',
                template: 'Something went wrong!'
            });
            alertPopup.then(function(res) {});
        };
    };
    var myCardCallback = function(data, status) {
        console.log("first submitted");
        console.log(data);
        // if (data.value === true) {
        //     $ionicLoading.hide();
        //     $location.path("/profile/mycard");
        // } else {
        //     var alertPopup = $ionicPopup.alert({
        //         title: 'INCORRECT OTP',
        //         template: 'Please enter the correct OTP'
        //     });
        // }
    };
    $scope.submitMyCard = function() {
        console.log($scope.mycard);
        MyServices.saveUser($scope.mycard).success(myCardCallback).error(errorCallback);
    };
    // $scope.personalDetails = function() {
    //   console.log($scope.mycard);
    //   console.log($scope.personal);
    //   // $scope.overAllProfile = angular.extend($scope.mycard, $scope.personal);
    //   // console.log($scope.overAllProfile);
    // };

})

.controller('Circle1Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('Circle2Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('Circle3Ctrl', function($scope, $ionicLoading, MyServices) {})

.controller('TabCtrl', function($scope, $location, $ionicLoading, MyServices) {

})

.controller('ProfileShareCtrl', function($scope, MyServices, $ionicLoading) {
    $scope.contacts = MyServices.all();
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
