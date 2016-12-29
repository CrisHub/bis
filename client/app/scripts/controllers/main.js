'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope, $position, $http, resolveData) {
  	$scope.products = resolveData.data;
  	$scope.pageTitle = 'Booked products';
  	$scope.sendEmail = function(id) {
  		$http.get('/book-confirmation/'+id).then(function(response) {
  			console.log(response);
  		}, function(response) {
  			console.log(response);
  		});
  	};
  	$scope.pikedUp = function(id) {
  		$http.get('/soft-delete-product/'+id).then(function(response) {
  			console.log(response);
  		}, function(response) {
  			console.log(response);
  		})
  	} 
  	$scope.unpiked = function(id) {
  		$http.get('/delete-product/'+id).then(function(response) {
  			console.log(response);
  		}, function(response) {
  			console.log(response);
  		});
  	};
  });
