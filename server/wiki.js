const cheerio = require('cheerio')
const axios = require('axios');

exports.getWikiCategories = async function (title, lang = 'en') {

  const categoryLang = {en: 'Category:', ru: 'Категория:', simple: 'Category:'}
  const mainTitle = {en: 'Main_topic_classifications', ru: 'Статьи', simple: 'Articles'};

  try {

    if (title === 'Wiki')
      title = mainTitle[lang];

    const urlString = 'https://' + lang + '.wikipedia.org/wiki/' + categoryLang[lang] + title;
    const url = encodeURI(urlString);
    const response = await axios.get(url);
    const data = response.data;

    let categories = [];
    const $ = cheerio.load(data);
    $('#mw-subcategories .CategoryTreeItem').find('a').each(function (index, element) {
      categories.push({id: $(element).text(), info: $(element).next().text()});
    });

    let pages = [];
    let isMainPage = false;
    $('#mw-pages li').find('a').each(function (index, element) {
      const pageTitle = $(element).text();
      pages.push({id: pageTitle});
      if (pageTitle === title || pageTitle === title.substring(0, title.length - 1))
        isMainPage = true;
    });

    return {categories: categories, pages: pages, mainPage: isMainPage ? await getWikiCategoryPage(title, lang) : {}};

  } catch (error) {
    console.log(error);
  }
}

let getWikiCategoryPage = async function (title, lang = 'en') {

  const urlString = 'https://' + lang + '.wikipedia.org/wiki/' + title;
  const url = encodeURI(urlString);

  try {
    const response = await axios.get(url);
    const data = response.data;

    const $ = cheerio.load(data);
    let text = $('p[class!=mw-empty-elt]').first().text();
    let fixedText = text.replace(/\[.*\]/gm, '').replace(/\s\s+/g, ' ');;

    return {text: fixedText};

  } catch (e) {
    return {text: null}
  }
}
