if (window.location.href.includes('localhost')) {
    document.getElementById('favicon').setAttribute('href', 'images/favicon.green.png');
    console.log(document.title = '')
}

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
    contentList.innerHTML += '<div><a href="https://video-intl.alicdn.com/Handbook%20of%20COVID-19%20Prevention%20and%20Treatment.pdf" target="_blank">Handbook of COVID–19 Prevention and Treatment</a></div>';
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
