// JavaScript source code

/**
 *鼠标移动延时执行
 */
(function($){
    $.fn.hoverDelay = function(options){
        var defaults = {
            hoverDuring: 300,
            outDuring: 1,
            hoverEvent: function(){
                $.noop();
            },
            outEvent: function(){
                $.noop();
            }
        };
        var sets = $.extend(defaults,options || {});
        var hoverTimer, outTimer;
        return $(this).each(function(){
            $(this).hover(function(){
                clearTimeout(outTimer);
                hoverTimer = setTimeout(sets.hoverEvent, sets.hoverDuring);
            },function(){
                clearTimeout(hoverTimer);
                outTimer = setTimeout(sets.outEvent, sets.outDuring);
            });
        });
    }
})(jQuery);
/**
 * canvas画圈
 */
;(function(window, jQuery, undefined) {
    var pluginName = "CricleRotation",
        defaults = {
            direction: false,//true逆时针方向;false顺时针方向
            radius:60,
            color:'blue',
            linewidth:2
        };
    var Circle=function(element, options){
        this.options = $.extend({}, defaults, options );
        this.element = element;
        this.canvas = this.element;
        this.context=this.canvas.getContext("2d");
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        this.x=this.canvas.width/2;
        this.y=this.canvas.height/2;
        this.step=0;
        this.StartAngle=0;
        this.EndAngle=0;
        this.Timer=null;
        this.Start();
    };
    Circle.prototype = {
        Start:function () {
            this.Timer=setInterval((function(progra){
                return function(){
                    progra.Run();
                };
            })(this),5);
        },
        Run: function () {
            this.context.clearRect(0,0,this.width,this.height);
            if(this.options.direction==false){
                this.step=this.step+5;
                this.EndAngle=this.step * Math.PI / 180;
            }
            if(this.options.direction==true){
                this.step=this.step-5;
                this.EndAngle=this.step * Math.PI / 180;
            }
            if(this.step>360){this.step=360;clearInterval(this.Timer);}
            if(this.step<-360){this.step=-360;clearInterval(this.Timer);}
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.options.radius, this.StartAngle, this.EndAngle,this.options.direction);
            this.context.strokeStyle =this.options.color;
            this.context.lineWidth = this.options.linewidth;
            //this.context.closePath();
            this.context.stroke();

        },
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            var NewCircle=new Circle( this, options );
            $._data(this, "pluginName", NewCircle);// 缓存插件
        });
    };
})( jQuery, window, document);
/**
 * 鼠标移入后顺时针画圈,移出后逆时针画圈
 */
function Circle_Effect(){
    $('.case-text').each(function(){
        var that=$(this);
        var that_id = that.parent().find('canvas').attr('id');
        that.hoverDelay({
            hoverDuring: 100,
            outDuring: 200,
            hoverEvent: function(){
                $('#'+that_id).CricleRotation({
                    direction: false,
                    radius:25,
                    color:'white',
                    lineWidth:2,
                    flagRun:0,
                });
            },
            outEvent: function(){
                $('#'+that_id).CricleRotation({
                    direction: true,
                    radius:25,
                    color:'#5db8ff',
                    lineWidth:2,
                    flagRun:1,
                });
            }
        });
    });
}
/**
* 侧边导航栏处理
*/
(function ($) {
    /* 鼠标移入状态 */
    function MouseInStatus(obj){
        var item_text=obj.find('span');
        item_text.fadeIn();
        item_text.animate({ left: '15px' }, "fast");
        obj.find('i').removeClass('small-circle');
        obj.find('i').addClass('big-circle');
    }
    /* 鼠标移出状态 */
    function MouseOutStatus(obj){
        var item_text=obj.find('span');
        item_text.animate({ left: '0' }, 10, function () {
            $(this).hide();
        });
        obj.find('i').removeClass('big-circle');
        obj.find('i').addClass('small-circle');
    }
    /* 鼠标移动点击处理 */
    $(function() {
        $('.nav-item').each(function(i){
            var that = $(this)
            that.hoverDelay({
                hoverDuring: 200,
                outDuring: 10,
                hoverEvent:function(){MouseInStatus(that)},
                outEvent: function(){MouseOutStatus(that)}
            });
            that.click(function(){
                $('html,body').animate({scrollTop: $('.page-block').eq(i).offset().top-i* 80}, 200);
            });
            $('.page-block').eq(i).mouseenter(function(){
                MouseInStatus(that);
            }).mouseleave(function(){
                MouseOutStatus(that);
            });
        });
        $('.back-top').click(function(){
            $('html,body').animate({scrollTop: 0}, 200);
        });
    });
})(jQuery);

