//variables
const fs = require('fs');
let board = {};
const rockPaper = fs.readFileSync('rpslsRooms.json', 'utf-8');
let array = JSON.parse(rockPaper);

//funciones
let startGame = function (boardId) {
    boardArray = JSON.parse(fs.readFileSync('rpslsRooms.json', 'utf-8'));
    for (let i = 0; i < array.length; i++) {
        if (array[i].boardId == boardId) {
            board = boardArray[i];
            return board;
        }
    }
}

let connect = function (boardId, id) {
    array = JSON.parse(fs.readFileSync('rpslsRooms.json', 'utf-8'));

    let board = {
        "boardId": undefined,
        "player1": {
            "choice": 0,
            "winCount": 0,
            "loseCount": 0,
            "win": false
        },
        "player2": {
            "choice": 0,
            "winCount": 0,
            "loseCount": 0,
            "win": false
        },
        "playersId": [] /* [0] = PLAYER1 // [1] = PLAYER2. */
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i].boardId == boardId) {
            board = array[i];
            if (board.playersId.length < 2) {
                const index = board.playersId.indexOf(id);
                if (index == -1) {
                    board.playersId.push(id);
                }
            }
            array[i] = board;
            fs.writeFileSync('rpslsRooms.json', JSON.stringify(array));
            return board;
        }
    }
    board.boardId = boardId;
    board.playersId.push(id);
    array.push(board);
    fs.writeFileSync('rpslsRooms.json', JSON.stringify(array));
    return board;
}


let choice = function (boardId, id, choice) {
    array = JSON.parse(fs.readFileSync('rpslsRooms.json', 'utf-8'));

    for (let i = 0; i < array.length; i++) {
        if (array[i].boardId == boardId) {
            if (array[i].playersId[0] == id) {
                /* SI ES LA ID DEL PLAYER1 */
                array[i].player1.choice = choice;
            } else {
                array[i].player2.choice = choice;
            }
            board = array[i];
            break;
        }
    }
    fs.writeFileSync('rpslsRooms.json', JSON.stringify(array));
    if (board.playersId[0] === id) {
        return {
            "boardId": board.boardId,
            "player1": {
                "choice": board.player1.choice,
                "winCount": board.player1.winCount,
                "loseCount": board.player1.loseCount,
                "win": board.player1.win
            },
            "player2": {
                "winCount": board.player2.winCount,
                "loseCount": board.player2.loseCount,
                "win": board.player2.win
            },
            "playersId": board.playersId
        }
    } else {
        if (board.playersId[1] === id) {
            return {
                "boardId": board.boardId,
                "player1": {
                    "winCount": board.player1.winCount,
                    "loseCount": board.player1.loseCount,
                    "win": board.player1.win
                },
                "player2": {
                    "choice": board.player2.choice,
                    "winCount": board.player2.winCount,
                    "loseCount": board.player2.loseCount,
                    "win": board.player2.win
                },
                "playersId": board.playersId
            }
        }
    }
}

