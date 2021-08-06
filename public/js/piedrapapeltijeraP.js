document.addEventListener('DOMContentLoaded', function () {

    const socket = io();
    const prefix = "/rockPaper";

    let data;
    let enemyChoice;

    const chooses = {
        rock: document.querySelector("#rock"),
        paper: document.querySelector("#paper"),
        scissor: document.querySelector("#scissor"),
        lizard: document.querySelector("#lizard"),
        spock: document.querySelector("#spock")
    }

    let gameInfo = {
        id: undefined,
        boardID: undefined
    }

    const boardText = document.querySelector("#board");
    const roomName = document.querySelector("#roomName");
    const formCreateRoom = document.querySelector("#formCreateRoom");
    const blurry = document.querySelector(".blurry");
    const backBtn = document.querySelector("#back")


    const timer = document.querySelector("#timer");
    const yourChoice = document.querySelector("#yourChoice");
    const otherChoice = document.querySelector("#otherChoice");
    const winCounter = document.querySelector("#counter-wins");
    const loseCounter = document.querySelector("#counter-lose");



    rockPaper = function (method, url, data) {
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

    function initGame(response) {
        game = response;
        yourChoice.innerHTML = "";
        return response;
    }

    function startGame() {
        rockPaper('GET', `/${gameInfo.boardID}/startGame`, data)
            .then(initGame)
            .catch(e => showError(e.message));
    }


    function drawBoard(response) {
        if (gameInfo.id === response.playersId[0]) {
            winCounter.innerHTML = response.player1.winCount;
            loseCounter.innerHTML = response.player1.loseCount;
        } else {
            winCounter.innerHTML = response.player2.winCount;
            loseCounter.innerHTML = response.player2.loseCount;
        }
        switch (enemyChoice) {
            case 'rock':
                otherChoice.innerHTML = "Piedra";
                break;
            case 'paper':
                otherChoice.innerHTML = "Papel";
                break;
            case 'scissor':
                otherChoice.innerHTML = "Tijera";
                break;
            case 'lizard':
                otherChoice.innerHTML = "Lagarto";
                break;
            case 'spock':
                otherChoice.innerHTML = "Spock";
                break;
        }

        newChoice(response);
    }

    function play(choice) {
        if ((yourChoice.innerHTML !== "rock") | (yourChoice.innerHTML !== "paper") | (yourChoice.innerHTML !== "scissor") |
            (yourChoice.innerHTML !== "lizard") | (yourChoice.innerHTML !== "spock")) {
            switch (choice) {
                case 'rock':
                    yourChoice.innerHTML = "<strong>Piedra</strong>";
                    break;
                case 'paper':
                    yourChoice.innerHTML = "<strong>Papel</strong>";
                    break;
                case 'scissor':
                    yourChoice.innerHTML = "<strong>Tijera</strong>";
                    break;
                case 'lizard':
                    yourChoice.innerHTML = "<strong>Lagarto</strong>";
                    break;
                case 'spock':
                    yourChoice.innerHTML = "<strong>Spock</strong>";
                    break;
            }
            rockPaper('PATCH', `/${gameInfo.boardID}/player${gameInfo.id}/choice${choice}`, data)
                .catch(e => showError((e.message)));
            socket.emit('rpsls-choice', {
                info: gameInfo,
                choice: choice
            });
            socket.emit('rpsls-play', gameInfo);
        }
    }

    function newChoice(response) {
        let i = 4;
        for (choice in chooses) {
            chooses[choice].disabled = true;
        }
        if (response.player1.win) {
            if (gameInfo.id == response.playersId[0]) {
                timer.innerHTML = 'GANASTE';
            } else {
                timer.innerHTML = 'perdiste :(';
            }
        } else if (response.player2.win) {
            if (gameInfo.id == response.playersId[1]) {
                timer.innerHTML = 'GANASTE';
            } else {
                timer.innerHTML = 'perdiste :(';
            }
        } else {
            timer.innerText = 'empataron!!';
        }
        const inter = setInterval(function () {
            if (i < 3) {
                timer.innerHTML = `Volvés a jugar en ${i} segundos.`;
            }
            i--;
            if (i == -1) {
                yourChoice.innerHTML = "";
                otherChoice.innerHTML = "";
                clearInterval(inter);
                timer.innerHTML = 'Escoge una opción'
                for (choice in chooses) {
                    chooses[choice].disabled = false;
                }
                rockPaper('PATCH', `/${gameInfo.BoardID}/clean`, data)
                    .catch(e => showError((e.message)));
            }
        }, 1000);
    }

    formCreateRoom.onsubmit = function (e) {
        e.preventDefault();

        gameInfo.boardID = roomName.value;
        boardText.innerHTML += gameInfo.boardID;

        socket.emit("create", gameInfo.boardID);

        formCreateRoom.classList.add("hidden");
        blurry.classList.add("hidden");

        rockPaper('PATCH', `/${gameInfo.boardID}/player${gameInfo.id}`, data)
            .then(begin)
            .catch(e => showError(e.message));
    }

    function start() {
        formCreateRoom.classList.remove("hidden");
        blurry.classList.remove("hidden");
    }

    backBtn.addEventListener('click', function () {
        rockPaper('POST', `/${gameInfo.boardID}/clean`, data)
            .then(drawBoard)
            .catch(e => showError(e.message));
        window.location.href = './index.html';
    })

    function sockets() {
        socket.on('rpsls-id', (idData) => {
            if (gameInfo.id == undefined) {
                gameInfo.id = idData;
            }
        })
        socket.on('rpsls-start', (idData) => {
            timer.innerHTML = 'Escoge una opción';
            startGame();
            listeners();
        })
        socket.on('rpsls-choice', (idData) => {
            enemyChoice = idData;
        })
        socket.on('rpsls-play', (idData) => {
            rockPaper('PATCH', `/${idData.boardID}/player${gameInfo.id}/compareChoices`, data)
                .catch(e => showError(e.message))
        })
        socket.on('rpsls-update', (idData) => {
            rockPaper('GET', `/${idData.boardID}/player${gameInfo.id}/update`, data)
                .then(drawBoard)
                .catch(e => showError(e.message))
        })
    }

    function listeners() {
        for (const element in chooses) {
            chooses[element].addEventListener('click', function () {
                ownChoice = element;
                play(element);
            })
        }
    }

    function begin(response) {
        if (response.playersId.length == 2) {
            socket.emit('rpsls-start', gameInfo);
        }
    }

    start();
    sockets();

})