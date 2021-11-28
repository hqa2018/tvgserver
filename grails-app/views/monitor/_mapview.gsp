<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>振动监测系统</title>
    %{--<link rel="Shortcut Icon" href="${request.getContextPath()}/static/assets/images/icons/apple-touch-icon-144-precomposed.png">--}%
    <!--设置是否为缩放模式 -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" type="text/css" href="https://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.css">
    <link href="${request.getContextPath()}/static/js/mapselect/css/mapTypeSelect.css?t=017" rel="stylesheet">
    <link href="${request.getContextPath()}/static/css/olmap.css?t=018" rel="stylesheet">
    <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
    <script src="${request.getContextPath()}/static/js/warning/jquery.min.js"></script>
    <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
    <script src="${request.getContextPath()}/static/js/warning/bootstrap.min.js"></script>
    <!-- 引入 echarts.js -->
    <script src="https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js"></script>
    <!--界面样式-->
    <script src="${request.getContextPath()}/static/js/utils.js"></script>
    <script src="${request.getContextPath()}/static/js/mapselect/js/mapTypeSelect.js?t=018"></script>
    %{--<script src="${request.getContextPath()}/static/js/warning/terminalInfo.js"></script>--}%
    <link rel="stylesheet" type="text/css" href="${request.getContextPath()}/static/css/warning/mapview.css">
    <link rel="stylesheet" type="text/css" href="${request.getContextPath()}/static/css/warning/button.css">
    <link rel="stylesheet" type="text/css" href="${request.getContextPath()}/static/css/map.css">
    <link rel="stylesheet" type="text/css" href="${request.getContextPath()}/static/css/index.css">
    <style>
    .info-table tr td {
        padding: 8px;
        border: 1px solid #545454;
    }

    .info-table input {
        background: #0d2a45;
        border: 0px solid #000;
        width: 280px;
    }

    .divset_close:hover {
        cursor: pointer;
    }

    #staCodeInfoTable input {
        background: #0d2a45;
        border: 0px solid #000;
        width: 280px;
    }

    </style>
</head>
<body class="ksh">
%{--系统设置--}%
<ul class="nav">
    <li class="drop-down">
        <a href="#"></a>
        <ul class="drop-down-content">
            %{--<li>
                <a href="#" id="alarm_bat">设置报警</a>
            </li>--}%
            <li>
                <a href="./mapview">地图监测</a>
            </li>
            <li>
                <a href="./realtime">实时监控</a>
            </li>
        </ul>
    </li>
</ul>
<input hidden class="manCodeLon" value="${manCodeLon}"/>
<input hidden class="manCodeLat" value="${manCodeLat}"/>
<input hidden class="manCode" value="${session.manCode}"/>
<div id="load">
    <div class="load_img"><!-- 加载动画 -->
        <img class="jzxz1" src="${request.getContextPath()}/static/images/warning/jzxz1.png">
        <img class="jzxz2" src="${request.getContextPath()}/static/images/warning/jzxz2.png">
    </div>
</div>
<div class="head_top">
    <img class="img-responsive" src="${request.getContextPath()}/static/images/warning/jcdsj_logo.gif">
    <p>振动监测系统</p>
