<?php

class ProductType extends Model {

    static protected $table = 'product_types';
    static protected $fillable = [
        'name'
    ];

    public static function getTable() {
        return self::$table;
    }
}