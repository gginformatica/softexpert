<?php

class Sale extends Model {

    static protected $table = 'sales';
    static protected $fillable = [
        'subtotal',
        'taxes',
        'total'
    ];
}