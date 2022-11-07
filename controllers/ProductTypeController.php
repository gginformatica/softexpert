<?php

class ProductTypeController extends Controller {
    protected $model = 'ProductType';

    public function index()
    {
        $this->throw(json_encode(ProductType::all(true)));
    }

    public function store(array $inputs)
    {
        $productType = ProductType::create($inputs);
        $this->throw(json_encode($productType));
    }

    public function update(ProductType $productType, array $inputs)
    {
        $updatedProductType = $productType->update($inputs);
        $this->throw(json_encode($updatedProductType));
    }

    public function destroy(ProductType $productType)
    {
        $deleted = $productType->delete();
        if($deleted)
            $this->throw(json_encode(['deleted' => $productType]));
        $this->throw(json_encode(['erorr' => 'There was an error while trying to delete this record. Record not found.']));
    }
}