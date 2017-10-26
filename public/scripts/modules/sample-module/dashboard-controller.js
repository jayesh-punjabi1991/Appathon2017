define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$scope','VehicleService', function ($scope, VehicleService) {
       $scope.destInput = '';
       $scope.origInput = '';
       var mapOptions = {
          zoom: 5,
          mapTypeControl: false,
          center: new google.maps.LatLng(40.0000, -98.0000),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.initAutoComplete = function () {
          new AutocompleteDirectionsHandler($scope.map);
        }

        function AutocompleteDirectionsHandler(map) {
          this.map = map;
          this.originPlaceId = null;
          this.destinationPlaceId = null;
          this.travelMode = 'DRIVING';
          var originInput = document.getElementById('origin-input');
          var destinationInput = document.getElementById('destination-input');
          this.directionsService = new google.maps.DirectionsService;
          this.directionsDisplay = new google.maps.DirectionsRenderer;
          this.directionsDisplay.setMap(map);

          var originAutocomplete = new google.maps.places.Autocomplete(
              originInput, {placeIdOnly: true});
          var destinationAutocomplete = new google.maps.places.Autocomplete(
              destinationInput, {placeIdOnly: true});

          this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
          
        }

        AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          var me = this;
          autocomplete.bindTo('bounds', this.map);
          autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
              window.alert("Please select an option from the dropdown list.");
              return;
            }
            if (mode === 'ORIG') {
              $scope.originPlaceId = place.place_id;
              me.originPlaceId = place.place_id;
            } else {
              $scope.destinationPlaceId = place.place_id;
              me.destinationPlaceId = place.place_id;
            }
            debugger
            me.route();
          });

        };

        AutocompleteDirectionsHandler.prototype.route = function() {
          debugger
          if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
          }
          var me = this;

          this.directionsService.route({
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
          }, function(response, status) {
            if (status === 'OK') {
              me.directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        };

        //$scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        $scope.carSelected = false;
        VehicleService.getCarsList().success(function (response) {
          $scope.carsList = response;
        });

        $(".collapse.in").each(function(){
        	$(this).siblings(".panel-heading").find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus");
        });

        // Toggle plus minus icon on show hide of collapse element
        $(".collapse").on('show.bs.collapse', function(){
        	$(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        }).on('hide.bs.collapse', function(){
        	$(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        });

        $(".dropdown-menu").on('click', 'li a', function(){
          $(".v-dropdown:first-child").text($(this).text());
          $(".v-dropdown:first-child").val($(this).text());
       });

       $scope.getCarsDetails = function(car_id) {
         $scope.carSelected = true;
         VehicleService.getCarInfo(car_id).success(function (response) {
           $scope.carDetails = response[0];
         });
       }
    }]);
});
