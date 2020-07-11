graph.style.width = 100 * borderRatio + '%';

let mainCircleText = 'Home';

let lang = 'en';

const circleRadius = isMobile ? 12 : 6;
const textPadding = isMobile ? 18 : 12;
const textHeight = isMobile ? '.4em' : '.35em';

const defaultEdge = 100;

let nodes_data = [];
let links_data = [];

let mainCategory = {id: '', main: true, active: true, depth: 0};
nodes_data.push(mainCategory);

let menu = {};

// TODO MENU DATA
let initMenu = () => {




    menu.mine = menuItem({id: 'Mine', title: 'My links and graph'});
    menuItem({id: 'Graph', title: 'Global graph'});
    menuItem({id: 'Sources ', title: 'Links sources'});

    // menuItem({id: 'Demo'});
    // menu.settings = menuItem({id: 'Settings', lang: true});
    // menuItem({id: 'Random'});
};

initMenu();

function menuItem(item) {
    item.depth = 1;
    nodes_data.push(item);
    links_data.push({source: mainCategory, target: item, value: defaultEdge});
    return item;
}

const languages = [{id: 'En', lang: true}, {id: 'Ru', lang: true}];

// , {id: 'Es'}, {id: 'Fr'}, {id: 'De'}, {id: 'Zh'}, {id: 'Ja'}

function initLanguageMenu(selectedNode) {

    for (let id in languages) {
        let language = languages[id]
        console.log(lang + ' ' + language.id.toLowerCase())
        language.active = lang === language.id.toLowerCase();
        nodes_data.push(language);
        links_data.push({source: language, target: menu.settings, value: defaultEdge});
    }
}
