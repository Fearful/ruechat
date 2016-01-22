module.exports = function(io){
	var numUsers = 0;

	io.on('connection', function (socket) {
		var defaultRoom = 'general'
		var rooms = ['General', 'Argentina', 'Magia', 'Illuminati', 'El bordo'];
		socket.emit('setup', {
			rooms: rooms
		});
		socket.on('join room', function(data){
			data.room = data.room.toLowerCase();
			socket.room = data.room;
			socket.join(data.room);
			io.to(data.room).emit('user joined',data);
		});
		socket.on('disconnect', function(data){
			socket.leave(data);
			socket.emit('disconnected', data);
		});
		socket.on('new message', function(data){
			var newMsg = {
				username: data.username,
				content: data.content.content,
				room: data.room.toLowerCase()
			};
			io.to(newMsg.room).emit('msg created', newMsg);
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
	});
};