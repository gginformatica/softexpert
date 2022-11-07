jQuery(($) => {
    // Used for updating.
    let moneyFormatter = Intl.NumberFormat( 'pt-BR', {
        style: "currency",
        currency: "BRL",
    });
    let totals = {
        qty: 0,
        subtotal: 0,
        fees: 0,
        total: 0
    }

    const loadSales = () => {
        $.ajax({
            url: 'http://localhost:8080/sales',
            method: 'GET',
        }).done((response) => {
            populateSales(response);
        });
    }
    
    const populateSales = (sales) => {
        let rowTemplate = '';
        let items = null;
        for (let sale of sales) {
            items = JSON.parse(sale.items) || [];
            console.log(items);
            rowTemplate += `<div></div>
                <div class="row">
                    <div class="col-3 col" style="flex-direction: column;text-align: left;align-items: flex-start;">
                        <h1 class="sale-totals">Subtotal:&nbsp;<span>${moneyFormatter.format(sale.subtotal)}</span>&nbsp;</h1>
                        <h1 class="sale-totals">Impostos:&nbsp;<span>${moneyFormatter.format(sale.taxes)}</span></h1>
                        <h1 class="sale-totals">Total:&nbsp;<span>${moneyFormatter.format(sale.total)}</span></h1>
                    </div>
                    <div class="col items-display">
                        <div class="item">
                            <div>
                                <p>PRODUTO</p>
                            </div>
                            <div>
                                <p>QUANTIDADE</p>
                            </div>
                            <div>
                                <p>SUBTOTAL</p>
                            </div>
                            <div>
                                <p>IMPOSTO</p>
                            </div>
                            <div>
                                <p>TOTAL</p>
                            </div>
                        </div>`;
                for (let item of items) {
                    rowTemplate += `<div class="item">
                        <div>
                            <p>${item.product}</p>
                        </div>
                        <div>
                            <p>${item.qty}</p>
                        </div>
                        <div>
                            <p>${moneyFormatter.format(item.subtotal)}</p>
                        </div>
                        <div>
                            <p>${moneyFormatter.format(item.tax)}</p>
                        </div>
                        <div>
                            <p>${moneyFormatter.format(item.total)}</p>
                        </div>
                    </div>`;
                }
            rowTemplate += `</div>
                </div>`;
            $('#sale-container').find('.card-body > .container-fluid').html(rowTemplate);
            totals.qty += 1;
            totals.subtotal += Number.parseFloat(sale.subtotal);
            totals.fees += Number.parseFloat(sale.taxes);
            totals.total += Number.parseFloat(sale.total);

            $('#qty_total-1').html(totals.qty);
            $('#price_total').html(moneyFormatter.format(totals.subtotal));
            $('#tax_total').html(moneyFormatter.format(totals.fees));
            $('#general_total').html(moneyFormatter.format(totals.total));
        }
    }
    // Initialize products table.
    loadSales();
});