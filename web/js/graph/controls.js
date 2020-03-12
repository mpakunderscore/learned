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

        selectLanguage(title);

    } else if (title === 'Mine') { // Personal graph

        await selectMine(selectedNode);

    } else if (title === mainCategory.id) { // Main

        selectMain();

    } else { // Graph and categories

        if (title === 'Graph') {
            clearGraph();
            menuItem(selectedNode);
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

                if (random) {

                    categoryJson.active = true;
                    setTimeout(() => {
                        selectNode(circleElement, categoryJson, random)
                    }, 300);

                } else {
                }

                nodes_data.push(categoryJson);
                links_data.push({source: categoryJson, target: selectedNode, value: defaultEdge})

            }
        });

        setContent(responseJson.pages, responseJson.mainPage, categoriesLength, title)
    }

    initGraph();
}

function selectLanguage(title) {

    console.log(title)

    if (title !== 'Language' && title !== 'Settings' ) {
        lang = title.toLowerCase();
    }

    clearGraph();
    setLanguageMenu();
}

function selectMain() {

    clearGraph();
    initGraphMenu();
    clickHome();
}

async function selectMine(selectedNode) {

    clearGraph();
    menuItem(selectedNode);

    await renderMine();

    // getTokensGraph();
    // if (user.graph['Main_topic_classifications'])
    //     renderCustomGraph(selectedNode, 'Main_topic_classifications');
}

function deleteNode(d) {

    links_data = links_data.filter(link => link.source.id !== d.id && link.target.id !== d.id);
    link = link.data(links_data)
    link.exit().remove();

    for (let i = 0; i < links_data.length; i++) {

    }

    let clickIndex = nodes_data.indexOf(d);

    nodes_data.splice(clickIndex, 1);
    node = node.data(nodes_data, function (d) {
        return d.id;
    });
    node.exit().remove();
}

// TODO bad to 0 all nodes
function clearGraph() {

    nodes_data = [];
    nodes_data.push(mainCategory);
    node = node.data(nodes_data, function (d) {
        return d.id;
    });
    node.exit().remove();

    links_data = [];
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

            // nodes_data.slice(i, 1)

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
