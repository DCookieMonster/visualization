/**
 * Created by dor on 17/07/2016.
 */


var Mainapp=angular.module('mainApp', [ 'ngAnimate','angular-table', 'ui.bootstrap','ngSanitize']);

var PagesApp=angular.module('PagesApp', ['ngRoute','angular.filter', 'ngAnimate', 'ui.bootstrap','ngSanitize',
    'btford.markdown']);

var GroupApp=angular.module('groupApp', [ 'ngAnimate', 'ui.bootstrap','ngSanitize']);

PagesApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
        when('/people', {
            templateUrl: 'pages/people.html',
            controller: 'peopleCtrl'
        }).
        when('/teaching', {
            templateUrl: 'pages/teaching.html',
            controller: 'teachingCtrl'
        }).
        when('/publications', {
            templateUrl: 'pages/publications.html',
            controller: 'publicationsCtrl'
        }).when('/media', {
            templateUrl: 'pages/media.html',
            controller: 'mediaCtrl'
        }).
            when('/dmbi', {
                templateUrl: 'pages/dmbi.html',
                controller: 'dmbiCtrl'
            }).
        when('/projects', {
            templateUrl: 'pages/projects.html',
            controller: 'projectsCtrl'
        }).
        when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'contactCtrl'
        }).

        when('/search', {
            templateUrl: 'pages/search.html',
            controller: 'searchCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
