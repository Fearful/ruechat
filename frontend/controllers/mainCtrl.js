'use strict';

angular.module('rueChat').controller('mainCtrl', ['$scope', '$mdSidenav', 'Auth', 'chatService', '$location', '$timeout', function($scope, $mdSidenav, Auth, chat, $location, $timeout){
	$scope.openMenu = function(){
		if($scope.isMenuOpen()){ return; }
		$mdSidenav('left').toggle();
	};
	$scope.isMenuOpen = function(){
      return $mdSidenav('left').isOpen();
    };
    $scope.closeMenu = function(){
		if(!$scope.isMenuOpen()){ return; }
		$mdSidenav('left').close();
	};
	$scope.roomList = [];
	$scope.roomLog = [];
	$scope.$root.$on('roomList', function(event, rooms){
		$scope.roomList = rooms.rooms;
	});
	$scope.logout = function(){
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			$scope.leaveRoom($scope.roomLog[i].room);
		};
		Auth.logout(function(){
			$location.path('/login');
		});
	};
	$scope.$root.$on('user joined', function(event, data){
		if(!isRoomOpen(data.room)){
			$scope.roomLog.push({
				room: data.room,
				access_date: new Date(),
				log: [],
				users : data.users
			});
			$scope.currentRoom = data.room;
			$scope.$apply();
		} else {
			for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
				if($scope.roomLog[i].room == data.room){
					$scope.roomLog[i].log.push({
						content: data.username + ' has joined the room.',
						room: data.room,
						username: 'SYSTEM'
					});
					$scope.roomLog[i].users.push({
						username: data.username
					})
					$scope.$apply();
					return;
				}
			};
		}
	});
	$scope.$root.$on('user left', function(event, data){
		if(data.room && !data.pm){
			if(isRoomOpen(data.room)){
				for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
					if($scope.roomLog[i].room == data.room){
						$scope.roomLog[i].log.push({
							content: data.username + ' has left the room.',
							room: data.room,
							username: 'SYSTEM'
						});
						$scope.roomLog[i].users.splice($scope.roomLog[i].users.indexOf({ username: data.username }), 1);
					}
				};
				$scope.$apply();
			}
		} else if(!data.pm){
			for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
				for (var j = $scope.roomLog[i].users.length - 1; j >= 0; j--) {
					if($scope.roomLog[i].users[j].username == data.username){
						$scope.roomLog[i].log.push({
							content: data.username + ' has left the room.',
							room: data.room,
							username: 'SYSTEM'
						});
						$scope.roomLog[i].users.splice(j, 1);
					}
				};
			};
			$scope.$apply();
		}
		if(data.pm){
				for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
					if($scope.roomLog[i].roomName && $scope.roomLog[i].roomName == data.roomName){
						$scope.roomLog[i].log.push({
							content: data.username + ' has left the room.',
							room: data.room,
							username: 'SYSTEM'
						});
						$scope.roomLog[i].users.splice($scope.roomLog[i].users.indexOf({ username: data.username }), 1);
					}
				};
				$scope.$apply();
		}
	});
	function isRoomOpen(name){
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room == name){
				return true;
			}
		};
		return false;
	}
	$scope.joinRoom = function(room){
		chat.join({room: room, username: $scope.$root.currentUser.username});
		$scope.searchQuery = '';
	};
	if($scope.$root.currentUser){
		$scope.joinRoom('General');
	}
	$scope.switchRoom = function(room){
		$scope.currentRoom = room.room;
	};
	$scope.leaveRoom = function(room){
		var pmRoom = false;
		$scope.currentRoom = '';
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room == room){
				if($scope.roomLog[i].pm){
					pmRoom = $scope.roomLog[i].roomName;
				}
				$scope.roomLog.splice(i, 1);
				$timeout(function(){
					$scope.$apply();
				});
			}
		};
		var data = {
			room: room,
			username: $scope.$root.currentUser.username
		}
		if(pmRoom){
			data.roomName = pmRoom;
		}
		chat.leave(data);
	};
	$scope.$root.$on('new pm', function(event, data){
		$scope.roomLog.push(data);
		$timeout(function(){
			$scope.$apply();
		});
	});
	$scope.pmUser = function(user){
		chat.pm({ to: user.username });
	};
}]);