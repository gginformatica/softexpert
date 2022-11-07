<?php

class SaleController extends Controller {
    protected $model = 'Sale';

    public function index()
    {
        $this->throw(json_encode(Sale::all(true)));
    }

    public function store(array $inputs)
    {
        $saleInputs = ['subtotal' => $inputs['subtotal'], 'taxes' => $inputs['taxes'], 'total' => $inputs['total']];
        $sale = Sale::create($saleInputs);
        
        
        foreach($inputs['items'] as $item) {
            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $item['id'],
                'tax' => $item['fee'],
                'quantity' => $item['qty'],
                'subtotal' => $item['price'],
                'total' => $item['subtotal']
            ]);
        }
        $sale = Sale::find($sale->id);
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