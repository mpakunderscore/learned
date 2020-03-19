let setPath = (path) => {
    history.pushState({}, null, path);
};

if (window.location.href.endsWith('/demo/')) {
    setPath('/demo');
    get('/demo/graph').then(response => {
        let demo = {id: 'Demo'}
        clearGraph(demo);
        if (response.graph['Y Combinator (company)']) {
            renderCustomGraph(response.graph, demo, 'Y Combinator (company)');
            initGraph();
        }
    });
}

if (window.location.href.endsWith('/coronavirus/')) {
    setPath('/coronavirus');
    clickMainCircle('Wash your hands!');
    get('/coronavirus/graph').then(response => {
        let coronavirus = {id: 'Coronavirus'};
        clearGraph(coronavirus);
        renderCustomGraph(response.graph, coronavirus, '2019–20 coronavirus pandemic');
        initGraph();
    });
}

if (window.location.href.endsWith('/mine/')) {
    // menu.mine.active = true;
    selectMine(menu.mine).then(() => {initGraph()});
}
