document.addEventListener('DOMContentLoaded', function () {


    const prefix = '/ahorcado'
    let history = [];
    let letterNode = document.querySelector('#letter');
    let checkBtn = document.querySelector('#btnCheck');
    let playAgainBtn = document.querySelector('#btnPlayAgain');
    let resultNode = document.querySelector('#result');
    let triesNode = document.querySelector('#tries');
    let recordNode = document.querySelector('#record');
    let statusNode = document.querySelector('#status');
    let drawingNode = document.querySelector('#drawing');
    let attemps = 5;
    let data;
    let firstTime = true;
    let id;

    ahorcado = function (method, url, data) {
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

    //generador de ids
    function generateRandomString() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result1;
    }

    function showError(msg) {
        document.getElementById('error').innerText = msg;
        console.error(msg);
    }

    function startGame() {
        id = generateRandomString();
        ahorcado('GET', `/startGame/${id}`, data)
            .then(initGame)
            .then(drawBoard)
            .catch(e => showError(e.message));
    }

    function checkLetter() {
        firstTime = false;
        let userLetter = letterNode.value;
        userLetter = userLetter.toLowerCase();
        if (resultNode.textContent.includes(userLetter)) {
            emptyLetterNode();
        } else {
            ahorcado('POST', `/checkLetter/${id}/${userLetter}`)
                .then(drawBoard)
                .then(endGame)
                .catch(e => showError(e.message));
        }
    }

    function initGame(response) {
        game = response;
        return response;
    }

    function drawBoard(response) {
        let userLetter = letterNode.value;
        emptyLetterNode();
        if (!firstTime) {
            if (!response.guess) {
                attemps -= 1;
                drawingNode.src = "img/state/" + attemps + ".png";
                history.push(userLetter);
            }

        }
        resultNode.textContent = response.showWord.join(' ');
        triesNode.textContent = attemps;
        recordNode.textContent = response.history.join(' ');
    }

    function checkEnter(event) {
        if (event.code == 'Enter') {
            checkLetter();
        }
    }

    function endGame() {
        ahorcado('POST', `/endGame/${id}/${attemps}`)
            .then(function (response) {
                let msg = response.msg;
                if (response.status === "winner" | response.status === "loser") {
                    if (response.status === "loser") {
                        let letter = "";
                        for (const property in response.word) {
                            if (property != ",")
                                letter = letter + response.word[property];
                        }
                        statusNode.textContent = msg + ". La palabra era: " + letter;
                    } else {
                        statusNode.textContent = msg;
                    }
                    playAgainBtn.style.display = "block";
                }
            })
            .catch(e => showError(e.message));
    }

    function emptyLetterNode() {
        letterNode.value = '';
        letterNode.focus();
    }
    checkBtn.addEventListener('click', checkLetter);
    letterNode.addEventListener('keyup', checkEnter);
    playAgainBtn.addEventListener('click', function () {
        window.location.reload(false)
    });
    startGame();

});