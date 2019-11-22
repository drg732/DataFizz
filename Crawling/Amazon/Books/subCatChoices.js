const cheerio = require('cheerio');

class BookSubCatChoicePage {
    /** 
      * Receives URL (Should be the Books page)
      * returns an array of urls -the urls are the subcategories under books
    */
    //PUT IN AMAZON SPECIFIC CLASS
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