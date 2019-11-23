const cheerio = require('cheerio');
/**
 * Receives cheerio object of the Amazon page containe the search results.
 * Extracts all product URLS within the div ID #mainResults.
 * Returns an arrary of product URLs.
 */
class Results {
    async extractProductLinks($resultsPage_chtml) {
        let item_list = [];
        let $results_chtml = cheerio.load($resultsPage_chtml('#mainResults').html());
        $results_chtml('.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal').each(function () {
            item_list.push($results_chtml(this).attr('href'));
        });
        return item_list;
    }
}

module.exports = Results;