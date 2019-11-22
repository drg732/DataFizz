const fs = require('fs');

class JsonElementsArray {

    convertToJSON(productsArray) {
        var file = fs.createWriteStream('productjson.txt');
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