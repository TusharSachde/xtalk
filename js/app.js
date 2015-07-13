angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
            StatusBar.overlaysWebView(true);
        }
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#804399");
        }
        if (device.platform == 'iOS') {
            navigator.splashscreen.hide();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        //$ionicConfigProvider.views.transition('none');
        $httpProvider.defaults.withCredentials = true;
        $ionicConfigProvider.views.swipeBackEnabled(false);
        //$ionicConfigProvider.scrolling.jsScrolling(false);
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                controller: 'AppCtrl',
                templateUrl: "templates/enter.html"
            })
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
                    controller: 'PersonalProfileCtrl'
                }
            }
        })

        .state('sharewith', {
            url: '/profile/sharewith',
            templateUrl: 'templates/profile-sharewith.html',
            controller: 'ProfileShareCtrl'
        })

        .state('profileget', {
            cache: false,
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
            cache: false,
            views: {
                'tab-news': {
                    templateUrl: 'templates/tab-news.html',
                    controller: 'NewsCtrl'
                }
            }
        })

        .state('tab.spingbook', {
            cache: true,
            url: '/spingbook',
            views: {
                'tab-spingbook': {
                    templateUrl: 'templates/tab-spingbook.html',
                    controller: 'SpingbookCtrl'
                }

            }
        })

        .state('tab.spingbook-detail', {
            cache: false,
            url: '/spingbook-detail',
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
            url: '/circle1detail',
            views: {
                'tab1-circle1': {
                    templateUrl: 'templates/spingbook-detail.html',
                    controller: 'InSpingbookCtrl'
                }
            }
        })

        .state('circle.circle2-detail', {
            url: '/circle2/:Id/:u1name',
            views: {
                'tab1-circle2': {
                    templateUrl: 'templates/circle2-detail.html',
                    controller: 'InSpingbookCtrl'
                }
            }
        })

        .state('circle.circle3-detail', {
            url: '/circle3/:Id/:u1name/:u2name',
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
    .filter('serverimageprofile', function () {

        return function (image) {
            if (image && image != "") {
                return imgpath + image;
            } else {
                return "img/default.png";
            }
        };
    })
    .filter('serverimage', function () {

        return function (image) {
            if (image && image != "") {
                return imgpath + image;
            } else {
                return "img/logo.jpg";
            }

        };
    })
    .filter('matchsearch', function () {
        return function (item, str) {
            var re = new RegExp("(.*?)" + str + "(.*?)", "i");
            var newitem = _.filter(item, function (n) {
                return re.test(n.name);
            });
            newitem = _.sortByOrder(newitem, ['name'], [true]);
            return newitem;
        }
    })

.filter('addhighlight', function () {
        return function (str, searchkey, phone) {
            var newstr = str;
            var num = 0;
            phone = phone + "";

            if (searchkey && searchkey != "") {
                var re = new RegExp(searchkey, "i");
                num = str.search(re);
                newstr = str.replace(re, "<span class='highlight'>" + str.substr(num, searchkey.length) + "</span>");
            } else {
                if (phone && phone != "") {
                    var regex = "";
                    var noregex = false;
                    _.each(phone, function (n) {
                        switch (n) {
                        case "1":
                            {
                                regex += "[1]";
                            };
                            break;
                        case "2":
                            {
                                regex += "[ABCabc2]";
                            };
                            break;
                        case "3":
                            {
                                regex += "[DEFdef3]";
                            };
                            break;
                        case "4":
                            {
                                regex += "[GHIghi4]";
                            };
                            break;
                        case "5":
                            {
                                regex += "[JKLjkl5]";
                            };
                            break;
                        case "6":
                            {
                                regex += "[MNOmno6]";
                            };
                            break;
                        case "7":
                            {
                                regex += "[PQRSpqrs7]";
                            };
                            break;
                        case "8":
                            {
                                regex += "[TUVtuv8]";
                            };
                            break;
                        case "9":
                            {
                                regex += "[WXYZwxyz9]";
                            };
                            break;
                        default:
                            {
                                noregex = true;
                            }

                        }
                    });

                    if (!noregex) {
                        var re = new RegExp(regex);
                        num = str.search(re);
                        newstr = str.replace(re, "<span class='highlight'>" + str.substr(num, phone.length) + "</span>");
                    }
                };
            }
            return newstr;
        }
    })
    .filter('numsearch', function () {
        return function (item, str) {
            var re = new RegExp("(.*?)" + str + "(.*?)", "i");
            var newitem = _.filter(item, function (n) {
                return re.test(n.number);
            });
            newitem = _.sortByOrder(newitem, ['name'], [true]);
            return newitem;
        }
    })
    .filter('addnumhighlight', function () {
        return function (str, searchkey) {
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
    });
var formvalidation = function (allvalidation) {
    var isvalid2 = true;
    for (var i = 0; i < allvalidation.length; i++) {
        console.log("checking");
        console.log(allvalidation[i].field);
        if (allvalidation[i].field == "" || allvalidation[i].field == null || !allvalidation[i].field) {
            allvalidation[i].validation = "ng-dirty";
            isvalid2 = false;
        }
    }
    return isvalid2;
};