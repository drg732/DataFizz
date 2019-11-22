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

    //creates an array of tuples in the form (label, URL),
    //Where label is the text to it's respecive URL
    //const $rootPage = await rawPage.toJQsearchable(start_url);
    let ListOfURLsOnRootPage = await rootPage.extractAllURLs(await rawPage.toJQsearchable(start_url), site);
    console.log('Got all urls from first page. Moving On...')

    //finds the tuple in ListOfURLsOnRootPage that contains our taget string in first element of tuple
    const booksindex = forcedPath.findURLforMatchString(ListOfURLsOnRootPage, target);

    //grabs the URL from target tuple 
    let chosenSubcatURL = ListOfURLsOnRootPage[booksindex][1];

    //Provides a list of subcatgory URLs. Specifically runs on amazons Primary book page
    //The bookSubCatChoicePage object runs getSubCatUrls function that takes in a cheero object that is returned from the rawPage function
    let ListOfSubcatURLS = await bookSubCatChoicePage.getSubCatUrls(await rawPage.toJQsearchable(chosenSubcatURL));
    console.log('Got subcategorgie URLs on second page. Moving on...')
    let productsListPage = 'https://www.amazon.com' + ListOfSubcatURLS[1];
    
    
    //Provides a list of subcatgory URLs. This should work on on final search reult pages as long as the primary search results has the div ID ##mainResults
    //The results object runs extractProductLinks function that takes in a cheero object that is returned from the rawPage function
    let ListOfProductURLs = await results.extractProductLinks(await rawPage.toJQsearchable(productsListPage));
    console.log('Got final page with products. Moving on...')
 

    /**Creates an array.
     * Each element in the array contains a product and product details object
     * Each object is formated in a way that we can convert to json latet
     */
     for (var i = 0; i < ListOfProductURLs.length; i++) {
         const prodURL = ListOfProductURLs[i];
         const $ = await rawPage.toJQsearchable(prodURL);
         products.push(await product.extractProductDetails($, i, prodURL));
     }

 
    jsonElementsArray.convertToJSON(products);
    console.log('We\'re done here. Check productjson.txt that was generated');
}
