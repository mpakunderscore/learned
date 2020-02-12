const graph = document.getElementById('graph');
const border = document.getElementById('border');
// const content = document.getElementById('content');

border.onmousedown = dragMouseDown;

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(e) {

  const graphSvg = document.getElementById('graph-svg');

  e = e || window.event;
  e.preventDefault();

  borderRatio = e.clientX/screenWidth;
  localStorage.setItem('borderRatio', borderRatio);
  width = screen.width * (isMobile ? 1 : borderRatio);
  height = document.body.clientHeight * (isMobile ? borderRatio : 1);

  if (borderRatio !== 0) {
    content.style.width = (99.5 - 100 * borderRatio) + '%';
    graph.style.width = 100 * borderRatio + '%';
    graphSvg.setAttribute('width', width);
    initSimulation();
  }
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
}

let graphZoomed = false;

let zoom = () => {

  const graphSvg = document.getElementById('graph-svg');

  if (!graphZoomed) {
    graphSvg.classList.add('scaled');
    width *= 1.5;
    height *= 1.5;
    graphSvg.setAttribute('width', width);
    // graph.style.width =  width + 'px';
    // graph.style.height =  height + 'px';
    // initSimulation()
  } else {
    graphSvg.classList.remove('scaled');
    width /= 1.5;
    height /= 1.5;
    graphSvg.setAttribute('width', width);
    // graph.style.width =  width + 'px';
    // graph.style.height =  height + 'px';
    // initSimulation()
  }

  graphZoomed = !graphZoomed;
};
