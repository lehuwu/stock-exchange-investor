﻿(function($) {
    'use strict';

    initSidebarToggle();
    setValidatorDefaults();
    setDatepickerDefaults();
    initModals();
    initAjaxErrorToasts();

    function initSidebarToggle() {
        $('.sidebar-toggle').click(function () {
            $('.sidebar').toggleClass('hide-sidebar');
            $('.main-content').toggleClass('hide-sidebar');
        });
    }

    function setValidatorDefaults() {
        $.validator.setDefaults({
            highlight: function (e) {
                var $formGroup = $(e).parents('.form-group');
                $formGroup.addClass('has-error')
                    .find('.field-validation-error').addClass('text-danger');
                $formGroup.find('.form-control-feedback')
                    .removeClass('glyphicon-ok').addClass('glyphicon-remove');
            },
            unhighlight: function (e) {
                var $formGroup = $(e).parents('.form-group');
                $formGroup.removeClass('has-error')
                    .find('.field-validation-error').removeClass('text-danger');
                $formGroup.find('.form-control-feedback')
                    .removeClass('glyphicon-remove').addClass('glyphicon-ok');
            }
        });

        //fix for chrome
        //https://github.com/jzaefferer/jquery-validation/issues/153
        $.validator.methods.date = function (value, element) {
            var dateRegex = /^(0?[1-9]\/|[12]\d\/|3[01]\/){2}(19|20)\d\d$/;
            return this.optional(element) || dateRegex.test(value);
        };
    }

    function setDatepickerDefaults() {
        $.fn.datepicker.defaults.format = 'dd/mm/yyyy';
        $.fn.datepicker.defaults.autoclose = true;
    }

    function initModals() {
        $('body').on('click', '.modal-link', function (e) {
            e.preventDefault();
            $(this).attr('data-target', '#modal-container');
            $(this).attr('data-toggle', 'modal');
        });
        $('body').on('click', '.modal-close-btn', function () {
            $('#modal-container').modal('hide');
        });
        $('#modal-container').on('hidden.bs.modal', function () {
            $(this).removeData('bs.modal');
        });
        $('#CancelModal').on('click', function () {
            return false;
        });
    }

    function initAjaxErrorToasts() {
        toastr.options = {
            "closeButton": true
        };

        $(document).ajaxError(function (event, jqxhr) {
            var message = 'An unexpected error occurred';
            var response = jqxhr.responseJSON;
            if (response && response.length > 0 && response[0].message) {
                message = response[0].message;
            }
            toastr.error(message, 'Error');
        });
    }

})(jQuery);