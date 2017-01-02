'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('preorderedProducts', function($scope, $position, $http, resolveData, alertify) {
    $scope.activeFilters = [
      {value:'all',label:'All'},
      {value:'email-sent',label:'Email sent'},
      {value:'picked', label:'Archived'},
      {value:'null', label:'Email not sent'}
    ];
    $scope.currentFilter = $scope.activeFilters[1];
  	$scope.products = resolveData.data;
  	$scope.pageTitle = 'Booked products';
  	alertify.logPosition("top left");
  	
  	$scope.getFiltered = function(status) {
      $scope.currentFilter = status;
  		var query = {type:'preorder', status:status.value};
  		$http({method:'GET', url:'/products', params:query }).then(function(response) {
  			$scope.products = response.data;
  		});
  	}
  });
