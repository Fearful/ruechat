'use strict';
angular.module('rueChat').factory('chatService', function ($rootScope, socketFactory) {
	var chat = {};
	var socket = socketFactory().connect();
	socket.on('setup', function(rooms){
		$rootScope.$broadcast('roomList', rooms);
	});
	// update user list live
	chat.join = function(data){
		socket.emit('join room', data);
	};
	socket.on('user joined', function(data){
		$rootScope.$broadcast('user joined', data);
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

	return chat;
});