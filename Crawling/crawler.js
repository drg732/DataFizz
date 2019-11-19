//const request = require('request');
var prompts = require('prompts');
let axios = require('axios');
const cheerio = require('cheerio');

//let url = 'https://www.amazon.com/Notre-Dame-Short-History-Meaning-Cathedrals/dp/198488025X/ref=lp_266162_1_1?s=books&ie=UTF8&qid=1573930252&sr=1-1.amazon.com/s/ref=lp_173508_nr_n_0?fst=as%3Aoff&rh=n%3A283155%2Cn%3A%211000%2Cn%3A1%2Cn%3A173508%2Cn%3A266162&bbn=173508&ie=UTF8&qid=1573930243&rnid=173508://www.amazon.com/Audio-Technica-Professional-Headphone-Bluetooth-Headphones/dp/B01M6BQUSG/ref=lp_12097479011_1_1_sspa?s=aht&ie=UTF8&qid=1572400180&sr=1-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExV1ZJNEU2NlVTWDlGJmVuY3J5cHRlZElkPUEwMjg0MTM2MjVORk1EQkZFVlJXNCZlbmNyeXB0ZWRBZElkPUEwNjc1ODU5M0ROWk5NWDZOMUEwNCZ3aWRnZXROYW1lPXNwX2F0Zl9icm93c2UmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl';
let url = 'https://www.amazon.com/Sushi-Home-Mat-Table-Cookbook/dp/1623155975/ref=sr_1_1_sspa?keywords=Sushi+at+Home%3A+a+Mat-To-Table+Sushi+Cookbook&qid=1573938298&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyRkhPSTNXVFFOWlJFJmVuY3J5cHRlZElkPUEwNzI3ODY4R0Y0VDdFRVFKSlVYJmVuY3J5cHRlZEFkSWQ9QTA2OTI2NTUxMkY4SzJNWkFHWlExJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=='
//item_info();
let directory_url = 'https://www.amazon.com/gp/site-directory'
let primecat_url = 'https://www.amazon.com/books-used-books-textbooks/b?ie=UTF8&node=283155&ref_=sd_allcat_bo_t3'
let catLabel_and_PrimecatLinks = [];
let preset = 118; //we found this so the we can just crawl through the books category and not all of amazon 
let subcat_list2 = [];
let Primecat_listlinks1 = [];
go_to();
//directorylist();


async function go_to(){
    let p1 = await directorylist();
    let booksindex = getIndexOfK(p1, 'Books');
    //console.log(x)
    //console.dir(p1, {'maxArrayLength': null});
    //console.log(primecat_url)
    let urlto2 = p1[booksindex][1];
    //console.log(urlto2);
    let p2 = await get_subcat(urlto2);
    let urlto3 = p2[1];
    //console.log(urlto3);
    let p3 =  await final_page_with_results(urlto3);
    for(var i = 0; i < p3.length; i++ ){   
    item_info(p3[i]);
    }

}


// async function directorylist(){
//     const $ = await raw_data(directory_url);
//     //let catLabel_and_subcatLinks = [];
//     $(".fsdDeptBox").each(function(){
//         let $$ = cheerio.load(this);
//         let title = $$('.fsdDeptTitle').text();
//         Primecat_listlinks1 = [];
//         $$('.fsdDeptLink').each(function(){
//         Primecat_listlinks1.push('https://www.amazon.com' + $$(this).attr('href'));
//         });
//         catLabel_and_PrimecatLinks.push([title, Primecat_listlinks1]);
//         //$('.fsdDeptLink')
//     });
//     return catLabel_and_PrimecatLinks;
//     //console.log(catLabel_and_PrimecatLinks[preset][1]);
    
// }


async function directorylist(){
    const $ = await raw_data(directory_url);
    $('a').each(function(){
        let label = '';
        let link = '';
        link = $(this).attr('href');
        label = $(this).text();
        if (typeof link !== 'undefined'){
            if (link[0] == '/'){
                link = 'https://www.amazon.com' + $(this).attr('href');  //take out ''https://www.amazon.com' + ' if you want to use this function for any other website
            }
            if(link.startsWith('https://www.amazon.com')){
            catLabel_and_PrimecatLinks.push([label, link]);
        }
        }

    });
    return catLabel_and_PrimecatLinks;
}

//grab and collects subcategories on left panel
async function get_subcat(x){
    const $ = await raw_data(x);
    subcat_list2 = [];
    let $$ = cheerio.load($('ul.a-unordered-list.a-nostyle.a-vertical.s-ref-indent-one').html());
    $$('.a-link-normal').each(function(){
        subcat_list2.push($$(this).attr('href'));
    });
   return subcat_list2;
}

async function final_page_with_results(x){
    const $ = await raw_data(x);
    let item_list = [];
    let $$ = cheerio.load($('#mainResults').html());
    //console.log($$);
     $$('.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal').each(function(){
        item_list.push($$(this).attr('href'));
        });
        return item_list;
     }



//------BEGIN products page raw data and specifics---//

//this goes to a specific item page and collects the raw output. 
//If all checks out (page respones = 200 & raw data is outputted by axios) this callsback to item_info with cheerio structured html
async function raw_data(passedurl){
    const response = await axios.get(passedurl);
    if(response.status == 200) {
        const html = response.data;
        const chtml = cheerio.load(html);
        //console.log(chtml);
        return chtml;
    }
    return null;
}

//this receives data from raw_data()
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
    console.log(product);
}

function getIndexOfK(arr, k) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] == 'Books'){
        return i;
      }
    }
}
//------END products page raw data and specifics---//