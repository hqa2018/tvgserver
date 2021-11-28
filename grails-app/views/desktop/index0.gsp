<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title><g:pageTitle/></title>
    %{--<link rel="shortcut icon" href="${request.getContextPath()}/static/assets/images/icons/favicon.ico"/>
    <link rel="bookmark" href="${request.getContextPath()}/static/assets/images/icons/favicon.ico"/>--}%
    <script type="text/javascript" src="${request.getContextPath()}/static/desktop/js/jquery-1.7.1.min.js"></script>
    %{--<script type="text/javascript" src="../js/jquery-2.1.1.min.js"></script>--}%
    <script type="text/javascript" src="${request.getContextPath()}/static/desktop/js/myLib.js"></script>
    <script type="text/javascript" src="${request.getContextPath()}/static/js/me-cookies.js"></script>
    <script type="text/javascript">
        //如果后台有actAction数据，执行重定向
        $(function () {
            //setPerson();
            myLib.progressBar();

            initialization();
            $('#logout').click(function () {
                window.open("../logout", '_self');
            })
            $('#login').click(function () {
                window.open("../login", '_self');
            })

            $('#app0').click(function () {
                window.open("../seiuser/list", '_blank');		//点击系统配置从新页面跳转
            })
            $('#app2').click(function () {
                window.open(seishareUrl + "/basicData/network", '_blank');		//点击系统配置从新页面跳转
            })


            $('#onduty_btn').on('click', function () {
                $.ajax({
                    url: "${request.getContextPath()}/static/desktop/judgeSpecialdutyExist",
                    type: "post",
                    data: {
                        "userName": document.getElementById("seiuser").value
                    },
                    dataType: "text",
                    error: function (xhr, status, error) {
                        console.log(error);
                    },
                    success: function (resp) {
                        if (resp == "success") {
                            document.getElementById("specialdutyButton").value = "0";
                            document.getElementById("specialdutyButton").innerHTML = "取消保存";
                        } else {
                            document.getElementById("specialdutyButton").value = "1";
                            document.getElementById("specialdutyButton").innerHTML = "保存";
                        }
                    }
                })
                $('#onDuty').css({'z-index': 999999999})
            });

            $("#manNetwork").val('${manCode}');
            //部门选项如果不是空字符则表示当前角色到部门
            if ($("#mgcNetwork").html() == "")
                mgcNetwork('${manCode}');

            // $('#config_btn').on('click',function(){
            // 	$('#config_inc').css({'z-index':999999999});
            // });

            $("#manNetwork").change(function () {
                var manCode = $(this).val();
                mgcNetwork(manCode);
            });

            window.onunload = save;

        });

        function mgcNetwork(manCode) {
            $.ajax({
                type: 'post',
                url: '/static/desktop/getMgcNetworkList',
                data: {manCode: manCode},
                dataType: 'json',
                success: function (resp) {
                    $("#mgcNetwork").empty();
                    $("#mgcNetwork").append("<option value='' >全部门</option>")

                    var selected = ""
                    $.each(resp, function (i, item) {
                        if (item.mNetCode == '${mNetCode}')
                            selected = "selected";
                        else
                            selected = "";

                        $("#mgcNetwork").append("<option value='" + item.mNetCode + "'" + selected + " >"
                            + item.nNetName + "</option>");

                    });
                }
            });
        }

        function saveConifg() {
            console.info("saveConifg()");
            var manCode = $("#manNetwork").val();
            var mNetCode = $("#mgcNetwork").val();
            var timer = new Date().getTime();
            $.ajax({
                type: 'post',
                url: '/static/desktop/setNetworkSession?timer=' + timer,
                data: {
                    manCode: manCode,
                    mNetCode: mNetCode
                },
                dataType: 'text',
                success: function (resp) {
                    location.reload()
                    //location.href = location.href;
                }
            });
        }

        function initialization() {//初始化桌面图标元素
            var timer = new Date().getTime();
            $.ajax({
                type: 'post',
                url: '/static/desktop/getDestopConfig',
                datatype: 'json',
                success: function (resp) {
                    console.info(resp)
                    if (resp != 'none') {
                        var configList = resp.configList;
                        var unread = configList[0].allcount;
                        var unread_a = configList[0].allcount_a;
                        //console.info("unread = " + unread)
                        if (configList.length > 0) {
                            configList.sort((value1, value2) => (value1.ID == undefined ? 0 : Number(value1.ID)) - (value2.ID == undefined ? 0 : Number(value2.ID)))
                            $('.desk1,.desk2,.desk3,.desk4').empty();
                            for (var j = 0; j < configList.length; j++) {
                                var p = configList[j].pagenumber;
                                var div = "desk" + p;
                                var iconLi;
                                if (configList[j].ID == 1029 || configList[j].iconName == "台网维护") {
                                    if (unread == 0) {
                                        console.info("unread == 0")
                                        iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon"><img src="' +
                                            configList[j].iconUrl + '" /></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                    } else {
                                        if (unread > 99) {
                                            console.info("unread == 99")
                                            iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon"><img src="' +
                                                configList[j].iconUrl + '" /><i class="unread allunread">99+</i></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                        } else {
                                            console.info("unread <= 99")
                                            iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon" style="position:relative;"><img src="' +
                                                configList[j].iconUrl + '" /><i class="unread allunread" >' + unread + '</i></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                        }
                                    }
                                } else if (configList[j].iconName == "台站维护") {
                                    if (unread_a == 0) {
                                        console.info("unread_a == 0")
                                        iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon"><img src="' +
                                            configList[j].iconUrl + '" /></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                    } else {
                                        if (unread_a > 99) {
                                            console.info("unread_a == 99")
                                            iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon"><img src="' +
                                                configList[j].iconUrl + '" /><i class="unread allunread_c">99+</i></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                        } else {
                                            console.info("unread_a <= 99")
                                            iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon" style="position:relative;"><img src="' +
                                                configList[j].iconUrl + '" /><i class="unread allunread_c" >' + unread_a + '</i></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                        }
                                    }
                                } else {
                                    iconLi = '<li class="desktop_icon" id="' + configList[j].ID + '"><span class="icon"><img src="' +
                                        configList[j].iconUrl + '" /></span><div class="text">' + configList[j].iconName + '<s></s></div></li>';
                                }
                                $('.' + div).append(iconLi);
                            }
                        }
                    } else {
                        $('.desk1,.desk2,.desk3,.desk4').empty();
                    }
                }
            });
        }

        //获取用户名的select标签
        function setPerson() {
            $.ajax({
                type: "get",
                url: "../mlogCenterDuty/getAllSeiuser",
                data: {},
                dataType: "json",
                error: function () {
                    console.log("获取人员失败！")
                },
                success: function (resp) {
                    var seiuser = $("#seiuser").val();
                    for (var i = 0; i < resp.length; i++) {

                        if (resp[i].username == seiuser) {
                            $("#r_person").append("<option selected value='" + resp[i].username + "'>" + resp[i].userRealName + "</option>")
                        } else {
                            $("#r_person").append("<option value='" + resp[i].username + "'>" + resp[i].userRealName + "</option>")
                        }

                    }
                }

            })
            var seiuser = $("#seiuser").val();
            $("#r_person").val("cdcgl");
        }

        function refresh() {
            myLib.progressBar();
            //初始化数据
            initialization();

            myLib.stopProgress();
            //异步初始化应用链接
            $.ajax({
                type: 'post',
                url: '../desktop/getdeskIconData',
                datatype: 'json',
                success: function (resp) {
                    var icons = resp.icons;
                    var deskIconData = {};
                    if ('none' != resp) {
                        for (var i = 0; i < icons.length; i++) {
                            deskIconData[icons[i].id] = icons[i];
                            delete deskIconData[icons[i].id].id;
                        }
                    }
                    myLib.desktop.deskIcon.init(deskIconData);//初始化桌面图标
                    //myLib.desktop.winWH();// 更新窗口大小数据
                    //存储桌面布局元素的jquery对象
                    //myLib.desktop.desktopPanel();
                    //初始化图标桌面
                    //myLib.desktop.deskIcon.init();
                    //初始化任务栏
                    //myLib.desktop.taskBar.init();
                    //初始化桌面导航栏
                    //myLib.desktop.navBar.init();
                }
            });
        }

        var pageWidth = window.innerWidth;
        if (pageWidth > 1900)
            $.include(['/static/desktop/css/desktop-1900.css']);
        else
            $.include(['/static/desktop/css/desktop.css']);

        $.include(['/static/desktop/css/jquery-ui-1.8.18.custom.css',
            '/static/desktop/css/smartMenu.css', '/static/desktop/js/jquery-ui-1.8.18.custom.min.js',
            '/static/desktop/js/jquery.winResize.js', '/static/desktop/js/jquery-smartMenu-min.js',
            '/static/desktop/js/desktop.js']);
        $(window).load(function () {
            myLib.stopProgress();
            $.get("${request.getContextPath()}/static/desktop/getRootPath", {}, function (resp) {
                // alert("设置成功")
                $("#rootPath").val(resp);
            });

            $('#NoteDiv').hide();
            $("#sitting_btn").on('click', function () {
                // alert("系统设置")
                $('#NoteDiv').show();
                $('#NoteDiv').css({'z-index': 999999999})
                $('#NoteContent').focus();
                // $('#NoteDiv').css({'z-index':999999999})
            });

            var lrBarIconData = {
                //	'app0' : {
                //		'title' : '用户参数配置',
                //		'url' : '../seiuser/list',//'../dashboard/mapindex',
                //		'winWidth' : 1048,
                //		'winHeight' : 580
                //	},
                'app1': {
                    'title': '我的订阅',
                    'url': '/static/desktop/setPage',
                    'winWidth': 594,
                    'winHeight': 605
                },
                //	'app2' : {
                //		'title' : '系统参数配置',
                //		'url' : seishareUrl+'/basicData/network',
                //		'winWidth' : 1048,
                //		'winHeight' : 580
                //	}
            };
            var deskIconData = {
                'station-1': {
                    'title': '汕尾红海湾台',
                    'url': '../seisearch/stationinfo?manCode=GD&staCode=SWHHW&observeType=1',
                    'winWidth': 950,
                    'winHeight': 500
                },
                'hudong': {
                    'title': '互动百科',
                    'url': '../dashboard/mapindex',
                    'winWidth': 950,
                    'winHeight': 500
                },
                'dashboard-index': {
                    'title': '主页',
                    'url': '../dashboard/mapindex',
                    'winWidth': 950,
                    'winHeight': 500
                },
                'MonoSt': {
                    'title': 'MonoSt',
                    'url': '../monitor/tde',
                    'winWidth': 942,
                    'winHeight': 547
                },

                'wincom': {
                    'title': 'WinCom',
                    'url': '../monitor/mr2002',
                    'winWidth': 942,
                    'winHeight': 547
                }


            };
            //存储桌面布局元素的jquery对象
            myLib.desktop.desktopPanel();
            //初始化桌面背景
            //myLib.desktop.wallpaper.init("${request.getContextPath()}/static/desktop/images/blue_glow.jpg");

            var bgImgUrl = '${bgImgUrl}'

            var hostport = document.location.host;
            var hostIp = hostport.split(":")[0]
            myLib.desktop.wallpaper.init("${request.getContextPath()}/static/images/bg_CN.jpg");
            //myLib.desktop.wallpaper.init("../images/bg_CN.jpg");
            //初始化任务栏
            myLib.desktop.taskBar.init();
            //初始化桌面图标对应属性
            var timer = new Date().getTime();
            $.ajax({
                type: 'post',
                url: '/static/desktop/getdeskIconData?timer=' + timer,
                datatype: 'json',
                success: function (resp) {
                    var icons = resp.icons;
                    var deskIconData = {};
                    var deskIconData1 = {
                        'monitor-environmental': {
                            'title': '实时监控',
                            'url': '../monitor/mapindex?reload=true',
                            'winWidth': 950,
                            'winHeight': 500
                        },

                        'seisearch-data': {
                            'title': '基础数据',
                            'url': '../seisearch/index',
                            'winWidth': 950,
                            'winHeight': 500
                        },
                        'mlog-center': {
                            'title': '台网维护',
                            'url': '../mlogCenter/center?observeType=1',
                            'winWidth': 950,
                            'winHeight': 500
                        },

                        'mlog-station': {
                            'title': '台站维护',
                            'url': '../mlogStation/station?observeType=1',
                            'winWidth': 950,
                            'winHeight': 500
                        },
                        'instrument-data': {
                            'title': '设备管理',
                            'url': '../instrumentProduct/list',
                            'winWidth': 950,
                            'winHeight': 500
                        }
                    };
                    if ("none" != resp) {
                        for (var i = 0; i < icons.length; i++) {
                            deskIconData[icons[i].id] = icons[i];
                            delete deskIconData[icons[i].id].id;
                        }
                    }
                    myLib.desktop.deskIcon.init(deskIconData);

                }
            });
            //初始化桌面导航栏
            myLib.desktop.navBar.init();
            //初始化侧边栏
            myLib.desktop.lrBar.init(lrBarIconData);
            //欢迎窗口
            /*myLib.desktop.win.newWin({
                WindowTitle : '欢迎窗口',
                iframSrc : "../login/auth",
                WindowsId : "welcome",
                WindowAnimation : 'none',
                WindowWidth : 1142,
                WindowHeight : 571
            });*/

            var deskIconData1 = {
                'monitor-environmental': {
                    'title': '实时监控',
                    'url': '../monitor/realtime',
                    'winWidth': 950,
                    'winHeight': 500
                },

                'seisearch-data': {
                    'title': '基础数据',
                    'url': '../seisearch/index',
                    'winWidth': 950,
                    'winHeight': 500
                },
                'mlog-center': {
                    'title': '台网维护',
                    'url': '../mlogCenter/center?observeType=1',
                    'winWidth': 950,
                    'winHeight': 500
                },

                'mlog-station': {
                    'title': '台站维护',
                    'url': '../mlogStation/station?observeType=1',
                    'winWidth': 950,
                    'winHeight': 500
                },
                'instrument-data': {
                    'title': '设备管理',
                    'url': '../instrumentProduct/list',
                    'winWidth': 950,
                    'winHeight': 500
                }
            };

            myLib.desktop.deskIcon.init(deskIconData1);

        });
        /*时钟*/
        //setInterval(function(){$(".powered_by").html(current)},1000)
        function current() {
            var d = new Date(), str = '';
            str += d.getFullYear() + '年'; //获取当前年份
            str += d.getMonth() + 1 + '月'; //获取当前月份（0——11）
            str += d.getDate() + '日';
            str += d.getHours() + '时';
            str += d.getMinutes() + '分';
            //str +=d.getSeconds()+'秒';
            return str;
        }

        /*便签*/
        function bianqian() {

            //当用户自行关闭浏览器时，为防止数据失丢，自动实现保存
            window.onunload = save;
        }

        function SetCookie(name, value) {//两个参数，一个是cookie的名子，一个是值
            var exp = new Date();    //new Date("December 31, 9998");
            exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }

        function getCookie(name) {//取cookies函数
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return null;
        }

        //保存涵数
        function save() {
            var rootPath = $("#rootPath").val();
            if (rootPath != '' || rootPath != null) {
                $.post("${request.getContextPath()}/static/desktop/setRootPath", {path: $("#rootPath").val()}, function () {
                    alert("设置成功");
                    $('#NoteDiv').hide();
                })
            }
        }

        //清空涵数
        function clear1() {
            $('#NoteContent').val('');
            save()
        }
    </script>
    <style type="text/css">
    .unread {
        width: 25px;
        height: 25px;
        line-height: 25px;
        font-size: 100%;
        font-style: normal;
        color: #fff;
        text-align: center;
        background-color: #f00;
        border-radius: 50%;
        position: absolute;
        right: -1px;
        top: -1px;
    }
    </style>
</head>

<body>
<input id="seiuser" value="${seiuser}" style="display:none"/>

<div id="NoteDiv" style="position:absolute;top:240px;right:10px;">
    <div id="YhNote"
         style="text-align:center;width:180px;height:100px;font-size:14px;font-weight:bold;background:#fff;border:solid 1px #69C;">
        <div style="background:#69C;width:180px;height:20px;border-bottom:solid 1px #ccc;margin-bottom:2px;">
            <span style="float:left;display:block;font-family:'宋体';width:180px;padding:2px 0 2px 0;color:#FFFFFF;">服务参数路径</span>
        </div>
        <input id="rootPath" style="width:170px;height:auto;border:solid 1px #69f;"></input>

        <div style="padding:4px;">
            <input type="button" onclick="save()" value="保存" style="padding: 0 10px;"/>
        </div>
    </div>
</div>

<div id="onDuty" style="position:absolute;top:240px;right:10px;">
    <div id="YhonDuty"
         style="display:none;text-align:center;width:210px;height:160px;font-size:14px;font-weight:bold;background:#fff;border:solid 1px #69C;">
        <div style="background:#69C;width:210px;height:25px;border-bottom:solid 1px #ccc;margin-bottom:2px;">
            <span style="float:left;display:block;font-family:'宋体';width:180px;padding:2px 0 2px 0;color:#FFFFFF;">今天我值班</span>
        </div>

        <div style="height:calc(100% - 27px)">
            <div style="position: absolute;transform: translate(0%, -50%);margin:0 auto;left:0;right:0;top:50%">
                <div style="width:38%;float:left;">
                    <span style="padding-left: 12px; font-weight: 900;">用户名：</span>
                </div>

                <div style="width:60%;float:left;">
                    %{--<select style="text-align:center;width: 100%;height: 25px;" name="r_person" id="r_person">
                        <option selected="selected" value='${seiuser}'><g:loggedInUserInfo
                                field="userRealName"/></option>
                    </select>--}%
                </div>
            </div>
        </div>

        <div class="" style="position:absolute;left:75px;top:120px;">
            <button id="specialdutyButton" value="" style="padding: 0 10px;" onclick="saveOnDuty()">保存</button>
        </div>

        <div style="font-size:12px;border:0;width:120px;height:14px;padding-left:30px;" title=""></div>
    </div>
</div>


<!--	<iframe id="weather_inc" style="position: absolute;right: 20px;display:none;border-width:0;padding:20px 10px 0 0;"
	width="420" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="http://i.tianqi.com/index.php?c=code&id=12&color=%23FFFFFF&icon=1&num=3"></iframe>
	-->


%{--<ul><li class="powered_by">欢迎：<g:loggedInUserInfo field="userRealName" /><br /><g:leftTopTitle /></li></ul>--}%

<div id="wallpapers"></div>

<div id="navBar">
    <a href="#" class="currTab" title="桌面1"></a><a href="#" title="桌面2"></a><a
        href="#" title="桌面3"></a><a href="#" title="桌面4"></a>
</div>


<div id="desktopPanel">
    <div id="desktopInnerPanel" class="ui-draggable">
        <ul class="deskIcon currDesktop desk1 ui-draggable">
            <li class="desktop_icon ui-draggable" id="monitor-environmental"><span class="icon"><img
                    src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon47.png" /></span>
                <div class="text">
                    环境监控<s></s>
                </div></li>

            <li class="desktop_icon ui-draggable" id="seisearch-data"><span class="icon"><img
                    src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon47.png" /></span>
                <div class="text">
                    基础数据<s></s>
                </div></li>
        <%--<g:if test="${mNetCode}">
    
        </g:if>
        <g:else>
            <li class="desktop_icon" id="monitor-environmental"><span class="icon"><img
                    src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon47.png" /></span>
            <div class="text">
                    环境监控<s></s>
                </div></li>
    
            <li class="desktop_icon" id="seisearch-data"><span class="icon"><img
                src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon47.png" /></span>
            <div class="text">
                基础数据<s></s>
            </div></li>
            <li class="desktop_icon" id="mlog-center"><span class="icon"><img
                src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon21.png" /></span>
            <div class="text">
                台网维护<s></s>
            </div></li>
            <li class="desktop_icon" id="mlog-station"><span class="icon"><img
                src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon22.png" /></span>
            <div class="text">
                台站维护<s></s>
            </div></li>
            <li class="desktop_icon" id="instrument-data"><span class="icon"><img
                src="${request.getContextPath()}/static/desktop/icon/appicon/td-icon20.png" /></span>
            <div class="text">
                设备管理<s></s>
            </div></li>
        </g:else>
        --%></ul>

        <ul class="deskIcon desk2">
            <!-- <li class="desktop_icon add_icon"><span class="icon"><img
						src="${request.getContextPath()}/static/desktop/images/add_icon.png" /></span>
				<div class="text">
						添加<s></s>
					</div></li> -->
        </ul>
        <ul class="deskIcon desk3">
            <!--  	<li class="desktop_icon add_icon"><span class="icon"><img
						src="${request.getContextPath()}/static/desktop/images/add_icon.png" /></span>
				<div class="text">
						添加<s></s>
					</div></li>-->
        </ul>
        <ul class="deskIcon desk4">
            <!-- <li class="desktop_icon add_icon"><span class="icon"><img
						src="${request.getContextPath()}/static/desktop/images/add_icon.png" /></span>
				<div class="text">
						添加<s></s>
					</div></li> -->
        </ul>
    </div>
</div>
<!--desktopPanel end-->

<div id="taskBarWrap">
    <div id="taskBar">
        <div id="leftBtn">
            <a href="#" class="upBtn"></a>
        </div>

        <div id="rightBtn">
            <a href="#" class="downBtn"></a>
        </div>

        <div id="task_lb_wrap">
            <div id="task_lb"></div>
        </div>
    </div>
</div>
<!--taskBarWrap end-->

<div id="lr_bar" style="top:160px;">
    <div id="start_block">
        <a title="退出" id="start_btn"></a>

        <div id="start_item">
            <ul class="item admin">
                <li><span class="adminImg"></span> </li>
            </ul>
            <ul class="item ">
                <li id="sitting_btn"><span class="sitting_btn"></span>系统设置</li>
            <!-- 	<li><span class="home_btn"></span>进入首页</li>
					<li><span class="sitting_btn"></span>系统设置</li>
					<li><span class="help_btn"></span>使用指南 <b></b></li>
					<li><span class="about_btn"></span>关于我们</li>
					<li id="logout"><span class="logout_btn"></span>退出系统</li>-->
                <li id="login"><span class="login_btn"></span>登录系统</li>
            </ul>
        </div>
    </div>
</div>
<!--lr_bar end-->
<div class="toggle-content-open clearfix hidden">
    <div id="g10" class="small-gauge float-left"></div>

    <div id="g11" class="small-gauge float-right"></div>
</div>
</body>
</html>