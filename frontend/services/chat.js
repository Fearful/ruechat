'use strict';
angular.module('rueChat').factory('chatService', function ($rootScope, socketFactory, $timeout) {
	var chat = {};
	var socket = socketFactory().connect();
	socket.on('setup', function(rooms){
		$rootScope.$broadcast('roomList', rooms);
	});
	// update user list live
	chat.join = function(data){
		socket.emit('join room', data);
	};
	chat.leave = function(data){
		socket.emit('leave room', data);
	};
	socket.on('user joined', function(data){
		$rootScope.$broadcast('user joined', data);
	});
	socket.on('user left', function(data){
		$rootScope.$broadcast('user left', data);
	});
	//send msg to a room and update all clients
	//disconnect from room
	// callback
	chat.disconnect = function(data){
		socket.emit('disconnect', data);
	};
	socket.on('disconnected', function(data){
		$rootScope.$broadcast('disconnected', data);
	});
	chat.sendMsg = function(data){
		socket.emit('new message', data);
	};
	socket.on('msg created', function(data){
		$rootScope.$broadcast('newMsg', data);
	});
	socket.on('new pm', function(data){
		$rootScope.$broadcast('new pm', data);
	});
	chat.pm = function(data){
		socket.emit('new chat', data);
	};
	chat.groupChat = function(name, users){
		socket.emit('gChat', {name: name, users: users});
	}
	return chat;
});