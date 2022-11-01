<?php
$phpSelf = explode('/index.php', $_SERVER['PHP_SELF']);
$resourcePath = end($phpSelf);

if( empty($resourcePath) ) {
    Route::setup('', function() {
        new SaleController('index');
    });
} else {
    $resourcePath = explode('/', $resourcePath);
    Route::setup(implode('/',$resourcePath), function() use ($resourcePath) {
        new SaleController($resourcePath[1]);
    });
}