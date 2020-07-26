
// socket connects to root path
const socket = io('/')
const myPeer = new Peer(undefined, { // undef bc server generates our id
    host: '/',
    port: 3001
})

// soon as we open and connect to peer server and get id, run below
myPeer.on('open', id => {
    // sends event to server
    socket.emit('join-room', ROOM_ID, id)
})


// if user connects, log that event
socket.on('user-connected', userId => {
    console.log('User connected:' + userId)
})