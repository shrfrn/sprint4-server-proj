

const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http);

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, { autoSave: true }))

    gIo.on('connection', socket => {
        console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        console.log();
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('task-updated', activity => {
            // emits to all sockets:
            console.log('beafore');
            socket.broadcast.emit('task-updated', activity)
            // gIo.emit('task-updated', activity)
            // emits only to sockets in the same room
            // gIo.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('in-board', boardId => {
            if (socket.boardId === boardId) return;
            if (socket.boardId) {
                socket.leave(socket.boardId)
            }
            socket.join(boardId)
            socket.boardId = boardId
        })
        socket.on('left-board', boardId => {
            socket.leave(socket.boardId)
            delete socket.boardId
        })
        socket.on('board-updated', board => {
            socket.to(socket.boardId).emit('board-updated', board)
        })
        socket.on('board-list-updated', board => {
            socket.broadcast.emit(socket.boardId).emit('board-list-updated', board)
        })

    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}


// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast,
}



