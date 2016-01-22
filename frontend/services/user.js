angular.module('rueChat')
  .factory('Auth', function Auth($location, $rootScope, $http) {
  	var Session = '/login';
	var User = '/auth/users/:id/';
	$rootScope.currentUser = localStorage.getItem("rueUser") ? JSON.parse(localStorage.getItem("rueUser")) : null;
    return {

      login: function(provider, user, callback) {
        var cb = callback || angular.noop;
        $http.post('/login', user).then(function(data) {
        	localStorage.setItem("rueUser", JSON.stringify(data.data));
          	$rootScope.currentUser = data.data;
          	return cb();
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;
        $http.delete('/login').then(function(res) {
            $rootScope.currentUser = null;
            return cb();
          });
      },

      createUser: function(userinfo, callback) {
        var cb = callback || angular.noop;
        $http.post('/register', userinfo).then(function(user) {
            $rootScope.currentUser = user;
            return cb();
          });
      },

      currentUser: function() {
        $http.get('/login').then(function(user) {
    		if(!user.user){
    			$location.path('/login');
    			return;
    		}
        	$rootScope.currentUser = user;
        });
      },

      // changePassword: function(email, oldPassword, newPassword, callback) {
      //   var cb = callback || angular.noop;
      //   User.update({
      //     email: email,
      //     oldPassword: oldPassword,
      //     newPassword: newPassword
      //   }, function(user) {
      //       console.log('password changed');
      //       return cb();
      //   }, function(err) {
      //       return cb(err.data);
      //   });
      // },

      // removeUser: function(email, password, callback) {
      //   var cb = callback || angular.noop;
      //   User.delete({
      //     email: email,
      //     password: password
      //   }, function(user) {
      //       console.log(user + 'removed');
      //       return cb();
      //   }, function(err) {
      //       return cb(err.data);
      //   });
      // }
    };
  })