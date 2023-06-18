function toFullColor(col) {
	// expecting either '#rrggbb' or '#rgb' and converting to '#rrggbb'

	if (col.length == 7)
		return col;
	
	let r = col[1],
		g = col[2],
		b = col[3];
	
	return '#' + r + r + g + g + b + b;
}

function updateLogin() {
	let span = document.getElementById('login');
	
	getUser().then(user => {
		if (!user) {
			window.location.href = 'login.html?m=restricted';
		}
	
		span.innerText = `Logged in as ${user.name}`;
	});
}

function updateForm() {
	getUser().then(user => {
		callBackend('GET', `api/player/${user.id}/email`).then(mail => {
			document.getElementById('email').value = mail;
		});
		
		callBackend('GET', `api/player/${user.id}/preferences`).then(({ color_found, color_closed, preferred_api }) => {
			if (!preferred_api)
				preferred_api = 'none';
			if (!color_found)
				color_found = '#00ff00';
			if (!color_closed)
				color_closed = '#ffff00';
	
			document.getElementById('color-found').value = toFullColor(color_found);
			document.getElementById('color-closed').value = toFullColor(color_closed);
			document.getElementById('api').value = preferred_api;
		});
	});
}

document.getElementById('submit').addEventListener('click', () => {
	getUser().then(user => {
		let set_pref = callBackend('POST', `api/player/${user.id}/preferences`, {
			id: user.id,
			color_found: document.getElementById('color-found').value,
			color_closed: document.getElementById('color-closed').value,
			api: document.getElementById('api').value
		});
		
		let set_email = callBackend('PUT', `api/player/${user.id}/email`, {
			email: document.getElementById('email').value
		});	
		
		return Promise.all([ set_email, set_pref ]);
	}).then(() => {
		window.location.href = 'settings.html?m=success'
	});
});

function updateMessage() {
	let span = document.getElementById('message');
	
	if (!window.location.search.startsWith('?'))
		return;

	let code = new URLSearchParams(window.location.search).get('m');

	switch (code) {
		case 'success':
			span.innerText = 'Succeed';
			break;
	}
}

updateMessage();
updateLogin();
updateForm();