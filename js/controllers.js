angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope) {
})

.controller('SpingbookCtrl', function($scope, MyServices) {
    $scope.contacts = MyServices.all();
})

.controller('NewsCtrl', function($scope) {
    $scope.settings = {
        enableNews: true
    };
});