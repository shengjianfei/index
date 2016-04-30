// JavaScript source code
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

(function ($) {
    function MouseInStatus(obj){
        var item_text=obj.find('span');
        item_text.fadeIn();
        item_text.animate({ left: '15px' }, "fast");
        obj.find('i').removeClass('small-circle');
        obj.find('i').addClass('big-circle');
    }
    function MouseOutStatus(obj){
        var item_text=obj.find('span');
        item_text.animate({ left: '0' }, 10, function () {
            $(this).hide();
        });
        obj.find('i').removeClass('big-circle');
        obj.find('i').addClass('small-circle');
    }
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

/*function SiriWave(opt){
    this.opt = opt || {};
    this.K = 2;
    this.F = 6;
    this.speed = this.opt.speed || 0.1;
    this.noise = this.opt.noise || 0;
    this.phase = this.opt.phase || 0;

    if (!devicePixelRatio) devicePixelRatio = 1;
    this.width = devicePixelRatio * (this.opt.width || 320);
    this.height = devicePixelRatio * (this.opt.height || 100);
    this.MAX = (this.height/2)-4;

    this.canvas = document.getElementById("wave");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    this.run = false;
}
SiriWave.prototype = {
    _globalAttenuationFn: function(x){
        return Math.pow(this.K*4/(this.K*4+Math.pow(x,4)),this.K*2);
    },
    _drawLine: function(attenuation, color, width){
        this.ctx.moveTo(0,0);
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width || 1;
        var x, y;
        for (var i=-this.K; i<=this.K; i+=0.01) {
            x = this.width*((i+this.K)/(this.K*2));
            y = this.height/2 + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-this.phase);
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    },

    _clear: function(){
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'source-over';
    },

    _draw: function(){
        if (!this.run) return;

        this.phase = (this.phase+this.speed)%(Math.PI*64);
        this._clear();
        this._drawLine(-2, 'rgba(255,255,255,0.1)');
        this._drawLine(-6, 'rgba(255,255,255,0.2)');
        this._drawLine(4, 'rgba(255,255,255,0.4)');
        this._drawLine(2, 'rgba(255,255,255,0.6)');
        this._drawLine(1, 'rgba(255,255,255,1)', 1.5);

        requestAnimationFrame(this._draw.bind(this), 1000);
    },

    start: function(){
        this.phase = 0;
        this.run = true;
        this._draw();
    },

    stop: function(){
        this.run = false;
        this._clear();
    },

    setNoise: function(v){
        this.noise = Math.min(v, 1)*this.MAX;
    },

    setSpeed: function(v){
        this.speed = v;
    },

    set: function(noise, speed) {
        this.setNoise(noise);
        this.setSpeed(speed);
    }

};*/


//背景图片缩放
/*function PageBlock_Zooming(){
    $('.page-block').css('height', parseInt(document.body.clientWidth/2.1)+'px');
    $(window).resize(function () {
        $('.page-block').css('height', parseInt(document.body.clientWidth/2.1)+'px');
    });
}*/

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
        var scrollupCount=0;
        var scrolldownCount=0;
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
        //背景图片缩放
        /*function Img_Zooming(obj){
            $(window).resize(function () {
                var setHeight=$(window).height();
                $('.web-enjoy').css('height',setHeight+'px');
            });
        }*/
        function diplayContent(obj){
            obj.find('.ca-more').click(function(){
                $(this).parent().parent().find('.web-info').show();
            });
            obj.find('.ca-close').click(function(){
                $(this).parent().hide();
            });
            $(window).resize(function () {
                if(document.body.clientWidth>650){
                    obj.find('.web-info').show();
                }
            });
        }
        this.each(function(i){
            var _this = $(this);
            picPosInit(_this);
            Move(_this);
            //Img_Zooming(_this);
            diplayContent(_this);
        });
    }
})(jQuery);
$(document).ready(function () {
    "use strict";
    Circle_Effect();
    // IndexNav_Proc();

    /* var setHeight=$(window).height();
    console.log(setHeight)
    $('.page-block').css('height',setHeight+'px');
       $(window).resize(function () {
        var setHeightx=$(window).height();console.log(setHeight)
        $('.page-block').css('height',setHeightx+'px');
    });
 */

    $('.menu-trigger').click(function(){
        $(this).toggleClass("opened");
    });

    $('.see-mywork').awesomodals();//弹出对话框


    $('.menu-trigger').click(function(){
        $('.mobile-nav').fadeToggle( 1000, "linear" );
    });
    $('#webTech').picSlide({
        speed: 500,
    });
});

/*
$(window).resize(resizeCanvas);

function resizeCanvas() {

    canvas.attr("width", $(window).get(0).innerWidth);

    canvas.attr("height", $(window).get(0).innerHeight);

    context.fillRect(0, 0, canvas.width(), canvas.height());

};

resizeCanvas();  */
