'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngAlertify'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/booked-products');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'app/views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'app/scripts/directives/header/header.js',
                    'app/scripts/directives/header/header-notification/header-notification.js',
                    'app/scripts/directives/sidebar/sidebar.js',
                    'app/scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bc/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bc/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bc/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bc/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bc/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bc/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bc/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.bookedProducts',{
        url:'/booked-products',
        controller:'bookInStoreCtrl',
        templateUrl:'app/views/dashboard/booked-products.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'app/scripts/controllers/main.js',
              'app/scripts/controllers/bookInStoreCtrl.js',
              'app/scripts/directives/notifications/notifications.js',
              ]
            })
          },
          resolveData: function($http) {
            return $http({
              method: 'GET',
              url: '/products',
              params: {type:'book-in-store',status:'email-sent'}
            }).then(function successCallback(response) {
                return response;
                // this callback will be called asynchronously
                // when the response is available
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
          }
        }
      })
      .state('dashboard.preorderedProducts',{
        url:'/preordered-products',
        controller:'bookInStoreCtrl',
        templateUrl:'app/views/dashboard/preordered-products.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'app/scripts/controllers/main.js',
              'app/scripts/controllers/preorderedProducts.js',
              'app/scripts/directives/notifications/notifications.js',
              ]
            })
          },
          resolveData: function($http) {
            return $http({
              method: 'GET',
              url: '/preorderd_products',
              params: {type:'preorder'}
            }).then(function successCallback(response) {
                return response;
                // this callback will be called asynchronously
                // when the response is available
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
          }
        }
      });
  }]);

    
