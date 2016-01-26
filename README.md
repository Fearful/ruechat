RueChat

Anonymous chat system, based around community self awareness and interactivity. No messages are saved on server side, they only communicate between clients.

Development planning

---------------------- REFACTOR ----------------------

0.0.2 Planned Features

- Save groups & connect to them when authenticated
- Record and send audio
- Take / send pictures
- Take / send video
- Voice call (2 or more)
- Video call (2 or more)

---------------------- REFACTOR ----------------------

0.0.1 Missing features

- PMs (DONE)
- Group chats (private chats - invite only - not saved)
- Whisper feature
- Community driven op commands, ban, silence, banword, ban age, etc
- Suggest username if already taken
- Be able to upload a profile picture (none will be saved, either use a free image service and link back or let them upload the picture OR maybe let them upload in js make a thumbnails version transform it into a binary and send it over with the username, storage temporaly inside the log of chat users which destroys each user and its binary image after disconnecting)

0.0.0 Current features

- User can register / login
- Each username is unique, no email required, no validation.
- Whenever the user enters the app, it prompts it to connect to the 'general' chatroom
- The user can search and join any room and multiple at a same time
- The user can interact with other users inside a room
- Whenever a user enters a room it displays to other online users notifing that someone has join, the same happens if someone leaves a room or discconnects
