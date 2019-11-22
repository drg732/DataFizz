const axios = require('axios');
const cheerio = require('cheerio');

/** 
 * Receives a URL te
 * Tests for 200 response
 * Loads html into cheerio object
 * returns cheerio object
*/
//PUT IN PAGE CLASS
class RawPage {
    async  toJQsearchable(url) {
        //console.log(url);
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36' } })
        if (response.status == 200) {
            const html = response.data;
            const chtml = cheerio.load(html);
            //console.log(chtml);
            return chtml;
        }
        else {
            console.log('OOPS');
            return response.status;
        }
    }
}

module.exports = RawPage;
