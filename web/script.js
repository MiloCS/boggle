let timerIID;
let timer;

let socket = io();
let url = window.location.href.split("/");
socket.emit('setup', url[url.length - 1]);

function startTimer(duration, display) {
	clearInterval(timerIID);
    var timer = duration, minutes, seconds;
    timerIID = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = 0;
            endTimer();
        }
    }, 1000);
}

function endTimer() {
	clearInterval(timerIID);
	t = document.getElementsByClassName("timer")[0];
	t.classList.add("redtimer")
}

function timerSetup() {
	t = document.getElementsByClassName("timer")[0];
	t.classList.remove("redtimer")
    var threeMinutes = 60 * 3 - 1,
    display = document.getElementsByClassName('timer')[0];
    startTimer(threeMinutes, display);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function loadBoard(arr) {
	let pa = document.getElementsByClassName("play-area")[0];
	removeAllChildNodes(pa);
	for (let x of arr) {
		e = document.createElement("div");
		e.classList.add("letter")
		e.textContent = x;
		pa.appendChild(e);
	}
}

function newGame(board) {
	document.getElementsByClassName("timer")[0].textContent = "03:00"
	loadBoard(board);
	timerSetup();
}

function newGameSignal() {
	socket.emit('newgame');
}

window.onload = function() {
	document.getElementsByClassName("newgame")[0].addEventListener("click", function () {
		newGameSignal();
	})
	socket.on("newgame", function(board) {
		newGame(board);
	})
}
