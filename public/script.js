
// socket connects to root path
const socket = io('/')

// sends event to server
socket.emit('join-room', ROOM_ID, 10)