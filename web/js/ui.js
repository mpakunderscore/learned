const graph = document.getElementById('graph');
const border = document.getElementById('border');
// const content = document.getElementById('content');

border.onmousedown = dragMouseDown;

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
    localStorage.setItem('borderRatio', borderRatio);
    width = screenWidth * (isMobile ? 1 : borderRatio);
    height = document.body.clientHeight * (isMobile ? borderRatio : 1);

    if (borderRatio !== 0) {
        content.style.width = (99.5 - 100 * borderRatio) + '%';
        graph.style.width = 100 * borderRatio + '%';
        graphSvg.setAttribute('width', width * (!graphZoomed ? 1 : ratio));
        initSimulation();
    }
}

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
