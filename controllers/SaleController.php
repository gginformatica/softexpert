<?php

class SaleController extends Controller {
    protected $model = 'Sale';

    public function index()
    {
        $this->throw(json_encode(Sale::all()));
    }

    public function store(array $inputs)
    {
        $sale = Sale::create($inputs);
        $this->throw(json_encode($sale));
    }

    public function update(Sale $sale, array $inputs)
    {
        $updatedSale = $sale->update($inputs);
        $this->throw(json_encode($updatedSale));
    }

    public function destroy(Sale $sale)
    {
        $deleted = $sale->delete();
        if($deleted)
            $this->throw(json_encode(['deleted' => $sale]));
        $this->throw(json_encode(['erorr' => 'There was an error while trying to delete this record. Record not found.']));
    }
}