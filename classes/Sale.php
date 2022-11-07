<?php

class Sale extends Model {

    static protected $table = 'sales';
    static protected $fillable = [
        'subtotal',
        'taxes',
        'total'
    ];
    static protected $relations = [
        'fields' => ["(select json_agg(json_build_object('product', (select name from products where products.id=product_id), 'tax', tax, 'qty', quantity, 'subtotal', subtotal, 'total', total)) from sale_items where sale_items.sale_id=sales.id) as items"]
    ];
}