/**
 *前端技术内容（鼠标滚轮移动，点击移动）
 */
(function($){
    $.fn.picSlide = function(options){
        var defaults = {
            speed: 1000,
        };
        var opts = $.extend({}, defaults, options);
        function picPosInit(obj){
            for(var i=0;i<obj.find('li').length;i++){
                obj.find('ul .web-item').eq(i).css('left',i*100+'%');
            }
        }
        var index=0;
        function Move(obj){
            var prevBtn=$('.prev');
            var nextBtn=$('.next');
            var picLength=obj.find('ul .web-item').length;
            var textHeight=obj.find('ul .web-item').find('span').height();
            function prevMove(){
                if(index==0){
                    return 0;
                }
                index=(index>0 ? (index-1) : 0);
                for(var i=0;i<picLength;i++){
                    obj.find('ul .web-item').eq(i).animate({left:(i-index)*100+'%'}, opts.speed, 'linear');
                }
            }
            function nextMove(){
                if(index==(picLength-1)){
                    return 0;
                }
                index=(index<(picLength-1) ? (index+1) : (picLength-1));
                for(var i=0;i<picLength;i++){
                    obj.find('ul .web-item').eq(i).animate({left:(i-index)*100+'%'}, opts.speed, 'linear');
                }
            }
            prevBtn.click(function () {
                prevMove();
            });
            nextBtn.click(function () {
                nextMove();
            });

            var flagTimeOut=0;
            obj.on('mousewheel', function(event) {
                //console.log(event.deltaX, event.deltaY, event.deltaFactor);
                if((event.deltaY==1)&&(flagTimeOut==0)){
                    flagTimeOut=1;
                    prevMove();
                    setTimeout(function(){
                        flagTimeOut=0;
                    },500);
                }
                if((event.deltaY==-1)&&(flagTimeOut==0)){
                    flagTimeOut=1;
                    nextMove();
                    setTimeout(function(){
                        flagTimeOut=0;
                    },500);
                }
            });
            obj.bind('mousewheel', function(event) {
                event.preventDefault();
                var scrollTop = this.scrollTop;
                this.scrollTop = (scrollTop + ((event.deltaY * event.deltaFactor) * -1));
            });
        }
        function diplayContent(obj){
            obj.find('.ca-more').click(function(){
                $(this).parent().parent().find('.web-info').show();
            });
            obj.find('.ca-close').click(function(){
                $(this).parent().hide();
            });
            $(window).resize(function () {
                if(document.body.clientWidth>850){
                    obj.find('.web-info').show();
                }
            });
        }
        this.each(function(i){
            var _this = $(this);
            picPosInit(_this);
            Move(_this);
            diplayContent(_this);
        });
    }
})(jQuery);

/**
 * 主程序
 */
(function ($) {
    $(function() {
        "use strict";
        //鼠标移入后顺时针画圈,移出后逆时针画圈
        Circle_Effect();
        //弹出对话框
        $('.see-mywork').awesomodals();
        //meun 点击处理
        $('.menu-trigger').click(function(){
            $(this).toggleClass("opened");
        });
        $('.menu-trigger').click(function(){
            $('.header-nav').slideToggle();
        });
        $('.nav-menu li').each(function(i){
            $(this).click(function () {
                $('html,body').animate({scrollTop: $('.page-block').eq(i).offset().top-i* 80}, 200);
            })
        });
        //创意分享动画处理
        $('.circle-info').each(function(){
            var that=$(this);
            that.hoverDelay({
                hoverDuring: 100,
                outDuring: 200,
                hoverEvent: function(){
                    that.find('p').slideDown();
                },
                outEvent: function(){
                    that.find('p').slideUp();
                }
            });
        });
        //前端技术内容滑动
        $('#webTech').picSlide({
            speed: 500,
        });
    });
})(jQuery);

