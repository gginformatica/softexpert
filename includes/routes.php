<?php

Route::setup('', function() {
    new SaleController('index');
});

Route::setup('sales', function() {
    new SaleController('index');
});

Route::setup('products', function() {
    new ProductController('index');
});

Route::setup('types', function() {
    new ProductTypeController('index');
});

Route::setup('taxes', function() {
    new TaxController('index');
});
