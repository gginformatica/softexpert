<?php
class SaleItem extends Model {

    static protected $table = 'sale_items';
    static protected $fillable = [
        'sale_id',
        'product_id',
        'tax',
        'quantity',
        'subtotal',
        'total'
    ];
}