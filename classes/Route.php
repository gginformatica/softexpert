<?php
class Route {
    public static $routes = [];

    public static function setup($route, $function) {
        if(preg_match('/\\{(.*?)\\}/', $route, $match) == 1) {
            echo 'Deu match '.$match[0];
        }
        self::$routes[] = $route;

        if(!isset($param_url)) {
            $param_url = '';
        }
        
        $function->__invoke();
    }
}

// products get -> lista params
// products post -> cadastra
// products update -> altera
// products delete -> apaga
// producst/id -> get
// products/s -> get busca
