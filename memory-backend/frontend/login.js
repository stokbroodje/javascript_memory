function callBackend(method, endpoint, data, headers = {}) {
	return fetch('http://localhost:8000/' + endpoint, {
		method: method,
    	headers: {
			'Content-Type': 'application/json', // own content-type
			'Accept': 'application/json', // responding content-type
			...headers
		},
		body: JSON.stringify(data)
	}).then(res => res.json());
}

function parseJWT(token) {
	var base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
}

function storeToken({ token, code, message }) {
	if (code) {
		alert(`Error: ${message} (${code})`);
		return;
	}
	localStorage.setItem('token', token);

	alert('Success!');
}

function getPayload() {
    let { sub: id, username, roles } = parseJWT(localStorage.getItem('token'));

	return { id, username, roles };
}

function getToken() {
	let username = document.getElementById('user').value;
	let password = document.getElementById('password').value;
	
	let data = { username, password };
	
	callBackend('POST', 'api/login_check', data)
	  .then(storeToken).then(() => console.log(getPayload()));
}

document.getElementById('submit').addEventListener('click', getToken);
