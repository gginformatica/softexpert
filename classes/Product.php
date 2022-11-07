<?php

class Product extends Model {
    static protected $table = 'products';
    static protected $fillable = [
        'type_id',
        'name',
        'price'
    ];
    static protected $relations = [
        'fields' => ['product_types.name as product_type','product_type_taxes.amount as tax'],
        ['join' => 'inner join', 'table' => 'product_types', 'on' => 'products.type_id=product_types.id'],
        ['join' => 'left join', 'table' => 'product_type_taxes', 'on' => 'product_types.id=product_type_taxes.type_id']
    ];
}