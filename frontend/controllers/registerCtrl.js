'use strict';

angular.module('rueChat').controller('registerCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location){
	$scope.user = {
		username: '',
		password: ''
	};
	$scope.register = function(){
		Auth.createUser($scope.user, function(data){
			$location.path('/');
		});
	};
	$scope.goToLogin = function(){
		$location.path('/login');
	};
}]);