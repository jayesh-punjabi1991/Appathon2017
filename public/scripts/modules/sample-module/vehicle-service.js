/*global define */
define(['angular', './sample-module'], function (angular, module) {
    'use strict';
    /**
    * PredixViewService is a sample angular service that integrates with Predix View Service API
    */
    module.factory('VehicleService', ['$http', '$q', function ($http, $q) {

        // var getCarInfo = function (car_id) {
        //     var info_url = 'https://genpact-vehicle-svc.run.aws-usw02-pr.ice.predix.io/api/vehicles';
        //     //var info_url = '/sample-data/vehicles-list.json';
        //     return $http.get(info_url, {
        //       'Content-Type' : 'application/json'
        //     });
        // }
        //
        // var getCarsList = function () {
        //     var list_url = 'https://genpact-vehicle-svc.run.aws-usw02-pr.ice.predix.io/api/vehicles';
        //     //var list_url = '/sample-data/vehicles-list.json';
        //     return $http.get(list_url, {
        //       'Content-Type' : 'application/json'
        //     });
        // }
        //
        // var getDriverInfo = function (driver_id) {
        //     var info_url = 'https://genpact-vehicle-svc.run.aws-usw02-pr.ice.predix.io/api/drivers';
        //     //var info_url = '/sample-data/drivers-list.json';
        //     return $http.get(info_url, {
        //       'Content-Type' : 'application/json'
        //     });
        // }
        //
        // var getDriversList = function () {
        //     var list_url = 'https://genpact-vehicle-svc.run.aws-usw02-pr.ice.predix.io/api/drivers';
        //     //var list_url = '/sample-data/drivers-list.json';
        //     return $http.get(list_url, {
        //       'Content-Type' : 'application/json'
        //     });
        // }

        var getAnalyticsData = function (data) {

            //var url = '/sample-data/analytic-data.json';
            var url = "https://ev-app.run.aws-usw02-pr.ice.predix.io/api/evplugplanner";
            //var url = "https://ev-service.run.aws-usw02-pr.ice.predix.io/evstation?origins="+origin+"&destinations="+dest+"&zip="+zip;
            // return $http.get(url, {
            //   'Content-Type' : 'application/json'
            // });
            return $http.post(url, data, {
               'Content-Type' : 'application/json'
            });
        }
        var stationId;
        var setStationID = function (station_id) {
          debugger
          stationId = station_id;
        }

        var getStationID = function () {
          return stationId;
        }

        var getBookingDetails = function (station_id) {
          var url = 'https://ev-service.run.aws-usw02-pr.ice.predix.io/api/station?stationID='+station_id;
          return $http.get(url, {
             'Content-Type' : 'application/json'
          });
        }
        var getTrafficData = function () {
          //var url = '/sample-data/traffic-data.json';
          var url = 'https://predix-appa-traffic-service.run.aws-usw02-pr.ice.predix.io/appathontraffic/service/trafficdetailsbyasset';
          return $http.get(url, {
             'Content-Type' : 'application/json'
          });
        }

        var getTrafficData1 = function (loc_id) {
          //var url = '/sample-data/traffic-data.json';
          var url = 'https://predix-appa-traffic-service.run.aws-usw02-pr.ice.predix.io/appathontraffic/service/trafficdetails?locationid='+loc_id;
          return $http.get(url, {
             'Content-Type' : 'application/json'
          });
        }

        return {
          // getCarInfo : getCarInfo,
          // getCarsList : getCarsList,
          // getDriverInfo : getDriverInfo,
          // getDriversList : getDriversList,
          getAnalyticsData : getAnalyticsData,
          setStationID : setStationID,
          getStationID : getStationID,
          getBookingDetails : getBookingDetails,
          getTrafficData : getTrafficData,
          getTrafficData1 : getTrafficData1
        };
    }]);
});
