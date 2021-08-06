const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');

const utf = 'utf-8';
const tatetiFile = 'tatetiRooms.json';
const rpslsFile = 'rpslsRooms.json';

let cont = [];

app.set('json spaces', 2);
app.set('port', PORT);

app.use(express.static('public'));
app.use(express.json());

app.use(require('./routes/ahorcado'));
app.use(require('./routes/tateti'));
app.use(require('./routes/rockPaper'));

const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {

    socket.on('disconnect', () => {

        let board = {};

        if(disconnect(board, tatetiFile, socket.id)){
            console.log(`User ${socket.id} has disconnected from Tateti`);
        }else{
            if(disconnect(board,rpslsFile,socket.id)){
                console.log(`User ${socket.id} has disconnected from RPSLS`);
            }
        }
    })


    socket.on("create", function (room) {
        socket.join(room);
        const contInfo = {
            boardID: room,
            cont: 0
        }
        cont.push(contInfo);
    })

    io.sockets.emit('tateti-id', socket.id);

    socket.on('tateti-start', (idData) => {
        io.sockets.in(idData.boardID).emit("tateti-start", idData);
    })

    socket.on('tateti-play', (idData) => {
        socket.broadcast.to(idData.boardID).emit("tateti-play", idData);
    })

    io.sockets.emit('rpsls-id', socket.id);

    socket.on('rpsls-start', (idData) => {
        io.sockets.in(idData.boardID).emit("rpsls-start", idData);
    })

    socket.on('rpsls-play', (idData) => {
        if (counter(idData) == 2) {
            socket.broadcast.to(idData.boardID).emit("rpsls-play", idData);
            io.sockets.in(idData.boardID).emit("rpsls-update", idData);
            setZero(idData);
        }
    })
    socket.on('rpsls-choice', (idData) => {
        socket.broadcast.to(idData.info.boardID).emit("rpsls-choice", idData.choice);
    })
})

function counter(idData) {
    for (let i = 0; i < cont.length; i++) {
        if (cont[i].boardID == idData.boardID) {
            cont[i].cont++;
            return cont[i].cont;
        }
    }
}

function setZero(idData) {
    for (let i = 0; i < cont.length; i++) {
        if (cont[i].boardID == idData.boardID) {
            cont[i].cont = 0;
            return cont[i].cont;
        }
    }
}

function disconnect(board, fileName, id){
    const boardArray = JSON.parse(fs.readFileSync(fileName, utf));
    for (let i = 0; i < boardArray.length; i++) {
        const length = boardArray[i].playersId.length;
        for (let j = 0; j < length; j++) {
            if (boardArray[i].playersId[j] == id) {
                board = boardArray[i];
                const index = board.playersId.indexOf(id);
                if (index > -1) {
                    board.playersId.splice(index, 1);
                    if (board.playersId.length == 0) {
                        boardArray.splice(i, 1);
                    }
                    fs.writeFileSync(fileName, JSON.stringify(boardArray));
                    return true;
                }
            }
        }
    }

}