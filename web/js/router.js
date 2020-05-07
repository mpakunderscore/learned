if (window.location.href.includes('localhost')) {
    document.getElementById('favicon').setAttribute('href', 'images/favicon.green.png');
    document.title = ''
}

let path = ''

let setPath = (path) => {
    this.path = path;
    console.log(this.path)
    history.pushState({}, null, path);
    // if (path !== '/chat')

};

if (window.location.href.endsWith('/demo/')) {
    // clearContent();
    setPath('/demo');
    showChat().then()
    // get('/demo').then(response => {
    //     let demo = {id: 'Demo'}
    //     clearGraph(demo);
    //     if (response.graph['Y Combinator (company)']) {
    //         renderSimpleCustomGraph(response.graph, demo, 'Y Combinator (company)');
    //         initGraph();
    //     }
    // });
}

if (window.location.href.endsWith('/coronavirus/')) {
    clearContent();
    // initServiceInfo(() => {})
    renderCard('COVID-19', 'Coronavirus disease 2019 (COVID-19) is an infectious disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). The disease was first identified in 2019 in Wuhan, Central China, and has since spread globally, resulting in the 2019–20 coronavirus pandemic. Common symptoms include fever, cough, and shortness of breath. Muscle pain, sputum production, diarrhea, and sore throat are less common. While the majority of cases result in mild symptoms, some progress to severe pneumonia and multi-organ failure. As of 20 March 2020, the rate of deaths per number of diagnosed cases is 4.1%; however, it ranges from 0.2% to 15% according to age group and other health problems.', null, 'red')
    addLink('https://video-intl.alicdn.com/Handbook%20of%20COVID-19%20Prevention%20and%20Treatment.pdf', 'Handbook of COVID–19 Prevention and Treatment');
    addLink('https://smartairfilters.com/en/blog/best-materials-make-diy-face-mask-virus', 'Best materials for DIY mask');


    setPath('/coronavirus');
    setText('Wash your hands!');
    get('/coronavirus').then(response => {
        let coronavirusNode = {id: 'Coronavirus'};
        clearGraph(coronavirusNode);
        renderSimpleCustomGraph(response.graph, coronavirusNode, '2019–20 coronavirus pandemic');
        initGraph();
    });
}

if (window.location.href.endsWith('/mine/')) {
    // menu.mine.active = true;
    selectMine(menu.mine).then(() => {initGraph()});
}

if (window.location.href.endsWith('/blog/')) {
    clearContent();
    setPath('/blog');
    let blogNode = {id: 'Blog'};
    clearGraph(blogNode);
    initGraph();
    for (let i = blog.length - 1; i > -1; i--) {
        setText(blog[i].title);
        setText(blog[i].text);
        setText('<span>' + blog[i].author + '</span><span>' + blog[i].date + '</span>', 'footer');
    }
}

if (window.location.href.endsWith('/chat/')) {
    clearContent();
    setPath('/chat');
    input.focus()
}

if (window.location.href.endsWith('/tasks/')) {
    clearContent();
    setPath('/tasks');
}
