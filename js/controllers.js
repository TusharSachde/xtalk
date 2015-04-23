angular.module('starter.controllers', [])

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
        document.location.href = "tel:" +number;
        console.log('Calling');
    };
    $scope.sms = function(number) {
        document.location.href = "sms:" +number;
        console.log('SMS');
    };
    $scope.mail = function(email) {
        document.location.href = "mailto:" +email;
        console.log('Mail');
    };
})

.controller('NewsCtrl', function($scope) {
    $scope.settings = {
        enableNews: true
    };
});