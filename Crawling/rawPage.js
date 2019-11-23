const axios = require('axios');
const cheerio = require('cheerio');
/**
 * Receives a URL.
 * Extracts the html using axios.
 * Converts it to cheerio object so we can treat it like JQuery.
 * Returns the cheerio object.
*/
class RawPage {
    async  toJQsearchable(url) {
        try {
            const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36' } })
            if (response.status == 200) {
                const html = response.data;
                const chtml = cheerio.load(html);
                //console.log(chtml);
                return chtml;
            }
        }
        catch (error) {
            // Error
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log('Bummer! Looks like we got a '+ error.response.status + '. Check the URL you are working with:');
                console.log(url);
                //console.log(error.response.status);
                //console.log(error.response.headers);
            }
            else {
                console.group('Looks like we didn\'t even get a response from the server we were trying to reach. You sure you have the right domain?');
                console.log(url);
            }
        }
    }
}

module.exports = RawPage;