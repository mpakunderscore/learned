let user = {};

// Client API

const getUser = async () => {
    try {
        user = await JSON.parse(localStorage['user']);
    } catch (e) {}

    user = await get('/user?' + (user.id ? 'id=' + user.id : ''));
    if (user)
        localStorage.setItem('user', JSON.stringify(user));

    document.getElementById('userid').innerHTML = user.email || user.id;

    if (user.email)
        email.innerText = user.email;
};

const login = async () => {
    let email = document.getElementById('email').innerText
    let userByEmail = await get('/user/login?' + (user.id ? 'userid=' + user.id : '') + '&email=' + email);
    console.log(userByEmail)

    if (userByEmail.id !== user.id) {
        localStorage.setItem('user', JSON.stringify(userByEmail));
        location.reload();
    }

    closeModal()
}

const getUserLinks = async () => {
    const userLinks = await get('/user/links?userid=' + user.id);
    user.links = userLinks;
    // console.log(userLinks);
    document.getElementById('links-count').innerHTML = user.links.length;
};

const initUser = async () => {
    // showAnimation()
    await getUser();
    await getUserLinks();


    // getUserGraph().then();
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
    // element.parentNode.classList.add('remove')
    await get('/user/link/delete?userid=' + user.id + '&url=' + element.parentNode.parentNode.firstChild.getAttribute('href'));
    await renderMine()
};

let topCategories = ['Main topic classifications', 'Wikipedia categories', 'Disambiguation pages'];

const crawlMineLink = async (element) => {
    clearGraph(menu.mine)
    get('/crawl/graph?url=' + element.parentNode.parentNode.firstChild.getAttribute('href') + '&graph=true&short=true').then(response => {

        console.log(response)

        if (response.graph && response.graph[topCategories[0]]) {
            renderCustomGraph(response.graph, menu.mine, 'Main topic classifications');
            initGraph();
        }

    });
};

const sendMessage = async (text) => {
    const response = await get('/user/message/send?userid=' + user.id + '&text=' + text);
    // console.log(response);
}

const getMessages = async () => {
    const messages = await get('/user/messages?userid=' + user.id);
    return messages;
}






// Only chrome mobile
const share = () => {
    if (navigator.share) {
        navigator.share({
            title: 'learned.space',
            text: 'Learned',
            url: 'https://learned.space',
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }
};

let prefix = '/api';

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
