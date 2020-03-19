let user = {};

// Client API

const getUser = async () => {
    try {
        user = await JSON.parse(localStorage['user']);
    } catch (e) {}
    user = await get('/user?' + (user.id ? 'id=' + user.id : ''));
    if (user)
        localStorage.setItem('user', JSON.stringify(user));
    document.getElementById('userid').innerHTML = user.id;
};

const getUserLinks = async () => {
    const userLinks = await get('/user/links?userid=' + user.id);
    user.links = userLinks;
    console.log(userLinks);
    document.getElementById('userid').innerHTML = user.id + ' ' + user.links.length;
};

const initUser = async () => {
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

const linkClick = async (url) => {
    const response = await get('/user/link/add?userid=' + user.id + '&url=' + url);
    console.log(response);
};

const deleteLink = async (element) => {
    await get('/user/link/delete?userid=' + user.id + '&url=' + element.parentNode.firstChild.getAttribute('href'));
    await renderMine()
};

const crawlMineLink = async (element) => {
    get('/crawl/graph?url=' + element.parentNode.firstChild.getAttribute('href') + '&graph=true&short=true').then(response => {

        console.log(response)

        if (response.graph && response.graph['Main_topic_classifications']) {
            renderCustomGraph(response.graph, menu.mine, 'Main_topic_classifications');
            initGraph();
        }

    });
};

let prefix = '/api'

async function get(url) {
    // console.log(url)
    let response = await fetch(prefix + url);
    if (response.ok) {
        return await response.json();
    } else {
        // console.error(response)
    }
}

initUser().then();
