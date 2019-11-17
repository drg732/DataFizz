//const request = require('request');
var prompts = require('prompts');
let axios = require('axios');
const cheerio = require('cheerio');

//let url = 'https://www.amazon.com/Notre-Dame-Short-History-Meaning-Cathedrals/dp/198488025X/ref=lp_266162_1_1?s=books&ie=UTF8&qid=1573930252&sr=1-1.amazon.com/s/ref=lp_173508_nr_n_0?fst=as%3Aoff&rh=n%3A283155%2Cn%3A%211000%2Cn%3A1%2Cn%3A173508%2Cn%3A266162&bbn=173508&ie=UTF8&qid=1573930243&rnid=173508://www.amazon.com/Audio-Technica-Professional-Headphone-Bluetooth-Headphones/dp/B01M6BQUSG/ref=lp_12097479011_1_1_sspa?s=aht&ie=UTF8&qid=1572400180&sr=1-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExV1ZJNEU2NlVTWDlGJmVuY3J5cHRlZElkPUEwMjg0MTM2MjVORk1EQkZFVlJXNCZlbmNyeXB0ZWRBZElkPUEwNjc1ODU5M0ROWk5NWDZOMUEwNCZ3aWRnZXROYW1lPXNwX2F0Zl9icm93c2UmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl';
let url = 'https://www.amazon.com/Sushi-Home-Mat-Table-Cookbook/dp/1623155975/ref=sr_1_1_sspa?keywords=Sushi+at+Home%3A+a+Mat-To-Table+Sushi+Cookbook&qid=1573938298&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyRkhPSTNXVFFOWlJFJmVuY3J5cHRlZElkPUEwNzI3ODY4R0Y0VDdFRVFKSlVYJmVuY3J5cHRlZEFkSWQ9QTA2OTI2NTUxMkY4SzJNWkFHWlExJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=='
raw_data();

//this goes to a specific item page and collects the raw output. 
//If all checks out (page respones = 200 & raw data is outputted by axios) this callsback to item_info with cheerio structured html
async function raw_data(){
    axios.get(url).then(response => {
        if(response.status == 200){
            const html = response.data;
            const chtml = cheerio.load(html);
            //console.log(chtml);
            item_info(chtml)
        }
    });
}

//this receives data from raw_data()
//stores the the html in a jquery objects so we can use jQuery and selectors to pull the data we need
function item_info(chtml){
    const $ = chtml;
    const img_url_list = [];
    $(".imageThumb").each(function(i){
        img_url_list.push($(this).html().split("\"")[1]);
    });

    let product = {
        //const $ = chtml;
        name: $('title').text(),
        list_price: $(".a-color-secondary:contains(List Price)").next().text(),
        description:  $($('#bookDescription_feature_div').children('noscript').html()).text().trim(),
        product_dimensions: $("li:contains(Product Dimensions:)").text().split(/[:(]+/)[1].trim(),
        imageURLs: img_url_list,
        weight: $("li:contains(Shipping Weight)").text().split(/[:(]+/)[1].trim(),
        // console.log('Name: '+name+ '\n\n' + 
        //             'List Price: '+list_price+  '\n\n' + 
        //             'Description: '+description+ '\n\n' +
        //             'Product_dimensions: '+product_dimensions+ '\n\n' +
        //             'Image URLs: '+imageurls_list+ '\n\n' + 
        //             'Weight: '+weight);

    }
    console.log(product);
}