angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
            StatusBar.backgroundColorByHexString("#7B2E9A");
        }
    });

    $ionicPlatform.registerBackButtonAction(function(event) {
        event.preventDefault();
    }, 100);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    //$ionicConfigProvider.views.transition('none');
    $httpProvider.defaults.withCredentials = true;
    $ionicConfigProvider.views.maxCache(1);
    $ionicConfigProvider.views.swipeBackEnabled(false);

    $stateProvider
        .state('enter', {
            url: "/enter",
            controller: 'EnterCtrl',
            templateUrl: "templates/enter.html"
        })

    .state('profile', {
        url: "/profile",
        controller: 'ProfileCtrl',
        templateUrl: "templates/profile.html"
    })

    .state('profile.mycard', {
        url: '/mycard',
        views: {
            'profile-mycard': {
                templateUrl: 'templates/profile-mycard.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('profile.personal', {
        url: '/personal',
        views: {
            'profile-personal': {
                templateUrl: 'templates/profile-personal.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('sharewith', {
        url: '/profile/sharewith',
        templateUrl: 'templates/profile-sharewith.html',
        controller: 'ProfileShareCtrl'
    })

    .state('profileget', {
        url: '/profile/get',
        templateUrl: 'templates/profile-get.html',
        controller: 'ProfileGetCtrl'
    })

    .state('tab', {
        url: "/tab",
        abstract: true,
        controller: 'TabCtrl',
        templateUrl: "templates/tabs.html"

    })

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    })

    .state('tab.news', {
        url: '/news',
        views: {
            'tab-news': {
                templateUrl: 'templates/tab-news.html',
                controller: 'NewsCtrl'
            }
        }
    })

    .state('tab.spingbook', {
        url: '/spingbook',
        views: {
            'tab-spingbook': {
                templateUrl: 'templates/tab-spingbook.html',
                controller: 'SpingbookCtrl'
            }
        }
    })

    .state('tab.spingbook-detail', {
        url: '/spingbook-detail/:id/:show',
        views: {
            'tab-spingbook': {
                templateUrl: 'templates/spingbook-detail.html',
                controller: 'InSpingbookCtrl'
            }
        }
    })

    .state('circle', {
        url: "/circle",
        abstract: true,
        templateUrl: "templates/tabs-circle.html"

    })

    .state('circle.circle1', {
        url: '/circle1',
        views: {
            'tab1-circle1': {
                templateUrl: 'templates/tab-circle1.html',
                controller: 'SpingbookCtrl'
            }
        }
    })

    .state('circle.circle2', {
        url: '/circle2',
        views: {
            'tab1-circle2': {
                templateUrl: 'templates/tab-circle2.html',
                controller: 'SpingbookCtrl'
            }
        }
    })

    .state('circle.circle3', {
        url: '/circle3',
        views: {
            'tab1-circle3': {
                templateUrl: 'templates/tab-circle3.html',
                controller: 'SpingbookCtrl'
            }
        }
    })

    .state('circle.spingbook-detail', {
        url: '/spingbook/:Id',
        views: {
            'tab1-circle1': {
                templateUrl: 'templates/spingbook-detail.html',
                controller: 'InSpingbookCtrl'
            }
        }
    })

    .state('circle.circle1-detail', {
        url: '/circle1/:Id',
        views: {
            'tab1-circle1': {
                templateUrl: 'templates/spingbook-detail.html',
                controller: 'InSpingbookCtrl'
            }
        }
    })

    .state('circle.circle2-detail', {
        url: '/circle2/:Id',
        views: {
            'tab1-circle2': {
                templateUrl: 'templates/circle2-detail.html',
                controller: 'InSpingbookCtrl'
            }
        }
    })

    .state('circle.circle3-detail', {
        url: '/circle3/:Id',
        views: {
            'tab1-circle3': {
                templateUrl: 'templates/circle3-detail.html',
                controller: 'InSpingbookCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/spingbook');

})

.filter('addhighlight', function() {
    return function(str, searchkey) {
        var newstr = str;
        var num = 0;

        if (searchkey && searchkey != "") {
            var re = new RegExp(searchkey, "i");
            num = str.search(re);
            newstr = str.replace(re, "<span class='highlight'>" + str.substr(num, searchkey.length) + "</span>");
        }
        return newstr;
    }
})

.filter('numsearch', function() {
    return function(item, str) {
        var re = new RegExp("(.*?)" + str + "(.*?)", "i");
        var newitem = _.filter(item, function(n) {
            return re.test(n.number);
        });
        newitem = _.sortByOrder(newitem, ['name'], [true]);
        return newitem;
    }
})

.filter('addnumhighlight', function() {
    return function(str, searchkey) {
        str = str + "";
        var newstr = str;
        var num = 0;
        if (searchkey && searchkey != "") {
            var re = new RegExp(searchkey);
            num = str.search(re);
            newstr = str.replace(re, "<span class='highlight'>" + str.substr(num, searchkey.length) + "</span>");
        }
        return newstr;
    }
})

.filter('uploadpath', function() {
    return function(image) {
        if (image && image != "") {
            if (image.indexOf('content:') == -1 && image.indexOf('/var/mobile') == -1) {
                return imgpath + image + "&height=100";
            } else {
                return "img/spingr.png";
            }
        }
    }
});
