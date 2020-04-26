let screenWidth = window.innerWidth;
// const screenWidth = screen.width;

const isMobile = screenWidth < 600;

// console.log(localStorage.getItem('borderRatio'))
let borderRatio = isMobile ? 0 : localStorage.getItem('borderRatio') || 0.65;
let width = screenWidth * (isMobile ? 1 : borderRatio);
let height = document.body.clientHeight * (isMobile ? borderRatio : 1);

let svg = d3.select('#graph').append('svg')
    .attr('id', 'graph-svg')
    .attr('width', width)
    .attr('height', height);

let content = document.getElementById('content');
let contentList = document.getElementById('content-list');
content.style.width = (99.5 - 100 * borderRatio) + '%';

initInput();
initServiceInfo(() => renderCard('This is still a test system', 'Do not expect much. Somewhere in the bins we have NN for chatbot and one more for recommendations. But for now, we need to complete the normal UI and graph structure.'));

const graph = document.getElementById('graph');
const border = document.getElementById('border');


// const content = document.getElementById('content');

border.onmousedown = dragMouseDown;
border.onclick = () => {
    // renderText('Border click')
};
border.ontouchstart = () => {
    // console.log('border touch')
    if (isMobile) {
        borderRatio = .2;
        renderView();
    }
};

if (isMobile) {
    setText('NO MOBILE, WILL BE 0.5')
}

document.onload = () => {
    if (isMobile) {
        fullscreen()
    }
};

function fullscreen() {
    document.body.requestFullscreen();
    window.scrollTo(0, 1);
}

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    border.classList.add('active');
}

function elementDrag(e) {

    const graphSvg = document.getElementById('graph-svg');

    e = e || window.event;
    e.preventDefault();

    borderRatio = e.clientX / screenWidth;

    if (borderRatio !== 0) {
        renderView()
    }
}

function renderView() {

    const graphSvg = document.getElementById('graph-svg');

    localStorage.setItem('borderRatio', borderRatio);
    width = screenWidth * (isMobile ? 1 : borderRatio);
    height = document.body.clientHeight * (isMobile ? borderRatio : 1);

    content.style.width = (99.5 - 100 * borderRatio) + '%';
    graph.style.width = 100 * borderRatio + '%';
    graphSvg.setAttribute('width', width * (!graphZoomed ? 1 : ratio));
    initSimulation();
}

window.onresize = function () {
    // location.reload();

    screenWidth = window.innerWidth;
    renderView();
};

function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    border.classList.remove('active');
}

let graphZoomed = false;

// TODO
let ratio = 1.51515152;

let zoom = () => {

    const graphSvg = document.getElementById('graph-svg');

    if (!graphZoomed) {
        graphSvg.classList.add('scaled');
        graphSvg.setAttribute('width', width * ratio);
        graphSvg.setAttribute('height', height * ratio);
    } else {
        graphSvg.classList.remove('scaled');
        graphSvg.setAttribute('width', width);
        graphSvg.setAttribute('height', height);
    }

    graphZoomed = !graphZoomed;
    initSimulation()
};

function initServiceInfo(card = () => {}) {

    setText('<div class="row"><span>v0.4.3</span><span>23.04.2020</span></div>', 'info');
    setText('This is a links management system. Like pocket, evernote, history or bookmarks in chrome, notepad or even paper. But, little bit different. Development in progress and there is a <a href="/blog">/blog</a> about it. Either you may message me via input below.')
    setText('And, maybe list of links is not a big value? Even if you did collect something special and build graph navigation on top of it for easy use. Most of links you will read only once, and there is something more. Something you may read.. not because you did save similar article. But because you will get a new words for your head. New meanings, ideas, thoughts or even friends with similar interests.')
    setText('We need two things for this.')
    setText('First - the edge of your knowledge. It\'s a personal information and things like this does not belong to anyone, except you. So, there is only random UUID for you and if you want to <span class="button simple" onclick="addEmail()">add email</span> to this account, it will be stored encrypted.')
    setText('There is several methods to build the edge:')
    setText('1. <a href="/chrome/learned.space.zip" target="_blank">Chrome extension</a> - save links that educate you')
    setText('2. Import your <a href="/chrome/bookmarks">Bookmarks</a> or <a href="/chrome/history">History</a> - there is will be no bindings to your identity')
    setText('3. Talk to me')
    setText('And second. You need to surf the edge and keep things going. Hey?');
    // renderText('');
    // setText('')
    // setText('')
    // setText('')
    // setText('')
    // setText('')

    // setText('');

    // card()
}

function closeModal() {
    let modal = document.getElementById('modal');
    modal.classList.add('hide')
}
