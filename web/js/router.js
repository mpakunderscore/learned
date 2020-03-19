let setPath = (path) => {
    history.pushState({}, null, path);
};

if (window.location.href.endsWith('/demo/')) {
    setPath('/demo');
    let demo = {id: 'Demo'}
    clearGraph(demo);
    get('/demo/graph').then(response => {
        if (response.graph['Y Combinator (company)']) {
            renderCustomGraph(response.graph, demo, 'Y Combinator (company)');
            initGraph();
        }
    });
}

if (window.location.href.endsWith('/coronavirus/')) {
    setPath('/coronavirus');
    clickMainCircle('Wash your hands!');
    let coronavirus = {id: 'Coronavirus'};
    clearGraph(coronavirus);
    get('/coronavirus/graph').then(response => {
        renderCustomGraph(response.graph, coronavirus, '2019–20 coronavirus pandemic');
        initGraph();
    });
}

if (window.location.href.endsWith('/mine/')) {
    selectMine(menu.mine).then(() => {initGraph()});
}
