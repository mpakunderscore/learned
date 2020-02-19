let user = JSON.parse(localStorage.getItem('user')) || {};
// console.log(user)

if (!user.id) {
    const response = get('/user');
    user = JSON.parse(response);
    localStorage.setItem('user', JSON.stringify(user))
} else {
    const response = get('/user?id=' + user.id);
    user = JSON.parse(response);
}

console.log(user)

const response = get('/links?userid=' + user.id);
user.links = JSON.parse(response);
console.log(user.links)

document.getElementById('userid').innerHTML = user.id + ' ' + user.links.length;

function get(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}