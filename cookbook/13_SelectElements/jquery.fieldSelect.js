/*global  jQuery */
/*jshint eqeqeq: true, curly: true, white: true */

(function ($) {

    $.fn.fieldSelect = function (el, options) {

        this.each(function () {
            $(this).data('field-select', new FieldSelect(this));
        });

    };

    $.fieldSelect = {
        options: {
            focusClass: "field-select-value-focus"
        }
    };

    function FieldSelect(element) {

        this.element = $(element);

        this._create();

    }

    FieldSelect.prototype = {

        _create: function () {

            this._objects();
            this._events();

            if (this.objects.value.width() !== 0) {
                this.objects.select.css({
                    width: this.objects.value.outerWidth()
                });
            }
            else {
                this.objects.value.width('auto');
            }

            return;
        },

        _objects: function () {

            this.objects = {};

            this.objects.select = this.element;
            this.objects.value = $('<span class="field-select-value"></span>');
            this.objects.wrap = this.objects.select.wrap('<div class="field-select" />').parent();

            $('<span class="field-select-icon" />').prependTo(this.objects.wrap);
            this.objects.value.prependTo(this.objects.wrap);

            return;
        },

        _events: function () {

            var self = this;

            this.objects.select.change(function (e) {
                self._updateValue();
            });

            this._updateValue();

            // Necessary for changes on keyboard events in Chrome
            this.objects.select.keyup(function () {
                $(this).change();
            });

            this.objects.select.focus(function () {
                self.objects.value.addClass($.fieldSelect.options.focusClass);
            });

            this.objects.select.blur(function () {
                self.objects.value.removeClass($.fieldSelect.options.focusClass);
            });

            return;
        },

        _updateValue: function () {

            this.text = this.objects.select.find('option:selected').text();

            this.objects.value.text(this.text);

            return;
        }

    };

})(jQuery);