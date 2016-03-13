'use strict';

angular.module('rueChat').controller('fullChatCtrl', ['$scope', 'chatService', '$timeout', function($scope, chat, $timeout){
	$scope.newMsg = {
		content: '',
		$error: null,
		color: '#BBB',
		bold: false,
		italic: false
	};
	$scope.newGroupChat = false;
	$scope.previousMsg = '';
	$scope.keepOpen = function(){
		$timeout(function(){
			$scope.newGroupChat = true;
		}, 100);
	}
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
		var isPm = false;
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room === $scope.currentRoom){
				if($scope.roomLog[i].pm){
					isPm = $scope.roomLog[i].roomName;
				}
			}
		};
		var msg = {
			username: $scope.$root.currentUser.username,
			content: $scope.newMsg,
			room: $scope.currentRoom,
			pm: isPm
		}
		// $scope.previousMsg = msg.content;
		chat.sendMsg(msg);
	}
	$scope.$root.$on('newMsg', function(event, data){
		if(data.username == $scope.currentUser.username){
			$scope.newMsg.content = '';
		}
		for (var i = $scope.roomLog.length - 1; i >= 0; i--) {
			if($scope.roomLog[i].room == data.room){
				if($scope.roomLog[i].log.length > 19){
					$scope.roomLog[i].log.pop();
				}
				$scope.roomLog[i].log.push(data);
				$timeout(function(){
					$scope.$apply();
				});
				return;
			}
		};
	});
}]).directive('chatUpdate', function () {
  return {
    scope: {
      room: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('room.log', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
});