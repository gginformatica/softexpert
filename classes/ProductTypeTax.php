<?php
class ProductTypeTax extends Model {

    static protected $table = 'product_type_taxes';
    static protected $fillable = [
        'type_id',
        'amount'
    ];
    static protected $relations = [
        'fields' => ['product_types.name as product_type', 'product_types.id as type_id'],
        ['join' => 'left join', 'table' => 'product_types', 'on' => 'product_types.id=product_type_taxes.type_id']
    ];
}