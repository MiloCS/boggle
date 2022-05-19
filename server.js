let express = require('express');
let app = express();
let http = require('http').createServer(app);
let https = require('https');
let io = require('socket.io')(http);
const fs = require('fs');

let nameWords;

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

function createRoomName() {
	word1 = nameWords[Math.floor(Math.random() * nameWords.length)]
	word2 = nameWords[Math.floor(Math.random() * nameWords.length)]

	return word1 + "-" + word2
}

function readWords() {
	fs.readFile('words.txt', 'utf8', (err, data) => {
	  if (err) {
	    console.error(err);
	    return;
	  }
	  nameWords = data.split("\r\n");
	});
}

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

readWords();

rooms = new Map();
users = new Map();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/web/start.html')
})

app.get('/start', (req, res) => {
	name = createRoomName();
	rooms[name] = sampleBoard(25);
	res.redirect('/' + name)
})

app.use(express.static(__dirname + '/web/'));

app.get('/*', (req, res) => {
	res.sendFile(__dirname + '/web/index.html')
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('setup', (room) => {
  	users.set(socket.id, room)
  	if (rooms.has(room)) {
  		rooms.get(room).users.push(socket.id)
  	}
  	else {
  		rooms.set(room, {
  			board: sampleBoard(25),
  			users: [socket.id]
  		})
  	}
  	socket.join(room)
  	socket.emit('newgame', rooms.get(room).board)
  })
  socket.on('newgame', () => {
  	room = users.get(socket.id)
  	rooms.get(room).board = sampleBoard(25);
  	io.to(room).emit('newgame', rooms.get(room).board)
  })
  socket.on('disconnect', () => {
  	room = users.get(socket.id)
  	users.delete(socket.id)
  	if (rooms.has(room)) {
	  	roomUsers = rooms.get(room).users
	  	idx = roomUsers.indexOf(socket.id)
	  	roomUsers.splice(idx, 1)
	  	if (roomUsers.length < 1) {
	  		rooms.delete(room)
	  	}
  	}
  })
});


http.listen(3000, () => {
     console.log('listening on localhost:3000');
});