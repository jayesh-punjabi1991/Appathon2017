/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
            .state('mapview', {
                url: '/mapview',
                templateUrl: 'views/mapview.html',
                controller: 'DashboardsCtrl'
            })
            .state('analyticview', {
                url: '/analyticview',
                templateUrl: 'views/analytic-view.html',
                controller: 'AnalyticsCtrl'
            })
            .state("ParameterAnalysis", {
                url: '/ParameterAnalysis',
                templateUrl : "views/parameter-analysis.html",
                controller:"ParameterAnalysisCtrl"

            })
            .state("realtimeview", {
                url: '/realtime',
                templateUrl : "views/realtime-view.html",
                controller:"RealtimeCtrl"
            })
            .state("bookingview", {
                url: '/booking',
                templateUrl : "views/booking-view.html",
                controller:"BookingCtrl"

            });


        $urlRouterProvider.otherwise('analyticview');

    }]);
});
