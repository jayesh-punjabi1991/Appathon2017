define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('RealtimeCtrl', ['$scope','VehicleService','$rootScope','$state','$http', function ($scope, VehicleService, $rootScope, $state, $http) {

        $('.real-nav').addClass('active');
        $('.param-nav').removeClass('active');
        $('.home-nav').removeClass('sidebar-active');

        $('.s-real-nav').addClass('sidebar-active');
        $('.s-param-nav').removeClass('sidebar-active');
        $('.s-home-nav').removeClass('sidebar-active');

        $('.title-entry').html("Plug&Go");

    }]);
});
