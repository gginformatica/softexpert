jQuery(($) => {
    // Used for updating.
    let moneyFormatter = Intl.NumberFormat( 'pt-BR', {
        style: "currency",
        currency: "BRL",
    });
    let updateId = null;


    let initialTotals = {
        qty: 0,
        price: 0,
        fees: 0,
        total: 0
    }
    let totals = {...initialTotals}
    
    const removeIcon = $('<i></i>').addClass('far fa-times-circle');
    const deleteButton = $('<button></button>')
        .addClass('btn btn-sm remove-item')
        .prop('type', 'button')
        .append(removeIcon);
    
    const loadProducts = () => {
        $.ajax({
            url: 'http://localhost:8080/products',
            method: 'GET',
        }).done((response) => {
            createCachedProducts(response);
        });
        $('[name="product"]').focus();
    }
    
    const createCachedProducts = (products) => {
        localStorage.setItem('cachedProducts', JSON.stringify(products));
    }
    
    const getCachedProduct = (productId) => {
        let cachedProducts = JSON.parse(localStorage.getItem('cachedProducts'));
        return cachedProducts.find(cachedProduct => cachedProduct.id == productId);
    }

    const addOneProduct = (product) => {
        let qty = Number.parseInt($('[name="qty"]').val());

        let price_uni = Number.parseFloat(product.price);
        let fee = ((Number.parseFloat(product.tax ?? 0) / 100) * price_uni) * qty;
        let price = price_uni * qty;
        let subtotal = price + fee;

        sell({
            id: product.id,
            name: product.name,
            price_uni: product.price,
            qty: qty,
            price: price,
            fee: fee,
            subtotal: subtotal
        });
        
        loadSaleItems();
        resetForm();
    }
    
    const loadSaleItems = () => {
        $('#sale-container').find('.card-body > .container-fluid').find('.row:not(:first-child)').remove();
        let column = null;               
        let row = $('<div></div>').addClass('row');

        let _sale = JSON.parse(localStorage.getItem('saleCache')) || []
        totals = {...initialTotals}
        for (let product of _sale) {
            _row = row.clone().prop('id', product.id);
            let fields = [
                product.name,
                moneyFormatter.format(product.price_uni),
                product.qty,
                moneyFormatter.format(product.price),
                moneyFormatter.format(product.fee),            
                moneyFormatter.format(product.subtotal)
            ];

            totals.qty += product.qty;
            totals.price += product.price;
            totals.fees += product.fee;
            totals.total += product.subtotal
            
            fields.forEach((field, index) => {
                column = $('<div></div>').addClass('col').html(field);
                if(index == 4) {
                    column.append(deleteButton.clone().attr('data-product-id', product.id));
                }  
                _row.append(column);    
            })
            $('#sale-container').find('.card-body > .container-fluid').find(`.row#${product.id}`).remove();
            $('#sale-container').find('.card-body > .container-fluid').append(_row);

        }
        $('#qty_total').html(totals.qty);
        $('#price_total').html(moneyFormatter.format(totals.price));
        $('#tax_total').html(moneyFormatter.format(totals.fees));
        $('#general_total').html(moneyFormatter.format(totals.total));
    }

    const sell = (product) => {
        if(updateId) {
            console.log('remove', updateId);
            removeProductOfSale(updateId);
            updateId = null;
        }
        let _sale = JSON.parse(localStorage.getItem('saleCache')) || [];
        let foundProduct = _sale.findIndex(productOnSale => productOnSale.id == product.id);
        if(foundProduct >= 0) {
            _sale[foundProduct].qty += Number.parseInt(product.qty);
            _sale[foundProduct].price += Number.parseFloat(product.price);
            _sale[foundProduct].fee += Number.parseFloat(product.fee);
            _sale[foundProduct].subtotal += Number.parseFloat(product.subtotal);
        } else {
            _sale.push(product);
        }
        localStorage.setItem('saleCache', JSON.stringify(_sale));
    }

    const removeProductOfSale = (productId) => {
        let _sale = JSON.parse(localStorage.getItem('saleCache')) || [];
        _sale = _sale.filter(productOnSale => productOnSale.id != productId);
        localStorage.setItem('saleCache', JSON.stringify(_sale));
        loadSaleItems();
    }

    const resetForm = () => {
        $('[name="product"]').val('').focus();
        $('[name="qty"]').val(1);
    }

    const sale = () => {
        let code = $('[name="product"]').val();
        if(code != '') {
            let product = getCachedProduct(code)
            if(product) {
                addOneProduct(product);
            } else {
                alert('product not found');
            }
        }
    }
    
    $('#sale-container').on('click', '.remove-item', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        let productId = $(this).closest('.row').prop('id');
        removeProductOfSale(productId)
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
    });

    $('#formSale').on('submit', function(e) {
        e.preventDefault();
        sale();
    });

    $('#sale-container').find('.card-body > .container-fluid').on('click', '.row:not(:first-child)', function(e) {
        if($(e.target).hasClass('far') || $(e.target).hasClass('remove-item'))
            return;
        
        updateId = $(this).prop('id')
        let cachedProduct = JSON.parse(localStorage.getItem('saleCache')).find(item => item.id == updateId);
        
        $('[name="product"]').val(cachedProduct.id);
        $('[name="qty"]').val(cachedProduct.qty);
        $('#cancel-btn').show();
    });

        
    $('#finishSale').on('click', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        let payload = {
            subtotal: totals.total - totals.fees,
            taxes: totals.fees,
            total: totals.total,
            items: JSON.parse(localStorage.getItem('saleCache'))
        }
        console.log(payload);

        let url = 'http://localhost:8080/sales';
        
        $.ajax({
            url,
            data: payload,
            method: 'POST',
        }).done((response) => {
            localStorage.setItem('saleCache', JSON.stringify([]));
            totals = {...initialTotals};
            loadSaleItems();
            alert('Venda finalizada');
        });
    });

    // Initialize products table.
    loadProducts();
    loadSaleItems();
});