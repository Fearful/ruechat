module.exports = function(io){
	var numUsers = 0;
	var clients = [];
	io.on('connection', function (socket) {
		var defaultRoom = 'general';
		var rooms = ['General', 'Argentina', 'Magia', 'Illuminati', 'El bordo'];
		socket.emit('setup', {
			rooms: rooms
		});
		socket.on('join room', function(data){
			socket.username = data.username;
			socket.join(data.room);
			var newUser = {
				username: data.username
			};
			if(clients['clientList-' + data.room]){
				clients['clientList-'+data.room].push(newUser);
			} else {
				clients['clientList-'+data.room] = [newUser];
			}
			data.users = clients['clientList-'+data.room];
			io.to(data.room).emit('user joined',data);
		});
		socket.on('leave room', function(data){
			var arr = Object.keys(clients);
			for (var i = arr.length - 1; i >= 0; i--) {
				if(arr[i] == 'clientList-'+data.room){
					clients[arr[i]].splice(clients[arr[i]].indexOf({ username: data.username }), 1);
				}
			};
			if(data.roomName){
				data.pm = true;
				socket.leave(data.roomName);
				io.to(data.roomName).emit('user left', data);
			} else {
				socket.leave(data.room);
				io.to(data.room).emit('user left', data);
			}
		});
		socket.on('new message', function(data){
			var newMsg = {
				username: data.username,
				content: data.content.content,
				room: data.room
			};
			if(!data.pm){
				io.to(newMsg.room).emit('msg created', newMsg);
			} else {
				var sender = data.pm.split('-')[0] == socket.username ? data.pm.split('-')[0] : data.pm.split('-')[1];
				var receiver = data.pm.split('-')[0] != socket.username ? data.pm.split('-')[0] : data.pm.split('-')[1];
				newMsg.room = sender;
				socket.broadcast.to(data.pm).emit('msg created', newMsg);
				newMsg.room = receiver;
				socket.emit('msg created', newMsg);
			}
		})
		socket.on('new chat', function(data){
			var currentSockets = io.sockets.clients().sockets;
			var arr = Object.keys(currentSockets);
			var userExists = false;
			for (var i = arr.length - 1; i >= 0; i--) {
				if(currentSockets[arr[i]].username == data.to){
					userExists = currentSockets[arr[i]];
				}
			};
			if(userExists){
				var roomName = userExists.username + '-' + socket.username;
				userExists.join(roomName);
				socket.join(roomName);
				userExists.emit('new pm', {
					room: socket.username,
					log: [{
						content: 'New chat between ' + userExists.username + ' and ' + socket.username,
						room: socket.username,
						username: 'SYSTEM'
					}],
					users: [{username: socket.username},{username:userExists.username}],
					pm: true,
					roomName : roomName
				});
				socket.emit('new pm', {
					room: userExists.username,
					log: [{
						content: 'New chat between ' + socket.username + ' and ' + userExists.username,
						room: userExists.username,
						username: 'SYSTEM'
					}],
					users: [{username: socket.username},{username:userExists.username}],
					pm: true,
					roomName : roomName
				});
			}
		})
	  // when the client emits 'typing', we broadcast it to others
	  socket.on('typing', function () {
	    socket.broadcast.emit('typing', {
	      username: socket.username
	    });
	  });

	  // when the client emits 'stop typing', we broadcast it to others
	  socket.on('stop typing', function () {
	    socket.broadcast.emit('stop typing', {
	      username: socket.username
	    });
	  });
	  socket.on('disconnect', function(){
	  	//we are currently notifing all rooms of a disconnection, this should be room located notifications to avoid over communication
  		var arr = Object.keys(clients);
		for (var i = arr.length - 1; i >= 0; i--) {
			for (var j = clients[arr[i]].length - 1; j >= 0; j--) {
				if(clients[arr[i]][j].username == socket.username){
					clients[arr[i]].splice(j, 1);
				}
			};
		};
	  	// figureout how to alert the user has left all rooms (socketio bug erasing room list before executing event)
	  	socket.broadcast.emit('user left', {
	        username: socket.username
	      });
	  })
	});
};