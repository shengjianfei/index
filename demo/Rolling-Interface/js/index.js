// JavaScript source code
window.onload=function(){
  $('.table-content').eq(0).show();
    InterfaceInit(userIndex);
    AddOrderTable(SetOrderRows);
    AddResellerTable(SetResellerRow);
}
document.write('<script type="text/javascript" src="config/config.js" > <\/script>');


//增加供应商数量
function AddSuppliersData(row){
    for(var i=0;i<parseInt(row/4);i++){
        var j=i*4;
        $("#marquee2_1").append(''+
            '<li>'+
            '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 supplier-case">'+
            '<img src="img/'+ImgARR[j][0]+'"'+' alt="二维码"/>'+
            '<p>'+ImgARR[j][1]+'</p>'+
            '</div>'+
            '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 supplier-case">'+
            '<img src="img/'+ImgARR[j+1][0]+'"'+' alt="二维码"/>'+
            '<p>'+ImgARR[j+1][1]+'</p>'+
            '</div>'+
            '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 supplier-case">'+
            '<img src="img/'+ImgARR[j+2][0]+'"'+' alt="二维码"/>'+
            '<p>'+ImgARR[j+2][1]+'</p>'+
            '</div>'+
            '<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 supplier-case">'+
            '<img src="img/'+ImgARR[j+3][0]+'"'+' alt="二维码"/>'+
            '<p>'+ImgARR[j+3][1]+'</p>'+
            '</div>'+
            '</li>'
        );
    }
}
//增加客户案例数量
function AddClientCaseData(row){
    for(var i=0;i<parseInt(row);i++){
        $("#mybook").append(''+
            '<div class="page-introduce">'+
            '<img src="img/'+ImgARR[i][0]+'"'+' alt="二维码"/>'+
            '<h1>'+ImgARR[i][1]+'</h1>'+
            '</div>'+
            '<div class="page-phone">'+
            '<img class="phone-img" src="img/'+ImgARR[i][3]+'"'+' alt="二维码"/>'+
            '</div>'
        );
    }
}
//保留两位小数
function changeTwoDecimal(x){
    var f_x = parseFloat(x);
    if (isNaN(f_x))
    {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(x*100)/100;
    return f_x;
}

var TotalMoney=0;                          //订单总额
var TotalCommission=0;                    //佣金总额

var orderIndex=0;//订单号末尾增加数字
var refresh={//刷新浏览器标志
    order:0,
    suppliers:0
};
//当前日期转换，并产生ID
function getConverTime(time){
    var order={
            SetHour:0,
            SetMinute:0,
            SetSecond:0,
            randomTime:' ',
            ID:' ',
            status:'',
            Name:'',
            money:0
        };
    order.status=OrderStatus[parseInt(Math.random()*OrderStatus.length)];
    // order.status=OrderStatus[0];
    order.Name=ImgARR[parseInt(Math.random()*ImgARR.length)][2];
    order.money=Math.random()*SetMoney;

    var year=time.getFullYear();           //年
    var month=time.getMonth()+1;           //月
    var day=time.getDate();                //日
    var hour=time.getHours();
    var minute=time.getMinutes();
    var second=time.getSeconds();
    order.SetHour=hour;
    order.SetMinute=minute;
    order.SetSecond=second;
    if(refresh.order==0||refresh.suppliers==0){   //首次刷新产生随机时间
         order.SetHour=Math.floor(Math.random()*hour);
         order.SetMinute=Math.floor(Math.random()*60);
         order.SetSecond=Math.floor(Math.random()*60);
    }

    if(year<10) {year="" + year;}
    if(month<10) {month="" + month;}
    if(day<10) {day="" + day;}
    if(order.SetHour<10) {order.SetHour="" + order.SetHour;}
    if(order.SetMinute<10) {order.SetMinute="0" + order.SetMinute;}
    if(order.SetSecond<10) {order.SetSecond="0" + order.SetSecond;}
    order.randomTime=year+'/'+month+'/'+day+'&nbsp;&nbsp;'+
        '<span class="time-hour">'+order.SetHour+'</span>'+
        ':'+'<span class="time-minute">'+order.SetMinute+'</span>'+
        ':'+'<span class="time-minute">'+order.SetSecond+'</span>'+'<br/>';
     /*order.randomTime= new Date() +'<br/>';*/
    orderIndex++;
    order.ID=year+month+day+order.SetHour+order.SetMinute+order.SetSecond+orderIndex;
    return order;
}
//json数据排序
function sortBy(filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) { return rev * -1; }
        if (a > b) { return rev * 1; }
        return 1;
    }
};
//订单排序
function OrderRank(num){
    var tableDate = [];
    for(var j=0;j<num;j++){
        var newRow=getConverTime(new Date());
        var newMoney=newRow.money;
        var NewDate={
            'rankID':''+newRow.SetHour+newRow.SetMinute+newRow.SetSecond,
            'headTag':'<tr>',
            'index':'<td class="td1"><input class="id-index" type="checkbox" name="sub-checkbox" /></td>',
            'time':'<td class="td1">'+newRow.randomTime+'旺铺&nbsp;:&nbsp;'+newRow.Name+'vip'+'</td>',
            'orderID':'<td class="td1">'+newRow.ID+'<br/>'+'<span class="order-status">'+newRow.status+'</span>'+'</td>',
            'orderMoney':'<td class="td1">&yen;'+changeTwoDecimal(newMoney)+'<br/>'+'微信支付'+'</td>',
            'orderCommission':'<td class="td1">&yen;'+changeTwoDecimal(newMoney*0.05)+'</td>',
            'result':'<td class="td1"></td>',
            'endTag':'</tr>',
        };
        tableDate.push(NewDate);
        TotalMoney=TotalMoney+newMoney;
        TotalCommission=TotalCommission+newMoney*0.05;
    }
    if(!refresh.order){
        tableDate.sort(sortBy('rankID', false, parseInt));/**/
    }
    refresh.order=1;
    return tableDate;
}
//添加交易订单表单数据
function AddOrderTable(num){
    var tableDate=OrderRank(num);
    for (var i = 0; i < num; i++) {
        $("#TableScroll_1 table tbody").append('' +
            tableDate[i].headTag+
            tableDate[i].index +
            tableDate[i].time +
            tableDate[i].orderID +
            tableDate[i].orderMoney +
            tableDate[i].orderCommission +
            tableDate[i].result +
            tableDate[i].endTag
        );
    }
    SetTableColor(num);

    $('#TotalOrderID').html('当日订单个数:&nbsp;&nbsp;'+SetOrderRows+'&nbsp;&nbsp;个');
    $('#TotalMoney').html('订单总金额（元）:&nbsp;&nbsp;&yen;'+changeTwoDecimal(TotalMoney));
    $('#TotalCommission').html('佣金总额（元）:&nbsp;&nbsp;&yen;'+changeTwoDecimal(TotalCommission));

}
//产生随机六位数字
function ProduceNumber(_idx){
    var str = '';
    for(var i = 0; i < _idx; i += 1){
        str += Math.floor(Math.random() * 10);
    }
    return str;
}
//随机产生上级ID(6位数据)
function Produce_ParentID(){
    var ParentId='';
    var num=parseInt(Math.random()*2);
    if(num){
        ParentId=''+ProduceNumber(6);
    }else{
        ParentId='无';
    }
    return ParentId;
}
//分销商排序
function ResellerRank(num){
    var ResellerTable=[];
    for(var j=0;j<num;j++){
        var time=getConverTime(new Date());
        var resellerID=ProduceNumber(6);
        var resellerParentID=Produce_ParentID();
        var NewReseller={
            'rankID':''+time.SetHour+time.SetMinute+time.SetSecond,
            'headTag':'<tr>',
            'index':'<td class="td2"><input class="id-index" type="checkbox" name="sub-checkbox" /></td>',
            'ID':'<td class="td2">'+resellerID+'</td>',
            'name':'<td class="td2">'+time.Name+'vip'+'</td>',
            'randomTime':'<td class="td2">'+time.randomTime+'</td>',
            'parentID':'<td class="td2">'+resellerParentID+'</td>',
            'endTag':'</tr>',
        };
        ResellerTable.push(NewReseller);
    }
    if(!refresh.suppliers){
        ResellerTable.sort(sortBy('rankID', false, parseInt));
    }
    refresh.suppliers=1;
    return ResellerTable;
}
//添加分销商表单数据
function  AddResellerTable(num){
    var ResellerTable=ResellerRank(num);
    for(var i=0;i<num;i++){
        $("#resellertable_1 table tbody").append(''+
            ResellerTable[i].headTag+
            ResellerTable[i].index+
            ResellerTable[i].ID +
            ResellerTable[i].name+
            ResellerTable[i].randomTime+
            ResellerTable[i].parentID +
            ResellerTable[i].endTag
        );
    }
}
//随机增加表单行
function addOrderRow(){
    if(SetOrderRows<SetOrderTotalRows){
        var AddRow=parseInt(Math.random()*AddOrderRandomRow);
        SetOrderRows=SetOrderRows+AddRow;
        AddOrderTable(AddRow);
    }
}
function addResellerRow(){
    if(SetResellerRow<SetResellerTotalRows) {
        var AddRow = parseInt(Math.random() * AddResellerRandomRow);
        SetResellerRow = SetResellerRow + AddRow;
        AddResellerTable(AddRow);
    }
}
//检查是否过了一天
var lastDay=0;
function checkDay(){
    var NewTime=new Date();
    var NewTimeDay=NewTime.getDate();
    if(lastDay!=NewTimeDay){
         //alert(NewTimeDay+';'+lastDay );
        if(lastDay!=0){
            window.location.reload();
        }
        lastDay=NewTimeDay;
    }
}

