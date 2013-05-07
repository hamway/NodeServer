/**
 * Created with JetBrains PhpStorm.
 * User: hamway
 * Date: 26.04.13
 * Time: 18:46
 * To change this template use File | Settings | File Templates.
 */
function getDateList(time) {
    if (time == 'now')
        var date = new Date();

    var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();


    var list = [];
    for (i = 0; i < 5; i++) {

        if (i > 0) {
            day--;
        }
        if ((day) == 0) {
            month--;
            if (month == 4 | 6 | 9 | 11) {
                day = 30
            } else if (month == 2) {
                if ((year - 2000) % 4 == 0) {
                    day = 29;
                } else {
                    day = 28;
                }
            } else {
                day = 31;
            }
        }
        if (month == 0) {
            year--;
            day = 31;
            month = 12;
        }

        if (typeof month == 'number') {
            month = (month < 10) ? "0" + month : month;
        }


        list.push(day + '-' + month + '-' + year)
    }
    list.reverse();
    list[list.length - 1] = 'Сегодня';
    list[list.length - 2] = 'Вчера';

    return list;
}

function getDateFromServer(time) {
    if (time == 'now')
        var date = new Date();

    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    month = (month < 10) ? "0" + month : month;

    var key = month + ':' + year;

    $.get('/status/date?key='+key,function(resp) {
        console.log(resp);
    })
}

function renderDateList() {
    var list = getDateList('now');

    dslist = getDateFromServer('now');
}

$(document).ready(function () {
    $('.alert .close').click(function () {
        $(this).parent().animate({opacity: 0, height: 0});
    });

    $('.nav>li>a.disable').click(function () {
        return false;
    });

    renderDateList();
});