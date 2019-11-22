

//stores the the html in a jquery objects so we can use jQuery and selectors to pull the data we need
//PUT IN AMAZON SPECIFIC CLASS
class Product {
    async extractProductDetails($prod_chtml, idNum, prodURL) {
        const img_url_list = [];
        $prod_chtml(".imageThumb").each(function () {
            img_url_list.push($prod_chtml(this).html().split("\"")[1]);
        });

        let product = {
            id: idNum + 1,
            name: $prod_chtml('title').text(),
            list_price: $prod_chtml(".a-color-secondary:contains(List Price)").next().text(),
            description: $prod_chtml($prod_chtml('#bookDescription_feature_div').children('noscript').html()).text().trim(),
            product_dimensions: $prod_chtml("li:contains(Product Dimensions:)").text().split(/[:(]+/)[1].trim(),
            imageURLs: img_url_list,
            weight: $prod_chtml("li:contains(Shipping Weight)").text().split(/[:(]+/)[1].trim(),
            sourceURL: prodURL,
        }
        console.log('Oo, Got a product!');
        return JSON.stringify(product, null, 2);
    }
}

module.exports = Product;
