const cheerio = require('cheerio');
    /**
     * Receives URL of the page that should contain search reults
     * returns an array of URLs for each product
     */
    //PUT IN AMAZON SPECIFIC CLASS
class Results {
    async extractProductLinks($) {
        let item_list = [];
        let $results_chtml = cheerio.load($('#mainResults').html());
        $results_chtml('.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal').each(function () {
            item_list.push($results_chtml(this).attr('href'));
        });
        return item_list;
    }
}

module.exports = Results;