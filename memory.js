// UTILITIES
// =========

function toFullColor(col) {
	// expecting either '#rrggbb' or '#rgb' and converting to '#rrggbb'

	if (col.length == 7)
		return col;
	
	let r = col[1],
		g = col[2],
		b = col[3];
	
	return '#' + r + r + g + g + b + b;
}

function shuffleArray(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
	
		// And swap it with the current element.
		[ array[currentIndex], array[randomIndex] ] = [ array[randomIndex], array[currentIndex] ];
	}

	return array;
}

// CONSTANTS
// =========

const DOG_API = "https://dog.ceo/api/breeds/image/random";
const CAT_API = "https://cataas.com/api/cats?limit=";
const CAT_API_PREFIX = "https://cataas.com/cat/";

const BOARD_SIZE = 36;


// GLOBALS
// =======

let buttons, done, openButton, pairs, time, interval =null;

// HELPERS
// =======

function getButton(btn) {
	return buttons[btn.id];
}

function makeBoard(res) {
	let board = document.getElementById("game_board");
	
	time = 0;
	
	if (interval) 
		clearInterval(interval);

	interval = setInterval(() => 
		document.getElementById('game_time').innerText = `Time: ${time++}sec`
	, 1000);

	let i = 0;
	for (let img of shuffleArray(res.concat(res))) {
		var btn = document.createElement("div");
		btn.setAttribute('area-label', 'card');
		btn.classList.add('card');
	
		btn.id = 'card-' + i;
		btn.addEventListener('click', onCardClick);
		
		board.appendChild(btn);
			
		buttons['card-' + i] = {
			state: 'closed',
			img: img,
		};
		i++;
	}
}


// HANDLERS
// ========

function onSelect() {
	let board = document.getElementById("game_board");
	board.innerHTML = '';
	
	buttons = {};
	openButton = null;
	done = [];
	pairs = 0;
	
	let select = document.getElementById('picture-select');
	switch (select.value) {
	case 'dog':
		let promises = [];
		for (let i = 0; i < BOARD_SIZE / 2; i++) {
			promises.push(fetch(DOG_API).then(res => res.json()).then(res => res.message));
		}
		Promise.all(promises).then(makeBoard);
		break;
	case 'cat':
		fetch(CAT_API + (BOARD_SIZE / 2), { mode: 'cors' }).then(res => res.json()).then(res =>
			makeBoard(res.map(x => CAT_API_PREFIX + x._id))
		);
		break;
	default: 
		return;	
	}
}

function menu(){
	let m = document.getElementById('menu');
	if(m.style.display == 'flex'){
		m.style.display = 'none';
	}else{
		m.style.display = 'flex';
	}
	
	console.log(m.getPropertyValue());
}

function onCardClick(evt) {
	if (done.includes(this))
	return;

	this.innerHTML = `<img width=100% height=100% src='${getButton(this).img}' />`;

	if (openButton) {
		if (this != openButton && getButton(openButton).img == getButton(this).img) {
			done.push(openButton);
			done.push(this);
			pairs++;
			document.getElementById('pairs').innerHTML = pairs;
	
			this.classList.add('done');
			openButton.classList.add('done');
			
			if (pairs >= BOARD_SIZE / 2) {
			alert("GEFELICITEERD!!!");
			}
		}
		openButton.classList.remove('clicked');
		openButton = null;
	} else {
		openButton = this;
		this.classList.add('clicked');
	}
}

function colorChange() {
	let color = document.getElementById("closed_card").value;
//	let fcolor = document.getElementById("found_card").value;
	
	for (let x of document.getElementsByClassName("card"))
		x.style.backgroundColor = color;

//	for (let x of document.getElementsByClassName("done"))
//		x.style.backgroundColor = fcolor;
}

function updateTop() {
	let list = document.getElementById("top_5");
	list.innerHTML = '';
	
	let players = callBackend('GET', 'scores').then(res =>
		res.sort((a, b) => b.score - a.score).slice(0, 5).forEach(({ username, score }) => {
			let entry = document.createElement('li');
			entry.innerText = `${username} (${score})`;
			list.appendChild(entry);
		})
	);	
}

function updateLogin() {
	let span = document.getElementById('login');
	
	let user = getUser().then(user => {
		if (!user) {
			window.location.href = 'login.html?m=restricted';
		}
	
		span.innerText = `Logged in as ${user.name}`;
	});
}

function updatePref() {
	getUser().then(user =>
		callBackend('GET', `api/player/${user.id}/preferences`).then(({ color_found, color_closed, preferred_api }) => {
			if (!preferred_api)
				preferred_api = 'none';
			if (!color_found)
				color_found = '#00ff00';
			if (!color_closed)
				color_closed = '#ffff00';
	
			document.getElementById('found_card').value = toFullColor(color_found);
			document.getElementById('closed_card').value = toFullColor(color_closed);
			document.getElementById('picture-select').value = preferred_api;

			onSelect();
			setTimeout(colorChange, 500);
		})
	);	
}

updateTop();
updateLogin();
updatePref();