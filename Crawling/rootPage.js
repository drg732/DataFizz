/**
 * Gets passed the starting URL
 * Grabs all URLS and respective text 
 * Returns an array where each object is a pair, [leabel, link]
*/
//THIS STAYS
class rootPage {
    async  extractAllURLs($rootPage, site) {
        let catLabel_and_PrimecatLinks = [];
        //const $ = await raw_data(directory_url);
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