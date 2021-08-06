let music = new Audio("css/music-index.mp3");
music.loop = true;
music.volume = 0.2;
music.play();

let play = document.getElementById("play");
let playButton = document.getElementById("playButton");

function play_audio() {
    if (music.paused) {
        music.play();
        playButton.src = "img/pause.png";
    } else {
        music.pause();
        playButton.src = "img/play.png";
    }
}
