let user;

const getUser = () => {
    user = JSON.parse(localStorage.getItem('user')) || {};
    const response = get('/user?' + (user.id ? 'id=' + user.id : ''));
    user = JSON.parse(response);
    localStorage.setItem('user', JSON.stringify(user));
};

getUser();

const getUserLinks = () => {
    const response = get('/user/links?userid=' + user.id);
    const userLinks = JSON.parse(response);
    user.links = userLinks.list;

    console.log(userLinks.list)
    console.log(userLinks.graph)

    document.getElementById('userid').innerHTML = user.id + ' ' + user.links.length;
};

getUserLinks();

function get(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