</div>
<div class="visual">
    <div class="visual_left">
        <div style="height: 60%" class="visual_box">
            <div class="visual_title">
                <span>监测设备</span>
                <img src="${request.getContextPath()}/static/images/warning/ksh33.png">
            </div>

            <div class="visual_chart sfzcll" id="mainq" style="height:96%;">
                %{--<div class="col-md">
                    <div style="width:calc(80% - 10px);float:left;margin-right:10px;">
                        <input id="keyword" type="text" class="form-control" placeholder="请输入搜索词" style="background-color:#fff0;color: white">
                    </div>
                    <div style="width:20%;float:left;"  id="search" >
                        <input id="search" value="查询" type="button" class="form-control" style="background:#12213d;color:#fff;" >
                    </div>
                </div>--}%
                <div style="overflow-y: auto;height: 95%;padding-top:5px;" id="eventUl" class="sfzcll_pos_box">
                    <div data-msgid="" data-location="" data-lon="" data-lat="" data-time="" data-m="" class="sfzcll_box" style="line-height: 64px;">
                        <img class="sfzcll_bkJk" src="${request.getContextPath()}/static/images/warning/ksh34.png">
                        <img class="sfzcll_bkJk" src="${request.getContextPath()}/static/images/warning/ksh34.png">
                        <img class="sfzcll_bkJk" src="${request.getContextPath()}/static/images/warning/ksh34.png">
                        <img class="sfzcll_bkJk" src="${request.getContextPath()}/static/images/warning/ksh34.png">
                        <div class="sfzcll_smallBk">
                            <div class="ygl" style="line-height: 62px;">
                                <span>1</span>
                            </div>
                        </div>
                        <div class="div_time">2020-09-08</div>
                        <div class="div_address">AAA</div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="visual_box" id="zdzx">
            <div class="visual_title">
                <span>设备运行统计</span>
                <img src="${request.getContextPath()}/static/images/warning/ksh33.png">
            </div>
            <div class="swiper-container visual_swiper1 visual_chart" style="background:#17293e;border:1px solid #05496f;">
                <div class="swiper-slide" id="main3" style="width: 100%;height:200px;"></div>
            </div>
        </div>
    </div>

    %{--设备状态监测--}%
    <div style="width: 75%" class="visual_con">
        <div style="height: calc(100% - 6px);" class="visual_conBot">
            <img class="visual_conBot_l" src="${request.getContextPath()}/static/images/warning/ksh42.png">
            <img class="visual_conBot_2" src="${request.getContextPath()}/static/images/warning/ksh43.png">
            <img class="visual_conBot_3" src="${request.getContextPath()}/static/images/warning/ksh44.png">
            <img class="visual_conBot_4" src="${request.getContextPath()}/static/images/warning/ksh45.png">


			%{--设备状态信息详情--}%
            <div style="border: 2px solid #3cc9ec;position:absolute;z-index: 99;left: 5px;top: 5px;display: none;background-color: #0d2a45;color:white;text-align:center;">
                <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
                    <div class="span_title param_title">
                        <div class="divset_close"
                             style="float:right;margin-right: 5px;width: 26px;margin-top: 7px;line-height: 23px;float: right;background-color: #34444c;height: 26px;">x</div>
                    </div>
                </div>
                <table id="staCodeInfoTable" class="info-table">
                    <tbody data-stacode="CDGBT">
                    %{--GPS状态, GPS精度, GPS 位置栅栏,垂直向零位,东西向零位, 北南向零位,电池电压,PCB温度--}%
                        <tr><td>数据时间</td><td class="data_time" colspan="3"></td></tr>
                        <tr><td><g:fetchnname chn="1"/></td><td class="ch1_td"></td><td><g:fetchnname chn="5"/></td><td class="ch5_td"></td></tr>
                        <tr><td><g:fetchnname chn="2"/></td><td class="ch2_td"></td><td><g:fetchnname chn="6"/></td><td class="ch6_td"></td></tr>
                        <tr><td><g:fetchnname chn="3"/></td><td class="ch3_td"></td><td><g:fetchnname chn="7"/></td><td class="ch7_td"></td></tr>
                        <tr><td><g:fetchnname chn="4"/></td><td class="ch4_td"></td><td><g:fetchnname chn="8"/></td><td class="ch8_td"></td></tr>
                    </tbody>
                </table>
                <button id="rebootDev" class="btn-sm btn-default bat_button" value="AAA"
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">设备重启</button>
                <button id="alertDev" class="btn-sm btn-default bat_button"
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">报警设置</button>
                <button id="editDev" class="btn-sm btn-default bat_button"
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">参数修改</button>
            </div>

            %{--台站配置参数--}%
            <div style="border: 2px solid #3cc9ec;position:absolute;z-index: 99;left: 5px;top: 5px;display: none;background-color: #0d2a45;color:white;text-align:center;">
                <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
                    <div class="span_title ">
                        <span class="stapar_title">台站参数配置</span>
                        <div class="stapar_close"
                             style="float:right;margin-right: 5px;width: 26px;margin-top: 7px;line-height: 23px;float: right;background-color: #34444c;height: 26px;">x</div>
                    </div>
                </div>
                <div id="staInfoTable">
                    <form id="par_form">
                        <table class="info-table" style="display: inline-block;">
                            <tbody>
                            <tr class="hide">
                                <td>台网代码</td><td><input id="NetCode" name="NetCode" style="width:120px" value="0"/></td>
                                <td>台站代码</td><td><input id="StaCode" name="StaCode" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>实时采样率</td><td><input id="DataRate" name="DataRate" style="width:120px" value="0"/></td>
                                <td>0-miniseed</td><td><input id="SecMode" name="SecMode" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>低通滤波器</td><td><input id="DataLP" name="DataLP" style="width:120px" value="0"/></td>
                                <td>串口波特率</td><td><input id="CommRate" name="CommRate" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>时区</td><td><input id="TimeZero" name="TimeZero" style="width:120px" value="0"/></td>
                                <td>GPS</td><td><input id="GPSTm" name="GPSTm" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>采集器灵敏度</td><td><input id="AdSen" name="AdSen" style="width:120px" value="0"/></td>
                                <td>数据时间修正</td><td><input id="nTmCorr" name="nTmCorr" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>GPS位置栅栏信息</td><td><input id="GPSLocLock" name="GPSLocLock" style="width:120px" value="0"/></td>
                                <td>休眠时间</td><td><input id="G4SlpSec" name="G4SlpSec" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>自动调零</td><td><input id="AutoZero" name="AutoZero" style="width:120px" value="0"/></td>
                                <td>实时数据存盘模式</td><td><input id="SaveData" name="SaveData" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>监测数据采样率</td><td><input id="MonRate" name="MonRate" style="width:120px" value="0"/></td>
                                <td>监测数据存盘模式</td><td><input id="SaveMon" name="SaveMon" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>数据回溯模式</td><td><input id="DeleteMode" name="DeleteMode" style="width:120px" value="0"/></td>
                                <td>监测数据上传间隔</td><td><input id="SendMon" name="SendMon" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>工作模式</td><td><input id="WorkMode" name="WorkMode" style="width:120px" value="0"/></td>
                                <td>压控晶振拟合参数</td><td><input id="TCXO" name="TCXO" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>服务器1的IP</td><td><input id="ServerIP1" name="ServerIP1" style="width:120px" value="0"/></td>
                                <td>服务器1的端口</td><td><input id="ServerPort1" name="ServerPort1" style="width:120px" value="0"/></td>
                            </tr>
                            <tr>
                                <td>服务器2的IP</td><td><input id="ServerIP2" name="ServerIP2" style="width:120px" value="0"/></td>
                                <td>服务器2的端口</td><td><input id="ServerPort2" name="ServerPort2" style="width:120px" value="0"/></td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="info-table" style="display: inline-block;vertical-align:top;">
                            <tbody>
                            <tr>
                                <td colspan="4">通道参数</td>
                            </tr>
                            <tr>
                                <td></td><td>通道1</td><td>通道2</td><td>通道3</td>
                            </tr>
                            <tr>
                                <td>通道代码<input id="ChCode" name="ChCode" class="hide"/></td>
                                <td><input id="ChCode0" style="width:100px"/></td>
                                <td><input id="ChCode1" style="width:100px"/></td>
                                <td><input id="ChCode2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>位置标识符<input id="LocID" name="LocID" class="hide"/></td>
                                <td><input id="LocID0" style="width:100px"/></td>
                                <td><input id="LocID1" style="width:100px"/></td>
                                <td><input id="LocID2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>通道增益<input id="Gain" name="Gain" class="hide"/></td>
                                <td><input id="Gain0" style="width:100px"/></td>
                                <td><input id="Gain1" style="width:100px"/></td>
                                <td><input id="Gain2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>传感器类型<input id="SensorMode" name="SensorMode" class="hide"/></td>
                                <td><input id="SensorMode0" style="width:100px"/></td>
                                <td><input id="SensorMode1" style="width:100px"/></td>
                                <td><input id="SensorMode2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>灵敏度<input id="SensorSen" name="SensorSen" class="hide"/></td>
                                <td><input id="SensorSen0" style="width:100px"/></td>
                                <td><input id="SensorSen1" style="width:100px"/></td>
                                <td><input id="SensorSen2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>低频截至频带<input id="SensorLow" name="SensorLow" class="hide"/></td>
                                <td><input id="SensorLow0" style="width:100px"/></td>
                                <td><input id="SensorLow1" style="width:100px"/></td>
                                <td><input id="SensorLow2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>传感器高频截至频带<input id="SensorHigh" name="SensorHigh" class="hide"/></td>
                                <td><input id="SensorHigh0" style="width:100px"/></td>
                                <td><input id="SensorHigh1" style="width:100px"/></td>
                                <td><input id="SensorHigh2" style="width:100px"/></td>
                            </tr>
                            <tr>
                                <td>高通滤波器<input id="DataHP" name="DataHP" class="hide"/></td>
                                <td><input id="DataHP0" style="width:100px"/></td>
                                <td><input id="DataHP1" style="width:100px"/></td>
                                <td><input id="DataHP2" style="width:100px"/></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <button id="saveParam" class="btn-sm btn-default bat_button" value=""
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">保存</button>
            </div>

            <div style="border: 2px solid #3cc9ec;position:absolute;z-index: 99;left: 5px;top: 5px;display: none;background-color: #0d2a45;color:white;text-align:center;">
                <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
                    <div class="span_title ">
                        <span class="alarm_title">报警参数配置</span>
                        <div class="alarm_close"
                             style="float:right;margin-right: 5px;width: 26px;margin-top: 7px;line-height: 23px;float: right;background-color: #34444c;height: 26px;">x</div>
                    </div>
                </div>
                <div id="staAlarmTable">
                    <form id="alarm_form">
                        <table class="info-table">
                            <tbody>
                            <tr>
                                <td>报警响铃时间(s)</td><td colspan="2"><input id="ALERTMRING" style="width:120px" value="0"/></td>
                                <td>清除报警时间(s)</td><td colspan="2"><input id="ALERTMCLR" style="width:120px"value="0"/></td>
                            </tr>
                            <tr>
                                <td>阀值</td><td>最小</td><td>最大</td>
                                <td>阀值</td><td>最小</td><td>最大</td>
                            </tr>
                            %{--GPS状态, GPS精度, GPS 位置栅栏,垂直向零位,东西向零位, 北南向零位,电池电压,PCB温度--}%
                            <tr>
                                <td class="labal-param1"><g:fetchnname chn="1"/></td><td><input id="range1" style="width:60px"/></td><td><input id="_range1" style="width:60px" value="0"/></td>
                                <td class="labal-param5"><g:fetchnname chn="5"/></td><td><input id="range5" style="width:60px"/></td><td><input id="_range5" style="width:60px" value="0"/></td>
                            </tr>
                            <tr>
                                <td class="labal-param2"><g:fetchnname chn="2"/></td><td><input id="range2" style="width:60px"/></td><td><input id="_range2" style="width:60px" value="0"/></td>
                                <td class="labal-param6"><g:fetchnname chn="6"/></td><td><input id="range6" style="width:60px"/></td><td><input id="_range6" style="width:60px" value="0"/></td>
                            </tr>
                            <tr>
                                <td class="labal-param3"><g:fetchnname chn="3"/></td><td><input id="range3" style="width:60px"/></td><td><input id="_range3" style="width:60px" value="0"/></td>
                                <td class="labal-param7"><g:fetchnname chn="7"/></td><td><input id="range7" style="width:60px"/></td><td><input id="_range7" style="width:60px" value="0"/></td>
                            </tr>
                            <tr>
                                <td class="labal-param4"><g:fetchnname chn="4"/></td><td><input id="range4" style="width:60px"/></td><td><input id="_range4" style="width:60px" value="0"/></td>
                                <td class="labal-param8"><g:fetchnname chn="8"/></td><td><input id="range8" style="width:60px"/></td><td><input id="_range8" style="width:60px"/></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <button id="saveAlarm" class="btn-sm btn-default bat_button" value=""
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">保存</button>
            </div>

            %{--<img src="${request.getContextPath()}/static/images/location.jpg"
                 style="position: absolute;z-index: 2;bottom: 45px;left: 15px;width:40px;height:40px;border-radius: 8px;cursor:pointer;"
                 id="resetCenter"/>--}%

            <img src="${request.getContextPath()}/static/images/icon_alarm2.png" title="查看报警信息" class="hidden"
                 style="position: absolute;z-index: 2;bottom: 45px;left: 15px;width:40px;height:40px;border-radius: 8px;cursor:pointer;"
                 id="alarmCenter"/>

            <div class="visual_chart" id="container">
                <div id="mapType-wrapper"/>
            </div>
            <div class="legend" id="legend">
                状态类型:&nbsp;
                <img src="${request.getContextPath()}/static/images/station/icon_adp.png"  style="width: 20px;height: 20px"/>&nbsp;正常
                <img src="${request.getContextPath()}/static/images/station/icon_sta0.png" style="width: 20px;height: 20px"/>&nbsp;异常
            <!--<div class="cata_sum">台站个数:&nbsp;<span id="sta_num">&nbsp;0 </span></div>-->
            </div>

            <div id="alarm_info" class="alarm_info">

            </div>

        </div>
    </div>
    <div class="clear"></div>
</div>
<link rel="stylesheet" href="${request.getContextPath()}/static/js/openlayers/ol.css" type="text/css">
<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/ol.js"></script>
<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/bmaplayer.js?t=002"></script>
<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/sourcelayers.js?v=080201"></script>
<script src="${request.getContextPath()}/static/js/mapdata.js?v=080201" type="text/javascript"></script>
<script type="text/javascript">
$(function () {
    initMapSwitch();    //初始化地图切换控件
	queryMapData();
    setInterval(updateMapData, 5000);    //定时加载数据

	var a = $('.visualSssf_left a')
	for (var i = 0; i < a.length; i++) {
		a[i].index = i;
		a[i].onclick = function () {
			for (var i = 0; i < a.length; i++) {
				a[i].className = ''
			}
			this.className = 'active'
		}
	}

	var sfzcllH = $('.sfzcll_box').height()
	var sfzcllHtwo = sfzcllH - 2
	$('.sfzcll_box').css('line-height', sfzcllH + 'px')
	$('.sfzcll_smallBk>div').css('line-height', sfzcllHtwo + 'px')

	//删除加载动画
	$('#load').fadeOut(1000)
	setTimeout(function () {
			$('#load').remove()
		}
		, 1100);
})
</script>
</body>
</html>
