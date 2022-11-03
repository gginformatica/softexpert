<?php
trait ParamsResolverTrait {
    private static function resolveParams($url, $id = null, $action  = null) {
        return [$url, $id, $action];
    }

    private static function resolveResourcePath() {
        if(strpos($_SERVER['PHP_SELF'], 'index.php/')) {
            $phpSelf = explode('/index.php/', $_SERVER['PHP_SELF']);
        } else {
            $phpSelf = explode('/index.php', $_SERVER['PHP_SELF']);
        }
        return end($phpSelf);
    }
}