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
    renderCard('COVID-19', 'Coronavirus disease 2019 (COVID-19) is an infectious disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). The disease was first identified in 2019 in Wuhan, Central China, and has since spread globally, resulting in the 2019–20 coronavirus pandemic. Common symptoms include fever, cough, and shortness of breath. Muscle pain, sputum production, diarrhea, and sore throat are less common. While the majority of cases result in mild symptoms, some progress to severe pneumonia and multi-organ failure. As of 20 March 2020, the rate of deaths per number of diagnosed cases is 4.1%; however, it ranges from 0.2% to 15% according to age group and other health problems.', null, 'red')
    addLink('https://video-intl.alicdn.com/Handbook%20of%20COVID-19%20Prevention%20and%20Treatment.pdf', 'Handbook of COVID–19 Prevention and Treatment');
    setPath('/coronavirus');
    renderText('Wash your hands!');
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
