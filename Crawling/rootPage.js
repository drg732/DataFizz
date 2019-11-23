/**
 * Receives cheerio objects and domain for the site we are working with.
 * Extracts all URLs with the matchin domain and all URLs with leading "//"
 * Appends domain to any URLs with leading "//"
 * This should work for any site if you are wanting all URLs on a page
 * Returns an array where each object is a pair, [label, URL] where both are string objects
*/
class rootPage {
    async  extractAllURLs($rootPage, site) {
        let catLabel_and_PrimecatLinks = [];
        $rootPage('a').each(function () {
            let label = '';
            let link = '';
            link = $rootPage(this).attr('href');
            label = $rootPage(this).text();
            if (typeof link !== 'undefined') {
                if (link[0] == '/') {
                    link = site + $rootPage(this).attr('href');
                }
                if (link.startsWith(site)) {
                    catLabel_and_PrimecatLinks.push([label, link]);
                }
            }

        });
        return catLabel_and_PrimecatLinks;
    }
}

module.exports = rootPage;