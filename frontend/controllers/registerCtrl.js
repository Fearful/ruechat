'use strict';

angular.module('rueChat').controller('registerCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location){
	$scope.user = {
		username: '',
		password: ''
	};
	$scope.register = function(){
		Auth.createUser($scope.user, function(data){
			debugger;
		});
	};
	$scope.goToLogin = function(){
		$location.path('/login');
	};
}]);