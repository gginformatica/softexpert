jQuery(($) => {    
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
    
    const loadTaxes = () => {
        // Load from cache before calling the api
        populateTaxes(JSON.parse(localStorage.getItem('cachedTaxes')) || []);
        
        $.ajax({
            url: 'http://localhost:8080/taxes',
            method: 'GET',
        }).done((response) => {
            populateTaxes(response);
            createCachedTaxes(response);
        });
        $('[name="name"]').focus();    
    }
    
    const createCachedProductTypes = (productTypes) => {
        localStorage.setItem('cachedProductTypes', JSON.stringify(productTypes));
    }
    
    const createCachedTaxes = (taxes) => {
        localStorage.setItem('cachedTaxes', JSON.stringify(taxes));
    }
    
    const getCachedTax = (productId) => {
        let cachedTaxes = JSON.parse(localStorage.getItem('cachedTaxes'));
        return cachedTaxes.find(cachedTax => cachedTax.id == productId);
    }
    
    const populateProductTypes = (productTypes) => {
        $('[name="type_id"]').html('');
        productTypes.forEach((field) => {
            $('[name="type_id"]').append($('<option></option>').val(field.id).html(field.name));
        })
    }    
    const populateTaxes = (taxes) => {
        let fields = [];
        let row = null,
            column = null;
        
        $('#sale-container').find('.card-body > .container-fluid').find('.row:not(:first-child)').remove();
        
        for(let tax of taxes) {
            row = $('<div></div>').addClass('row');
            
            fields = [
                tax.id,
                tax.product_type,
                Number(tax.amount).toFixed(2).replace('.',',')+'%'
            ];
            
            fields.forEach((field, index) => {
                column = $('<div></div>').addClass('col').html(field);
                if(index == 2) {
                    column.addClass('col-2');
                    column.append(deleteButton.clone().attr('data-tax-id', tax.id));
                }  
                row.append(column);    
            })
            
            $('#sale-container').find('.card-body > .container-fluid').append(row)
            row = null;
        }
    }
    
    const addOneProduct = (tax) => {
        let column = null;               
        let row = $('<div></div>').addClass('row');
        let fields = [
            tax.id,
            tax.product_type,
            Number(tax.amount).toFixed(2).replace('.',',')+'%'
        ];
        
        fields.forEach((field, index) => {
            column = $('<div></div>').addClass('col').html(field);
            if(index == 2) {
                column.addClass('col-2');
                column.append(deleteButton.clone().attr('data-tax-id', tax.id));
            }
            row.append(column);    
        })
        
        if(updateId) {
            let previousRow = $('#sale-container').find('.card-body > .container-fluid .row').eq(rowId);
            row.insertAfter(previousRow);
            previousRow.remove();
            updateId = null;
            rowId = null;
            updateCachedProduct(tax);
        } else {
            $('#sale-container').find('.card-body > .container-fluid').append(row)
            addProductToCache(tax);
        }
        resetForm();
    }
    
    const updateCachedProduct = (tax) => {
        let taxes = JSON.parse(localStorage.getItem('cachedTaxes')) || [];
        let productIndex = taxes.findIndex(p => p.id == tax.id);
        taxes[productIndex] = tax;
        localStorage.setItem('cachedTaxes', JSON.stringify(taxes));
    } 
    
    const addProductToCache = (tax) => {
        let taxes = JSON.parse(localStorage.getItem('cachedTaxes')) || [];
        taxes.push(tax);
        localStorage.setItem('cachedTaxes', JSON.stringify(taxes));
    }
    
    const resetForm = () => {
        updateId = null;
        rowId = null;
        
        $('#cancel-btn').hide();
        $('#save-btn').html('Save').prop('disabled', true);
        $('[name="type_id"]').val('').trigger('select');
        $('[name="amount"]').val('').focus();        
    }
    
    $('#formCreateTax').on('submit', function(e) {
        e.preventDefault();
        let payload = $(this).serializeArray();
        let url = 'http://localhost:8080/taxes';
        let cachedTaxes = JSON.parse(localStorage.getItem('cachedTaxes')) || [];

        let typeHasTax = cachedTaxes.find(tax => tax.type_id == $('[name="type_id"]').val());
        
        if(typeHasTax) {
            updateId = typeHasTax.id;
        }
        
        if(updateId) {
            url = `http://localhost:8080/taxes/${updateId}`;
            rowId = $(`[data-tax-id="${updateId}"]`).closest('.row').index();
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
        let payload = {id: $(this).data('tax-id')};
        
        $.ajax({
            url: `http://localhost:8080/taxes/${payload.id}`,
            method: 'DELETE',
        }).done((response) => {
            loadTaxes();
        });
    });
    
    $('#sale-container').find('.card-body > .container-fluid').on('click', '.row:not(:first-child)', function(e) {
        if($(e.target).hasClass('far') || $(e.target).hasClass('remove-item'))
            return;
        
        updateId = $(this).find('.remove-item').data('tax-id');
        rowId = $(this).index();
        
        let cachedTax = getCachedTax(updateId);
        $('[name="amount"]').val(cachedTax.amount);
        $('[name="type_id"]').val(cachedTax.type_id).trigger('select');
        
        $('#save-btn').html('Update');
        $('#cancel-btn').show();
    });
    
    $('#cancel-btn').on('click', function() {
        $(this).hide();
        resetForm();
    });
    
    $('#formCreateTax').on('change, input', '.form-control', function() {
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
    
    // Initialize taxes table.
    loadTaxes();
    // Initialize tax types select
    loadProductTypes();
});