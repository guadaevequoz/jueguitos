const fs = require('fs');

let board = {};
const file = 'tatetiRooms.json';
const utf = 'utf-8';
let boardArray = JSON.parse(fs.readFileSync(file, utf));

/* funciones */

let startGame = function (boardID) {
    boardArray = JSON.parse(fs.readFileSync(file, utf));
    for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i].boardID == boardID) {
            board = board = boardArray[i];
            board.win.turn = "X"; /* X siempre es el primero acorde a las reglas. */
            return {
                boardID: board.boardID,
                board: board.board,
                win: board.win
            };
        }
    }
}

let update = function (boardID) {
    for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i].boardID == boardID) {
            board = boardArray[i];
            return {
                boardID: board.boardID,
                board: board.board,
                win: board.win,
            };
        }
    }

}

let connect = function (boardID, id) {
    boardArray = JSON.parse(fs.readFileSync(file, utf));
    let playerSymbol;
    let board = {
        "boardID": undefined,
        "board": {
            pos00: "-",
            pos01: "-",
            pos02: "-",
            pos10: "-",
            pos11: "-",
            pos12: "-",
            pos20: "-",
            pos21: "-",
            pos22: "-"
        },
        "win": {
            "turn": " ",
            "boolean": false,
            "draw": false
        },
        "playersId": []
    }
    for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i].boardID == boardID) {
            board = boardArray[i];
            if (board.playersId.length < 2) {
                const index = board.playersId.indexOf(id);
                if (index == -1) {
                    board.playersId.push(id);
                }
            }
            playerSymbol = 'O';
            boardArray[i] = board;
            fs.writeFileSync(file, JSON.stringify(boardArray));
            return {
                symbol: playerSymbol,
                length: board.playersId.length
            };
        }
    }
    board.boardID = boardID;
    playerSymbol = 'X';
    board.playersId.push(id);
    boardArray.push(board);
    fs.writeFileSync(file, JSON.stringify(boardArray));
    return {
        symbol: playerSymbol,
        length: board.playersId.length
    };
}

let play = function (boardID, id, pos) {
    if ((pos >= 00 && pos <= 02) || (pos >= 10 && pos<=12) || (pos >=20 && pos<=22)) {
        for (let i = 0; i < boardArray.length; i++) {
            if (boardArray[i].boardID == boardID) {
                let newPos = 'pos' + pos;
                board = boardArray[i];
                if (id === board.playersId[0]) {
                    if (board.win.turn == "X") board.board[newPos] = "X";
                } else if (id === board.playersId[1]) {
                    if (board.win.turn == "O") board.board[newPos] = "O";
                }
                const wins = {
                    case1: areEqual(board.board.pos00, board.board.pos10, board.board.pos20),
                    case2: areEqual(board.board.pos01, board.board.pos11, board.board.pos21),
                    case3: areEqual(board.board.pos02, board.board.pos12, board.board.pos22),
                    case4: areEqual(board.board.pos00, board.board.pos01, board.board.pos02),
                    case5: areEqual(board.board.pos10, board.board.pos11, board.board.pos12),
                    case6: areEqual(board.board.pos20, board.board.pos21, board.board.pos22),
                    case7: areEqual(board.board.pos00, board.board.pos11, board.board.pos22),
                    case8: areEqual(board.board.pos02, board.board.pos11, board.board.pos20),
                };

                function areEqual() {
                    const len = arguments.length;
                    for (let i = 1; i < len; i++) {
                        if (arguments[i] === "-" || arguments[i] !== arguments[i - 1]) {
                            return false;
                        }
                    }
                    return true;
                }

                function winner() {
                    for (const element in wins) {
                        if (wins[element]) {
                            board.win.boolean = wins[element];
                        }
                    }
                }
                winner();

                if (!(board.win.boolean)) {
                    if (board.win.turn === "X") {
                        board.win.turn = "O"
                    } else if (board.win.turn === "O") {
                        board.win.turn = "X"
                    }
                }
                return {
                    boardID: board.boardID,
                    board: board.board,
                    win: board.win,
                };
            }
        }
   } else {
        console.log('Lo enviado en POS no es un numero valido');
    }
}

let back = function (boardID) {
    for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i].boardID == boardID) {
            board = boardArray[i];
            for (const element in board) {
                board[element] = "-";
            }
            board.win.turn = "X";
            board.win.boolean = false;
            board.win.draw = false;
            return {
                boardID: board.boardID,
                board: board.board,
                win: board.win,
            };
        }
    }
}

module.exports = {
    startGame,
    update,
    connect,
    play,
    back
}