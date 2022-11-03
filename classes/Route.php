<?php
class Route {
    use ParamsResolverTrait;

    public static $routes = [];

    public static function setup($route, $function) {
        
        $resourcePath = self::resolveResourcePath();
        list ($url, $id, $action) = self::resolveParams(...explode('/', $resourcePath)); // products/15/delete
        self::$routes[] = $route;

        if( $route === $url ) {
            $function->__invoke();
        }
    }
}

// products get -> lista params
// products post -> cadastra
// products update -> altera
// products delete -> apaga
// producst/id -> get
// products/s -> get busca