let compareChoices = function (boardId, id) {

    array = JSON.parse(fs.readFileSync('rpslsRooms.json', 'utf-8'));

    /* Casos de victoria:
        -Piedra: lagarto, tijera
        -Papel: piedra, spock
        -Tijera: papel, lagarto
        -Lagarto: spock, papel
        -Spock: tijera, piedra

    Casos de derrota:
        -Piedra: piedra, papel, spock
        -Papel: papel, tijera, lagarto
        -Tijera: tijera, spock, piedra
        -Lagarto: lagarto, piedra, tijera
        -Spock: spock, lagarto, papel
    */

    function winMatch(item) {
        item.player1.win = true;
        item.player1.winCount += 1;
        item.player2.loseCount += 1;
        item.player2.win = false;
        return item;
    }

    function loseMatch(item) {
        item.player2.win = true;
        item.player2.winCount += 1;
        item.player1.loseCount += 1;
        item.player1.win = false;
        return item;
    }

    function drawMatch(item) {
        item.player1.win = false;
        item.player2.win = false;
        return item;
    }

    for (let i = 0; i < array.length; i++) {
        if (array[i].boardId == boardId) {
            switch (array[i].player1.choice) {
                case 'rock':
                    switch (array[i].player2.choice) {
                        case 'lizard':
                        case 'scissor':
                            array[i] = winMatch(array[i]);
                            break;
                        case 'paper':
                        case 'spock':
                            array[i] = loseMatch(array[i]);
                            break;
                        case 'rock':
                            array[i] = drawMatch(array[i]);
                            break;
                        default:
                            console.log();
                    }
                    break;
                case 'paper':
                    switch (array[i].player2.choice) {
                        case 'rock':
                        case 'spock':
                            array[i] = winMatch(array[i]);
                            break;
                        case 'scissor':
                        case 'lizard':
                            array[i] = loseMatch(array[i]);
                            break;
                        case 'paper':
                            array[i] = drawMatch(array[i]);
                            break;
                        default:
                            console.log();
                    }
                    break;
                case 'scissor':
                    switch (array[i].player2.choice) {
                        case 'paper':
                        case 'lizard':
                            array[i] = winMatch(array[i]);
                            break;
                        case 'spock':
                        case 'rock':
                            array[i] = loseMatch(array[i]);
                            break;
                        case 'scissor':
                            array[i] = drawMatch(array[i]);
                            break;
                        default:
                            console.log();
                    }
                    break;
                case 'lizard':
                    switch (array[i].player2.choice) {
                        case 'spock':
                        case 'paper':
                            array[i] = winMatch(array[i]);
                            break;
                        case 'rock':
                        case 'scissor':
                            array[i] = loseMatch(array[i]);
                            break;
                        case 'lizard':
                            array[i] = drawMatch(array[i]);
                            break;
                        default:
                            console.log();
                    }
                    break;
                case 'spock':
                    switch (array[i].player2.choice) {
                        case 'scissor':
                        case 'rock':
                            array[i] = winMatch(array[i]);
                            break;
                        case 'lizard':
                        case 'paper':
                            array[i] = loseMatch(array[i]);
                            break;
                        case 'spock':
                            array[i] = drawMatch(array[i]);
                            break;
                        default:
                            console.log();
                    }
                    break;
                default:
                    console.log();
            }
            board = array[i];
            break;
        }
    }
    fs.writeFileSync('rpslsRooms.json', JSON.stringify(array));
    if (board.playersId[0] === id) {
        return {
            "boardId": board.boardId,
            "player1": {
                "choice": board.player1.choice,
                "winCount": board.player1.winCount,
                "loseCount": board.player1.loseCount,
                "win": board.player1.win
            },
            "player2": {
                "winCount": board.player2.winCount,
                "loseCount": board.player2.loseCount,
                "win": board.player2.win
            },
            "playersId": board.playersId
        }
    } else {
        if (board.playersId[1] === id) {
            return {
                "boardId": board.boardId,
                "player1": {
                    "winCount": board.player1.winCount,
                    "loseCount": board.player1.loseCount,
                    "win": board.player1.win
                },
                "player2": {
                    "choice": board.player2.choice,
                    "winCount": board.player2.winCount,
                    "loseCount": board.player2.loseCount,
                    "win": board.player2.win
                },
                "playersId": board.playersId
            }
        }
    }
}

let update = function (boardId, id) {
    array = JSON.parse(fs.readFileSync('rpslsRooms.json', 'utf-8'));
    for (let i = 0; i < array.length; i++) {
        if (array[i].boardId == boardId) {
            board = array[i];
            break;
        }
    }
    if (board.playersId[0] === id) {
        return {
            "boardId": board.boardId,
            "player1": {
                "choice": board.player1.choice,
                "winCount": board.player1.winCount,
                "loseCount": board.player1.loseCount,
                "win": board.player1.win
            },
            "player2": {
                "winCount": board.player2.winCount,
                "loseCount": board.player2.loseCount,
                "win": board.player2.win
            },
            "playersId": board.playersId
        }
    } else {
        if (board.playersId[1] === id) {
            return {
                "boardId": board.boardId,
                "player1": {
                    "winCount": board.player1.winCount,
                    "loseCount": board.player1.loseCount,
                    "win": board.player1.win
                },
                "player2": {
                    "choice": board.player2.choice,
                    "winCount": board.player2.winCount,
                    "loseCount": board.player2.loseCount,
                    "win": board.player2.win
                },
                "playersId": board.playersId
            }
        }
    }
}
let clean = function (boardId) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].boardId == boardId) {
            array[i].player1.choice = 0;
            array[i].player2.choice = 0;
            board = array[i];
            break;
        }
    }
    fs.writeFileSync('rpslsRooms.json', JSON.stringify(array));
    return board;
}

/* no funciona esta funcion que sirve para no repetir tanto codigo */
/* function returns(board,id){
    if (board.playersId[0] === id) {
        return {
            "boardId": board.boardId,
            "player1": {
                "choice": board.player1.choice,
                "winCount": board.player1.winCount,
                "loseCount": board.player1.loseCount,
                "win": board.player1.win
            },
            "player2": {
                "winCount": board.player2.winCount,
                "loseCount": board.player2.loseCount,
                "win": board.player2.win
            },
            "playersId": board.playersId
        }
    } else {
        if (board.playersId[1] === id) {
            return {
                "boardId": board.boardId,
                "player1": {
                    "winCount": board.player1.winCount,
                    "loseCount": board.player1.loseCount,
                    "win": board.player1.win
                },
                "player2": {
                    "choice": board.player2.choice,
                    "winCount": board.player2.winCount,
                    "loseCount": board.player2.loseCount,
                    "win": board.player2.win
                },
                "playersId": board.playersId
            }
        }
    }
}*/
module.exports = {
    startGame,
    connect,
    choice,
    compareChoices,
    update,
    clean
}