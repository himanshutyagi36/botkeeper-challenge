'use strict';
const axios = require('axios'),
    config_loader = require('../configs/botkeeperConfigs.json'),
    BASE_URL = config_loader["base_url"],
    jsonQuery = require('json-query');

function getAllProducts(){
    return axios.get(BASE_URL+'products');
}
function getAllInventory(){
    return axios.get(BASE_URL+'inventory');
}
const getAllProductsInfo = async (req, res) => {
        axios.all([getAllProducts(), getAllInventory()])
        .then(axios.spread(function(productResponse, inventoryResponse){
            var productData = productResponse.data;
            var inventoryData = inventoryResponse.data.inventory;
            var responseData = [];
            for(let i=0;i<productData.length;i++) {
                var product = productData[i];
                var inventoryCount = jsonQuery(`[name=${product.name}].inventory`,{
                    data: inventoryData
                });
                responseData.push({'name': product.name, 'price': product.price, 'inventory': inventoryCount.value});
            }
            console.log("Sending all products data");
            res.status(200).send(responseData);
        }))
        .catch((err) => {
            console.log(`Err is: ${err}`);
            res.status(500).send("Internal server error");

        });
}
const getSingleProductInfo = async (req,res) => {
    var productName = req.params.name;
    try {
        var response = await axios.get(BASE_URL+'products/'+productName);
        var productData = response.data.product;
        if(productData.length > 0) {
            var inventoryResponse = await axios.get(BASE_URL+'inventory/'+productName);
            var inventoryData = inventoryResponse.data.inventory;
            var responseData = {
                'name': productData[0].name,
                'price': productData[0].price,
                'inventory': inventoryData[0].inventory
            }
            console.log(`Sending data for product: ${productName}`);
            res.status(200).send(responseData);
        } else {
            throw new Error("Product does not exist");
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send(error.message);
    }
};
function invalidURL(req, res) {
    console.log("Invalid url requested")
    res.status(404).send("Please enter a valid url");
}

module.exports = {
    getAllProductsInfo,
    getSingleProductInfo,
    invalidURL
}