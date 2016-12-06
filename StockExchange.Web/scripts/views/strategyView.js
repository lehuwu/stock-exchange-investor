﻿(function($) {
    'use strict';

    var chosenCompanies = [21];

    $('.company-select').select2();
    $('.company-select').val(chosenCompanies).trigger('change');

    $('.company-select').on('change', function () {
        chosenCompanies = $(this).val();
    });

    $('#StartDate').datepicker('setDate', new Date(2006,0,1));
    $('#EndDate').datepicker('setDate', new Date());

    function addCompaniesToUrl(baseUrl, companyIds) {
        var newUrl = baseUrl + '?';
        for (var i = 0; i < companyIds.length; i++) {
            newUrl += 'companyIds=' + companyIds[i] + '&';
        }
        return newUrl.slice(0, -1);
    }

})(jQuery);