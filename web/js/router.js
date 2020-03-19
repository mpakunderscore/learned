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
    clickMainCircle('Wash your hands!')
    let coronavirus = {id: 'Coronavirus'}
    clearGraph(coronavirus);
    get('/coronavirus/graph').then(response => {
        renderCustomGraph(response.graph, coronavirus, '2019–20 coronavirus pandemic');
        initGraph();
    });
}

if (window.location.href.endsWith('/mine/')) {
    selectMine(menu.mine).then(() => {initGraph()});
}
