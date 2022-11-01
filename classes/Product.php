<?php

class Product extends Model {

    static protected $table = 'products';
    static protected $fillable = [
        'type_id',
        'name',
        'price'
    ];
}