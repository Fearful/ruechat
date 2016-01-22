'use strict';

angular.module('rueChat').controller('loginCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location){
	$scope.user = {
		username: '',
		password: ''
	};
	$scope.login = function(){
		Auth.login(null, $scope.user, function(data){
			debugger;
		});
	};
	$scope.goToRegister = function(){
		$location.path('/register');
	};
}]);