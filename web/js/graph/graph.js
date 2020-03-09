// TODO MENU DATA
let initMain = () => {

    menuItem({id: 'Language'});
    menuItem({id: 'Graph'});
    menuItem({id: 'Mine'});
    menuItem({id: 'Random'});
};

let initTest = () => {
    menuItem({id: 'A'});
    menuItem({id: 'B'});
    menuItem({id: 'C'});
    menuItem({id: 'D'});
};

initMain();
// initTest();

function menuItem(item) {
    nodes_data.push(item);
    links_data.push({source: mainCategory, target: item, value: defaultEdge});

    return item;
}

// Graph render functions

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
    link = link.data(links_data);
}

// function initExit() {
//     node.exit().remove();
//     link.exit().remove();
// }

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
            // TODO click node name
        })
        .text(function (d) {
            return d.id + (d.main ? mainCircleText : '') + (d.debug ? ' ' + d.debug : ''); // + (d.info ? ' ' + d.info : '');
        })
        .select(function () {
            return this.parentNode;
        })

        // TODO

        .append('text')
        .attr('class', 'button')
        .attr('dx', textPadding * -1 - 8)
        .attr('dy', textHeight)
        .text(function (d) {
            return '✕'; // + (d.info ? ' ' + d.info : '');
        })
        .on('click', function (d) {
            // d3.event.stopPropagation();
            // this.parentNode.remove();
            // nodes_data.splice(d.index, 1);
            // console.log(d)
            // console.log(this)
            // console.log(this.parentNode)
            deleteNode(d);
            initGraph();
        })
        .select(function () {
            return this.parentNode;
        })

        // .append('text')
        // .attr('class', 'button star')
        // .attr('dx', textPadding * -1 - 22)
        // .attr('dy', textHeight)
        // .text(function (d) {
        //     return '★'; // + (d.info ? ' ' + d.info : '');
        // })
        // .on('click', function (d) {
        //
        // })
        // .select(function () {
        //     return this.parentNode;
        // })

        .merge(node);

    link = link.enter()
        .append('line')
        .attr('class', 'link')
        .merge(link);
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

function clearGray(selectedNode) {

    console.log('nodes: ' + nodes_data.length)

    // let nodes_data_green = []
    for (let i = 0; i < nodes_data.length; i++) {

        // if (!nodes_data[i])
        //     break;

        if (!nodes_data[i].active) {

            links_data = links_data.filter(link => {
                return link.source.id !== nodes_data[i].id && link.target.id !== nodes_data[i].id
            })

            // nodes_data.slice(i, 1)

        } else {

            // nodes_data_green.push(nodes_data[i])

        }
    }

    // nodes_data_green.push(selectedNode)

    // console.log(nodes_data_green)

    link = link.data(links_data);
    link.exit().remove();

    // nodes_data = [];
    // nodes_data = nodes_data_green;
    // node = node.data(nodes_data);
    // node.exit().remove();

    console.log('nodes: ' + nodes_data.length)
}

const languages = [{id: 'En'}, {id: 'Ru'}];

// , {id: 'Es'}, {id: 'Fr'}, {id: 'De'}, {id: 'Zh'}, {id: 'Ja'}

function setLanguageMenu() {

    let languageCategory = menuItem({id: 'Language', active: true});

    for (let id in languages) {
        let language = languages[id]
        language.active = lang === language.id.toLowerCase();
        nodes_data.push(language);
        links_data.push({source: language, target: languageCategory, value: defaultEdge});
    }
}




function renderUserGraph(graphNode, categoryName) {

    if (user.graph[categoryName].count > 1) {
        let renderNode = {id: categoryName, active: true, debug: user.graph[categoryName].count};
        nodes_data.push(renderNode);
        links_data.push({source: renderNode, target: graphNode, value: defaultEdge})

        for (let id in user.graph[categoryName].subcategories) {
            renderUserGraph(renderNode, user.graph[categoryName].subcategories[id])
        }
    }

    // console.log(user.graph[id].subcategories)
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
