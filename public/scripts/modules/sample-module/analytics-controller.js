define(['angular', './sample-module'], function(angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('AnalyticsCtrl', ['$scope', 'VehicleService', '$state', '$rootScope', function($scope, VehicleService, $state, $rootScope) {
        clearInterval($rootScope.bookingInterval);
        $rootScope.bookingInterval = 0;
        $('.home-nav').addClass('active');
        $('.param-nav').removeClass('active');
        $('.real-nav').removeClass('active');

        $('.s-home-nav').addClass('sidebar-active');
        $('.s-param-nav').removeClass('sidebar-active');
        $('.s-real-nav').removeClass('sidebar-active');

        $('.title-entry').html("Plan&Plug");

        $scope.destInput = '';
        $scope.origInput = '';
        $scope.directionsRequest = false;
        $scope.road = "400";
        $scope.weatherCondition = "1";

        var mapOptions = {
            zoom: 5,
            mapTypeControl: false,
            center: new google.maps.LatLng(41.85, -87.65),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        var rendererOptions = {
            draggable: true
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.directionsService = new google.maps.DirectionsService;
        $scope.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        $scope.directionsDisplay.setMap($scope.map);
        $scope.directionsDisplay.setPanel(document.getElementById('directions-panel'));

        $scope.getDirections = function() {
            $scope.directionsRequest = true;
            setTimeout(function() {
                google.maps.event.trigger(map, 'resize')
            }, 100);
            $scope.getMapDirections($scope.directionsService, $scope.directionsDisplay);
        }
        $scope.closeMap = function() {
            $scope.directionsRequest = false;
        }

        $scope.initAutoComplete = function() {
            new AutocompleteDirectionsHandler($scope.map);
        }

        function AutocompleteDirectionsHandler(map) {
            this.map = map;
            var originInput = document.getElementById('origin-input');
            var destinationInput = document.getElementById('destination-input');

            var originAutocomplete = new google.maps.places.Autocomplete(
                originInput, {
                    placeIdOnly: true
                });
            var destinationAutocomplete = new google.maps.places.Autocomplete(
                destinationInput, {
                    placeIdOnly: true
                });

            this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
            this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        }

        AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
            var me = this;
            // autocomplete.bindTo('bounds', this.map);
            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();
                if (!place.place_id) {
                    window.alert("Please select an option from the dropdown list.");
                    return;
                }
                console.log(place);
                if (mode === 'ORIG') {
                    $scope.originPlace = place.name;
                } else {
                    $scope.destinationPlace = place.name;
                }
                // me.route();
            });


        };

        $scope.getMapDirections = function(directionsService, directionsDisplay) {
            //debugger

            directionsService.route({
                origin: $scope.analyticsData.distanceMatrix.origin,
                destination: $scope.analyticsData.distanceMatrix.destination,
                travelMode: 'DRIVING'
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        };

        $scope.showAnalytics = false;
        // VehicleService.getCarsList().then(function (response) {
        //   $scope.carsList = response.data;
        //   console.log($scope.carsList);
        // });
        //
        // VehicleService.getDriversList().then(function (response) {
        //   $scope.driversList = response.data;
        // });

        $(".driver-dropdown").on('click', 'li a', function() {
            $(".d-dropdown:first-child").text($(this).text());
            $(".d-dropdown:first-child").val($(this).text());
        });
        $(".car-dropdown").on('click', 'li a', function() {
            $(".v-dropdown:first-child").text($(this).text());
            $(".v-dropdown:first-child").val($(this).text());
        });

        $('.collapse').on('show.bs.collapse', function() {
            $('.collapse.in').collapse('hide');
        });

        $scope.getCarsDetails = function(car_id) {
            $scope.carSelected = true;
            $scope.selectedCarId = car_id;
        }

        $scope.getDriverDetails = function(driver_id) {
            $scope.selectedDriverId = driver_id;
        }

        $scope.getAnalytics = function() {
            $scope.goClicked = true;
            var data = {
                "vehicleID": $scope.selectedCarId,
                "driverID": $scope.selectedDriverId,
                "source": $scope.originPlace,
                "destination": $scope.destinationPlace,
                "zipCode": $scope.zipCode,
                "weatherRating": $scope.weatherCondition,
                "roadRating": $scope.road
            }
            //$scope.data = data;
            console.log(data)
            VehicleService.getAnalyticsData(data).then(function(response) {
                console.log(response);
                $scope.analyticsData = response.data;
                data = response.data.evStation;


                $scope.stationData = response.data.evStation;
                console.log($scope.stationData);
                $scope.showAnalytics = true;
                $scope.goClicked = false;
            });
        }

        $scope.viewBookingDetails = function(station_id) {
            VehicleService.setStationID(station_id);
            $state.go('bookingview');
        }

        // Traffic Chart Code
        var locationIds = [];
        var car = [],
            truck = [],
            bike = [],
            vehicle = [];
        $scope.trafficRequest = false;

        $scope.closeTraffic = function() {
            $scope.trafficRequest = false;
        }


        $scope.getTrafficGraph = function() {
            $scope.trafficRequest = true;
            VehicleService.getTrafficData().then(function(response) {
                locationIds = [];
                car = [];
                truck = [];
                bike = [];
                vehicle = [];
                const data = response.data;
                //console.log(data);
                angular.forEach(data, function(val, key) {
                    console.log(val);
                    locationIds.push(key);
                    if (val.car)
                        car.push(val.car);
                    else {
                        car.push(0);
                    }
                    if (val.truck)
                        truck.push(val.truck);
                    else {
                        truck.push(0);
                    }
                    if (val.motorcycle)
                        bike.push(val.motorcycle);
                    else {
                        bike.push(0);
                    }
                    if (val.vehicle)
                        vehicle.push(val.vehicle);
                    else {
                        vehicle.push(0);
                    }
                });
                trafficAjax(locationIds[0]);
                chartData();
            });
        }

        function trafficAjax(loc_id) {
            VehicleService.getTrafficData1(loc_id).then(function(response) {
                $scope.trafficData = response.data;
                console.log($scope.trafficData);
            }).then(function() {
              console.log('chart 1');
              setTimeout(function () {
                chartData1(loc_id);
              }, 500)
            });
        }

        var chart, chart1;

        function chartData1(loc_id) {
            chart1 = Highcharts.chart('trafficChart1', {
                data: {
                    table: 'freq',
                    startRow: 1,
                    endRow: 5,
                    endColumn: 4
                },

                chart: {
                    polar: true,
                    type: 'column'
                },

                title: {
                    text: loc_id
                },

                pane: {
                    size: '85%'
                },

                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 100,
                    layout: 'vertical'
                },

                xAxis: {
                    tickmarkPlacement: 'on'
                },

                yAxis: {
                    min: 0,
                    endOnTick: false,
                    showLastLabel: true,
                    title: {
                        text: 'Number of Vehicles'
                    },
                    labels: {
                        formatter: function() {
                            return this.value;
                        }
                    },
                    reversedStacks: false
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    valueSuffix: ''
                },

                plotOptions: {
                    series: {
                        stacking: 'normal',
                        shadow: false,
                        groupPadding: 0,
                        pointPlacement: 'on'
                    }
                }
            });
        }

        function chartData() {
            chart = new Highcharts.chart('trafficChart', {

                chart: {
                    type: 'column'
                },

                title: {
                    text: 'Traffic'
                },

                xAxis: {
                    categories: locationIds
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Traffic'
                    }
                },
                exporting: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        cursor: 'pointer',
                        events: {
                            click: function(event) {
                                console.log('clicked');
                                console.log(event);
                                trafficAjax(event.point.category);
                            }
                        }
                    }
                },

                series: [{
                    name: 'Car',
                    color: '#7cb5ec',
                    data: car
                }, {
                    name: 'Truck',
                    color: '#333333',
                    data: truck
                }, {
                    name: 'Motorcycle',
                    color: '#90ee7e',
                    data: bike
                }, {
                    name: 'Vehicle',
                    color: '#f7a35c',
                    data: vehicle
                }]
            });
        }
    }]);
});
