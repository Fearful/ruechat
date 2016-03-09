'use strict';

angular.module('rueChat').controller('mainCtrl', ['$scope', '$mdSidenav', 'Auth', 'chatService', '$location', '$timeout', '$mdDialog', function($scope, $mdSidenav, Auth, chat, $location, $timeout, $mdDialog){
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
	$scope.groupChat = function(){
		function DialogController($scope, $mdDialog, users) {
	        $scope.users = users;
	        $scope.groupName = '';
	        $scope.create = function(){
	        	if(this.groupName.length > 0){
	        		chat.groupChat(this.groupName, users);
	        	}
	        	$mdDialog.hide();
	        }
	        $scope.closeDialog = function() {
	          $mdDialog.hide();
	        }
	      }
		var roomWhereTheyMet = false;
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room == $scope.currentRoom){
				roomWhereTheyMet = $scope.roomLog[i];
			}
		};
		if(roomWhereTheyMet){
			var selectedUsers = roomWhereTheyMet.users.filter(function(obj){return obj.selected});
			selectedUsers.push({username: $scope.currentUser.username});
	       var parentEl = angular.element(document.body);
	       $mdDialog.show({
	         parent: parentEl,
	         template: '<md-dialog aria-label="Create new group chat">' +
			  '<md-dialog-content layout-padding>'+
			  '<h3>Group Name:</h3>'+
			   '<md-input-container>' +
			   	'<input type="text", ng-model="groupName">' +
			   '</md-input-container>' +
			    '<md-list>' +
			      '<md-list-item ng-repeat="user in users">' +
			        '<p class="md-caption">{{user.username}}</p>' +
			      '</md-list-item>' +
			    '</md-list>' +
			  '</md-dialog-content>' +
			  '<md-dialog-actions>' +
			  '<md-button ng-click="create()" class="md-primary">Create Chat</md-button>' +
			    '<md-button ng-click="closeDialog()" class="md-primary">Close Dialog</md-button>' +
			  '</md-dialog-actions>' +
			 '</md-dialog>',
	         locals: {
	           users: selectedUsers
	         },
	         controller: DialogController
	      });
		}
	};
}]);