'use strict';
angular.module('rueChat').factory('commands', function ($rootScope) {
	var chat = function(cmmd, room){
		var action = cmmd.content.split('/')[1];
		switch(action){
			case 'help':
				// Display help
				room.log.push({
					content: 'Use "/away message" to set your away message if anyone pms you',
					room: room.room,
					username: 'SYSTEM'
				},{
					content: 'Use "/ckick username" to vote for kicking a user from the room',
					room: room.room,
					username: 'SYSTEM'
				},{
					content: 'Use "/quit" to leave the room',
					room: room.room,
					username: 'SYSTEM'
				},{
					content: 'Use "/csilence username" to vote for silencing a user temporaly',
					room: room.room,
					username: 'SYSTEM'
				},{
					content: 'Use "/silence username" to deny messages from a user',
					room: room.room,
					username: 'SYSTEM'
				},{
					content: 'Use "/whisper username message" send a whisper to a specific user in the current room',
					room: room.room,
					username: 'SYSTEM'
				}, {
					content: 'Use "/crules position newrule" to suggest a new or modification to a rule of the current room',
					room: room.room,
					username: 'SYSTEM'
				}, {
					content: 'Use "/rules" to see the current rules of the room',
					room: room.room,
					username: 'SYSTEM'
				},{
					content: 'Use "/blist word" vote for banning a word from being use in the room for 24 hours',
					room: room.room,
					username: 'SYSTEM'
				});
				break;
			case 'away':
				// This will make it so you can set a away msg if anyone contacts you by PM
				//msg --> cmmd.content.split('/')[1].split(' ')[1]
				break;
			case 'cnotice':
				// Community annoucement, the annoucement has to be approved by 80% of the room and will be send as a msg to all other rooms to promote something
				break;
			case 'notice':
				// Command for moderators will send an annoucement by the system to all users in the current room
				break;
			case 'ckick':
				// Initialize a vote on the current room to kick a specific user, this must be approved by a mayority (51%) of the users that ARE watching and interacting with the given room
				break;
			case 'kick':
				// Command for moderators will call for a vote on kicking a user among the current mods, if there isn't at least three mods this will only call for a community kick ('ckick')
				break;
			case 'quit':
				// Leave the current room
				break;
			case 'csilence':
				// Voting for silencing a user for 20, 40 or 60 minutes in the current room, it needs 30% for 20', 40% for 40' and more than 50% for 60'
			case 'silence':
				// Make a user silence to yourself
				break;
			case 'whisper':
				// Whisper to user, normally followed by the target username and msg
				break;
			case 'crules':
				// Propose a new or change a community rule (Which will save the manifest on each room)
				break;
			case 'rules':
				// Displays the rules from the current room
				break;
			case 'blist':
				// Vote for blacklisting a word from the room for 24 hours
				break;
		}
	};
	return chat;
});

// Define how mods will be selected and for how long