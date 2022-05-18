const dice = [
'aaafrs',
'aaeeee',
'aafirs',
'adennn',
'aeeeem',
'aeegmu',
'aegmnn',
'afirsy',
'bjkqxz',
'ccenst',
'ceiilt',
'ceilpt',
'ceipst',
'ddhnot',
'dhhlor',
'dhlnor',
'dhlnor',
'eiiitt',
'emottt',
'ensssu',
'fiprsy',
'gorrvw',
'iprrry',
'nootuw',
'ooottu'
]

let timerIID;

function sampleBoard(numSamples) {
	let board = []

	let bucket = []

	for (let i=0; i<numSamples; i++) {
		bucket.push(i);
	}

	for (let i=0; i<numSamples; i++) {
		let randomIndex = Math.floor(Math.random()*bucket.length);
		board.push(dice[bucket.splice(randomIndex, 1)[0]].charAt(Math.floor(Math.random() * 5)))
	}
	return board;
}

function startTimer(duration, display) {
	clearInterval(timerIID);
    let timer = duration, minutes, seconds;
    timerIID = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function timerSetup() {
    var fiveMinutes = 60 * 3,
    display = document.getElementsByClassName('timer')[0];
    startTimer(fiveMinutes, display);
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

function newGame() {
	let board = sampleBoard(25);
	loadBoard(board);
	timerSetup();
}

window.onload = function() {
	newGame();

	document.getElementsByClassName("newgame")[0].addEventListener("click", function () {
		newGame();
	})
}
