let screenWidth = window.innerWidth;
// const screenWidth = screen.width;

const isMobile = screenWidth < 600;

// console.log(localStorage.getItem('borderRatio'))
let borderRatio = localStorage.getItem('borderRatio') || 0.65;
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

// content.innerHTML += '<div>Hey. Add a link via input, from below. Or leave a message</div>';

graph.style.width = 100 * borderRatio + '%';


// TODO

let lang = 'en';

const circleRadius = isMobile ? 12 : 6;
const textPadding = isMobile ? 18 : 12;
const textHeight = isMobile ? '.4em' : '.33em';

const defaultEdge = 100;

let nodes_data = [];
let links_data = [];



let mainCategory = {id: '', main: true};
nodes_data.push(mainCategory);

// let languageCategory;
// let graphCategory;

// TODO MENU DATA
let initMain = () => {

    menuItem({id: 'Language'});
    menuItem({id: 'Graph'});
    menuItem({id: 'Mine'});
    menuItem({id: 'Random'});
};
initMain();

function menuItem(item) {
    nodes_data.push(item);
    links_data.push({source: mainCategory, target: item, value: defaultEdge});

    return item;
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
    node = node.data(nodes_data);
    node.exit().remove();
    link = link.data(links_data);
    link.exit().remove();
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
            selectNode(this, d, false)
        })
        .select(function () {
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

            let index = nodes_data.indexOf(d);
            console.log(nodes_data[index])
            if (index !== -1) {

                nodes_data.splice(index, 1);
                // node = node.data(nodes_data)
                // node.exit().remove();

                console.log(nodes_data)
                console.log(links_data)

                // console.log(index)
                // console.log(links_data.filter(link => link.source.id === d.id || link.target.id === d.id))

                links_data = links_data.filter(link => link.source.id !== d.id && link.target.id !== d.id);
                // link = link.data(links_data)
                // link.exit().remove();

            }

            // console.log(nodes_data.length)
            // console.log(links_data.length)

            // d3.event.stopPropagation();

            initGraph();
        })
        .text(function (d) {
            return d.id; // + (d.info ? ' ' + d.info : '');
        })
        .select(function () {
            return this.parentNode;
        })
        // .append('div')
        // .html('')
        // .attr('class', 'paper')
        // .select(function () {
        //     return this.parentNode;
        // })
        .merge(node);

    // node.append('text')
    // .attr('dx', 10)
    // .attr('dy', '.35em')
    //     .text(function (d) {
    //       return d.id;
    //     })
    //
    // node = node.merge(node);

    // node.exit().remove();

    link = link.enter()
        .append('line')
        .attr('class', 'link')
        .merge(link);

    // link.exit().remove();
}

function clearGraph() {

    nodes_data = [];
    nodes_data.push(mainCategory);
    node = node.data(nodes_data);
    node.exit().remove();

    links_data = [];
    link = link.data(links_data);
    link.exit().remove();
}

let ru = {id: 'Ru'};
let en = {id: 'En'};
let simple = {id: 'Simple'};

function setLanguageMenu() {

    let languageCategory = menuItem({id: 'Language', active: true});

    en.active = lang === 'en';
    ru.active = lang === 'ru';
    simple.active = lang === 'simple';

    nodes_data.push(en);
    nodes_data.push(ru);
    nodes_data.push(simple);
    console.log(nodes_data)

    links_data.push({source: ru, target: languageCategory, value: defaultEdge});
    links_data.push({source: en, target: languageCategory, value: defaultEdge});
    links_data.push({source: simple, target: languageCategory, value: defaultEdge});
    console.log(links_data)
}

function selectNode(circleElement, category, random) {

    let title = category.id;

    d3.select(circleElement).attr('class', category.main ? 'main' : 'active')
    d3.select(circleElement.nextSibling).attr('class', category.main ? 'main' : 'active')

    if (title === 'Random') {
        title = 'Graph';
        random = true;
    }

    let selectedNode = nodes_data.find(element => element.id === title);
    selectedNode.active = true;

    // console.log(title)

    if (title === 'Language' || title === 'Ru' || title === 'En' || title === 'Simple') { // Language

        if (title !== 'Language')
            lang = title.toLowerCase();

        // console.log(lang)

        clearGraph();
        setLanguageMenu();

    } else if (title === 'Mine') { // Personal graph

        clearGraph();
        menuItem(selectedNode);

        getUserLinks();
        renderUserLinks();

        getUserGraph();
        renderUserGraph();

        // TODO ADD GRAPH BUILDER FROM {} HERE

    } else if (title === '') { // Main

        clearGraph();
        initMain();
        setCircle()

    } else { // Graph and categories

        if (title === 'Graph') {
            clearGraph();
            menuItem(selectedNode);
        }

        const response = get('/wiki?title=' + title + '&lang=' + lang);
        const responseJson = JSON.parse(response);

        let categoriesLength = responseJson.subcategories.length;

        shuffle(responseJson.subcategories).splice(0, random ? 1 : 5).forEach(categoryJson => {

            if (!nodes_data.find(element => element.id === categoryJson.id)) {

                if (random) {
                    categoryJson.active = true;
                    setTimeout(() => selectNode(circleElement, categoryJson, random), 1000);
                }

                nodes_data.push(categoryJson);
                links_data.push({source: categoryJson, target: selectedNode, value: defaultEdge})

            } else {

            }
        });

        setContent(responseJson.pages, responseJson.mainPage, categoriesLength, title)
    }

    initGraph();
}

function renderUserGraph() {

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
