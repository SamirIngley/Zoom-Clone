// express server
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4 : uuidV4 } = require('uuid')


// setup how we render views (ejs library)
app.set('view engine', 'ejs')
// setup static folder
app.use(express.static('public'))


// routes
app.get('/', (req, res) => {
    // create a brand new room and send user there
    res.redirect(`/${uuidV4()}`) // get a random dynamic roomid/uuid generated
})

// dynamic param in url, use that param in res.render
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room }) 
})

// anytime someone comes on webpage
io.on('connection', socket => {
    // set up events to listen to: when someone connects to a room, pass in roomId and userId
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId)
    })
})

server.listen(3000)