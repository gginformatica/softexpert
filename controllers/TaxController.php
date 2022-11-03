<?php

class TaxController extends Controller {
    protected $model = 'ProductTypeTax';

    public function index()
    {
        $this->throw(json_encode(ProductTypeTax::all()));
    }

    public function store(array $inputs)
    {
        $sale = ProductTypeTax::create($inputs);
        $this->throw(json_encode($sale));
    }

    public function update(ProductTypeTax $sale, array $inputs)
    {
        $updatedProductTypeTax = $sale->update($inputs);
        $this->throw(json_encode($updatedProductTypeTax));
    }

    public function destroy(ProductTypeTax $sale)
    {
        $deleted = $sale->delete();
        if($deleted)
            $this->throw(json_encode(['deleted' => $sale]));
        $this->throw(json_encode(['erorr' => 'There was an error while trying to delete this record. Record not found.']));
    }
}