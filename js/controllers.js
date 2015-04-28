angular.module('starter.controllers', [])

.controller('EnterCtrl', function($scope, $ionicSlideBoxDelegate) {

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

})

.controller('ProfileCtrl', function($scope) {})

.controller('ProfileShareCtrl', function($scope, MyServices) {
    $scope.contacts = MyServices.all();

})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope) {})

.controller('SpingbookCtrl', function($scope, MyServices) {
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

})

.controller('InSpingbookCtrl', function($scope, MyServices, $stateParams) {
    $scope.contact = MyServices.get($stateParams.Id);
})

.controller('NewsCtrl', function($scope) {
    $scope.settings = {
        enableNews: true
    };
});