//表格向上移动
function Table_Move(obj,speedhq){
    var obj=document.getElementById(obj);
    function Marqueehq(){
        obj.scrollTop++;
        obj.onscroll=function(){
            if( this.scrollTop + this.clientHeight >= this.scrollHeight ){
                this.scrollTop=0;
            }
        }
    }
    var MyMarhq=setInterval(Marqueehq,speedhq);
    obj.onmouseover=function() {clearInterval(MyMarhq);}
    obj.onmouseout=function() {MyMarhq=setInterval(Marqueehq,speedhq);}
}
var OrderStatus=[                           //订单状态
    '等待发货中...',
    '已发货',
    '已收货'
];
//设定表格颜色
function SetTableColor(num){
    $('.order-status').each(function(){
        var order_status=$(this).html();
        if(order_status=='等待发货中...'){
            $(this).css('color','yellow');
            $(this).parent().parent().css('background','#40de4e');
            $(this).parent().parent().find('td:last').text('处理中');
        }
        if(order_status=='已发货'){
            $(this).css('color','#a45891');
            $(this).parent().parent().css('background','#decd40');
            $(this).parent().parent().find('td:last').text('处理中');
        }
       if(order_status=='已收货'){
            $(this).css('color','blue');
            $(this).parents('tr').css('background','#ffffff');
            $(this).parents('tr').find('td:last').text('交易完成');
        }

    });

}

