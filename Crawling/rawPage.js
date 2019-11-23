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
        catch (error){
            console.error('OOPS');
            //return error.response.status;
        }
    }
}

module.exports = RawPage;
