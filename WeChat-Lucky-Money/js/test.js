// JavaScript source code
function checkIsWeixinOpen(){
	var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        var isAndroid = ua.indexOf('android') != -1;
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        if (!isWeixin) {
                document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/connect/zh_CN/htmledition/style/wap_err1a9853.css">';
                document.body.innerHTML = '<div class="page_msg"><div class="inner"><span class="msg_icon_wrp"><i class="icon80_smile"></i></span><div class="msg_content"><h4>请在微信客户端打开链接</h4></div></div></div>';
        }

}
window.onload=checkIsWeixinOpen;
//var MoneySum = 1000;
//var PeopleNum = 100;

var PreGetMoney = 0;    //抢红包之前获得的现金总和
var ThisEnvelopeNum = 0;//每次抢到发的红包个数 
var ThisGetMoney = 0;   //每次抢到红包的现金
var ThisMaxMoney = 0;   //抢到红包的总和
var PlayCount = 0;      //已抢红包次数   
var PlayMaxCount = 6;   //分配给每个人抢红包的次数

var EachMaxMoney = 10;  //分配给每个人抢红包的现金总额
var ThisToMoney = EachMaxMoney * Math.random(); //分配给每个人抢红包的现金（随机数小于等于总额）


$(document).ready(function () {
    "use strict";
    ProgressBar();
    BtnScale();
    PreBegainGame();
    //PlayGame();
    ReplayGame();

    var NewCircle = new Ray();
    NewCircle.RayTick();


    $('#use-envelope').click(function () {
        alert("(拆红包，立即使用）活动已结束");
    });
    $('#share').click(function () {
        $('.share-happiness').show();
    });


});
 
/**
*首页进度条
*/ 
function ProgressBar() {
    var count = 0;
    var dispNum=0;var factor=1,TotalNum=33;
    var Timer=window.setInterval(function () {
		count = count + factor*$('.set-progress').width() / TotalNum;
        dispNum = dispNum + factor; 
        $(".progress-bar").css('width',count+'px');
        $('#bar-speed').html(dispNum-1+ '/'+TotalNum);
        
        if (dispNum-1> TotalNum) {
            count = 0;
            dispNum = 0;
            $('.first-page').hide();
            $('.second-page').show();
            $('#canvas').show();
            clearInterval(Timer);
        }
     },200);
}
/**
*按钮（游戏规则，开始游戏）放大缩小动态显示
*/
function BtnScale(){
    var factor = 1;
    var flag = 0;
    var pos = 8.2; 

    var BtnScaleTimer = window.setInterval(function () {
        factor = flag ? (factor - 0.02) : (factor + 0.02);
        if (factor > 1.7) { flag = 1; }
        if (factor < 1) { flag = 0; }
        $(".game-rule").css("transform", 'scale(' + factor + ')');
        pos = flag ? (pos - 0.1) : (pos + 0.1);
        $(".game-arrow").css("right", pos + '%');
        $(".begain-game").css("transform", 'scale(' + factor + ')');
    }, 20);

    $(".game-close").click(function () {
        $('.activity-rules').hide();
        $('.game-title').show();
        
    });

    $(".game-rule").click(function () {
        $('.game-title').hide();
        $('.activity-rules').show();
        $('.activity-rules').css("transform", 'scale(0.1)');
        var GameFactor = 0;
        window.setInterval(function () {
            if (GameFactor < 1) {
                GameFactor = (GameFactor + 0.01);
                $(".activity-rules").css("transform", 'scale(' + GameFactor + ')');
            }
        }, 10);
    });
}
/**
*首次游戏前3，2，1倒计时
*/
function PreBegainGame() {
    var ImgSrc = [
        "img/three[1].png",
        "img/two[1].png",
        "img/one[1].png"
    ];
    $(".begain-game").click(function () {
        $('.activity-rules').hide();
        $('.counter-down').show();
  
        var ArrowPos = 40;
        var flag = 0;
        var NumPicFactor = 0.1;
        var Counter = 0;
        $(".counter-num").attr("src", ImgSrc[Counter]);
        $(".counter-num").css("transform", 'scale(' + NumPicFactor + ')');
        $('#black-mask').show();
		var CounterTimer=window.setInterval(function () {
			ArrowPos = flag ? (ArrowPos - 0.1) : (ArrowPos + 0.1);
			if (ArrowPos > 45) { flag = 1; }
			if (ArrowPos < 40) { flag = 0; }
			$(".up-arrow").css("bottom", ArrowPos + '%');
		 
			if (NumPicFactor <1) {
				NumPicFactor = (NumPicFactor + 0.01);
				$(".counter-num").css("transform", 'scale(' + NumPicFactor + ')');
				if (NumPicFactor >1) {
					if (Counter++ < 2) {
						$(".counter-num").attr("src", ImgSrc[Counter]);
						$(".counter-num").css("transform", 'scale(0)');
						NumPicFactor = 0;
					} else {
						$(".counter-down").hide();
						$('#black-mask').hide();
					    $(".cloud-award").show();
					    clearInterval(CounterTimer);
					    Game.GameRemainTime();
					}
				}
			}
		}, 10);
    });
}
/**
*保留两位小数
*/
function changeTwoDecimal(x)
{
   var f_x = parseFloat(x);
   if (isNaN(f_x))
   {
      alert('function:changeTwoDecimal->parameter error');
      return false;
   }
   var f_x = Math.round(x*100)/100;
   return f_x;
}

