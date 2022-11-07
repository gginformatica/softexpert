jQuery(($) => {
    // Used for updating.
    let moneyFormatter = Intl.NumberFormat( 'pt-BR', {
        style: "currency",
        currency: "BRL",
    });
    
    let updateId = null,
        rowId = null;
    
    const removeIcon = $('<i></i>').addClass('far fa-times-circle');
    const deleteButton = $('<button></button>')
        .addClass('btn btn-sm remove-item')
        .prop('type', 'button')
        .append(removeIcon);
    
    const loadProductTypes = () => {
        populateProductTypes(JSON.parse(localStorage.getItem('cachedProductTypes')) || []);
        
        $.ajax({
            url: 'http://localhost:8080/types',
            method: 'GET',
        }).done((response) => {
            populateProductTypes(response);
            createCachedProductTypes(response);
        });
    }
    
    const loadProducts = () => {
        // Load from cache before calling the api
        populateProducts(JSON.parse(localStorage.getItem('cachedProducts')) || []);
        
        $.ajax({
            url: 'http://localhost:8080/products',
            method: 'GET',
        }).done((response) => {
            populateProducts(response);
            createCachedProducts(response);
        });
        $('[name="name"]').focus();    
    }
    
    const createCachedProductTypes = (productTypes) => {
        localStorage.setItem('cachedProductTypes', JSON.stringify(productTypes));
    }
    
    const createCachedProducts = (products) => {
        localStorage.setItem('cachedProducts', JSON.stringify(products));
    }
    
    const getCachedProduct = (productId) => {
        let cachedProducts = JSON.parse(localStorage.getItem('cachedProducts'));
        return cachedProducts.find(cachedProduct => cachedProduct.id == productId);
    }
    
    const populateProductTypes = (productTypes) => {
        $('[name="type_id"]').html('');
        productTypes.forEach((field) => {
            $('[name="type_id"]').append($('<option></option>').val(field.id).html(field.name));
        })
    }    
    const populateProducts = (products) => {
        let fields = [];
        let row = null,
            column = null;
        
        $('#sale-container').find('.card-body > .container-fluid').find('.row:not(:first-child)').remove();
        
        for(let product of products) {
            row = $('<div></div>').addClass('row');
            
            fields = [
                product.id,
                product.name,
                product.product_type,
                moneyFormatter.format(product.price),
                Number(product.tax).toFixed(2).replace('.',',')+'%'
            ];
            
            fields.forEach((field, index) => {
                column = $('<div></div>').addClass('col').html(field);
                if(index == 4) {
                    column.append(deleteButton.clone().attr('data-product-id', product.id));
                }  
                row.append(column);    
            })
            
            $('#sale-container').find('.card-body > .container-fluid').append(row)
            row = null;
        }
    }
    
    const addOneProduct = (product) => {
        let column = null;               
        let row = $('<div></div>').addClass('row');
        let fields = [
            product.id,
            product.name,
            product.product_type,
            moneyFormatter.format(product.price),
            Number(product.tax).toFixed(2).replace('.',',')+'%'
        ];
        
        fields.forEach((field, index) => {
            column = $('<div></div>').addClass('col').html(field);
            if(index == 4) {
                column.append(deleteButton.clone().attr('data-product-id', product.id));
            }  
            row.append(column);    
        })
        
        if(updateId) {
            let previousRow = $('#sale-container').find('.card-body > .container-fluid .row').eq(rowId);
            row.insertAfter(previousRow);
            previousRow.remove();
            updateId = null;
            rowId = null;
            updateCachedProduct(product);
        } else {
            $('#sale-container').find('.card-body > .container-fluid').append(row)
            addProductToCache(product);
        }
        resetForm();
    }
    
    const updateCachedProduct = (product) => {
        let products = JSON.parse(localStorage.getItem('cachedProducts')) || [];
        let productIndex = products.findIndex(p => p.id == product.id);
        products[productIndex] = product;
        localStorage.setItem('cachedProducts', JSON.stringify(products));
    } 
    
    const addProductToCache = (product) => {
        let products = JSON.parse(localStorage.getItem('cachedProducts')) || [];
        products.push(product);
        localStorage.setItem('cachedProducts', JSON.stringify(products));
    }
    
    const resetForm = () => {
        updateId = null;
        rowId = null;
        
        $('#cancel-btn').hide();
        $('#save-btn').html('Save').prop('disabled', true);
        $('[name="price"]').val('');
        $('[name="type_id"]').val('').trigger('select');
        $('[name="name"]').val('').focus();        
    }
    
    $('#formCreateProduct').on('submit', function(e) {
        e.preventDefault();
        let payload = $(this).serializeArray();
        let url = 'http://localhost:8080/products';
        
        if(updateId) {
            url = `http://localhost:8080/products/${updateId}`;
        }
        
        $.ajax({
            url,
            data: payload,
            method: 'POST',
        }).done((response) => {
            addOneProduct(response);
        });
    });
    
    
    $('#sale-container').on('click', '.remove-item', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        let payload = {id: $(this).data('product-id')};
        
        $.ajax({
            url: `http://localhost:8080/products/${payload.id}`,
            method: 'DELETE',
        }).done((response) => {
            loadProducts();
        });
    });
    
    $('#sale-container').find('.card-body > .container-fluid').on('click', '.row:not(:first-child)', function(e) {
        if($(e.target).hasClass('far') || $(e.target).hasClass('remove-item'))
            return;
        
        updateId = $(this).find('.remove-item').data('product-id');
        rowId = $(this).index();
        
        let cachedProduct = getCachedProduct(updateId);
        $('[name="name"]').val(cachedProduct.name);
        $('[name="price"]').val(cachedProduct.price);
        $('[name="type_id"]').val(cachedProduct.type_id).trigger('select');
        
        $('#save-btn').html('Update');
        $('#cancel-btn').show();
    });
    
    $('#cancel-btn').on('click', function() {
        $(this).hide();
        resetForm();
    });
    
    $('#formCreateProduct').on('change, input', '.form-control', function() {
        let errors = null;
        
        $('.form-control').each((index, item) => {
            if ($(item).val().trim() == '') {
                errors = true
            }
        });
        if(!errors) {
            $('#save-btn').prop('disabled', false).removeClass('disabled');
        }
    })
    
    // Initialize product types select
    loadProductTypes();
    // Initialize products table.
    loadProducts();    
});