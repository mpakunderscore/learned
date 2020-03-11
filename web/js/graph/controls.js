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

    // console.log(title)

    if (title === 'Language' || title === 'Ru' || title === 'En') { // Language

        if (title !== 'Language') {
            lang = title.toLowerCase();
        } else {
            // window.location.href = '/language'
            // console.log(window.location.href)
        }

        // console.log(lang)

        clearGraph();
        setLanguageMenu();

    } else if (title === 'Mine') { // Personal graph

        clearGraph();
        menuItem(selectedNode);

        await renderMine();

        // getTokensGraph();
        // if (user.graph['Main_topic_classifications'])
        //     renderUserGraph(selectedNode, 'Main_topic_classifications');

    } else if (title === mainCategory.id) { // Main

        clearGraph();
        initGraphMenu();
        clickHome()

    } else { // Graph and categories

        if (title === 'Graph') {
            clearGraph();
            menuItem(selectedNode);
        }

        const responseJson = await getCategory(title);

        let categoriesLength = responseJson.subcategories.length;

        console.log(nodes_data)

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

            } else {

            }
        });

        // nodes_data.filter(node => node.id === d.id || node.target.id === d.id))
        // links_data.filter(link => link.source.id === d.id || link.target.id === d.id))

        setContent(responseJson.pages, responseJson.mainPage, categoriesLength, title)
    }

    initGraph();
}

function deleteNode(d) {

    links_data = links_data.filter(link => link.source.id !== d.id && link.target.id !== d.id);
    // console.log(links_data)
    link = link.data(links_data)
    link.exit().remove();


    let clickIndex = nodes_data.indexOf(d);
    console.log(clickIndex)

    console.log(nodes_data)
    nodes_data.splice(clickIndex, 1);
    node = node.data(nodes_data, function (d) {
        return d.id;
    });
    node.exit().remove();
    console.log(nodes_data)
}
