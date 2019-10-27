const express = require('express');
const app = express(); // spins up express app

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

app.use('/products', productRoutes);

app.use('/orders', orderRoutes);

module.exports = app;