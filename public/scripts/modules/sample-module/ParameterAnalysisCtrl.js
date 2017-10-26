define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('ParameterAnalysisCtrl', ['$scope','VehicleService','$rootScope','$filter','$http', function ($scope, VehicleService, $rootScope, $filter, $http) {

      $('.home-nav').removeClass('active');
      $('.real-nav').removeClass('active');
      $('.param-nav').addClass('active');

      $('.s-home-nav').removeClass('sidebar-active');
      $('.s-real-nav').removeClass('sidebar-active');
      $('.s-param-nav').addClass('sidebar-active');

      $('.title-entry').html("Plan&Plug");
      // datepicker
      $scope.format = 'dd-MMM-yyyy';
      $scope.altInputFormats = ['M!/d!/yyyy'];
      // $scope.startDate = "01-Jan-2016";
      $scope.popup1 = {
        opened: false
      };

      $scope.popup2 = {
        opened: false
      };
      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };
      //Get Vehicle and drivers list
      // VehicleService.getCarsList().then(function (response) {
      //   $scope.carsList = response.data;
      //   console.log($scope.carsList);
      // });
      //
      // VehicleService.getDriversList().then(function (response) {
      //   $scope.driversList = response.data;
      // });

      $(".driver-dropdown").on('click', 'li a', function(){
        $(".d-dropdown:first-child").text($(this).text());
        $(".d-dropdown:first-child").val($(this).text());
      });
      $(".car-dropdown").on('click', 'li a', function(){
         $(".v-dropdown:first-child").text($(this).text());
         $(".v-dropdown:first-child").val($(this).text());
      });
      //charts
      $scope.showCharts = false;
      $scope.getParameters = function () {
        $scope.goClicked = true;
        $scope.OPChartRefresh();
        $scope.OTChartRefresh();
        $scope.CSChartRefresh();
      }
      //Voltage Logic & Chart
      $scope.OPChartRefresh = function(){
          var startDate=$filter("date")(new Date($scope.startDate),"dd-MMM-yyyy");
          var endDate=$filter("date")(new Date($scope.endDate),"dd-MMM-yyyy");
          $http.get('https://digitalthread-assetdetails-service.run.aws-usw02-pr.ice.predix.io/digitalThread/getAllParamvalues?esn=333333&startDate='+startDate+'&endDate='+endDate).then(function(res){
                  $scope.goClicked = false;
                  $scope.showCharts = true;
                  $scope.ChartData1 = [];
                  $scope.paraDataOP = [];
                  $scope.paraDataOP = res.data[6];

                  angular.forEach($scope.paraDataOP,function(value,key){

                  $scope.ChartData1.push(value);
         //         debugger

                  });
                 // console.log( angular.toJson($scope.ChartData1) );
               var seriesData=$scope.ChartData1;

               $scope.ChartDataOP = [];
               var OPDateYear =[];
               var OPDateDay=[];
               var OPDateMonth=[];
               var OPDateHour=[];
               var OPDateMin=[];
               var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
               for(var i=0;i<seriesData.length;i++){
                   OPDateYear=$filter('date')(new Date(seriesData[i].oilPressureeventDate),"yy");
                      OPDateMonth=$filter('date')(new Date(seriesData[i].oilPressureeventDate),"M");

                      OPDateMonth=OPDateMonth-1;
                      OPDateDay=$filter('date')(new Date(seriesData[i].oilPressureeventDate),"d");
                      if(OPDateYear.length==1){
                         OPDateYear='200'+OPDateYear;
                      }

                      else{
                          OPDateYear='20'+OPDateYear;
                      }
                      // OPDateDay=01;

                      OPDateHour=0;
                      OPDateMin=0;

                      $scope.ChartDataOP.push({'x':Date.UTC(OPDateYear,OPDateMonth,OPDateDay,OPDateHour,OPDateMin),
                        'y':Number($scope.ChartData1[i].oilPressureparameterValue),'Date':OPDateDay,'Year':OPDateYear,'Month':monthNames[OPDateMonth]});

                      $scope.ChartDataOP = $filter('orderBy')($scope.ChartDataOP,'x');

                    //  console.log($scope.ChartDataOP);
                      var dataOP=$scope.ChartDataOP;

               }
              $scope.drawchart4(dataOP);
              });
            }
      $scope.drawchart4=function(val){
           var chart = new Highcharts.Chart({
            chart: {
                type: 'area',
                renderTo: 'oilPressureChart',
                zoomType: 'x'

            },
            title: {
                text: 'Voltage',
                style: {
                    fontSize: '2.2rem',
                    fontWeight: 'bold'
                }
                // x: 25
            },
            xAxis: {
                ordinal: false,
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%b. %y ',
                    year: '%b. %y'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Counts'
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            exporting: {
                enabled: false
            },
            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            tooltip: {
                formatter: function() {
                    return '<b>Voltage </b><br>' + '<b>Date </b>:' + this.point.Date + ',' + this.point.Month + ',' + this.point.Year + '<br><b>Counts:</b>' + this.y;
                },
            },
            annotationsOptions: {
                enabledButtons: false
            },
            series: [{
                name: 'Voltage',
                data: val
            }]
        });
      }

      //Temperature Logic & Chart
      $scope.OTChartRefresh = function() {
          var startDate=$filter("date")(new Date($scope.startDate),"dd-MMM-yyyy");
          var endDate=$filter("date")(new Date($scope.endDate),"dd-MMM-yyyy");
          $rootScope.chartId = 'oilTemperatureChart';
          $http.get('https://digitalthread-assetdetails-service.run.aws-usw02-pr.ice.predix.io/digitalThread/getAllParamvalues?esn=333333&startDate=' + startDate + '&endDate=' + endDate).then(function(res) {



              $scope.ChartData1 = [];
              $scope.paraDataOT = [];
              $scope.paraDataOT = res.data[2];

              angular.forEach($scope.paraDataOT, function(value, key) {

                  $scope.ChartData1.push(value);
                  //         debugger

              });
              // console.log( angular.toJson($scope.ChartData1) );
              var seriesData = $scope.ChartData1;

              $scope.ChartDataOT = [];
              var OTDateYear = [];
              var OTDateDay = [];
              var OTDateMonth = [];
              var OTDateHour = [];
              var OTDateMin = [];
              var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              for (var i = 0; i < seriesData.length; i++) {
                  OTDateYear = $filter('date')(new Date(seriesData[i].oilTempeventDate), "yy");
                  OTDateMonth = $filter('date')(new Date(seriesData[i].oilTempeventDate), "M");

                  OTDateMonth = OTDateMonth - 1;
                  OTDateDay = $filter('date')(new Date(seriesData[i].oilTempeventDate), "d");
                  if (OTDateYear.length == 1) {
                      OTDateYear = '200' + OTDateYear;
                  } else {
                      OTDateYear = '20' + OTDateYear;
                  }
                  // OTDateDay=01;

                  OTDateHour = 0;
                  OTDateMin = 0;

                  $scope.ChartDataOT.push({
                      'x': Date.UTC(OTDateYear, OTDateMonth, OTDateDay, OTDateHour, OTDateMin),
                      'y': Number($scope.ChartData1[i].oilTempParameterValue),
                      'Date': OTDateDay,
                      'Year': OTDateYear,
                      'Month': monthNames[OTDateMonth]
                  });

                  $scope.ChartDataOT = $filter('orderBy')($scope.ChartDataOT, 'x');

                  //  console.log($scope.ChartDataOT);
                  var dataOT = $scope.ChartDataOT;

              }

              $scope.drawchart5(dataOT);
          });
      }
      $scope.drawchart5 = function(val) {
          var chart = new Highcharts.Chart({
              chart: {
                  type: 'area',
                  renderTo: 'oilTemperatureChart',
                  zoomType: 'x'

              },
              title: {
                  text: 'Temperature',
                  style: {
                      fontSize: '2.2rem',
                      fontWeight: 'bold'
                  }
                  // x: 25
              },

              xAxis: {
                  ordinal: false,
                  type: 'datetime',
                  dateTimeLabelFormats: {
                      month: '%b. %y ',
                      year: '%b. %y'
                  },
                  title: {
                      text: 'Date'

                  }
              },
              yAxis: {
                  title: {
                      text: 'Counts'
                  }
              },
              credits: {
                  enabled: false
              },
              plotOptions: {
                  area: {
                      fillColor: {
                          linearGradient: {
                              x1: 0,
                              y1: 0,
                              x2: 0,
                              y2: 1
                          },
                          stops: [
                              [0, Highcharts.getOptions().colors[0]],
                              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                          ]
                      },
                      marker: {
                          radius: 2
                      },
                      lineWidth: 1,
                      states: {
                          hover: {
                              lineWidth: 1
                          }
                      },
                      threshold: null
                  },
                  spline: {
                      marker: {
                          enabled: true
                      }
                  }
              },
              exporting: {
                  enabled: false
              },
              legend: {
                  enabled: false,
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'top',
                  x: -40,
                  y: 80,
                  floating: true,
                  borderWidth: 1,
                  backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                  shadow: true
              },
              tooltip: {
                  formatter: function() {
                      return '<b>Temperature </b><br>' + '<b>Date </b>:' + this.point.Date + ',' + this.point.Month + ',' + this.point.Year + '<br><b>Counts:</b>' + this.y;
                  },
              },
              annotationsOptions: {
                  enabledButtons: false
              },
              series: [{
                  name: 'Temperature',
                  data: val
              }]
          });
      }

      // Core Speed Logic & Chart
      $scope.CSChartRefresh = function() {
            var startDate=$filter("date")(new Date($scope.startDate),"dd-MMM-yyyy");
            var endDate=$filter("date")(new Date($scope.endDate),"dd-MMM-yyyy");
            $rootScope.chartId = 'coreSpeedChart';
            $http.get('https://digitalthread-assetdetails-service.run.aws-usw02-pr.ice.predix.io/digitalThread/getAllParamvalues?esn=333333&startDate=' + startDate + '&endDate=' + endDate).then(function(res) {

                $scope.ChartData1 = [];
                $scope.paraDataCS = [];
                $scope.paraDataCS = res.data[4];

                angular.forEach($scope.paraDataCS, function(value, key) {

                    $scope.ChartData1.push(value);
                    //         debugger

                });
                //  console.log( angular.toJson($scope.ChartData1) );
                var seriesData = $scope.ChartData1;

                $scope.ChartDataCS = [];
                var CSDateYear = [];
                var CSDateDay = [];
                var CSDateMonth = [];
                var CSDateHour = [];
                var CSDateMin = [];
                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for (var i = 0; i < seriesData.length; i++) {
                    CSDateYear = $filter('date')(new Date(seriesData[i].coreSpeedeventDate), "yy");
                    CSDateMonth = $filter('date')(new Date(seriesData[i].coreSpeedeventDate), "M");

                    CSDateMonth = CSDateMonth - 1;
                    CSDateDay = $filter('date')(new Date(seriesData[i].coreSpeedeventDate), "d");
                    if (CSDateYear.length == 1) {
                        CSDateYear = '200' + CSDateYear;
                    } else {
                        CSDateYear = '20' + CSDateYear;
                    }
                    // CSDateDay=01;

                    CSDateHour = 0;
                    CSDateMin = 0;

                    $scope.ChartDataCS.push({
                        'x': Date.UTC(CSDateYear, CSDateMonth, CSDateDay, CSDateHour, CSDateMin),
                        'y': Number($scope.ChartData1[i].coreSpeedparameterValue),
                        'Date': CSDateDay,
                        'Year': CSDateYear,
                        'Month': monthNames[CSDateMonth]
                    });

                    $scope.ChartDataCS = $filter('orderBy')($scope.ChartDataCS, 'x');

                    //      console.log($scope.ChartDataCS);
                    var dataCS = $scope.ChartDataCS;

                }


                $scope.drawchart3(dataCS);
            });
      }
      $scope.drawchart3 = function(val) {

          var chart = new Highcharts.Chart({
              chart: {
                  type: 'area',
                  renderTo: 'coreSpeedChart',
                  zoomType: 'x'

              },
              title: {
                  text: 'Core Speed',
                  style: {
                      fontSize: '2.2rem',
                      fontWeight: 'bold'
                  }
                  // x: 25
              },

              xAxis: {
                  ordinal: false,
                  type: 'datetime',

                  dateTimeLabelFormats: {
                      month: '%b. %y ',
                      year: '%b. %y'
                  },
                  title: {
                      text: 'Date'

                  }
              },
              yAxis: {
                  title: {
                      text: 'Counts'

                  }
              },
              credits: {
                  enabled: false
              },



              plotOptions: {
                  area: {
                      fillColor: {
                          linearGradient: {
                              x1: 0,
                              y1: 0,
                              x2: 0,
                              y2: 1
                          },
                          stops: [
                              [0, Highcharts.getOptions().colors[0]],
                              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                          ]
                      },
                      marker: {
                          radius: 2
                      },
                      lineWidth: 1,
                      states: {
                          hover: {
                              lineWidth: 1
                          }
                      },
                      threshold: null
                  },
                  spline: {
                      marker: {
                          enabled: true
                      }
                  }
              },
              exporting: {
                  enabled: false
              },
              legend: {
                  enabled: false,
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'top',
                  x: -40,
                  y: 80,
                  floating: true,
                  borderWidth: 1,
                  backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                  shadow: true
              },
              tooltip: {

                  formatter: function() {

                      return '<b>Core Speed </b><br>' + '<b>Date </b>:' + this.point.Date + ',' + this.point.Month + ',' + this.point.Year + '<br><b>Counts:</b>' + this.y;
                  },

              },
              annotationsOptions: {
                  enabledButtons: false
              },
              series: [{
                  name: 'Core Speed',
                  data: val
              }]
          });
      }
    }]);
});
