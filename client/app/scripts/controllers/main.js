'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope, $position, $http, resolveData, alertify) {
  	$scope.products = resolveData.data;
  	$scope.pageTitle = 'Booked products';
  	alertify.logPosition("top left");
  	$scope.sendEmail = function(id) {
  		$http.get('/book-confirmation/'+id).then(function(response) {
  			console.log(response);
  			angular.forEach($scope.products, function(p, idx) {
				if (p.id === response.id){
					$scope.products[idx] = response;
					console.log($scope.products[idx]);
				}
			});
  			alertify.success('Email successfully sent!');
  		}, function(response) {
  			alertify.error(response);
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