/**
*每次玩游戏之前初始化
*/
function init(ThisEnvelopeNum, ThisGetMoney, PlayCount) {
    if (ThisMaxMoney < ThisGetMoney) { //获取最高纪录
        ThisMaxMoney = ThisGetMoney;
    }
    $('#envelope-num').val(ThisEnvelopeNum);
	$('#total-money').val(changeTwoDecimal(ThisGetMoney));
	$('#record').val(changeTwoDecimal(ThisMaxMoney));
	$('#paly-record').val(PlayCount+1);
	$('#remain-time').val(PlayMaxCount -1- PlayCount);
}
/**
*红包分配
*/

function MoneyDistribution() {  
    var EachRemainMoney = (Math.random()*(ThisToMoney - PreGetMoney)/(PlayMaxCount-PlayCount))*Math.random();
    return EachRemainMoney;
}

function load (){
	var EnvelopeMove = 0;
    	var startX, startY, endX, endY;
	document.getElementById("play-btn").addEventListener("touchstart", touchStart, false);
	document.getElementById("play-btn").addEventListener("touchmove", touchMove, false);
	document.getElementById("play-btn").addEventListener("touchend", touchEnd, false);
	function touchStart(event) {
		var touch = event.touches[0];
		startY = touch.pageY;
		startX = touch.pageX;
	}
	function touchMove(event) {
		var touch = event.touches[0];
        event.preventDefault();
		endX = touch.pageX;
		endY = touch.pageY;
	}
	function touchEnd(event) {
		$("#play-btn").html("X轴移动大小：" + (endX - startX)+"<br/>"+"Y轴移动大小：" + (endY -startY));
		if((startY -endY)>100){
			alert(startY -endY);
			var money = changeTwoDecimal(MoneyDistribution());
			if (EnvelopeMove == 0) {
				EnvelopeMove = 1;
				$(".hongbao-paper").animate({ bottom: 45 + '%' }, 500, "easeOutBounce", function () {
				});
				$(".hongbao-paper").animate({ bottom: 30 + '%' }, 100, "easeOutBounce", function () {
					EnvelopeMove=0;
				});
				ThisEnvelopeNum++;
				$('#getmoney').css({ "bottom": '0', 'left': 100 * Math.random() + '%' });
				$("#getmoney").animate({ left: 100 * Math.random() + '%' }, 10, "linear", function () {
					$('#getmoney').val('+' + money);
					$('#getmoney').show();
					$("#getmoney").animate({ bottom: 100 * Math.random() + '%' }, 500, "linear", function () {
						$("#getmoney").hide();
						$('#getmoney').css({ "bottom": '0', 'left': 100 * Math.random() + '%' });

						PreGetMoney += money;
						ThisGetMoney += money;
						$('#AwardMoney').html(changeTwoDecimal(PreGetMoney));
						FlagPlay = 0;
					});
				});
			}
		}
	}
}
window.addEventListener('load',load, false);

 
/**
*开始玩游戏
*/
/*function PlayGame() {
	var EnvelopeMove = 0; 
	var obj = document.getElementById('play-btn');
	obj.addEventListener('touchmove', function(event) {
        event.preventDefault();// 阻止浏览器默认事件，重要
        var money = changeTwoDecimal(MoneyDistribution());
		if (EnvelopeMove == 0) {
			EnvelopeMove = 1;
			$(".hongbao-paper").animate({ bottom: 45 + '%' }, 500, "easeOutBounce", function () {
			});
			$(".hongbao-paper").animate({ bottom: 30 + '%' }, 100, "easeOutBounce", function () {
				EnvelopeMove=0;
			});
			ThisEnvelopeNum++;
			$('#getmoney').css({ "bottom": '0', 'left': 100 * Math.random() + '%' });
			$("#getmoney").animate({ left: 100 * Math.random() + '%' }, 10, "linear", function () {
				$('#getmoney').val('+' + money);
				$('#getmoney').show();
				$("#getmoney").animate({ bottom: 100 * Math.random() + '%' }, 500, "linear", function () {
					$("#getmoney").hide();
					$('#getmoney').css({ "bottom": '0', 'left': 100 * Math.random() + '%' });

					PreGetMoney += money;
                    ThisGetMoney += money;
					$('#AwardMoney').html(changeTwoDecimal(PreGetMoney));
 					FlagPlay = 0;
				});
			});
		}
    }, false);
}*/
/**
*再一次玩游戏
*/
function ReplayGame() {
    $('#replay').click(function () {
        $('.share-happiness').hide();
        PlayCount++;
        if (PlayCount < PlayMaxCount) {
          $('.moneybag').hide();
          ThisGetMoney = 0;
          ThisEnvelopeNum = 0;
          init(ThisEnvelopeNum,ThisGetMoney, PlayCount);
          Game.GameRemainTime();
       } else {
           $('.moneybag').show();
           alert("本次抢红包结束！");
       }

    }); 
}
/**
*玩游戏倒计时10秒
*/
var Game = {
    time:100,
	GameRemainTime:function(){
	    var Sec = 0, MilSec = 0;
	    var time = this.time;
	    var RemainTimer = window.setInterval(function () {
		if (time > 0) {
			  time -=  1;
			  Sec = parseInt(time / 10);
			  MilSec = time % 10;
			  $('#remiain-time').html(Sec + ':' + MilSec + '秒');
 		 } else {
			  $('.moneybag').show();
			  clearInterval(RemainTimer);
			  init(ThisEnvelopeNum, ThisGetMoney, PlayCount);
 		 }
	  }, 100);
 	}
};

/**
*背景光线
*/
 var Ray=function(){
	this.canvas=document.getElementById("canvas");
	this.context=canvas.getContext("2d");	
	this.x=this.canvas.width/2;
	this.y=this.canvas.height/2;
	this.r=500;
};
 Ray.prototype = {
     RayTick: function () {
        var StartAngle=0,EndAngle=0;
        for(var i=0;i<360;i=i+10){
	        StartAngle=i*Math.PI/180;
	        EndAngle=(i+5)*Math.PI/180;	 
	        this.context.beginPath();
	        this.context.moveTo(this.x,this.y);
	        this.context.arc(this.x, this.y, this.r,StartAngle,EndAngle, false);
	        this.context.lineTo(this.x, this.y);
	  
	        var lGrd=this.context.createLinearGradient(this.x,this.y, this.x+this.r*Math.cos(StartAngle), this.y+this.r*Math.cos(StartAngle));
	        lGrd.addColorStop(0, 'grey');  
	        lGrd.addColorStop(1, 'white');
	        this.context.globalAlpha=0.5;
	        this.context.lineWidth = 1;
	        this.context.fillStyle=lGrd;
	        this.context.fill();
        }
    },  
};
