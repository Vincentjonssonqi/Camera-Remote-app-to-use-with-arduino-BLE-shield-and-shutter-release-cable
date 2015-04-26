// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


        angular.module('starter', ['ionic', 'controllers','filters','angular-sly'])
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                try{
                    ble.isEnabled(
                        function () {
                            alert("Bluetooth is enabled");
                        },
                        function () {
                            alert("Bluetooth is DISABLED");
                        }
                    );
                } catch(error) {
                    alert("ble does not  existst");
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: 'MainCtrl'
            })

            // Each tab has its own nav history stack:

            .state('tab.timelapse', {
                url: '/timelapse',
                views: {
                    'tab-timelapse': {
                        templateUrl: 'templates/tab-timelapse.html',
                        controller: 'TimeLapseCtrl'
                    }
                }
            })

            .state('tab.trigger', {
                url: '/trigger',
                views: {
                    'tab-trigger': {
                        templateUrl: 'templates/tab-trigger.html',
                        controller: 'TriggerCtrl'
                    }
                }
            })
                .state('tab.timer', {
                    url: '/timer',
                    views: {
                        'tab-timer': {
                            templateUrl: 'templates/tab-timer.html',
                            controller: 'TimerCtrl'
                        }
                    }
                })
                .state('tab.connect', {
                    url: '/connect',
                    views: {
                        'tab-connect': {
                            templateUrl: 'templates/tab-connect.html',
                            controller: 'ConnectCtrl'
                        }
                    }
                })
                .state('tab.debug', {
                    url: '/debug',
                    views: {
                        'tab-debug': {
                            templateUrl: 'templates/tab-debug.html',
                            controller: 'DebugCtrl'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/tab/trigger');

        });