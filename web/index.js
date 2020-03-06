let user;

// TODO need refactoring, user object

// Client API here

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

//TODO heavy method
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

const deleteLink = (element) => {
    // TODO
    const response = get('/user/link/delete?userid=' + user.id + '&url=' + element.parentNode.firstChild.getAttribute('href'));
    renderMine()
}

const crawlLink = (element) => {
    // TODO
    const response = get('/crawl?url=' + element.parentNode.firstChild.getAttribute('href') + '&graph=true');
    console.log(JSON.parse(response))
}

function get(url) {
    // TODO fetch
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
