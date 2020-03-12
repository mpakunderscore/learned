let user;

// Client API

const getUser = async () => {
    user = JSON.parse(localStorage['user'] || '{}');
    user = await get('/user?' + (user.id ? 'id=' + user.id : ''));
    localStorage.setItem('user', JSON.stringify(user));
    document.getElementById('userid').innerHTML = user.id;
};

const getUserLinks = async () => {
    const userLinks = await get('/user/links?userid=' + user.id);
    user.links = userLinks;
    console.log(userLinks);
    document.getElementById('userid').innerHTML = user.id + ' ' + user.links.length;
};

const initAPI = async () => {
    await getUser();
    await getUserLinks();
};

//TODO heavy method
const getUserGraph = () => {
    const response = get('/user/graph?userid=' + user.id);
    const userGraph = response;
    user.graph = userGraph;
    console.log(userGraph)
};

const getUserWords = () => {
    const response = get('/user/words?userid=' + user.id);
    const userWords = response;
    user.words = userWords;
    // console.log(userWords)
};

const getCategory = async (title) => {
    const response = await get('/wiki?title=' + title + '&lang=' + lang);
    // console.log(response);
    return response;
};

const linkClick = (url) => {
    const response = get('/user/link/add?userid=' + user.id + '&url=' + url);
    // console.log(response);
};

const deleteLink = async (element) => {
    await get('/user/link/delete?userid=' + user.id + '&url=' + element.parentNode.firstChild.getAttribute('href'));
    await renderMine()
};

const crawlMineLink = async (element) => {
    get('/crawl?url=' + element.parentNode.firstChild.getAttribute('href') + '&graph=true&short=true').then(response => {

        console.log(response)

        if (response.graph['Main_topic_classifications']) {
            renderCustomGraph(response.graph, menu.mine, 'Main_topic_classifications');
            initGraph();
        }

    });
};

async function get(url) {
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        // console.error(response)
    }
}

initAPI().then();
