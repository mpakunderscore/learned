graph.style.width = 100 * borderRatio + '%';

let mainCircleText = 'Home';

let lang = 'en';

const circleRadius = isMobile ? 12 : 6;
const textPadding = isMobile ? 18 : 12;
const textHeight = isMobile ? '.4em' : '.35em';

const defaultEdge = 100;

let nodes_data = [];
let links_data = [];

let mainCategory = {id: '', main: true, active: true};
nodes_data.push(mainCategory);

// TODO MENU DATA
let initGraphMenu = () => {

    menuItem({id: 'Settings', lang: true});
    menuItem({id: 'Graph'});
    menuItem({id: 'Mine'});
    menuItem({id: 'Random'});
};

initGraphMenu();

function menuItem(item) {
    nodes_data.push(item);
    links_data.push({source: mainCategory, target: item, value: defaultEdge});
    return item;
}

const languages = [{id: 'En', lang: true}, {id: 'Ru', lang: true}];

// , {id: 'Es'}, {id: 'Fr'}, {id: 'De'}, {id: 'Zh'}, {id: 'Ja'}

function setLanguageMenu() {

    let languageCategory = menuItem({id: 'Language', active: true, lang: true});

    for (let id in languages) {
        let language = languages[id]
        console.log(lang + ' ' + language.id.toLowerCase())
        language.active = lang === language.id.toLowerCase();
        nodes_data.push(language);
        links_data.push({source: language, target: languageCategory, value: defaultEdge});
    }
}
