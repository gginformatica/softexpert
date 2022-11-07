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
    
    const loadTypes = () => {
        // Load from cache before calling the api
        populateTypes(JSON.parse(localStorage.getItem('cachedTypes')) || []);
        
        $.ajax({
            url: 'http://localhost:8080/types',
            method: 'GET',
        }).done((response) => {
            populateTypes(response);
            createCachedTypes(response);
        });
        $('[name="name"]').focus();    
    }
    
    const createCachedTypes = (types) => {
        localStorage.setItem('cachedTypes', JSON.stringify(types));
    }
    
    const getCachedType = (typeId) => {
        let cachedTypes = JSON.parse(localStorage.getItem('cachedTypes'));
        return cachedTypes.find(cachedType => cachedType.id == typeId);
    }
    
    const populateTaxes = (typeTypes) => {
        typeTypes.forEach((field) => {
            $('[name="type_id"]').append($('<option></option>').val(field.id).html(field.name));
        })
    }    
    const populateTypes = (types) => {
        let fields = [];
        let row = null,
            column = null;
        
        $('#sale-container').find('.card-body > .container-fluid').find('.row:not(:first-child)').remove();
        
        for(let type of types) {
            row = $('<div></div>').addClass('row');
            
            fields = [
                type.id,
                type.name,
                type.products,
                Number(type.tax).toFixed(2).replace('.',',')+'%'
            ];
            
            fields.forEach((field, index) => {
                column = $('<div></div>').addClass('col').html(field);
                if(index == 3) {
                    column.append(deleteButton.clone().attr('data-type-id', type.id));
                }  
                row.append(column);    
            })
            
            $('#sale-container').find('.card-body > .container-fluid').append(row)
            row = null;
        }
    }
    
    const addOneType = (type) => {
        let column = null;               
        let row = $('<div></div>').addClass('row');
        let fields = [
            type.id,
            type.name,
            type.products,
            Number(type.tax).toFixed(2).replace('.',',')+'%'
        ];
        
        fields.forEach((field, index) => {
            column = $('<div></div>').addClass('col').html(field);
            if(index == 3) {
                column.append(deleteButton.clone().attr('data-type-id', type.id));
            }  
            row.append(column);    
        })
        
        if(updateId) {
            let previousRow = $('#sale-container').find('.card-body > .container-fluid .row').eq(rowId);
            row.insertAfter(previousRow);
            previousRow.remove();
            updateId = null;
            rowId = null;
            updateCachedType(type);
        } else {
            $('#sale-container').find('.card-body > .container-fluid').append(row)
            addTypeToCache(type);
        }
        resetForm();
    }
    
    const updateCachedType = (type) => {
        let types = JSON.parse(localStorage.getItem('cachedTypes')) || [];
        let typeIndex = types.findIndex(p => p.id == type.id);
        types[typeIndex] = type;
        localStorage.setItem('cachedTypes', JSON.stringify(types));
    } 
    
    const addTypeToCache = (type) => {
        let types = JSON.parse(localStorage.getItem('cachedTypes')) || [];
        types.push(type);
        localStorage.setItem('cachedTypes', JSON.stringify(types));
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
    
    $('#formCreateType').on('submit', function(e) {
        e.preventDefault();
        let payload = $(this).serializeArray();
        let url = 'http://localhost:8080/types';
        
        if(updateId) {
            url = `http://localhost:8080/types/${updateId}`;
        }
        
        $.ajax({
            url,
            data: payload,
            method: 'POST',
        }).done((response) => {
            addOneType(response);
        });
    });
    
    
    $('#sale-container').on('click', '.remove-item', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        let payload = {id: $(this).data('type-id')};
        
        $.ajax({
            url: `http://localhost:8080/types/${payload.id}`,
            method: 'DELETE',
        }).done((response) => {
            loadTypes();
        });
    });
    
    $('#sale-container').find('.card-body > .container-fluid').on('click', '.row:not(:first-child)', function(e) {
        if($(e.target).hasClass('far') || $(e.target).hasClass('remove-item'))
            return;
        
        updateId = $(this).find('.remove-item').data('type-id');
        rowId = $(this).index();
        
        let cachedType = getCachedType(updateId);
        $('[name="name"]').val(cachedType.name);
        $('[name="price"]').val(cachedType.price);
        $('[name="type_id"]').val(cachedType.type_id).trigger('select');
        
        $('#save-btn').html('Update');
        $('#cancel-btn').show();
    });
    
    $('#cancel-btn').on('click', function() {
        $(this).hide();
        resetForm();
    });
    
    $('#formCreateType').on('change, input', '.form-control', function() {
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
    
    // Initialize types table.
    loadTypes();    
});