function login() {
    const user = document.getElementById('user_login').value;
    const password = document.getElementById('password_login').value;
    const data = {
        user: user,
        password: password
    }
    fetch('http://localhost:8080/', {
        method:'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
}

function register() {
    const user = document.getElementById('user_register').value;
    const password = document.getElementById('password_register').value;
    const data = {
        user: user,
        password: password
    }
    fetch('http://localhost:8080/register', {
        method:'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}