const express = require('express');
const routerAdmin = express.Router();
const admin = require('../controllers/admin');

routerAdmin.get('/products', admin.getProducts);
routerAdmin.get('/dashboard', admin.getDashBoard);
routerAdmin.get('/profile', admin.getProfile);
routerAdmin.get('/', admin.redirectToDashboard);

module.exports = routerAdmin;