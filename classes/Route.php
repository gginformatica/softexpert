<?php
class Route {
    public static $routes = [];

    public static function setup($route, $function) {
        
        $resourcePath = self::resolveResourcePath();
        list ($url, $id, $action) = self::resolveParams(...explode('/', $resourcePath));
        self::$routes[] = $route;

        if( $route === $url ) {
            $function->__invoke();
        }
    }

    private static function resolveResourcePath() {
        if(strpos($_SERVER['PHP_SELF'], 'index.php/')) {
            $phpSelf = explode('/index.php/', $_SERVER['PHP_SELF']);
        } else {
            $phpSelf = explode('/index.php', $_SERVER['PHP_SELF']);
        }
        return end($phpSelf);
    }

    private static function resolveParams($url, $id = null, $action  = null) {
        return [$url, $id, $action];
    }
}

// products get -> lista params
// products post -> cadastra
// products update -> altera
// products delete -> apaga
// producst/id -> get
// products/s -> get busca
