if (window.location.href.endsWith('/demo/')) {
    get('/demo/graph').then(response => {
        if (response.graph['Y Combinator (company)']) {
            let demo = {id: 'Demo'}
            clearGraph(demo);
            renderCustomGraph(response.graph, demo, 'Y Combinator (company)');
            initGraph();
        }
    });
}
