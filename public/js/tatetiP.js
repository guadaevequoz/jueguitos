document.addEventListener('DOMContentLoaded', function () {

    const socket = io();
    let gameInfo = {
        id: undefined,
        symbol: undefined,
        boardID: undefined
    }

    const winMsg = document.querySelector("#win");
    const turn = document.querySelector("#turn");

    const board = {
        pos00: document.querySelector("#pos00"),
        pos01: document.querySelector("#pos01"),
        pos02: document.querySelector("#pos02"),
        pos10: document.querySelector("#pos10"),
        pos11: document.querySelector("#pos11"),
        pos12: document.querySelector("#pos12"),
        pos20: document.querySelector("#pos20"),
        pos21: document.querySelector("#pos21"),
        pos22: document.querySelector("#pos22"),
    }
    const boardText = document.querySelector("#board");
    const roomName = document.querySelector("#roomName");
    const formCreateRoom = document.querySelector("#formCreateRoom");
    const blurry = document.querySelector(".blurry");
    const backBtn = document.querySelector("#back")

    const prefix = '/tateti';
    let data;
    let draw = 0;
    let winner = {
        turn: "",
        boolean: false,
        draw: false
    };

    tateti = function (method, url, data) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open(method, prefix + url, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        reject(JSON.parse((req.responseText)));
                    }
                }
            };
            req.onerror = function () {
                reject(Error("network error"));
            };
            req.send(JSON.stringify(data));
        });
    };

    function showError(msg) {
        document.getElementById('error').innerText = msg;
        console.error(msg);
    }

    function joinGame() {
        if (!(winner.boolean)) {
            tateti('GET', `/${gameInfo.boardID}/startGame`, data)
                .then(initGame)
                .then(drawBoard)
                .catch(e => showError(e.message));
        }
    }

    function initGame(response) {
        game = response;
        return response;
    }

    function drawBoard(response) {
        for (const element in board) {
            board[element].innerHTML = response.board[element];
            if (board[element].innerHTML === "X" | board[element].innerHTML === "O") {
                draw++;
            }
        }
        winner = response.win;
        if (draw == 9) {
            winner.draw = true
        }
        if (gameInfo.symbol === winner.turn) {
            turn.innerHTML = "es tu turno!"
        } else {
            turn.innerHTML = "es el turno de tu compañero :)"
        }

        if (winner.boolean) {
            if (winner.turn === gameInfo.symbol) {
                winMsg.innerHTML = "GANASTE :)"
            } else {
                winMsg.innerHTML = "PERDISTE :("
            }
            turn.innerHTML = " "
        } else if (winner.draw) {
            winMsg.innerHTML = "empataron"
            turn.innerHTML = " "
        }
        draw = 0;
    }

    function play(pos) {
        if ((board[pos].innerHTML !== "X") && (board[pos].innerHTML !== "O") && !(winner.boolean)) {
            if (gameInfo.symbol === winner.turn) {
                let sendPos = pos.slice(-2);
                tateti('PATCH', `/${gameInfo.boardID}/player${gameInfo.id}/${sendPos}`, data)
                    .then(drawBoard)
                    .catch(e => showError(e.message));
                socket.emit('tateti-play', gameInfo);
            }
        }
    }

    function update() {
        tateti('GET', `/${gameInfo.boardID}/update`, data)
            .then(drawBoard)
            .catch(e => showError(e.message));
    }

    function listeners() {
        for (const element in board) {
            board[element].addEventListener('click', function () {
                play(element);
            })
        }
    }

    backBtn.addEventListener('click', function () {
        tateti('POST', `/${gameInfo.boardID}/reset`, data)
            .then(drawBoard)
            .catch(e => showError(e.message));
        window.location.href = './index.html';
    })

    formCreateRoom.onsubmit = function (e) {
        e.preventDefault();

        gameInfo.boardID = roomName.value;
        boardText.innerHTML += gameInfo.boardID;

        socket.emit("create", gameInfo.boardID);

        formCreateRoom.classList.add("hidden");
        blurry.classList.add("hidden");

        tateti('PATCH', `/${gameInfo.boardID}/player${gameInfo.id}`, data)
            .then(begin)
            .catch(e => showError(e.message));
    }

    function start() {
        formCreateRoom.classList.remove("hidden");
        blurry.classList.remove("hidden");
    }

    function sockets() {
        socket.on('tateti-id', (idData) => {
            if (gameInfo.id === undefined) {
                gameInfo.id = idData;
            }
        })
        socket.on('tateti-play', (idData) => {
            update();
        })
        socket.on('tateti-start', (idData) => {
            joinGame();
            listeners();
        })
    }

    function begin(response) {
        gameInfo.symbol = response.symbol;
        if (response.length == 2) {
            socket.emit("tateti-start", gameInfo);
        }
    }

    start();
    sockets();
});