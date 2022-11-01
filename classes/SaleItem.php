<?php
use Model;

class SaleItem extends Model {

    static protected $table = 'sale_items';
    static protected $fillable = [
        'sale_id',
        'product_it',
        'tax',
        'quantity',
        'subtotal',
        'total'
    ];
}