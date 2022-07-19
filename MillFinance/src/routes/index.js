const express = require('express');
const homeRoutes= require('./home_routes');
const userRoutes= require('./user_routes');

const route= express.Router();
route.use('/', homeRoutes);
route.use('/dashboard', userRoutes);

module.exports= route;