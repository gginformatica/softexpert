<?php

Route::setup('', function() {
    new SaleController('index');
});

Route::setup('sales', function() {
    new SaleController('sales');
});

Route::setup('products', function() {
    new SaleController('products');
});
