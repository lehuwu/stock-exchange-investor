﻿(function ($) {

    $.fn.DataTableColumns = function () {
        return $(this).map(function () {
            return {
                "name": $(this).data("column"),
                "data": $(this).data("column")
            }
        });
    };

    $.fn.DataTableColumnDefs = function () {
        return $(this).map(function (col) {
            var template = $(this).data("template");
            var templateHtml = $(template).html();
            if (template) {
                return {
                    "targets": col,
                    "createdCell": function (td, cellData, rowData) {
                        $(td).html(templateHtml.replace(/\[(.*)\]/gi, function (match, p1) {
                            return rowData[p1] === null ? "" : rowData[p1];
                        }));
                    }
                }
            }
            return null;
        });
    };

    $.fn.DataTableColumnFilters = function (o) {

        var defaults = {
            NoValueText: "No Value",
            getValuesUrlCallback: function () { throw new Error("Not implemented"); }
        };
        var options = $.extend({}, defaults, o || {});
        // ReSharper disable once DeclarationHides
        var dataTable = null;
        var that = this;
        var tr = document.createElement("tr");
        $(tr).addClass("dataTableFilterRow");
        $("thead", this).each(function () {
            $(this).prepend(tr);
        });
        $("thead th", this).each(function () {
            var column = $(this).data("column");
            var th = document.createElement("th");
            $("thead tr.dataTableFilterRow", that).each(function () {
                $(this).append(th);
            });
            var title = $(this).text();
            $(th).data("column", column);
            $(th).html("<select multiple=\"multiple\" placeholder=\"Search " + title + "\" />");
        });
        var filter = {
            clear: function () {
                $("thead tr.dataTableFilterRow select", that).each(function () {
                    $(this).empty();
                    try {
                        $(this).multiselect("uncheckAll");
                    } catch (x) {
                    }
                    if (dataTable) {
                        var column = dataTable.column($(this).parent("th").data("column") + ":name");
                        column.search("");
                    }
                });
            },
            assign: function (dt) {
                dataTable = dt;
            },
            init: function () {
                $("thead tr.dataTableFilterRow select", that).on("keyup change", function () {
                    if (dataTable !== null) {
                        var value = $(this).val();
                        var search = (value !== null) ? JSON.stringify(value) : "";
                        var column = dataTable.column($(this).parent("th").data("column") + ":name");
                        if (column.search() !== search) {
                            column
                                .search(search)
                                .draw();
                        }
                    }
                });
                $("thead tr.dataTableFilterRow select", that).multiselect({
                    beforeopen: function () {
                        var thatSelect = this;
                        if ($(this).children().length === 0) {
                            if (typeof options.getValuesUrlCallback === "function") {
                                var url = options.getValuesUrlCallback($(this).parent().data("column"));
                                $.get(url, function (data) {
                                    var hasEmpty = false;
                                    for (var i = 0; i < data.length; i++) {
                                        var option = $("<option></option>");
                                        if (data[i] !== null && data[i] !== "") {
                                            var text = $.trim(data[i]);
                                            var br = text.indexOf("\n");
                                            if (br > -1) {
                                                text = $.trim(text.substr(0, br));
                                            }
                                            option.attr("value", text);
                                            option.text(text);
                                            $(thatSelect).append(option);
                                        } else {
                                            option.attr("value", "");
                                            option.text(options.NoValueText);
                                            if (!hasEmpty) {
                                                $(thatSelect).append(option);
                                            }
                                            hasEmpty = true;
                                        }
                                    }
                                    $(thatSelect).multiselect("refresh");
                                }, "json");
                            }
                        }
                    }
                }).multiselectfilter();
                window.dispatchEvent(new Event("resize"));
            }
        };
        return filter;
    }

    var ajaxUrl = $("#grid").data("ajax-url");
    var date = new Date();
    date = new Date(date.getFullYear(), date.getMonth(), 1);
    var dateType = "month";
    var companyName = "";
    var ajaxFilterUrl = $("#grid").data("filter-ajax-url");
    var ajaxFilterParamName = $("#grid").data("filter-ajax-paramname");
    var freezeEvents = false;

    function getSearchParams() {
        if (dateType === "month") {
            return {
                startDate: new Date(date.getFullYear(), date.getMonth(), 1),
                endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0) // last day of month
            };
        } else {
            return {
                startDate: new Date(date.getFullYear(), 0, 1), // 1 Nov fiscal year start
                endDate: new Date(date.getFullYear(), 11, 31) // 31 Oct fiscal year end
            }
        }
    }

    function getFilterValuesUrl(filterParamValue) {
        var search = $("#grid-container [type=search]").val();
        var url = $.AppendUrlParam(ajaxFilterUrl, ajaxFilterParamName, filterParamValue);
        var params = getSearchParams();
        url = $.AppendUrlParam(url, "Filter.StartDate", params.startDate.toISOString());
        url = $.AppendUrlParam(url, "Filter.EndDate", params.endDate.toISOString());
        url = $.AppendUrlParam(url, "Filter.CompanyName", companyName);
        url = $.AppendUrlParam(url, "Search.Value", search);
        return url;
    }

    var columns = $("#grid th").DataTableColumns();
    var columnDefs = $("#grid th").DataTableColumnDefs();
    var columnFilters = $("#grid-container").DataTableColumnFilters({
        getValuesUrlCallback: getFilterValuesUrl
    });

    var dataTable = $("#grid").DataTable(
    {
        "columns": columns,
        "columnDefs": columnDefs,
        "fixedColumns": {
            "drawCallback": function () { columnFilters.init() },
            "leftColumns": 1
        },
        "ajax": {
            "url": ajaxUrl,
            "contentType": "application/json",
            "type": "POST",
            "data": function (d) {
                var params = getSearchParams();
                d.filter = {
                    startDate: params.startDate,
                    endDate: params.endDate,
                    companyName: companyName
                };
                return JSON.stringify(d);
            }
        }
    });
    columnFilters.assign(dataTable);

    /* Filters */
    $("#grid_filter").append($("#filters").html());

    var filterTypeOptions = {
        years: {
            format: "yyyy",
            viewMode: "years",
            minViewMode: "years",
            immediateUpdates: true,
            autoclose: true
        },
        months: {
            format: "mm/yyyy",
            viewMode: "months",
            minViewMode: "months",
            immediateUpdates: true,
            autoclose: true
        }
    };

    $("#grid-container #filterValue").datepicker(filterTypeOptions.months);

    $("#grid-container #filterValue").datepicker("setDate", date);

    $("#grid-container [type=search]").on("change", function () {
        columnFilters.clear();
    });
    $("#grid-container #filterValue").on("changeDate", function () {
        if (!freezeEvents) {
            date = $(this).datepicker("getDate");;
            columnFilters.clear();
            dataTable.draw();
        }
    });

    $("#grid-container #filterType").on("change", function () {
        dateType = $(this).val();
        columnFilters.clear();
        freezeEvents = true;
        if (dateType === "month") {
            $("#grid-container #filterValue").datepicker("remove");
            $("#grid-container #filterValue").datepicker(filterTypeOptions.months);
            $("#grid-container #filterValue").datepicker("setDate", date);
        } else {
            $("#grid-container #filterValue").datepicker("remove");
            $("#grid-container #filterValue").datepicker(filterTypeOptions.years);
            $("#grid-container #filterValue").datepicker("setDate", date);
        }
        freezeEvents = false;
        dataTable.draw();
    });

    $("#grid-container #companyName").on("change", function () {
        companyName = $(this).val();
        dataTable.draw();
    });

})(jQuery);