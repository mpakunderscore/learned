const cheerio = require('cheerio')
const axios = require('axios');

const database = require("../database/postgres");

exports.getWikiCategories = async function (title, lang = 'en') {

    // console.log(title)

    const categoryLang = {en: 'Category:', ru: 'Категория:', simple: 'Category:'}
    const mainTitle = {en: 'Main_topic_classifications', ru: 'Статьи', simple: 'Articles'};

    try {

        if (title === 'Graph')
            title = mainTitle[lang];

        let databaseCategory = await database.getCategory(title).then();
        if (databaseCategory)
            return databaseCategory;

        const urlString = 'https://' + lang + '.wikipedia.org/wiki/' + categoryLang[lang] + title;
        // console.log(urlString)
        const url = encodeURI(urlString);
        const response = await axios.get(url);
        const data = response.data;

        const $ = cheerio.load(data);

        let subcategories = [];
        $('#mw-subcategories .CategoryTreeItem').find('a').each(function (index, element) {
            subcategories.push({id: $(element).text(), info: $(element).next().text()});
        });

        let categories = [];
        $('#mw-normal-catlinks > ul').find('li > a').each(function (index, element) {
            categories.push($(element).text());
        });

        let pages = [];
        let isMainPage = false;
        $('#mw-pages li').find('a').each(function (index, element) {
            const pageTitle = $(element).text();
            pages.push({id: pageTitle});
            if (pageTitle === title || pageTitle === title.substring(0, title.length - 1) || pageTitle.substring(0, pageTitle.length - 1) === title.substring(0, title.length - 1))
                isMainPage = true;
        });

        let category = {
            id: title,
            subcategories: subcategories,
            categories: categories,
            pages: pages,
            mainPage: isMainPage ? await exports.getWikiPage(title, lang) : {},
            language: lang,
        };

        database.saveCategory(category).then();

        return category;

    } catch (error) {
        // TODO
        // console.log(error);

        return {id: title, categories: []};
    }
}

exports.getWikiPage = async function (title, lang = 'en') {

    const urlString = 'https://' + lang + '.wikipedia.org/wiki/' + title;
    const url = encodeURI(urlString);

    let page = {};

    try {
        const response = await axios.get(url);
        const data = response.data;

        const $ = cheerio.load(data);
        let text = $('p[class!=mw-empty-elt]').first().text();
        let fixedText = text.replace(/\[.*\]/gm, '').replace(/\s\s+/g, ' ');
        page.text = fixedText;

        let categories = [];
        $('#mw-normal-catlinks > ul').find('li > a').each(function (index, element) {
            categories.push($(element).text());
        });
        page.categories = categories;

        $('img').each(function (index, element) {
            let src = $(element).attr('src');
            let width = $(element).attr('width');
            if (width > 100)
                page.image = src;
        });

        return page;

    } catch (e) {
        return {text: null}
    }
};
