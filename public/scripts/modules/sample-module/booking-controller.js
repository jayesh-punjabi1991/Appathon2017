define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('BookingCtrl', ['$scope','VehicleService','$rootScope','$state','$http', function ($scope, VehicleService, $rootScope, $state, $http) {

        $('.home-nav').addClass('active');
        $('.param-nav').removeClass('active');
        $('.real-nav').removeClass('active');

        $('.s-home-nav').addClass('sidebar-active');
        $('.s-param-nav').removeClass('sidebar-active');
        $('.s-real-nav').removeClass('sidebar-active');

        $('.title-entry').html("Plug&Go");

        var station_id = VehicleService.getStationID();
        booking();
        $rootScope.bookingInterval = setInterval(function () {
          booking();
        },60000);

        function booking() {
          VehicleService.getBookingDetails(station_id).then(function (response) {
            console.log(response);
            $scope.stationData = response.data;
         });
        }

    }]);
});
