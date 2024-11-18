$('.carusel').slick({
    autoplay: true, 
    autoplaySpeed: 3000,
    dots: true,
    adaptiveHeight: true,
});

$('.about__items > div').on('click', function(){
    // alert('hello') - всплывающее окно
    $(this).children('.about__icon').toggleClass('active');
    $(this).parent('.about__items').toggleClass('toggleBg');
    $(this).next('p').slideToggle(300)
})

