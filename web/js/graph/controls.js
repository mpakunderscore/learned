// TODO refactoring

let currentNode = '';

async function selectNode(circleElement, category, random) {

    let title = category.id;

    d3.select(circleElement).attr('class', category.main ? 'main' : 'active')
    d3.select(circleElement.nextSibling).attr('class', category.main ? 'main' : 'active')

    if (title === 'Random') {
        title = 'Graph';
        random = true;
    }

    let selectedNode = nodes_data.find(element => element.id === title);
    selectedNode.active = true;

    if (selectedNode.lang) { // Language

        selectLanguage(selectedNode);

    } else if (title === 'Mine') { // Personal graph

        await selectMine(selectedNode);

    } else if (title === mainCategory.id) { // Main

        selectMain();

    } else if (title === 'Demo') { // Personal graph

        // renderView();

    } else { // Graph and categories

        setPath('/');

        if (title === 'Graph') {
            clearGraph(selectedNode);
        }

        const responseJson = await getCategory(title);

        let categoriesLength = responseJson.subcategories.length;

        // console.log(nodes_data)

        selectedNode = nodes_data.find(element => element.id === title);

        if (selectedNode.id !== currentNode) {
            clearGray(selectedNode);
            currentNode = selectedNode.id;
        }

        shuffle(responseJson.subcategories).splice(0, random ? 1 : 7).forEach(categoryJson => {

            if (!nodes_data.find(element => element.id === categoryJson.id)) {

                categoryJson.depth = selectedNode.depth + 1;

                if (random) {

                    categoryJson.active = true;
                    setTimeout(() => {
                        selectNode(circleElement, categoryJson, random)
                    }, 300);

                }

                nodes_data.push(categoryJson);
                links_data.push({source: categoryJson, target: selectedNode, value: defaultEdge})

            }
        });

        setContent(responseJson.pages, responseJson.mainPage, categoriesLength, title)
    }

    initGraph();
}

function selectLanguage(selectedNode) {

    clearGraph(selectedNode);
    if (selectedNode.id !== 'Language' && selectedNode.id !== 'Settings') {
        lang = selectedNode.id.toLowerCase();
        clearGraph();
        initMenu()
    } else {

    }
    // menuItem(selectedNode);
    initLanguageMenu();

    setPath('/settings');
}

function selectMain() {

    clearGraph();
    initMenu();
    clickHome();

    setPath('/');
}

async function selectMine(selectedNode) {

    clearGraph(selectedNode);

    await renderMine();

    // getTokensGraph();
    // if (user.graph['Main_topic_classifications'])
    //     renderCustomGraph(selectedNode, 'Main_topic_classifications');

    setPath('/mine');
}

function deleteUpperNodes(d, nodesForDeletion) {

    nodesForDeletion.push(d.id)

    links_data.filter(link => link.source.id === d.id || link.target.id === d.id).forEach(link_data => {

        if (link_data.source.depth > d.depth) {

            deleteUpperNodes(link_data.source, nodesForDeletion);
        }
    });
}

function deleteNode(d) {

    let nodesForDeletion = [];

    deleteUpperNodes(d, nodesForDeletion);

    console.log(nodesForDeletion);

    links_data = links_data.filter(link => nodesForDeletion.indexOf(link.source.id) < 0 && nodesForDeletion.indexOf(link.target.id) < 0);
    link = link.data(links_data);
    link.exit().remove();

    nodes_data = nodes_data.filter(node => nodesForDeletion.indexOf(node.id) < 0);
    node = node.data(nodes_data, function (d) {
        return d.id;
    });
    node.exit().remove();
}

function clearGraph(selectedNode) {

    nodes_data = [];
    nodes_data.push(mainCategory);
    links_data = [];

    if (selectedNode) {
        selectedNode.active = true;
        menuItem(selectedNode)
    }


    node = node.data(nodes_data, function (d) {
        return d.id
    });
    node.exit().remove();

    link = link.data(links_data);
    link.exit().remove();
}

function clearGray() {

    console.log('nodes: ' + nodes_data.length)

    let nodes_data_green = []
    for (let i = 0; i < nodes_data.length; i++) {

        // if (!nodes_data[i])
        //     break;

        if (!nodes_data[i].active) {

            links_data = links_data.filter(link => {
                return link.source.id !== nodes_data[i].id && link.target.id !== nodes_data[i].id
            })

        } else {

            nodes_data_green.push(nodes_data[i])

        }
    }

    // nodes_data_green.push(selectedNode)

    // console.log(nodes_data_green)

    link = link.data(links_data);
    link.exit().remove();

    // nodes_data = [];
    nodes_data = nodes_data_green;
    node = node.data(nodes_data, function (d) {
        return d.id;
    });
    node.exit().remove();

    console.log('nodes: ' + nodes_data.length)
}
