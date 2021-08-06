const palabra = require('./palabraAleatoria.js');
let msg = "sigue jugando";
let board = {};

const file = 'ahorcado.json';
const fs = require('fs');
let arrayFile = fs.readFileSync(file, 'utf-8');
let array = JSON.parse(arrayFile);

let startGame = function (id) {
    let guessWord = palabra();
    let showWord = [];
    for (let letra of guessWord) {
        showWord.push('_');
    }
    board = {
        guessWord: guessWord,
        showWord: showWord,
        id: id,
        guess: false,
        history: []
    }
    array.push(board);
    fs.writeFileSync(file, JSON.stringify(array));
    return {
        showWord: board.showWord,
        id: board.id,
        guess: board.guess,
        history: board.history
    };
}

let checkLetter = function (id, letter) {
    if (letter) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                for (const [pos, guessLetter] of array[i].guessWord.entries()) {
                    if (letter == guessLetter) {
                        array[i].showWord[pos] = guessLetter;
                    }
                }
                if (array[i].guessWord.includes(letter))
                    array[i].guess = true;
                else {
                    array[i].history.push(letter);
                    array[i].guess = false;
                }
                board = array[i];
                break;
            }
        }
    }
    fs.writeFileSync(file, JSON.stringify(array));
    return {
        showWord: board.showWord,
        id: board.id,
        guess: board.guess,
        history: board.history
    };
}

let endGame = function (id, attemps) {
    let status = null;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            if (!array[i].showWord.includes('_')) {
                msg = "Ganaste";
                status = "winner";
                array.splice(i, 1);
                fs.writeFileSync(file, JSON.stringify(array));
                return {
                    msg,
                    status
                };
            } else {
                if (attemps == 0) {
                    msg = "Perdiste";
                    status = "loser";
                    word = array[i].guessWord;
                    array.splice(i, 1);
                    fs.writeFileSync(file, JSON.stringify(array));
                    return {
                        msg,
                        status,
                        word
                    }
                } else {
                    fs.writeFileSync(file, JSON.stringify(array));
                    return {
                        msg
                    };
                }
            }
        }
    }
}

module.exports = {
    startGame,
    checkLetter,
    endGame
}