jQuery(document).ready(function($) {

    // function slideAdjustment (argument) {
    //         var currentHeight = $(window).height();
    //         // var currentWidth = $(window).width();
    //         $('section').css('min-height', currentHeight + 'px');
    //         // $('section').css('width', currentWidth + 'px');
    //     }
    // slideAdjustment();
    // $(window).on('scroll resize' ,function(e){
    //     slideAdjustment();
    // })

    // Asigna los active en el menu de acuerdo el scroll
    $(window).scroll(function() {
        var windscroll = $(window).scrollTop();
        if (windscroll >= 1) {
            $('section').each(function(i) {
                if ($(this).position().top <= windscroll) {
                    $('nav a.active').removeClass('active');
                    $('nav a').eq(i).addClass('active');
                    $('#arrowtop').css('opacity', '1');
                }
            });

        } else {

            $('nav').removeClass('fixed');
            $('nav a.active').removeClass('active');
            $('nav a:first').addClass('active');
            $('#arrowtop').css('opacity', '0');
        }

    })//.scroll();​
    
    $('.meny-burguer').click(function() {
        $('.meny-burguer').toggleClass('cross');
        $('.meny').slideToggle(300);
    });

    $('.meny a').click(function() {
        $('.meny a').removeClass('active')
        $(this).toggleClass('active');
        $('.meny-burguer').toggleClass('cross');
        $('.meny').slideToggle(300);
    });
    
    $(function() {

        // Call Gridder
        $('.gridder').gridderExpander({
            scroll: true,
            scrollOffset: 30,
            scrollTo: "panel",                  // panel or listitem
            animationSpeed: 400,
            animationEasing: "easeInOutExpo",
            showNav: true,                      // Show Navigation
            nextText: "<i class=\"fa fa-arrow-right\"></i>",     // Next button text
            prevText: "<i class=\"fa fa-arrow-left\"></i>",      // Previous button text
            closeText: "<i class=\"fa fa-times\"></i>",          // Close button text

            onStart: function(){
                //Gridder Inititialized
            },
            onContent: function(){
                //Gridder Content Loaded
            },
            onClosed: function(){
                //Gridder Closed
            }
        });

    });
    // $("#owl-Slider").owlCarousel({
    //     items   : 1,
    //     loop    : true,
    //     autoplay: true,
    //     animateIn: 'fadeIn',
    //     animateOut: 'fadeOut',
    //     dots    : true
    // });
});