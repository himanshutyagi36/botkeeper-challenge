'use strict';
var express = require('express'),
    site_route = {};

module.exports = function() {
    var botkeeperController = require('../controllers/botkeeperController');
    var router = express.Router();  
    router.route('/').get(function(req,res){
        res.redirect('/home');
    });
    site_route.get_router = function() {
        return router;
    };
    router.get('/products', botkeeperController.getAllProductsInfo);
    router.get('/products/:name', botkeeperController.getSingleProductInfo);
    router.get('/*', botkeeperController.invalidURL);
    return site_route;
}
