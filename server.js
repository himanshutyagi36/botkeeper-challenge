'use strict';
var express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    site_route = require(__dirname+'/api/routes/botkeeperRoutes')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', site_route.get_router());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})