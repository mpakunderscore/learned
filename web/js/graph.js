const screenWidth = window.innerWidth;
// const screenWidth = screen.width;

const isMobile = screenWidth < 600;

// console.log(localStorage.getItem('borderRatio'))
let borderRatio = localStorage.getItem('borderRatio') || 0.5;
let width = screenWidth * (isMobile ? 1 : borderRatio);
let height = document.body.clientHeight * (isMobile ? borderRatio : 1);

let svg = d3.select('#graph').append('svg')
    .attr('id', 'graph-svg')
    .attr('width', width)
    .attr('height', height);

let content = document.getElementById('content');
content.style.width = (99.5 - 100 * borderRatio) + '%';

function initInput() {
  return '<input id="input" autocomplete="off" placeholder="Link, message or search"/>';
}

content.innerHTML = initInput();

// content.innerHTML += '<div>Hey. Add a link via input, from below. Or leave a message</div>';

graph.style.width = 100 * borderRatio + '%';





// TODO

const circleRadius = isMobile ? 12 : 6;
const textPadding = isMobile ? 18 : 12;
const textHeight = isMobile ? '.4em' : '.33em';

let nodes_data = [];
let links_data = [];

let mainCategory = {id: '', main: true};
nodes_data.push(mainCategory);






// TODO MENU DATA

// menuItem({id: 'Links'})
menuItem({id: 'Random'})
menuItem({id: 'Wiki', active: false})
menuItem({id: 'Language'})
// menuItem({id: 'HN'})
// menuItem({id: 'About'})

let lang = 'en';
// let lang = 'ru';

function menuItem(item) {
  nodes_data.push(item);
  links_data.push({source: mainCategory, target: item, value: 100});
}














let link = svg.selectAll('line');
let node = svg.selectAll('node');

let simulation = d3.forceSimulation()
simulation.on('tick', tickActions);

let initGraph = () => {
  initData();
  initView();
  initSimulation();
};
initGraph();

function initData() {
  node = node.data(nodes_data, function (d) {
    return d.id;
  });
  link = link.data(links_data, function (d) {
    return d.source.id + '-' + d.target.id;
  })
}

function initView() {
  node = node.enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))
      .append('circle')
      .attr('r', circleRadius)
      .attr('class', (d) => {
        return d.main ? 'main' : (d.active ? 'active' : '')
      })
      .on('click', function (d) {
        addNode(this, d, false)
      })
      .select(function(){
        return this.parentNode;
      })
      .append('text')
      .attr('dx', textPadding)
      .attr('dy', textHeight)
      .attr('class', (d) => {
        return d.main ? 'main' : (d.active ? 'active' : '')
      })
      .on('click', function (d) {

        // console.log(nodes_data.length)
        // console.log(links_data.length)
        nodes_data.splice(nodes_data.indexOf(d), 1);
        links_data = links_data.filter(link => link.source !== d && link.target !== d);
        // console.log(nodes_data.length)
        // console.log(links_data.length)

        // d3.event.stopPropagation();

        initGraph();
      })
      .text(function (d) {
        return d.id; // + (d.info ? ' ' + d.info : '');
      })
      .select(function(){
        return this.parentNode;
      })
      .merge(node);

  // node.append('text')
  // .attr('dx', 10)
  // .attr('dy', '.35em')
  //     .text(function (d) {
  //       return d.id;
  //     })
  //
  // node = node.merge(node);

  node.exit().remove();

  link = link.enter()
      .append('line')
      .attr('class', 'link')
      .merge(link);

  link.exit().remove();
}

function addNode(circleElement, category, random) {

  // console.log('addNode')

  // let title = that.nextSibling.textContent;
  // let title = that.textContent;
  let title = category.id;
  // d.active = true;

  d3.select(circleElement).attr('class', category.main ? 'main' : 'active')
  d3.select(circleElement.nextSibling).attr('class', category.main ? 'main' : 'active')
  // d.active = true;

  if (title === 'Random') {
    title = 'Wiki';
    random = true;
  }

  let titleNode = nodes_data.find(element => element.id === title);
  titleNode.active = true;

  if (title === 'Language' || title === 'Ru' || title === 'En' || title === 'Simple') {

    if (title === 'Language') {
      let ru = {id: 'Ru'};
      let en = {id: 'En'};
      let simple = {id: 'Simple'};
      nodes_data.push(ru);
      nodes_data.push(en);
      nodes_data.push(simple);
      links_data.push({source: ru, target: titleNode, value: 100})
      links_data.push({source: en, target: titleNode, value: 100})
      links_data.push({source: simple, target: titleNode, value: 100})
    }

    if (title === 'Ru')
      lang = 'ru';

    if (title === 'En')
      lang = 'en';

    if (title === 'Simple')
      lang = 'simple';

  } else {

    const response = get('/wiki?title=' + title + '&lang=' + lang);
    const responseJson = JSON.parse(response);

    // console.log(responseJson.categories)
    // console.log(responseJson.pages)
    // console.log(responseJson.mainPage)

    // console.log(responseJson.categories.length)

    let categoriesLength = responseJson.categories.length;

    shuffle(responseJson.categories).splice(0, random ? 1 : 7).forEach(categoryJson => {

      if (!nodes_data.find(element => element.id === categoryJson.id)) {

        if (random) {
          categoryJson.active = true;
          setTimeout(() => addNode(circleElement, categoryJson, random), 1000);
        }

        nodes_data.push(categoryJson);
        links_data.push({source: categoryJson, target: titleNode, value: 100})

      } else {

      }
    });

    setContent(responseJson.pages, responseJson.mainPage, categoriesLength)
  }

  initGraph();
}

function setContent(pages, mainPage, categoriesLength) {

  // console.log(responseJson)

  // let categories = responseJson.categories

  // console.log(categories)

  content.innerHTML = initInput();

  let html = '';
  if (mainPage.text) {
    html += '<div id="main-text">' + mainPage.text + '</div>';
  }
  html += '<div>Pages: ' + pages.length + ', Categories: ' + categoriesLength + '</div>';
  for (let i = 0; i < pages.length; i++) {
    html += '<div><a href="https://' + lang + '.wikipedia.org/wiki/' + pages[i].id.replace(/\s/g, '_') + '" target="_blank">' + pages[i].id + '</a></div>';
  }
  content.innerHTML += html;
}

function initSimulation() {
  simulation.nodes(nodes_data);
  simulation.force('links', d3.forceLink(links_data)
      .id(function (d) {
        return d.id;
      })
      .distance(function (d) {
        return d.value;
      }));
  // console.log(graphZoomed)
  simulation.force('charge', d3.forceManyBody())
  simulation.force('center', d3.forceCenter(width * (!graphZoomed ? 1 : ratio) / 2, height * (!graphZoomed ? 1 : ratio) / 2));
  simulation.alpha(1).restart();
}

function tickActions() {
  link.attr('x1', function (d) {
    return d.source.x;
  })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });
  node.attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function get(url) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', url, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
