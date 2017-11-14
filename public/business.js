console.log('business.js-- is --working');
console.log('***************************');
// IE 版本检测,IE9以下跳转到升级页面
if (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 9) {
    window.location.href = "http://www.w3school.com.cn/js/js_window_location.asp";
}

window.onload = function () {
    // 轮播图
    $('.carousel').carousel({
        interval: 1000
    });
    //  请求首页列表数据
    $.ajax({
        type: "GET",
        url: "/getHomePageList",
        data: {},
        async: true,
        dataType: "json",
        success: function (data) {
            var listData = {};
            var listJ = JSON.parse(data);
            if (listJ.status === '1') {
                listData = listJ;
                var strList = '';
                for (var j = 0; j < listData.list.length; j++) {
                    strList += '<div id="';
                    strList += listData.list[j].id;
                    strList += '" class="col-lg-3 col-lg-offset-1">';
                    strList += '<a href="/detail?id=';
                    strList += listData.list[j].id;
                    strList += '"><img src="http://127.0.0.1:3000/';
                    strList += listData.list[j].coverPicURL;
                    strList += '" alt=""></a></div>';
                }
                $('#list_1').html(strList);
            } else {
                var strNote = '暂无数据';
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('首页请求err---XMLHttpRequest.status---' + XMLHttpRequest.status);
            console.log('首页请求err---XMLHttpRequest.readyState---' + XMLHttpRequest.readyState);
            console.log('首页请求err---textStatus---' + textStatus);
        }
    });
    // 跳转到对应的列表页
    $.ajax({
        type: "GET",
        url: "/getDetail",
        data: {
            id: getQueryString('id')
        },
        async: true,
        dataType: "json",
        success: function (data) {
            var detailData = {};
            var detailJ = JSON.parse(data);
            if (detailJ.status === '1') {
                detailData = detailJ;
            } else {
                var strNote = '暂无数据';
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('详情页请求err---XMLHttpRequest.status---' + XMLHttpRequest.status);
            console.log('详情页请求err---XMLHttpRequest.readyState---' + XMLHttpRequest.readyState);
            console.log('详情页请求err---textStatus---' + textStatus);
        }
    });

    // 注册弹窗
    // 验证状态对象
    var registerStatus = {
        username: '1',
        psw1: '',
        psw2: '',
        ok: false
    }
    // 注册校验-输入用户名
    $('#RegisterUseName').keyup(function () {
        var _this = this;
        var username = $(this).val();
        var note = $(this).siblings('.note');
        var ok = $(_this).siblings('.glyphicon-ok');
        if (username.length < 6) {
            note.text('用户名不少于6个字符');
            note.fadeIn();
            ok.hide();
        } else {
            $.ajax({
                type: 'POST',
                url: '/UserNameCheckR',
                data: {
                    username: username
                },
                dataType: 'json',
                success: function (data) {
                    var Data = JSON.parse(data);
                    if (Data.status === '-1') {
                        note.text('此用户名被占用！');
                        note.fadeIn();
                        ok.hide();
                    } else if (Data.status === '-3') {
                        note.text('网络错误，请重试~');
                        note.fadeIn();

                    } else if (Data.status === '1') {
                        ok.fadeIn();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {}
            })
            note.hide();
        }
    });

    // 注册校验-第一次输入密码
    /**
     * 
     */
    $('#RegisterPSW1').keyup(function () {
        var _this = this;
        var psw1 = $(this).val();
        var note = $(this).siblings('.note');
        var ok = $(this).siblings('.glyphicon-ok');
        if (psw1.length < 6) {
            note.text('密码不能小于6位');
            note.fadeIn();
            ok.hide();
        } else {
            note.hide();
            ok.fadeIn();
        }
    })
    // 注册校验-第二次输入密码
    $('#RegisterPSW2').keyup(function () {
        var _this = this;
        var psw1 = $('#RegisterPSW1').val();
        var psw2 = $(this).val();
        var note = $(this).siblings('.note');
        var ok = $(this).siblings('.glyphicon-ok');
        if (psw1 === psw2) {
            note.hide();
            ok.fadeIn();
        } else {
            note.text('两次密码不一致');
            note.fadeIn();
            ok.hide();
        }
    })



    // 注册校验-点击注册按钮
    function doRegister() {
        var username = $('#RegisterUseName').val();
        var password1 = $('#RegisterPSW1').val();
        var password2 = $('#RegisterPSW2').val();
        /**
         * 用户名长度是否合格
         * 用户名是否存在实时提示 keyDown
         * 密码长度是否合格
         * 密码不允许有空格
         * 两次密码是否一致
         */
        // 注册校验通过
        if (password1 === password2) {
            $('.registerBtn').addClass('bg_ok');
            $.ajax({
                type: 'POST',
                url: '/doRegister',
                data: {
                    username: username,
                    password: password1
                },
                async: true,
                dataType: 'json',
                success: function (data) {
                    var registerJData = {};
                    var registerJ = JSON.parse(data);
                    console.log(registerJ)
                    if (registerJ.status === '1') {
                        registerJData = registerJ;
                        $('#showName a').text('欢迎您,' + registerJ.username + '!').show();
                        $('#signOut').show();
                        $('.registerPop').hide();
                        $('#topRegister').hide();
                        $('#topLogin').hide();
                        setCookie('username',username,1);
                        setCookie('password',password1,1);
                        history.go(0);
                    } else if (registerJ.status === '-1') {
                        $('#RegisterPSW1').siblings('.note').text('用户名被占用！').addClass('zoomOut');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {}

            })
        } else {
            // 注册校验不通过

        }
    }
    $('#topRegister').on('click', function () {
        $('.registerPop').fadeIn();
    })
    // 注册校验--点击注册按钮
    $('.registerBtn').on('click', function () {
        var username = $('#RegisterUseName').val();
        var password1 = $('#RegisterPSW1').val();
        var password2 = $('#RegisterPSW2').val();
        if (username === '') {
            var note = $('#RegisterUseName').siblings('.note');
            var ok = $('#RegisterUseName').siblings('.glyphicon-ok');
            note.text('用户名不能为空');
            note.fadeIn();
            ok.hide();
            return;
        }
        if (password1 === '') {
            var note = $('#RegisterPSW1').siblings('.note');
            var ok = $('#RegisterPSW1').siblings('.glyphicon-ok');
            note.text('密码不能小于6位');
            note.fadeIn();
            ok.hide();
            return;
        }
        if (!(password1 === password2)) {
            var note = $('#RegisterPSW2').siblings('.note');
            var ok = $('#RegisterPSW2').siblings('.glyphicon-ok');
            note.text('两次密码不一致');
            note.fadeIn();
            ok.hide();
            return;
        }
        doRegister();
    });
    // 点击退出
    $('#signOut').on('click', function () {
        // alert(1);
        clearCookie('username');
        clearCookie('password');
        $('#topLogin').show();
        $('#topRegister').show();
        $('#showName').hide();
        $('#signOut').hide();
        history.go(0);
    });

    // 点击“我有账号”
    $('.hasAccountWrap').on('click',function () {
        $(this).parents('.registerPop').hide();
        $('.loginPop').fadeIn();
    })
    // 点击“没有账号”
    $('.hasNotAccountWrap').on('click',function () {
        $(this).parents('.loginPop').hide();
        $('.registerPop').fadeIn();
    });

    $('#LoginUseName').blur(function() {
        var username = $(this).val();
        var _this = this;
        $.ajax({
            type : 'GET',
            url : '/checkLoginAccount',
            data : {
                'username' : username
            },
            success : function(data) {
                var loginJData = {};
                var loginJ = JSON.parse(data);
                console.log(loginJ)
                if(loginJ.status === '-2') {
                    $(_this).siblings('.note').text('用户名未注册，请检查！').fadeIn();
                }else if(loginJ.status === '-3') {
                    $(_this).siblings('.note').text('服务器错误').fadeIn();
                }
            }

        });
    });

































    /**
     * 
     * 公用函数
     * 公用函数
     * 公用函数
     * 公用函数
     */
    // 取url中的参数值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    // 设置cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    //获取cookie
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
    //清除cookie 
    function clearCookie(name) {
        setCookie(name, "", -1);
    }
    // 检查cookie
    function checkCookie() {
        var user = getCookie("username");
        if (user != "") {   
            // alert(user)
            $('#showName a').text('欢迎您,' + user + '!').show();
            $('#signOut').show();
            $('#topLogin').hide();
            $('#topRegister').hide();
            $('.registerPop').hide();
        } 
        // else {
        //     user = prompt("Please enter your name:", "");
        //     if (user != "" && user != null) {
        //         setCookie("username", user, 365);
        //     }
        // }
    }
    checkCookie();

}