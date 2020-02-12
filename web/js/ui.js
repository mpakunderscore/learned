const isMobile = screen.width < 600;

console.log(localStorage.getItem('borderRatio'))
let borderRatio = localStorage.getItem('borderRatio') || 0.5;
let width = screen.width * (isMobile ? 1 : borderRatio);
let height = document.body.clientHeight * (isMobile ? borderRatio : 1);
document.getElementById('content').style.width = (99.5 - 100 * borderRatio) + '%'

console.log(width)
console.log(height)

document.getElementById('border').onmousedown = dragMouseDown;

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  // pos3 = e.clientX;
  // pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position:
  // pos1 = pos3 - e.clientX;
  // pos2 = pos4 - e.clientY;
  // pos3 = e.clientX;
  // pos4 = e.clientY;
  // // set the element's new position:
  // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
  // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  borderRatio = e.clientX/screen.width;
  localStorage.setItem('borderRatio', borderRatio);
  width = screen.width * (isMobile ? 1 : borderRatio);
  height = document.body.clientHeight * (isMobile ? borderRatio : 1);

  // console.log(100 * borderRatio)

  if (borderRatio !== 0) {
    document.getElementById('content').style.width = (99.5 - 100 * borderRatio) + '%';
    document.getElementById('graph').style.width = 100 * borderRatio + '%'
    initSimulation();
  }
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
}
