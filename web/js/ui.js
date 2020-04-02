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
    renderText('NO MOBILE, WILL BE 0.5')
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

    setText('Last update: 2.04.2020');
    setText('Version: 0.3.9.8');
    setText('Parallel graph builder', 'info');
    setText('New wiki loop checker');
    setText('We started to draw some ui');

    card()
}
