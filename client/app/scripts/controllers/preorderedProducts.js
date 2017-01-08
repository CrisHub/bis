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
      {value:'all',label:'All'}
    ];
    $scope.currentFilter = $scope.activeFilters[1];
  	$scope.products = resolveData.data;
  	$scope.pageTitle = 'Preordered products';
  	alertify.logPosition("top left");
  	
  	$scope.getFiltered = function(status) {
      $scope.currentFilter = status;
  		var query = {type:'preorder', status:status.value};
  		$http({method:'GET', url:'/preorderd_products', params:query }).then(function(response) {
  			$scope.products = response.data;
  		});
  	};

    $scope.pickedUp = function(id) {
      $http.get('/soft-delete-product/'+id).then(function(response) {
        angular.forEach($scope.products, function(p, idx) {
          if (p.id === response.data.id) {
            $scope.products.splice(idx, 1);
          }
        });
        alertify.success('Product successfully archived!');
      }, function(response) {
        alertify.error(response);
      })
    };

    $scope.unpicked = function(id) {
      $http.get('/delete-product/'+id).then(function(response) {
        if(parseInt(response.data)>0 ){
          angular.forEach($scope.products, function(p, idx) {
            if (p.id === id) {
              $scope.products.splice(idx, 1);
            }
          });
        }
        alertify.success('Product successfully deleted!');
      }, function(response) {
        alertify.error(response);
      });
    };
  });