//供应商向上移动
function marquee(i, direction){
    var obj = document.getElementById("marquee" + i);
    var obj1 = document.getElementById("marquee" + i + "_1");
    var obj2 = document.getElementById("marquee" + i + "_2");
    if (direction == "up"){
        if (obj2.offsetTop - obj.scrollTop <= 0){
            obj.scrollTop -= (obj1.offsetHeight + 20);
        }else{
            var tmp = obj.scrollTop;
            obj.scrollTop++;
            if (obj.scrollTop == tmp){
                obj.scrollTop = 1;
            }
        }
    }
}
function marqueeStart(i, direction){
    var obj = document.getElementById("marquee" + i);
    var obj1 = document.getElementById("marquee" + i + "_1");
    var obj2 = document.getElementById("marquee" + i + "_2");

    obj2.innerHTML = obj1.innerHTML;
    var marqueeVar = window.setInterval("marquee("+ i +", '"+ direction +"')", moveSpeed);
    obj.onmouseover = function(){
        window.clearInterval(marqueeVar);
    }
    obj.onmouseout = function(){
        marqueeVar = window.setInterval("marquee("+ i +", '"+ direction +"')", moveSpeed);
    }
}
//导航栏
function nav_proc(){
    //展开导航栏
    $('.nav-index').click(function(){
        for(var i=0;i<$('.nav-item').length;i++){
            $('.nav-index').eq(i).css('background','black');
            $('.nav-item').hide();
            $(".arrow-icon img").attr('src',"img/aa_open.png");
        }
        $(this).parent().find(".nav-item").slideToggle(500);
        $(this).css('background','#393939');
        $(this).find(".arrow-icon img").attr('src',"img/aa_close.png");
    });
    //点击显示空白(欢迎光临)
    $('.nav-list').click(function(){
        for(var i=0;i<$('.table-content').length;i++){
            $('.table-content').hide();
        }
        $('#blank').show();
    });
    //点击切换界面
    var selectInterface=[
        [$('.all-order'),$('#AllOrder')],
        [$('.suppliers'),$('#suppliers')],
        [$('.reseller'),$('#allreseller')],
        [$('.client-cases'),$('#ClientCases')],
    ];
    $.each(selectInterface, function(i, item){
        item[0].click(function(){
            for(var j=0;j<$('.table-content').length;j++){
                $('.table-content').hide();
            }
            $('#blank').hide();
           item[1].show();
        });
    });
}

