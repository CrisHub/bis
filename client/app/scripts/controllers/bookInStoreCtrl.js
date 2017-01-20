'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('bookInStoreCtrl', function($scope, $position, $http, $state, resolveData, alertify) {
    $scope.activeFilters = [
      {value:'all',label:'All'},
      {value:'email-sent',label:'Email sent'},
      {value:'picked', label:'Archived'},
      {value:'null', label:'Email not sent'}
    ];
    $scope.currentFilter = $scope.activeFilters[3];
  	$scope.products = resolveData.data;
  	$scope.pageTitle = 'Booked products';
  	alertify.logPosition("top left");
  	$scope.sendEmail = function(id) {
  		$http.get('/book-confirmation/'+id).then(function(response) {
  			
        if (response.status != 'error') {
          if ($scope.products.length == 1) {
            $state.go('dashboard.bookedProducts');
            $scope.getFiltered({value:'email-sent', label:'Email sent'});
            return;
          }
          angular.forEach($scope.products, function(p, idx) {
            if (p.id === response.data.id){
              $scope.products[idx] = response.data;
            }
          });
          alertify.success('Email successfully sent!');
        } else {
          alertify.error(response.message);
        }
  			
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
    
  	$scope.getFiltered = function(status) {
      $scope.currentFilter = status;
  		var query = {type:'book-in-store', status:status.value};
  		$http({method:'GET', url:'/products', params:query }).then(function(response) {
  			$scope.products = response.data;
  		});
  	};
    $scope.reverse = false;
    $scope.sortBy = function(propertyName) {
      $scope.reverse = !$scope.reverse;
      $scope.propertyName = propertyName;
    };
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
      $scope.dt = null;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(),
      startingDay: 1
    };
    $scope.openDatepicker = function() {
      $scope.datepicker.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.datepicker = {
      opened: false
    };

});
