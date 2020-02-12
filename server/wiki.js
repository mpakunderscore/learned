const cheerio = require('cheerio')
const axios = require('axios');

exports.getWikiCategories = async function (title, lang = 'en') {

  const categoryLang = {en: 'Category:', ru: 'Категория:', simple: 'Category:'}
  const mainTitle = {en: 'Main_topic_classifications', ru: 'Статьи', simple: 'Articles'};

  try {

    if (title === 'Wiki')
      title = mainTitle[lang];

    const urlString = 'https://' + lang + '.wikipedia.org/wiki/' + categoryLang[lang] + title;
    // console.log(urlString)
    const url = encodeURI(urlString);
    const response = await axios.get(url);
    const data = response.data;

    let categories = [];
    const $ = cheerio.load(data);
    $('#mw-subcategories .CategoryTreeItem').find('a').each(function (index, element) {
      categories.push({id: $(element).text(), info: $(element).next().text()});
    });
    let pages = [];
    $('#mw-pages li').find('a').each(function (index, element) {
      pages.push({id: $(element).text()});
    });
    // console.log(pages)

    return {categories: categories, pages: pages};

  } catch (error) {
    console.log(error);
  }
}
