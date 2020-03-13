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

if (window.location.href.endsWith('/coronavirus/')) {
    get('/coronavirus/graph').then(response => {
        let coronavirus = {id: 'Coronavirus'}
        clearGraph(coronavirus);
        renderCustomGraph(response.graph, coronavirus, '2019–20 coronavirus pandemic');
        initGraph();
    });
}
