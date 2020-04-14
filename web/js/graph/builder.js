function renderCustomGraph(graph, parentNode, categoryName, iteration = 0) {

    // if (iteration > 2)
    //     return
    // console.log(categoryName)
    // console.log(graphNode)
    // console.log(categoryName)

    let graphNode = graph[categoryName];

    if (graphNode.count > 20) {
        let renderNode = {id: categoryName, active: graphNode.active, debug: graphNode.count}; //, debug: graphNode.count
        nodes_data.push(renderNode);
        links_data.push({source: renderNode, target: parentNode, value: defaultEdge})

        for (let id in graphNode.subcategories) {
            renderCustomGraph(graph, renderNode, graphNode.subcategories[id], iteration + 1)
        }
    }

    // console.log(graph[id].subcategories)
}
