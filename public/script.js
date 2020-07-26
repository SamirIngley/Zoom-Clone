
// socket connects to root path
const socket = io('/')
const myPeer = new Peer(undefined, { // undef bc server generates our id
    host: '/',
    port: 3001
})
const myVideo = document.createElement('video')
myVideo.muted = true // mutes video for ourselves

const videoGrid = document.getElementById('video-grid')
const peers = {}
// connecting video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => { // promise, passes us a stream
    // stream and video setup
    addVideoStream(myVideo, stream)

    // listening when someone tries to call us
    myPeer.on('call', call => {

        call.answer(stream) // answer and send our stream
        const video = document.createElement('video')
        // we answered call, need to respond to video stream coming in so we both get each others stream
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    // allow to be connected by other users
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream) // userid, and send current video stream to that user
        console.log('User connected:' + userId)

    })
})

socket.on('user-disconnected', userId => {
    console.log('User disconnected: ', userId)
    if  (peers[userId]) peers[userId].close()
})

// soon as we open and connect to peer server and get id, run below
myPeer.on('open', id => {
    // sends event to server
    socket.emit('join-room', ROOM_ID, id)
})

// // if user connects, log that event
// socket.on('user-connected', userId => {
//     console.log('User connected:' + userId)
// })

// function to tell our myVideo object to use that video from navigator.mediaDevices
function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play() // once video is loaded, play it
    })
    videoGrid.append(video)
}


function connectToNewUser(userId, stream) {
    // call a user with a certain id to and give them our stream
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    // when they send us back their video stream, we get the 'stream' event which will take in their video stream
    call.on('stream', userVideoStream => { // just add video stream to our list of videos
        addVideoStream(video, userVideoStream)
    }) 
    call.on('close', () => { // remove video when someone leaves
        video.remove()
    })
    // every user id is linked to that call, so we can get rid of them when they leave
    peers[userId] = call
}