//定时切换界面
var userIndex=0;
function ChangeInterface(){
    for(var i=0;i<$('.table-content').length;i++){
        $('.table-content').hide();
    }
    $('.table-content').eq(userIndex).show();
    InterfaceInit(userIndex);
    userIndex=(userIndex>$('.table-content').length-3) ? 0:(userIndex+1);
}
function InterfaceInit(index){
    var selectInterface=[
        $('.all-order'),
        $('.suppliers'),
        $('.reseller'),
        $('.client-cases')
    ];
    for(var i=0;i<$('.nav-item').length;i++){
        $('.nav-index').eq(i).css('background','black');
        $('.nav-item').hide();
        $(".arrow-icon img").attr('src',"img/aa_open.png");
        $('.nav-item li').css('color','white');
    }
    selectInterface[index].parent().parent().find('.nav-index').css('background','#393939');
    selectInterface[index].parent().show();
    selectInterface[index].parent().parent().find('.nav-index').find(".arrow-icon img").attr('src',"img/aa_close.png");
    selectInterface[index].css('color','sandybrown');
}

$(document).ready(function () {
    "use strict";

    setInterval(addOrderRow,2000+parseInt(Math.random()*Timer_addOrderRow));
    setInterval(addResellerRow,2000+parseInt(Math.random()*Timer_addResellerRow));

    setInterval(checkDay,5000);//定时检查是否当天
    setInterval(ChangeInterface,ChangeInterfaceTime);
    nav_proc();

    AddSuppliersData(SetSuppliersRow);
    AddClientCaseData(SetClientCaseRow);
    marqueeStart(2, "up");
    Table_Move('TableScroll',Orderspeedhq);
    Table_Move('resellertable',Resellerspeedhq);
    $(function () {
        $('#mybook').booklet({
            auto: true,
            delay: 2000,
            //shadows: false,//翻书阴影去除
            speed: 3000,//翻页速度
            width:  900,
            height: 600,
            easeOut: "easeOutExpo",
            pageNumbers: false,//页码显示去除
        });
    });
    //全选标记
    $(".allchecked").click(function () {
        if ($(this).is(":checked")) {
            $("input[name = 'sub-checkbox']:checkbox").prop("checked", true);
        }else {
            $("input[name = 'sub-checkbox']:checkbox").prop("checked", false);
        }
    });
});
/**/