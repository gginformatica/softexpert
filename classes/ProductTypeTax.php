<?php
use Model;

class ProductTypeTax extends Model {

    static protected $table = 'product_type_taxes';
    static protected $fillable = [
        'type_id',
        'amount'
    ];
}