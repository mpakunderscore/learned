let user = JSON.parse(localStorage.getItem('user')) || {};
console.log(user)

if (!user.id) {
    const response = get('/user');
    const userJson = JSON.parse(response);
    console.log(userJson)
    user.id = userJson.id;
    localStorage.setItem('user', JSON.stringify(user))
} else {
    console.log(user)
    const response = get('/user?id=' + user.id);
    const userJson = JSON.parse(response);
    console.log(userJson)
}

document.getElementById('userid').innerHTML = user.id;

function get(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
