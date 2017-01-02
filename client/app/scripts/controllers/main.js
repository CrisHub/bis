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
  	$scope.currentFilter = 'All';
  	$scope.products = resolveData.data;
  	$scope.pageTitle = 'Booked products';
  	alertify.logPosition("top left");
  	var srz = function(obj, prefix) {
	  var str = [], p;
	  for(p in obj) {
	    if (obj.hasOwnProperty(p)) {
	      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
	      str.push((v !== null && typeof v === "object") ?
	        serialize(v, k) :
	        encodeURIComponent(k) + "=" + encodeURIComponent(v));
	    }
	  }
	  return str.join("&");
	}
  	$scope.sendEmail = function(id) {
  		$http.get('/book-confirmation/'+id).then(function(response) {
  			angular.forEach($scope.products, function(p, idx) {
				if (p.id === response.data.id){
					$scope.products[idx] = response.data;
				}
			});
  			alertify.success('Email successfully sent!');
  		}, function(response) {
  			alertify.error(response);
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
  	} 
  	$scope.unpicked = function(id) {
  		$http.get('/delete-product/'+id).then(function(response) {
  			angular.forEach($scope.products, function(p, idx) {
  				if (p.id === response.data.id) {
  					$scope.products.splice(idx, 1);
  				}
  			});
  			alertify.success('Product successfully deleted!');
  		}, function(response) {
  			alertify.error(response);
  		});
  	};
  	$scope.getFiltered = function(status) {
  		var query = {status:status};
  		$http.get('/products?'+srz(query)).then(function(response) {
  			console.log(response);
  		});
  	}
  });
