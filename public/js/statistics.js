/**
 * Created with JetBrains PhpStorm.
 * User: hamway
 * Date: 26.04.13
 * Time: 18:46
 * To change this template use File | Settings | File Templates.
 */
function getDateList(){

}

function renderDataList() {
    var list = getDateList('now');
}

$(document).ready(function(){
    $('.alert .close').click(function(){
       $(this).parent().animate({opacity:0, height:0});
    });

    $('.nav>li>a.disable').click(function(){
        return false;
    });

    renderDateList();
});