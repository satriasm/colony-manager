viewModel.app = {}; var app = viewModel.app;

app.section = ko.observable('');
app.mode = ko.observable('');
app.applyNavigationActive = function () {
	var currentURL = document.URL.split("/").slice(3).join("/");
	var $a = $("a[href='/" + currentURL + "']");

	$a.closest(".navbar-nav").children().removeClass("active");
	if ($a.closest("li").parent().hasClass("navbar-nav")) {
		$a.closest("li").addClass("active");
	} else {
		$a.closest("li").closest("li").addClass("active");
	}
};
app.prepareTooltipster = function ($o) {
    var $tooltipster = ($o == undefined) ? $('.tooltipster') : $o;

    $tooltipster.tooltipster({
        theme: 'tooltipster-val',
        animation: 'grow',
        delay: 0,
        offsetY: -5,
        touchDevices: false,
        trigger: 'hover',
        position: "top"
    });
};
app.wrapGridSelect = function (selector, excludeClassSelector, callback) {
    var $grid = $(selector).data("kendoGrid");
    if ($grid.select().size() == 0) {
        return;
    }
    
    var $target = $(event.target);
    if ($target.hasClass(excludeClassSelector)) {
        $grid.clearSelection();
        return false;
    } else if ($target.closest(excludeClassSelector).size() > 0) {
        $grid.clearSelection();
        return false;
    }

    var selectedItem = $grid.dataItem($grid.select());
    callback(selectedItem);
};
app.ajaxPost = function (url, data, callbackSuccess, callbackError, otherConfig) {
    var startReq = moment();
    var callbackScheduler = function (callback) {
        app.isLoading(false);
        callback();
    };

    if (typeof callbackSuccess == "object") {
        otherConfig = callbackSuccess;
        callbackSuccess = function () { };
        callbackError = function () { };
    } 

    if (typeof callbackError == "object") {
        otherConfig = callbackError;
        callbackError = function () { };
    } 

    var config = {
        url: url,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: ko.mapping.toJSON(data),
        success: function (a) {
            callbackScheduler(function () {
                if (callbackSuccess !== undefined) {
                    callbackSuccess(a);
                }
            });
        },
        error: function (a, b, c) {
            callbackScheduler(function () {
                if (callbackError !== undefined) {
                    callbackError(a, b, c);
                }
            });
        }
    };

    if (data instanceof FormData) {
        delete config.config;
        config.data = data;
        config.async = false;
        config.cache = false;
        config.contentType = false;
        config.processData = false;
    }

    if (otherConfig != undefined) {
        config = $.extend(true, config, otherConfig);
    }

    if (config.hasOwnProperty("withLoader")) {
        if (config.withLoader) {
            app.isLoading(true);
        }
    } else {
        app.isLoading(true);
    }

    return $.ajax(config);
};
app.isFine = function (res) {
    if (!res.success) {
        sweetAlert("Oops...", res.message, "error");
        return false;
    }

    return true;
};
app.isFormValid = function (selector) {
    app.resetValidation(selector);
    var $validator = $(selector).data("kendoValidator");
    return ($validator.validate());
};
app.resetValidation = function (selectorID) {
    var $form = $(selectorID).data("kendoValidator");
    if ($form == undefined) {
        $(selectorID).kendoValidator();
        $form = $(selectorID).data("kendoValidator");
    }

    $form.hideMessages();
};
app.isLoading = ko.observable(false);
app.fixKendoMultiSelect = function () {
    $("*.k-multiselect").change(function (e) {
        var existingValue = $(this).attr("existingValue");
        if (existingValue !== undefined) {
            var d = $(this).find("select[multiple='multiple']").data("kendoMultiSelect");
            var newValue = existingValue.split(",");
            var existingDataSource = d.dataSource._data;
            newValue.push(d.value()[0]);
            d.setDataSource(existingDataSource);
        }
    });

    $("*.k-multiselect").keydown(function (e) {
        var d = $(this).find("select[multiple='multiple']").data("kendoMultiSelect");
        if (e.keyCode == 13) {
            var existingValue = $(this).attr("existingValue");
            var newValue = existingValue.split(",");
            var existingDataSource = d.dataSource._data;
            newValue.push(d.value()[0]);
            d.setDataSource(existingDataSource);
            d.value(newValue);
        } else {
            $(this).attr("existingValue",d.value())
        }
    });
};
app.changeActiveSection = function (section) {
    return function (self, e) {
        $(e.currentTarget).parent().siblings().removeClass("active");
        app.section(section);
        app.mode('');
    };
};
app.couldBeNumber = function (value) {
    if (!isNaN(value)) {
        if (String(value).indexOf(".") > -1) {
            return parseFloat(value);
        } else {
            return parseInt(value, 10);
        }
    }

    return value;
};
app.gridBoundTooltipster = function (selector) {
    return function () {
        app.prepareTooltipster($(selector).find(".tooltipster"));
    };
};
app.registerSearchKeyup = function ($selector, callback) {
    $selector.keyup(function (e) {
        if (e.which == 13) {
            callback();
        }
    });
}

$(function () {
	app.applyNavigationActive();
    app.fixKendoMultiSelect();
});