let screenWidth = window.innerWidth;
// const screenWidth = screen.width;

const isMobile = screenWidth < 600;

// console.log(localStorage.getItem('borderRatio'))
let borderRatio = isMobile ? 0 : localStorage.getItem('borderRatio') || 0.33;
let width = screenWidth * (isMobile ? 1 : borderRatio);
let height = document.body.clientHeight * (isMobile ? borderRatio : 1);

let svg = d3.select('#graph').append('svg')
    .attr('id', 'graph-svg')
    .attr('width', width)
    .attr('height', height);

let content = document.getElementById('content');
let contentList = document.getElementById('content-list');
let centerImage = document.getElementById('center-image');

const graph = document.getElementById('graph');
const border = document.getElementById('border') || {};
const modal = document.getElementById('modal');


centerImage.style.width = (99.5 - 100 * borderRatio) + '%';
content.style.width = (99.5 - 100 * borderRatio) + '%';

initInput();

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

    if (borderRatio > 0.67)
        borderRatio = 0.67;

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
    centerImage.style.width = (99.5 - 100 * borderRatio) + '%';
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

    // setText('<div class="row"><span>v0.4.3</span><span>23.04.2020</span></div>', 'info');
    // setText('This is a links management system. Like pocket, evernote or bookmarks in chrome. But, little bit different. Development in progress and there is a <a href="/blog">/blog</a> about it.', 'big')
    // setText('And, maybe list of links is not a big value? Even if you did collect something special and build graph navigation on top of it for easy use. Most of links you will read only once, and there is something more. Something you may read.. not because you did save similar article. But because you will get a new words for your head. New meanings, ideas, thoughts or even friends with similar interests.')
    // setText('We need two things for this.')
    // setText('First - the edge of your knowledge. It\'s a personal information and things like this does not belong to anyone, except you. So, there is only random UUID for you and if you want to <span class="button simple" onclick="addEmail()">add email</span> to this account, it will be stored encrypted.')
    // setText('The main idea is to improve the process of reading educational links. Through the construction of knowledge graph. There is several methods to build your knowledge graph:', 'big')
    // setText('1. <a href="/chrome/learned.space.zip" target="_blank">Chrome extension</a> - save links that educate you. A large set of links may be used to build a large graph, but it does not reflect the current state. It’s more important to add what excites you right now.')
    // setText('2. <input type="file" style="display: none" id="bookmarks"/><label class="button" for="bookmarks">Import your bookmarks</label> - there is will be no bindings to your identity. You may grab file at bookmarks manager > export bookmarks.')
    // setText('3. <strike>History</strike> - there is a way to export chrome history via extension, but it\'s not that easy and safe.');
    // setText('4. <strike>Talk to me. I\'m not your personal bot (still), but at last i may answer (or there will be a real human).</strike>')
    // setText('And second. You need to surf the edge and keep things going. Hey?');
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
    console.log('close modal')
    modal.classList.add('hide')
    centerImage.classList.add('hide')
}

let circlesAmount = 10 + Math.floor(Math.random() * 3);

for (let i = 0; i < circlesAmount; i++) {

    // let count = Math.floor(Math.random() * circlesAmount/i);
    let count = 5;

    let y = 100 / circlesAmount * i;

    // console.log(count)
    for (let j = 0; j < Math.floor(Math.random() * 2); j++) {

    }

    let x = Math.floor(Math.random() * i * 7) - 2;
    centerImage.append(createCircle(i, x, y));

}

function createCircle(i, x, y) {

    let size = i * 20 * 1.5^i;

    let circle = document.createElement('div');
    circle.classList.add('center-image-small-circle')
    if (i  === 5) {
        circle.classList.add('active')
        let animal = document.createElement('img')
        animal.src = 'images/animal.png'
        animal.id = 'animal'
        circle.append(animal)
    }

    circle.style.width = size + 'px'
    circle.style.height = size + 'px'
    // circle.style.border = i + 'px solid lightgray'
    // circle.style.borderRadius = size/2 + 'px'

    circle.style.top = y + '%';
    circle.style.left = x + '%';
    return circle;
}



// if (i  === 5) {
//
//
//     if (i  === 3) {
//         size *= 10;
//     } else {
//         let animal = document.createElement('img')
//         animal.src = 'images/animal.png'
//         animal.id = 'animal'
//         circle.append(animal)
//         circle.classList.add('active')
//     }
//
//     circle.style.width = size + 'px'
//     circle.style.height = size + 'px'
//
//
// }
