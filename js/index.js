function toggleDarkLight() {
  var table = document.getElementById("myTable");
  var currentClass = table.className;
  table.className = currentClass == "greyGridTable2" ? "greyGridTable" : "greyGridTable2";
};

function toggleDarkLight2() {
  var table = document.getElementById("body");
  var currentClass = body.className;
  body.className = currentClass == "dark-mode" ? "light-mode" : "dark-mode";
};

function toggleDarkLight3() {
  var table = document.getElementById("myTable_thead_clone");
  var currentClass = myTable_thead_clone.className;
  myTable_thead_clone.className = currentClass == "dark2-mode" ? "light2-mode" : "dark2-mode";
};
function combo (){
	
	toggleDarkLight();
	toggleDarkLight2();
	toggleDarkLight3();
	
};


(function ($) {
    $.fn.tbltable = function (settings) {

        const key_esc = 27; // KeyboardEvent.which value for Escape (Esc) key
        const key_dlt = 46; // KeyboardEvent.which value for Delete key
        const key_enter = 13; // KeyboardEvent.which value for Enter key
        const key_tab = 9; // KeyboardEvent.which value for tab key
        const key_left = 37; // KeyboardEvent.which value for left-arrow key
        const key_up = 38; // KeyboardEvent.which value for up-arrow key
        const key_right = 39; // KeyboardEvent.which value for right-arrow key
        const key_down = 40; // KeyboardEvent.which value for down-arrow key

        var defaults = {
            checkbox: false,
            editable: false,
            freezecolumns: 0,
            freezethead: false,
            paging: false,
            search: false,
            sortable: false,
        };

        if (settings) { $.extend(defaults, settings); }

        // freezethead
        function freezeThead(table) {
            var tbl = table,
                tclone = tbl.clone();
            $('#' + tbl.attr("id") + '_thead_clone').parent().remove();

            var theadWrapper = $('<div class="freeze-thead-wrapper" />');
            theadWrapper.css({
                'position': 'fixed',
                'top': 0,
                'left': tbl.offset().left,
                'right': $(window).width() - (tbl.offset().left + tbl.parent().width()),
                'overflow': 'hidden',
                'display': 'none',
            });

            tclone.addClass('freeze-thead')
                .attr('id', tbl.attr("id") + '_thead_clone')
                .css('margin', 0)
                .find('tbody').remove();
            tbl.find('thead th').each(function (index) {
                tclone.find('thead th').eq(index).css({
                    'min-width': $(this).outerWidth(),
                    'height': $(this).outerHeight()
                });
            });
            tclone.insertAfter(tbl).wrap(theadWrapper);
            tbl.parent().on('scroll', function () {
                tclone.parent().scrollLeft($(this).scrollLeft());
            });

            function affix() {
                if ($(window).scrollTop() > tbl.offset().top && $(window).scrollTop() < tbl.offset().top + tbl.height() - 80) {
                    tclone.parent().show();
                    tclone.parent().scrollLeft($(tbl.parent()).scrollLeft());
                } else {
                    tclone.parent().hide();
                }
            }

            affix();
            $(window).on('scroll', function () {
                affix();
            });
            // console.log('freezeThead() is enabled.');
        }

        // freezecolumns
        function freezeColumn(table) {
            var tbl = table,
                tclone = tbl.clone(),
                columns = 0;

            if (defaults.freezecolumns) {
                columns = defaults.freezecolumns;
            } else if (tbl.attr('data-freezecolumns')) {
                columns = table.attr('data-freezecolumns');
            }

            $('#' + tbl.attr("id") + '_column_clone').parent().remove();

            var columnWrapper = $('<div class="freeze-column-wrapper" />');
            columnWrapper.css({
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'background': '#fff',
                'border-right': '1px solid #ccc',
                'box-shadow': '2px 0 5px rgba(20,20,20,0.2)',
                'overflow': 'hidden',
                'z-index': '1',
                // 'display': 'none',
            });

            tclone.addClass('freeze-column')
                .attr('id', tbl.attr("id") + '_column_clone')
            // .css('margin', 0);

            $.each(tclone.data(), function (i) {
                tclone.removeAttr("data-" + i);
            });

            tclone.find('thead tr:not(:first-child)').remove();
            tclone.find('tr th, tr td').each(function (index) {
                var cell = $(this),
                    cellNo = $(this).index() + 1;

                cell.css({
                    'height': tbl.find('tr:first-child th, tr td').eq(index).outerHeight(),
                    'min-width': tbl.find('tr:first-child th, tr td').eq(index).outerWidth(),
                    // 'width': tbl.find('tr:first-child th, tr td').eq(index).outerWidth(),
                    'max-width': tbl.find('tr:first-child th, tr td').eq(index).outerWidth(),
                });
                if (cellNo > columns) {
                    cell.remove();
                }
            });
            tclone.find('thead tr th').attr({
                'rowspan': '',
                'colspan': '',
            })
            tclone.insertAfter(tbl).wrap(columnWrapper);
            tclone.parent().width(tclone.outerWidth());


            if (tbl.attr('data-frezethead') == 'true' || defaults.freezethead === true) {
                var theadClone = tclone.clone();

                // no need to check remove clone, as we remove parent directly
                var theadCloneWrapper = $('<div class="freeze-column-thead-wrapper" />');
                theadCloneWrapper.css({
                    'position': 'fixed',
                    'left': tbl.offset().left,
                    'top': 0,
                    'background': '#fff',
                    'box-shadow': '0 2px 5px rgba(20,20,20,0.2)',
                    'max-height': tclone.find('thead').height(),
                    'z-index': 2,
                    'display': 'none',
                });

                // alert(tclone.outerWidth())
                theadClone.find('tbody').remove();
                theadClone.toggleClass('freeze-column freeze-column-thead')
                    .attr('id', tbl.attr("id") + '_column_thead_clone')
                    .css({
                        'width': tclone.outerWidth(),
                        'height': tclone.find('thead').height(),
                        'max-height': tclone.find('thead').height(),
                    });

                theadClone.insertBefore(tclone).wrap(theadCloneWrapper);

                function affix() {
                    if ($(window).scrollTop() > tbl.offset().top && $(window).scrollTop() < tbl.offset().top + tbl.height() - 80) {
                        theadClone.parent().show();
                    } else {
                        theadClone.parent().hide();
                    }
                }
                affix();
                $(window).on('scroll', function () {
                    affix();
                });
            }

            tclone.parent().hide();

            tbl.parent().on('scroll', function () {
                tclone.parent().css('left', $(this).scrollLeft());
                if ($(this).scrollLeft() > 0) {
                    tclone.parent().show();
                } else {
                    tclone.parent().hide();
                }
            });
        }

        // searchtable
        function searchTable(table) {
            var tbl = table,
                toolbar = $('<div class="tbl-table-toolbar form-group" />'),
                input = $('<input type="search" class="table-control form-control" />'),
                inputGroup = $('<div class="input-group" />'),
                label = $('<span class="input-group-addon">Search</span>');

            toolbar.attr('id', tbl.attr("id") + '_toolbar');
            input.attr('id', tbl.attr("id") + '_filter');

            label.appendTo(inputGroup);
            input.appendTo(inputGroup);
            inputGroup.appendTo(toolbar);
            toolbar.insertBefore($('#' + tbl.attr('id') + '_wrapper'));


            function filter(q) {
                // var term = q.replace(/ /gi, '|');
                var term = q;
                table.find('tbody tr').each(function () {
                    var len = $(this).text().search(new RegExp(term, "i"));
                    if (len < 0) {
                        $(this).addClass('hidden');
                    } else {
                        $(this).removeClass('hidden');
                    }
                });
            }

            $('input').on('keyup change', function (e) {
                var key = (e.keyCode ? e.keyCode : e.which),
                    query = $(this).val().trim();
                if (key == key_esc) {
                    $(this).val('');
                    table.find('tbody tr').removeClass('hidden');
                } else {
                    filter(query);
                }
            });

            if (tbl.attr('data-frezethead') == 'true' || defaults.freezethead === true) {
                freezeThead(tbl);
            }
            // console.log('searchTable() is enabled.');
        }



        return this.each(function () {
            var $elm = $(this);
            // check if table has thead
            if ($elm.find('thead').length < 1) {
                console.log('thead is needed to use this plugin.');
                return;
            } else {
                var mainWrapper = $('<div class="tbl-table-wrapper table-responsive" />');
                mainWrapper.css({
                    'position': 'relative',
                    'border': '1px solid #ccc',
                    'border-radius': '4px',
                    'margin-bottom': '30px',
                });
                mainWrapper.attr('id', $elm.attr('id') + '_wrapper');
                $elm.wrap(mainWrapper);

                if ($elm.attr('data-frezethead') == 'true' || defaults.freezethead === true) {
                    freezeThead($elm);
                }

                if ($elm.attr('data-search') == 'true' || defaults.search === true) {
                    searchTable($elm);
                }
                if ($elm.attr('data-freezecolumns') > 0 || defaults.freezecolumns > 0) {
                    freezeColumn($elm);
                }
            }
        });
    };
})(jQuery);


$('#myTable').tbltable({
	freezethead: true,
	search: true,
	sortable: true,
	// editable: true,
	editable: {
		2: 'text',
		3: 'number',
		4: 'number',
		5: 'number',
		6: {
			'm': 'Male',
			'f': 'Female',
		},
		8: 'text',
	},
});