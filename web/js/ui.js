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
initServiceInfo();

const graph = document.getElementById('graph');
const border = document.getElementById('border');


// const content = document.getElementById('content');

border.onmousedown = dragMouseDown;
border.onclick = () => {
    // clickMainCircle('Border click')
};
border.ontouchstart = () => {
    // console.log('border touch')
    if (isMobile) {
        borderRatio = .2;
        renderView();
    }
};

if (isMobile) {
    clickMainCircle('NO MOBILE, WILL BE 0.5')
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
        // width *= 1.5;
        // height *= 1.5;
        graphSvg.setAttribute('width', width * ratio);
        graphSvg.setAttribute('height', height * ratio);
        // graphSvg.style.width =  width * zzz + 'px';
        // graph.style.width =  width + 'px';
        // graph.style.height =  height + 'px';
    } else {
        graphSvg.classList.remove('scaled');
        // width /= 1.5;
        // height /= 1.5;
        graphSvg.setAttribute('width', width);
        graphSvg.setAttribute('height', height);
        // graphSvg.style.width =  width + 'px';
        // graph.style.width =  width + 'px';
        // graph.style.height =  height + 'px';

    }

    graphZoomed = !graphZoomed;
    initSimulation()
};

function initServiceInfo() {

    contentList.innerHTML = '' +
        '<div>Last update: 12.03.2020</div>' +
        '<div>Version: 0.3.8</div>' +
        // '<div>Delete mine link</div>' +
        // '<div>Link graph</div>' +
        // '<div><a href="/api">API</a> for link graph</div>' +
        '<div class="info">Link graph works somehow</div>' +
        '<div>Where is design</div>' +
        '';

    // TODO card design
    contentList.innerHTML += renderCard('インタラクションカードの例', 'セゴビアはマドリードからの日帰り観光地として人気がある（マドリードからは高速鉄道で30分）。旧市街は長く狭い高台の上に壮大に位置している。大聖堂、古代ローマの水道橋、美しいおとぎ話にでてきそうな古城（アルカサル）などの名所があり、眼下には田舎の景色が広がっている。カスティーリャと言われるこの辺りの景色は赤い大地という異名と合わせてファンタジーではよく用いられる。')
}
