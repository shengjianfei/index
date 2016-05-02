// JavaScript source code

//提交检查
function submitCheck() {
    var PersonInfo="输入自我介绍，个人详情，拉票宣言等等！必须上传最少一张图片，请认真填写!";
     if (!$("#person-name").val()) {
        InfoShow("姓名不能为空!");
        return false; // 返回值为false，将阻止表单提交
    }
    if (!$("#phonenumber").val()) {
        InfoShow("手机号码不能为空!");
        return false;  
    } 
    if (!$("#person-info").val() || ($("#person-info").val() === PersonInfo)) {
        InfoShow("个人介绍不能为空!");
        return false; 
    }
        
    var length = $(".textarea").length;
    //to do check fileupload 
    var isNull = false;
    for (var i = 0; i < length; i++) {
        var oNode = $(".textarea")[i];
        if (oNode.getAttribute("id")=="img-info") continue;
        if (oNode.innerHTML == "") {
            isNull = true;
            break;
        }
        //to do check img-info length 
        if (getByteLen(oNode.innerHTML) < 10) {
            InfoShow("图片说明内容太短了!");
            return false;
        }
    }
    if (isNull) {
        InfoShow("图片说明不能为空!");
        return false;
    }
    //to do check person-info length 
    if (getByteLen($("#person-info").val()) < 10) {
        InfoShow("个人介绍内容太短了!");
        return false;
    }
    //to do check image upload 
    if (!$('#fileList').find('img').attr("src")) {
        InfoShow("请上传图片!");
        return false;
    }
    //submit sucess 
    InfoShow("提交成功!");

    var ajax_option = {
        type:"post",
        target: "#testForm",
        url: "http://mmilai.com/shopmp/signup.ok.asp",//默认是form action
        resetForm: true,
        timeout: 5000,
        success: function (data) {
            alert(1);
        },
        error: function () {
              
            $('#testForm').resetForm();
            $('#fileList').html(""); 
            //alert(2);
        }
    };
    $('#testForm').ajaxSubmit(ajax_option);
}

$(document).ready(function () {
    "use strict";
    $("#phonenumber").blur(function () {
        var myreg = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        var inpVal = $(this).val();
        if (!myreg.exec(inpVal)) {
            alert('请输入正确的手机号');
        }
    });
});
 
//获取字符长度
function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null){ 
            len += 2;
        }else{
            len += 1;
        }
    }
    return len;
}
//显示提示框
function InfoShow(title){
	$("#InfoDialog").show();
	$("#InfoDialog").text(title);
    $("#InfoDialog").fadeOut(5000 ); 
}  
//设置上传图片后的文本框焦点
function setFocus(obj,sId) {
    var editor = document.getElementById(sId);
    obj.setFocus = window.setTimeout(function () {
        var sel, range;
        
        if (window.getSelection && document.createRange) {
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(true);
            range.setEnd(editor, editor.childNodes.length);
            range.setStart(editor, editor.childNodes.length);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return;
        }
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(editor);
            range.collapse(true);
            range.select();
        }
    }, 1);
    $('#' + sId).trigger("focus");
}

var BASE_URL = "../webuploader";
// 图片上传
jQuery(function() {
    var $ = jQuery,
        $list = $('#fileList'),
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,

        // Web Uploader实例
        uploader;

        // 初始化Web Uploader
         uploader = WebUploader.create({

        // 自动上传。
        auto: true,

        // swf文件路径
        swf: BASE_URL + '/js/Uploader.swf',

        // 文件接收服务端。
        server: 'http://webuploader.duapp.com/server/fileupload.php',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',

        // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });
    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        if ($('.error').prev('.textarea').html() == '') {
            $('.textarea').eq($('.textarea').length-1).hide();
        }
        $('.file-item').find('img').click(function () {
            var sName = $(this).attr("name");
            if ($(this).parent().find('.textarea').length ==1) {
                var $li = $('<div class="textarea" id="_'+sName+'" contenteditable="true" style="text-align:left;"></div>');
                $(this).parent().append($li);
                setFocus($li,"_"+sName);
            }
        });
         
        var $li = $(
                '<div id="' + file.id + '" class="file-item" style="text-align:left;">' +
                    '<img style="display:block;margin:0 auto;" name="im'+file.id+'">' +
                   // '<div class="info">' + file.name + '</div>' +
                '<div class="textarea" contenteditable="true" id="tx'+file.id+'" style="text-align:left;"></div></div>'
                );
                
           $img = $li.find('img');
           $list.append($li);
        setFocus($li,"tx"+file.id);
        // 创建缩略图
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                    .appendTo( $li )
                    .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).addClass('upload-state-done');
    });

    // 文件上传失败，现实上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');
        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }
      // $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });
});