function callBackend(method, endpoint, data = null, headers = {}) {
	let token = localStorage.getItem('token');
	if (token) {
	  headers['Authorization'] = 'Bearer ' + token;
	}
	if (data) {
		data = JSON.stringify(data);
		headers['Content-Type'] = 'application/json';
	} else {
		data = undefined;
	}
	return fetch('http://localhost:8000/' + endpoint, {
		method: method,
		headers: {
			'Accept': 'application/json', // responding content-type
			...headers
		},
		body: data
	}).then(res => res.json()).catch(e => ({}));
}

function parseJWT(token) {
	var base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c =>
		'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	).join(''));

	return JSON.parse(jsonPayload);
}

function getUser() {
	let token = localStorage.getItem('token');
	if (!token)
		return Promise.resolve(null);

	let { sub: id, username: name, roles } = parseJWT(token);
	
	return callBackend('GET', `api/player/${id}/email`).then(() => {
		return { id, name, roles, token };
	}).catch(e => null);
}

function login(username, password) {
	return callBackend('POST', 'api/login_check', { username, password })
		.then(({ token, code, message }) => {
			if (token) {
				localStorage.setItem('token', token);
				return {};
			}
			return { code, message };
		});
}

function register(username, email, password) {
	return callBackend('POST', 'register', { username, email, password });
}

function logout() {
	localStorage.removeItem('token');
}