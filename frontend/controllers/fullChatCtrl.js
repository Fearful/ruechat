'use strict';

angular.module('rueChat').controller('fullChatCtrl', ['$scope', 'chatService', function($scope, chat){
	$scope.newMsg = {
		content: '',
		$error: null,
		color: '#BBB',
		bold: false,
		italic: false
	};
	$scope.previousMsg = '';
	function getLevenshteinDistance(a, b){
		if(a.length == 0){ return b.length };
		if(b.length == 0){ return a.length };
		var matrix = [],
			i, j;
		for (i = 0; i <= b.length; i++) {
			matrix[i] = [i];
		};
		for (j = 0; j <= a.length; j++) {
			matrix[0][j] = j;
		};
		for (i = 1; i <= b.length; i++) {
			for (j = 1; j <= a.length; j++) {
				if(b.charAt(i-1) == a.charAt(j-1)){
					matrix[i][j] = matrix[i-1][j-1];
				} else {
					matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
					Math.min(matrix[i][j-1] + 1,
					matrix[i-1][j] + 1));
				}
			};
		};
		return matrix[b.length][a.length];
	};
	$scope.sendMsg = function(){
		// var unlikeness = getLevenshteinDistance($scope.newMsg.content, $scope.previousMsg);
		// if(unlikeness === 0 || unlikeness < ($scope.newMsg.content.length / 3)){
		// 	$scope.newMsg.content = '';
		// 	return;
		// }
		var msg = {
			username: $scope.$root.currentUser.username,
			content: $scope.newMsg,
			room: $scope.currentRoom
		}
		// $scope.previousMsg = msg.content;
		chat.sendMsg(msg);
	}
	$scope.$root.$on('newMsg', function(event, data){
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room == data.room){
				$scope.roomLog[i].log.push(data);
				$scope.$apply();
				return;
			}
		};
	});
}]);