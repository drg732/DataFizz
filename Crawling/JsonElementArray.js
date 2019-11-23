const fs = require('fs');

/**
 * This receives an array of JSON stringified objects.
 * Writes each product string object to a predetermined file (productjson.txt).
 * The final rsult in the tixt file is valid JSON.
 */

class JsonElementsArray {

    convertToJSON(productsArray) {
        var file = fs.createWriteStream('Products_JSON.txt');
        file.on('error', function (err) { /* error handling */ });
        file.write('[')
        productsArray.forEach(function (value, idx, array) {
            if (idx === array.length - 1) {
                //console.log("Last callback call at index " + idx + " with value " + i ); 
                file.write(value);
            }
            else {
                file.write(value + ',');
            }
        });
        file.write(']')
        file.end();
    }
}

module.exports = JsonElementsArray;