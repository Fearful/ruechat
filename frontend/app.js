'use strict';
angular.module('rueChat', [
	'ngMaterial',
	'ngRoute',
	'btford.socket-io'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'partials/fullChat.jade',
		controller: 'fullChatCtrl'
	}).
	when('/login', {
		templateUrl: 'partials/login.jade',
		controller: 'loginCtrl'
	}).
	when('/register', {
		templateUrl: 'partials/register.jade',
		controller: 'registerCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]).
run(function ($rootScope, $location, Auth) {
	$rootScope.$watch('currentUser', function(currentUser) {
	  // if no currentUser and on a page that requires authorization then try to update it
	  // will trigger 401s if user does not have a valid session
	  if (!currentUser && (['/login', '/logout', '/register'].indexOf($location.path()) == -1 )) {
	    Auth.currentUser();
	  }
	});
	// On catching 401 errors, redirect to the login page.
	$rootScope.$on('event:auth-loginRequired', function() {
	  $location.path('/login');
	  return false;
	});
});