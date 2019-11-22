const prompts = require('prompts');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const ForcedPath = require('./forcedPath');
const Results = require('./Amazon/results');
const Product = require('./Amazon/product');
const RootPage = require('./rootPage');
const JsonElementsArray = require('./JsonElementArray')
const RawPage = require('./rawPage')
const BookSubCatChoicePage = require('./Amazon/Books/subCatChoices')

const forcedPath = new ForcedPath();
const results = new Results();
const product = new Product();
const rootPage = new RootPage();
const jsonElementsArray = new JsonElementsArray();
const rawPage = new RawPage();
const bookSubCatChoicePage = new BookSubCatChoicePage;

const start_url = 'https://www.amazon.com/gp/site-directory'
const site = 'https://www.amazon.com';
const target = 'Books'

let products = [];

start_crawling();
//directorylist();

async function start_crawling(){

    const $rootPage = await rawPage.toJQsearchable(start_url);
    let ListOfURLsOnRootPage = await rootPage.extractAllURLs($rootPage, site);
    console.log('Got all urls from first page. Moving On...')


    const booksindex = forcedPath.findURLforMatchString(ListOfURLsOnRootPage, target);

    let urlto2 = ListOfURLsOnRootPage[booksindex][1];
    console.log(urlto2);

    const $chtmlp2 = await rawPage.toJQsearchable(urlto2);

    let p2 = await bookSubCatChoicePage.getSubCatUrls($chtmlp2);
    console.log('Got subcategorgie URLs on second page. Moving on...')
    let urlto3 = 'https://www.amazon.com' + p2[1];
    
    const $ = await rawPage.toJQsearchable(urlto3);
    
    //$$ = cheerio.load($('#mainResults').html());
    let p3 = await results.extractProductLinks($);
    //let p3 = await final_page_with_results(urlto3);
    console.log('Got final page with products. Moving on...')
    //console.log(p3);

     for (var i = 0; i < p3.length; i++) {
         const prodURL = p3[i];
         const $ = await rawPage.toJQsearchable(prodURL);
         products.push(await product.extractProductDetails($, i, prodURL));
     }

    //toJSONfile(products);
    jsonElementsArray.convertToJSON(products);
    console.log('We\'re done here. Check productjson.txt that was generated');
}
