﻿/**
 * A view for the wallet main page
 */
(function (StockExchange, $) {
    'use strict';
    
    $("input[type='radio']").iCheck({
        radioClass: 'iradio_flat'
    });
    $('#SelectedCompanyId').select2();
    $('.company-select').select2({
        height: '100%'
    });

    $('#AddTransactionViewModel_Date').datepicker({
        endDate: new Date()
    });

    var budgetBox = new StockExchange.BudgetInfoBox($('.budget-infobox'));
    var dataTable = initTransactionsTable();
    var dataTableCurrent = initCurrentStocksTable();

    /*
     * Send AJAX request for adding a new transaction
     */
    $('#add-transaction-form').on('submit', function (event) {
        event.preventDefault();

        var $this = $(this);
        if (!($this.valid())) {
            return;
        }

        $('#add-transaction-button').prop('disabled', true);

        $.ajax({
            url: $this.attr('action'),
            type: $this.attr('method'),
            data: $this.serialize()
        }).done(function () {
            toastr.success('Transaction has been added');
            budgetBox.refresh();
            dataTable.draw();
            dataTableCurrent.draw();
        }).always(function() {
            $('#add-transaction-button').prop('disabled', false);
        });
    });

    /**
     * Initializes the transactions table
     * @returns {Object} - The created DataTables object
     */
    function initTransactionsTable() {
        var columnDefs =[{
            targets: $('#grid th[data-column=Total]').index(),
            render: function (data, type, full) {
                return StockExchange.getPriceWithIconHtml(data, full.Action === 'Sell');
            }
        }];
        return StockExchange.createDataTable($('#grid'), columnDefs);
    }

    /**
     * Initializes the current stocks table
     * @returns {Object} - The created DataTables object
     */
    function initCurrentStocksTable() {
        var columnDefsCurrent = [{
            targets: $('#current-grid th[data-column=Profit]').index(),
            render: function (data) {
                return StockExchange.getPriceWithIconHtml(data);
            }
        }];
        return StockExchange.createDataTable($('#current-grid'), columnDefsCurrent);
    }

})(StockExchange, jQuery);