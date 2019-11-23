const prompts = require('prompts');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
/*---BEGIN Classes Made for this Project---*/
const ForcedPath = require('./forcedPath');
const Results = require('./Amazon/results');
const Product = require('./Amazon/product');
const RootPage = require('./rootPage');
const JsonElementsArray = require('./JsonElementArray')
const RawPage = require('./rawPage')
const BookSubCatChoicePage = require('./Amazon/Books/subCatChoices')
/*---END Classes Made for this Project---*/

const forcedPath = new ForcedPath();
const results = new Results();
const product = new Product();
const rootPage = new RootPage();
const jsonElementsArray = new JsonElementsArray();
const rawPage = new RawPage();
const bookSubCatChoicePage = new BookSubCatChoicePage;

const starting_url = 'https://www.amazon.com/gp/site-directory' //Preset for this exercise: Starting Page
const site = 'https://www.amazon.com'; //Preset for this exercise: Domain for appending to URLs 
const target = 'Books' //Preset for this exercise: target string to force navigation.
const products = [];

async function start_crawling() {

    //Creates an array of tuples in the form (label, URL) extracted from the starting page.
    let ListOfURLsOnRootPage = await rootPage.extractAllURLs(await rawPage.toJQsearchable(starting_url), site);
    console.log('Got all urls from first page. Moving On...')

    //Finds the tuple in ListOfURLsOnRootPage that contains our taget string in first element of tuple.
    const booksindex = forcedPath.findURLforMatchString(ListOfURLsOnRootPage, target);

    //Extracts URL from target tuple.
    let chosenSubcatURL = ListOfURLsOnRootPage[booksindex][1];

    //Provides a list of subcatgory URLs. Specifically runs on amazons Primary book page
    //The bookSubCatChoicePage object runs getSubCatUrls function that takes in a cheero object that is returned from the rawPage function.
    let ListOfSubcatURLS = await bookSubCatChoicePage.getSubCatUrls(await rawPage.toJQsearchable(chosenSubcatURL));
    console.log('Got subcategories URLs on second page. Moving on...')
    let productsListPage = 'https://www.amazon.com' + ListOfSubcatURLS[1];


    //Provides a list of subcatgory URLs. This should work on on final search reult pages as long as the primary search results has the div ID ##mainResults
    //The results object runs extractProductLinks function that takes in a cheero object that is returned from the rawPage function
    let ListingPage = await results.extractProductLinks(await rawPage.toJQsearchable(productsListPage));
    console.log('Got final listing page with products. Moving on...')


    //Creates an array of JSON stringified objects.
    for (var i = 0; i < ListingPage.length; i++) {
        const prodURL = ListingPage[i];
        const $ = await rawPage.toJQsearchable(prodURL);
        products.push(await product.extractProductDetails($, i, prodURL));
    }

    //Converts products array to Valid JSON string that is written to a text file in the root directory of this project.
    jsonElementsArray.convertToJSON(products);  
    console.log('We\'re done here. Check Products_JSON.txt file that was generated in the current working directory');
}

start_crawling();
