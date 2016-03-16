'use strict';

angular.module('rueChat').controller('mainCtrl', ['$scope', '$mdSidenav', 'Auth', 'chatService', '$location', '$timeout', '$mdDialog', '$mdMenu', function($scope, $mdSidenav, Auth, chat, $location, $timeout, $mdDialog, $mdMenu){
	$scope.$root.loader.spinner.setComplete();
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
	$scope.openUserMenu = function($mdOpenMenu, event){
		$mdOpenMenu(event);
	};
	$scope.logout = function(){
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			$scope.leaveRoom($scope.roomLog[i].room);
		};
		Auth.logout(function(){
			$location.path('/login');
		});
	};
	$scope.uploadNewImg = function(event){
		if(event.target.files[0]){
	        var fileReader = new FileReader();
	        fileReader.onload = function(fileLoadedEvent) {
	        	// Send base64 img to the server 
	            var base64 = fileLoadedEvent.target.result;
	            chat.newUserImg(base64, $scope.$root.currentUser.username);
	        }
	        fileReader.readAsDataURL(event.target.files[0]);
		}
	};
	$scope.$root.$on('nui', function(event, data){
		var dataURIComponents = data.img.split(',');
		var mimeString = dataURIComponents[0].split(':')[1].split(';')[0];
		var byteString;
		if(dataURIComponents[0].indexOf('base64') != -1){
		     byteString = atob(dataURIComponents[1]);
		}
		else{
		     byteString = unescape(dataURIComponents[1]);
		}
		var length = byteString.length;
		var ab = new ArrayBuffer(length);
		var ua = new Uint8Array(ab);
		for(var i=0; i<length; i++){
		     ua[i] = byteString.charCodeAt(i);
		}
		var builder = new Blob([ab], {type:mimeString});
		// Create image locally
		var userImageProcessed = window.URL.createObjectURL(builder);
		if($scope.$root.currentUser.username == data.user){
			$scope.$root.currentUser.img = userImageProcessed;
		} 
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			for (var e = $scope.roomLog[i].users.length - 1; e >= 0; e--) {
				if($scope.roomLog[i].users[e].username == data.user){
					$scope.roomLog[i].users[e].img = userImageProcessed;
				}
			}
		}
		$scope.$apply();
		// should update the users img property which should render on the client (transform base64)
	});
	$scope.$root.$on('user joined', function(event, data){
		// should render all base64 img attributes from the data.users
		if(!isRoomOpen(data.room)){
			$scope.roomLog.push({
				room: data.room,
				access_date: new Date(),
				log: [],
				users : data.users
			});
			$scope.currentRoom = data.room;
			$scope.$apply();
			if(data.users.length > 1){
				for (var i = data.users.length - 1; i >= 0; i--) {
					if(data.users[i].img){
						var dataURIComponents = data.users[i].img.split(',');
						var mimeString = dataURIComponents[0].split(':')[1].split(';')[0];
						var byteString;
						if(dataURIComponents[0].indexOf('base64') != -1){
						     byteString = atob(dataURIComponents[1]);
						}
						else{
						     byteString = unescape(dataURIComponents[1]);
						}
						var length = byteString.length;
						var ab = new ArrayBuffer(length);
						var ua = new Uint8Array(ab);
						for(var e=0; e<length; e++){
						     ua[e] = byteString.charCodeAt(e);
						}
						var builder = new Blob([ab], {type:mimeString});
						data.users[i].img = window.URL.createObjectURL(builder);
					} else {
						//assign default img TODO
					}
				}
				$timeout(function(){
					$scope.$apply();
				});
			}
		} else {
			for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
				if($scope.roomLog[i].room == data.room){
					if($scope.roomLog[i].log.length > 19){
						$scope.roomLog[i].log.pop();
					}
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
						if($scope.roomLog[i].log.length > 19){
							$scope.roomLog[i].log.pop();
						}
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
						if($scope.roomLog[i].log.length > 19){
							$scope.roomLog[i].log.pop();
						}
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