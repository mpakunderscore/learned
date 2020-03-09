graph.style.width = 100 * borderRatio + '%';

let mainCircleText = 'Home';

let lang = 'en';

const circleRadius = isMobile ? 12 : 6;
const textPadding = isMobile ? 18 : 12;
const textHeight = isMobile ? '.4em' : '.35em';

const defaultEdge = 100;

let nodes_data = [];
let links_data = [];

let mainCategory = {id: '', main: true, active: true};
nodes_data.push(mainCategory);
