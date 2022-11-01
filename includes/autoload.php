<?php
// Adding vendors autoload
require __DIR__.'/../vendor/autoload.php';

spl_autoload_register(function($className){
    
    $className = str_replace('\\', '/', $className);
    $class = __DIR__.'/../classes/'.$className.'.php';
    
    if (!file_exists($class)) {
        $class = __DIR__.'/../controllers/'.$className.'.php';
    }

    include_once $class;
});

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
$dotenv->safeLoad();
