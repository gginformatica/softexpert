<?php

class ProductController extends Controller {
    protected $model = 'Product';

    public function index()
    {
        $this->throw(json_encode(Product::all()));
    }

    public function store(array $inputs)
    {
        $product = Product::create($inputs);
        $this->throw(json_encode($product));
    }

    public function update(Product $product, array $inputs)
    {
        $updatedProduct = $product->update($inputs);
        $this->throw(json_encode($updatedProduct));
    }

    public function destroy(Product $product)
    {
        $deleted = $product->delete();
        if($deleted)
            $this->throw(json_encode(['deleted' => $product]));
        $this->throw(json_encode(['erorr' => 'There was an error while trying to delete this record. Record not found.']));
    }
}