'use strict';

angular.module('rueChat').controller('mainCtrl', ['$scope', '$mdSidenav', 'Auth', 'chatService', function($scope, $mdSidenav, Auth, chat){
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
	$scope.filteredRooms = [];
	$scope.roomList = [];
	$scope.roomLog = [];
	$scope.$root.$on('roomList', function(event, rooms){
		$scope.roomList = rooms.rooms;
	});
	$scope.logout = function(){
		Auth.logout(function(){
			debugger;
		});
	};
	$scope.$root.$on('user joined', function(event, data){
		if(!isRoomOpen(data.room)){
			$scope.roomLog.push({
				room: data.room,
				access_date: new Date(),
				log: []
			});
		}
		$scope.currentRoom = data.room;
	});
	function isRoomOpen(name){
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room == name){
				return true;
			}
		};
		return false;
	}
	$scope.searchRoom = function(searchQuery){
		var filteredRooms = [];
		for (var i = $scope.roomList.length - 1; i >= 0; i--) {
			if($scope.roomList[i].toLowerCase().indexOf(searchQuery.toLowerCase()) != -1){
				filteredRooms.push($scope.roomList[i]);
			}
		};
		$scope.filteredRooms = filteredRooms;
	};
	$scope.joinRoom = function(room){
		chat.join({room: room});
		$scope.searchQuery = '';
	};
	$scope.switchRoom = function(room){
		$scope.currentRoom = room.room;
	};
}]);