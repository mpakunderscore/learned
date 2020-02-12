let graphZoomed = false;

let zoom = () => {

  if (!graphZoomed) {
    graph.classList.add('scaled');
    width *= 1.5;
    height *= 1.5;
    // graph.setAttribute('width', width);
    // graph.style.width =  width + 'px';
    // graph.style.height =  height + 'px';
    initSimulation()
  } else {
    graph.classList.remove('scaled');
    width /= 1.5;
    height /= 1.5;
    // graph.setAttribute('width', width);
    // graph.style.width =  width + 'px';
    // graph.style.height =  height + 'px';
    initSimulation()
  }

  graphZoomed = !graphZoomed;
};
