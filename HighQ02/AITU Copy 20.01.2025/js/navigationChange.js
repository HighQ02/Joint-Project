$(document).scroll(function(e) {
    $(window).scrollTop() > 770 ? $(".logo_aitu").attr("src", "images/header/Mask_Group.svg") : $(".logo_aitu").attr("src", "images/header/LOGO.svg");
});
$(document).scroll(function(e) {
    $(window).scrollTop() > 770 ? $('.navigation-block').addClass('navigation-block-change') : $('.navigation-block').removeClass('navigation-block-change');
});
$(document).scroll(function(e) {
    $(window).scrollTop() > 770 ? $('.navigation-button').addClass('navigation-button-change') : $('.navigation-button').removeClass('navigation-button-change');
});
$(document).scroll(function(e) {
    $(window).scrollTop() > 770 ? $('.language').addClass('language-change') : $('.language').removeClass('language-change');
});