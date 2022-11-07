<?php

class ProductType extends Model {

    static protected $table = 'product_types';
    static protected $fillable = [
        'name'
    ];
    static protected $relations = [
        'distinct' => true,
        'fields' => ['product_type_taxes.amount as tax', '(select count(products.id) from products where products.type_id=product_types.id)  as products'],
        ['join' => 'left join', 'table' => 'products', 'on' => 'product_types.id=products.type_id'],
        ['join' => 'left join', 'table' => 'product_type_taxes', 'on' => 'product_types.id=product_type_taxes.type_id']
    ];

    public static function getTable() {
        return self::$table;
    }
}