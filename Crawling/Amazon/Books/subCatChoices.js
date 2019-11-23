const cheerio = require('cheerio');
/**
 * Receives cheerio object (Must Have been the results of the result of an Ama)
 * returns an array of urls -the urls are the subcategories on the books page
*/

class BookSubCatChoicePage {
    async  getSubCatUrls($chtml) {
        let subcat_list2 = [];
        subcat_list2 = [];
        let $$ = cheerio.load($chtml('ul.a-unordered-list.a-nostyle.a-vertical.s-ref-indent-one').html());
        $$('.a-link-normal').each(function () {
            subcat_list2.push($$(this).attr('href'));
        });
        return subcat_list2;
    }
}

module.exports = BookSubCatChoicePage;