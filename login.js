document.getElementById('submit').addEventListener('click', () => {
	let username = document.getElementById('username').value;
	let email = document.getElementById('email').value;
	let password = document.getElementById('password').value;
	let password_again = document.getElementById('password-again').value;
	let do_register = document.getElementById('do-register').checked;
	
	if (!do_register) {
		login(username, password).then(({ code, message }) => {
			if (code == 401) {
				window.location.href = 'login.html?m=error-login';
				return;
			}
			window.location.href = 'memory.html';
		});
	} else {
		if (password != password_again) {
			window.location.href = 'login.html?m=unequals-password';
			return;
		}
		register(username, email, password).then(() => {
			window.location.href = 'login.html?m=register-done';
		});
	}
});

document.getElementById('do-register').addEventListener('change', () => {
	if (event.target.checked) {
		document.getElementById('email').style.display = null;
		document.getElementById('password-again').style.display = null;
	} else {
		document.getElementById('email').style.display = 'none';
		document.getElementById('password-again').style.display = 'none';		
	}
});

document.getElementById('logout').addEventListener('click', () => {
	logout();
	window.location.href = 'login.html?m=logout';
});

function updateMessage() {
	let span = document.getElementById('message');
	
	if (!window.location.search.startsWith('?'))
		return;
		
	let code = new URLSearchParams(window.location.search).get('m');

	switch (code) {
		case 'restricted':
			span.innerText = 'Login required to access this page';
			break;
		case 'error-login':
			span.innerText = 'Username or Password invalid';
			break;
		case 'unequals-password':
			span.innerText = 'Password fields didn\'t match';
			break;
		case 'register-done':
			span.innerText = 'Registration succeed! You can login now';
			break;
		case 'logout':
			span.innerText = 'You are logged out';
	}
}

updateMessage();