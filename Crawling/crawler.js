//const request = require('request');
var prompts = require('prompts');
let axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');
//const A = axios.create({headers: {'User-Agent:': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'}});
let directory_url = 'https://www.amazon.com/gp/site-directory'
let products = [];


go_to();


async function go_to(){
    let p1 = await directorylist();
    console.log('Got all urls from first page. Moving On...')
    let booksindex = getIndexOfK(p1, 'Books');  //very specific to this exercise. Grabs the index of requested string so that we could get the link to the next page
    let urlto2 = p1[booksindex][1];
    console.log(p1);
    let p2 = await get_subcat(urlto2);
    console.log('Got subcategorgie URLs on second page. Moving on...')
    let urlto3 = 'https://www.amazon.com' + p2[1];
    console.log(urlto3);
    let p3 =  await final_page_with_results(urlto3);
    console.log('Got final page with products. Moving on...')
    //console.log(p3);
    for(var i = 0; i < p3.length; i++ ){   
    products.push(item_info(p3[i]));
    }
    //console.log(products);
    //console.log(products)
    toJSONfile(products);
}



/**
 * Gets passed the starting URL
 * Grabs all URLS and respective text 
 * Returns an array where each object is a pair, [leabel, link]
*/
async function directorylist(){
    let catLabel_and_PrimecatLinks = [];
    const $ = await raw_data(directory_url);
    $('a').each(function(){
        let label = '';
        let link = '';
        link = $(this).attr('href');
        label = $(this).text();
        if (typeof link !== 'undefined'){
            if (link[0] == '/'){                                        //REMOVE THIS LINE TO USE THIS FUNCTION FOR ANY WEBSITE
                link = 'https://www.amazon.com' + $(this).attr('href'); //REMOVE THIS LINE TO USE THIS FUNCTION FOR ANY WEBSITE
            }                                                           //REMOVE THIS LINE TO USE THIS FUNCTION FOR ANY WEBSITE   
            if(link.startsWith('https://www.amazon.com')){              //REMOVE THIS LINE TO USE THIS FUNCTION FOR ANY WEBSITE  
            catLabel_and_PrimecatLinks.push([label, link]);
        }                                                               //REMOVE THIS LINE TO USE THIS FUNCTION FOR ANY WEBSITE
        }

    });
    return catLabel_and_PrimecatLinks;
}



/** 
  * Receives URL (Should be the Books page)
  * returns an array of urls -the urls are the subcategories under books
*/
async function get_subcat(x){
    let subcat_list2 = [];
    const $ = await raw_data(x);
    subcat_list2 = [];
    let $$ = cheerio.load($('ul.a-unordered-list.a-nostyle.a-vertical.s-ref-indent-one').html());
    $$('.a-link-normal').each(function(){
        subcat_list2.push($$(this).attr('href'));
    });
   return subcat_list2;
}



/**
 * Receives URL of the page that should contain search reults
 * returns an array of URLs for each product
 */
async function final_page_with_results(x){
    const $ = await raw_data(x);
    let item_list = [];
    let $$ = cheerio.load($('#mainResults').html());
     $$('.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal').each(function(){
        item_list.push($$(this).attr('href'));
        });
        return item_list;
     }


//stores the the html in a jquery objects so we can use jQuery and selectors to pull the data we need
async function item_info(x){
    const $ = await raw_data(x);
    const img_url_list = [];
    $(".imageThumb").each(function(){
        img_url_list.push($(this).html().split("\"")[1]);
    });

    let product = {
        //const $ = chtml;
        name: $('title').text(),
        list_price: $(".a-color-secondary:contains(List Price)").next().text(),
        description:  $($('#bookDescription_feature_div').children('noscript').html()).text().trim(),
        product_dimensions: $("li:contains(Product Dimensions:)").text().split(/[:(]+/)[1].trim(),
        imageURLs: img_url_list,
        weight: $("li:contains(Shipping Weight)").text().split(/[:(]+/)[1].trim()
    }
    //console.log(product);
    return JSON.stringify(product, null, 2);
}

/** Finds specfic label (Books in our exercise) and returns the respective URL */
function getIndexOfK(arr, k) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] == 'Books'){
        return i;
      }
    }
}



/** 
 * Receives a URL te
 * Tests for 200 response
 * Loads html into cheerio object
 * returns cheerio object
*/
async function raw_data(passedurl){
   const response = await  axios.get(passedurl, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'}})
        // if (error.response) {
        //     console.log('Dang.. Looks like we got blocked or throttled');
        //     console.log(error.response.status);
        //     console.log(error.response.headers);
        //     return null;
        //   }
    if(response.status == 200) {
        const html = response.data;
        const chtml = cheerio.load(html);
        //console.log(chtml);
        return chtml;
    }
}


function toJSONfile(){
var file = fs.createWriteStream('productjson.txt');
file.on('error', function(err) { /* error handling */ });
file.write('[')
products.forEach(function(value, idx, array){
    if (idx === array.length - 1){ 
        //console.log("Last callback call at index " + idx + " with value " + i ); 
        file.write(value);
    }
    else{
        file.write(value + ',');
    }
 });
file.write(']')
file.end();
}
