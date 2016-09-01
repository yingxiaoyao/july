//点击使用优惠码
var $usePrivilegeA = $('.use-privilege');
var $usePrivilegeDiv = $('.use-privilege-info');
$usePrivilegeA.click(function(){

    var $icon = $usePrivilegeA.children('i').attr('class');
    if($icon == 'icon-down') {
        $usePrivilegeA.children('i').attr('class','icon-up');
    }else {
        $usePrivilegeA.children('i').attr('class','icon-down');
    }

    if($usePrivilegeDiv.css('display')=='none'){
        $usePrivilegeDiv.css('display','block');
    }else {
        $usePrivilegeDiv.css('display','none');
    }

});

//验证优惠码
var $affirmPrivilege = $('#affirm-privilege');
var useState = false;
$affirmPrivilege.click(function(){
    //获取课程id
    var $cid = $('#coutseImg').attr('cid');
    var $privilegeCode = $('#privilege-code').val();
    if($.trim($privilegeCode)=='') {
        return false;
    }
   /* console.log($privilegeCode);*/
   if(!useState){
       $.get('http://localhost/pay/pay.php',{ c : $privilegeCode, s : 1, cid : $cid},function(json){
           /*console.log(json);*/
           var data = JSON.parse(json);
           if(data.errno == 0){
               $(".exempt-price").css('display','block');
               $('.exempt-error').css('display','none');
               $affirmPrivilege.html('取消使用').css('background','#bbb').hover(function(){
                   $(this).css('background','#bbb');
               },function(){
                   $(this).css('background','#bbb');
               });
               $('#privilege-code').attr('disabled','true');
               useState = true;
           }else {
               $('.exempt-error').css('display','block');
           }
       });
   }else {
       $.get('http://localhost/pay/pay.php',{c : $privilegeCode,s : 0},function(json){
           var data = JSON.parse(json);
           if(data.errno == 0) {
               $(".exempt-price").css('display','none');
               $('.exempt-error').css('display','none');
               $affirmPrivilege.html('确认使用').css('background','#18b4ed').hover(function(){
                   $(this).css('background','#2cc8f2');
               },function(){
                   $(this).css('background','#18b4ed');
               });
               $('#privilege-code').removeAttr('disabled');
               useState = false;
           }
       });
   }

});

// http://localhost/pay/get_user_info.php

//编辑信息
var $compile = $('#compile');
/*console.log($inputs);*/
$compile.click(function(){
    //console.log('.........');
    compileUserInfo(true);
    $.get('http://localhost/pay/get_user_info.php',function(data){
        var data = JSON.parse(data);
        //console.log(data);
        if(data.errno == 0){
            var userInfo = data.data;
            for(var i=0,length = $inputs.length;i<length;i++){
                if($($inputs[i]).attr('type')!='radio'){
                    var name = $($inputs[i]).attr('name');
                    $($inputs[i]).val(userInfo[name]);
                }else {
                    if($($inputs[i]).val() == userInfo[$($inputs[i]).attr('name')]) {
                        $($inputs[i]).attr('checked','true');
                        if($($inputs[i]).attr('name')=='iswork'){
                            workVal = userInfo[$($inputs[i]).attr('name')];
                            if(workVal==1){
                                $("#xuesheng-form").css('display','none');
                                $('#work-form').css('display','block');
                            }else {
                                $("#xuesheng-form").css('display','block');
                                $('#work-form').css('display','none');
                            }
                        }
                    }else {
                        $($inputs[i]).removeAttr('checked');
                    }
                }
            }
        }
        /*return false;*/
    });
});
//isWork
var $radioInline = $("input[name='iswork']");
for(let i = 0,length = $radioInline.length; i < length ; i++){
    $($radioInline[i]).click(function(){
        var workVal = $(this).val();
        /* console.log(workVal);*/
        if(workVal == 1){
            $("#xuesheng-form").css('display','none');
            $('#work-form').css('display','block');
        }else {
            $("#xuesheng-form").css('display','block');
            $('#work-form').css('display','none');
        }
    });
}

//保存表单
var $btnSaveForm = $('#form-save');
var $inputs = $('#applyInfoform').find('input');
$btnSaveForm.click(function(){
    var needInput = [];
    var parameter = {};

    for(var i =0 ,Ilength = $inputs.length ; i < Ilength ; i++) {
        if($($inputs[i]).attr('type')!=='radio') {
            needInput.push($inputs[i]);
        }else {
            if($($inputs[i]).attr('checked')) {
                needInput.push($inputs[i]);
            }
        }
    }
    console.log(needInput);
    for(let j = 0, Nlength = needInput.length; j< Nlength ; j++ ){
        var value = $(needInput[j]).val();
        var name = $(needInput[j]).attr('name');
        parameter[name] = value;
    }
    console.log(parameter);
    $.post('http://localhost/pay/data.php',parameter,function(json){
        var data = JSON.parse(json);
        if(data.errno != 0) {
            alert('');
        }
    });
    return false;
});

//提交订单
var $submitOrder = $('#submitOrder');
$submitOrder.click(function(){
    //获取购买课程 cid
    var $cid = $('#coutseImg').attr('cid');
    if($('#userName').html() == "") {
        alert('请完善个人信息');
        /* $('#myModal').modal({show:true});*/
        compileUserInfo(true);
        return;
    }
    $.post('http://localhost/pay/order.php',{cid : $cid},function(json){

    });
});

//选择支付方式
var $payZhifubao = $('.pay-zhifubao');
var $payWeixin = $('.pay-weixin');
//payment-way-selected
var $paymentWay = $('.payment-way>div');
var paymentWay;
for(let i=0,length = $paymentWay.length;i<length;i++){
    $($paymentWay[i]).click(function(){
        $(this).addClass('payment-way-selected');
        $(this).siblings('.payment-way-selected').removeClass('payment-way-selected');
        $(this).siblings().children('.pay-choose').css('display','none');
        $(this).children('.pay-choose').css('display','block');
        //alert($(this).attr('data-type'));
        paymentWay = $(this).attr('data-type');
    })
}


//支付
var btnPayment = $('#btn-payment');
btnPayment.click(function(){

  if(paymentWay == undefined) {
    alert('请选择支付方式');
    return;
  }
  //http://localhost/pay/paystatus.php
    $.get('http://localhost/pay/getorder.php',{t : paymentWay},function(json){
        let data = JSON.parse(json);
        if(data.errno == 0) {
          //取订单号
            var oid = data.data.oid;
            //console.log(oid);
            var intervalID = setInterval(function(){
                $.get('http://localhost/pay/paystatus.php',{oid : oid},function(json){
                    let data = JSON.parse(json);
                    //console.log(data);
                    if(data.errno == 0) {
                      clearInterval(intervalID);
                      if(data.data.status==1) {
                        window.location = data.data.redirect_url;
                      }else {
                        window.location = 'http://www.jd.com/';
                      }
                    }
                })
            },2000)
        }
    });

});

//优惠信息列表
var $privilegeInfoLeft = $('.privilege-info-left');
var $privilegeListLis = $('.privilege-list').children('li');
//console.log($privilegeListLis);
if($privilegeListLis.length <= 3 ) {
    $privilegeInfoLeft.css('height','280px');
}else {
    $privilegeInfoLeft.css('height','auto');
}


//显示个人信息表单
var $myModal = $('#myModal');
function compileUserInfo (isShow){
    $myModal.on('show.bs.modal',function(){
        $('#dalog').css('display','block');
    });
    $myModal.on('hide.bs.modal',function(){
        $('#dalog').css('display','none');
    });
    $myModal.modal({show:isShow});
}

//compileUserInfo(false);