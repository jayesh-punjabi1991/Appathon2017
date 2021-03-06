/**
 * Load controllers, directives, filters, services before bootstrapping the application.
 * NOTE: These are named references that are defined inside of the config.js RequireJS configuration file.
 */
define([
    'jquery',
    'angular',
    'main',
    'routes',
    'interceptors',
    'ng-bind-polymer',
    'bootstrap',
    'angular-bootstrap',
    'angular-bootstrap-tpls'
], function ($, angular) {
    'use strict';

    /**
     * Application definition
     * This is where the AngularJS application is defined and all application dependencies declared.
     * @type {module}
     */
    var predixApp = angular.module('predixApp', [
        'app.routes',
        'app.interceptors',
        'sample.module',
        'px.ngBindPolymer',
        'ui.bootstrap',
        'ui.bootstrap.tpls'
    ]);

    /**
     * Main Controller
     * This controller is the top most level controller that allows for all
     * child controllers to access properties defined on the $rootScope.
     */
    predixApp.controller('MainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        //Global application object
        // window.App = $rootScope.App = {
        //     version: '1.0',
        //     name: 'Predix Seed',
        //     session: {},
        //     tabs: [
        //         {icon: 'fa-tachometer', state: 'dashboards', label: 'Dashboards'},
        //         {icon: 'fa-file-o', state: 'blankpage', label: 'Blank Page', subitems: [
        //             {state: 'blanksubpage', label: 'Blank Sub Page'}
        //         ]}
        //     ]
        // };

    }]);


    //Set on window for debugging
    window.predixApp = predixApp;

    //Return the application  object
    return predixApp;
});
