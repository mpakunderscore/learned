let user = JSON.parse(localStorage.getItem('user')) || {};

if (!user.id) {
    const response = get('/user');
    user = JSON.parse(response);
    localStorage.setItem('user', JSON.stringify(user))
} else {
    const response = get('/user?id=' + user.id);
    user = JSON.parse(response);
}

const getUserLinks = () => {
    const response = get('/links?userid=' + user.id);
    const userLinks = JSON.parse(response);
    user.links = userLinks.list;

    document.getElementById('userid').innerHTML = user.id + ' ' + user.links.length;
};

getUserLinks();

function get(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
