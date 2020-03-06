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
    user.links = userLinks;
    console.log(userLinks)
    document.getElementById('userid').innerHTML = user.id + ' ' + user.links.length;
};
getUserLinks();

const getUserGraph = () => {
    const response = get('/user/graph?userid=' + user.id);
    const userGraph = JSON.parse(response);
    user.graph = userGraph;
    console.log(userGraph)
};

const getUserWords = () => {
    const response = get('/user/words?userid=' + user.id);
    const userWords = JSON.parse(response);
    user.words = userWords;
    console.log(userWords)
};
getUserWords();

const deleteLink = () => {
    const response = get('/user/link/delete?userid=' + user.id);
    const userWords = JSON.parse(response);
    user.words = userWords;
    console.log(userWords)
}

function get(url) {
    // TODO fetch
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
