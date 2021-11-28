%{--参考模板66--}%
<%@ page contentType="text/html;charset=UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    %{--<meta name="layout" content="main"/>--}%
    <title>index</title>
    <asset:stylesheet href="layui/css/layui.css"/>
    <link rel="stylesheet" href="${request.getContextPath()}/static/demo/css/comon0.css">
    <script type="text/javascript" src="${request.getContextPath()}/static/demo/js/jquery.js"></script>
    <asset:javascript src="layui/layui.js"/>
    <asset:javascript src="laydate/laydate.js"/>

</head>
<style>
.info-table {
    text-align: left;
    margin: 0 auto !important;
    width: 100%;
}
.info-table tr td {
    padding: 8px;
    color: #ccc;
    width: 2rem;
    border: 1px solid #048CAA;
}
.time-input {
    width: 1.8rem;
    height: 0.4rem;
    box-sizing: border-box;
    border: 1px
    solid #0E94EA;
    font-size: 0.16rem;
    background: rgba(14, 148, 234, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    color: #cdddf7;
    padding-left: 10px;
}
</style>
<script>
    $(window).load(function () {
        $(".loading").fadeOut()
    })
    $(document).ready(function () {
        var whei = $(window).width()
        $("html").css({ fontSize: whei / 20 })
        $(window).resize(function () {
            var whei = $(window).width()
            $("html").css({ fontSize: whei / 20 })
        });
    });
</script>
<asset:javascript src="utils.js?v=001"/>
<script type="text/javascript" src="${request.getContextPath()}/static/demo/js/echarts.min.js"></script>
<script language="JavaScript" src="${request.getContextPath()}/static/demo/js/js.js"></script>
<body>
<input id="devcode" style="display: none" value="${params.devcode}"/>
<div class="canvas" style="opacity: .2">
    <iframe frameborder="0" src="${request.getContextPath()}/static/demo/js/index.html" style="width: 100%; height: 100%"></iframe>
</div>
<div class="loading">
    <div class="loadbox"> <img src="${request.getContextPath()}/static/demo/images/loading.gif"> 页面加载中... </div>
</div>
<div class="head">
    <h1>SH.49811设备详情</h1>
    <div class="weather"><span id="showTime"></span></div>
    <script>
        // var t = null;
        // t = setTimeout(time, 1000);
        // function time() {
        //     clearTimeout(t);
        //     dt = new Date();
        //     var y = dt.getFullYear();
        //     var mt = dt.getMonth() + 1;
        //     var day = dt.getDate();
        //     var h = dt.getHours();
        //     var m = dt.getMinutes();
        //     var s = dt.getSeconds();
        //     document.getElementById("showTime").innerHTML = y + "年" + mt + "月" + day + "-" + h + "时" + m + "分" + s + "秒";
        //     t = setTimeout(time, 1000);
        // }
    </script>
</div>
<div class="mainbox">
    <ul class="clearfix">
        <li style="width: 35%">
            <div class="boxall" style="height: 7.5rem">
                <div class="alltitle"> 基础参数</div>
                <table class="info-table">
                    <tbody>
                    <tr>
                        <td>台网代码</td><td class="NetCode"></td>
                        <td>台站代码</td><td class="StaCode"></td>
                    </tr>
                    <tr>
                        <td>实时采样率</td><td class="DataRate"></td>
                        <td>0-miniseed</td><td class="SecMode"></td>
                    </tr>
                    <tr>
                        <td>低通滤波器</td><td class="DataLP"></td>
                        <td>串口波特率</td><td class="CommRate"></td>
                    </tr>
                    <tr>
                        <td>时区</td><td class="TimeZero"></td>
                        <td>GPS</td><td class="GPSTm"></td>
                    </tr>
                    <tr>
                        <td>采集器灵敏度</td><td class="AdSen"></td>
                        <td>数据时间修正</td><td class="nTmCorr"></td>
                    </tr>
                    <tr>
                        <td>GPS位置栅栏信息</td><td class="GPSLocLock"></td>
                        <td>休眠时间</td><td class="G4SlpSec"></td>
                    </tr>
                    <tr>
                        <td>自动调零</td><td class="AutoZero"></td>
                        <td>实时数据存盘模式</td><td class="SaveData"></td>
                    </tr>
                    <tr>
                        <td>监测数据采样率</td><td class="MonRate"></td>
                        <td>监测数据存盘模式</td><td class="SaveMon"></td>
                    </tr>
                    <tr>
                        <td>数据回溯模式</td><td class="DeleteMode"></td>
                        <td>监测数据上传间隔</td><td class="SendMon"></td>
                    </tr>
                    <tr>
                        <td>工作模式</td><td class="WorkMode"></td>
                    </tr>
                    <tr>
                        <td>压控晶振拟合参数</td><td colspan="3" class="TCXO"></td>
                    </tr>
                    <tr>
                        <td>服务器1的IP</td><td class="ServerIP1"></td>
                        <td>服务器1的端口</td><td class="ServerPort1"></td>
                    </tr>
                    <tr>
                        <td>服务器2的IP</td><td class="ServerIP2"></td>
                        <td>服务器2的端口</td><td class="ServerPort2"></td>
                    </tr>
                    </tbody>
                </table>
                <div class="boxfoot"></div>
            </div>
            <div class="boxall" style="height: 5.5rem">
                <div class="alltitle"> 通道参数</div>
                <table class="info-table">
                    <tbody>
                    <tr>
                        <td></td><td>通道1</td><td>通道2</td><td>通道3</td>
                    </tr>
                    <tr>
                        <td>通道代码<input id="ChCode" name="ChCode" hidden/></td>
                        <td class="ChCode0"></td>
                        <td class="ChCode1"></td>
                        <td class="ChCode2"></td>
                    </tr>
                    <tr>
                        <td>位置标识符<input id="LocID" name="LocID" hidden/></td>
                        <td class="LocID0"></td>
                        <td class="LocID1"></td>
                        <td class="LocID2"></td>
                    </tr>
                    <tr>
                        <td>通道增益<input id="Gain" name="Gain" hidden/></td>
                        <td class="Gain0"></td>
                        <td class="Gain1"></td>
                        <td class="Gain2"></td>
                    </tr>
                    <tr>
                        <td>传感器类型<input id="SensorMode" name="SensorMode" hidden/></td>
                        <td class="SensorMode0"></td>
                        <td class="SensorMode1"></td>
                        <td class="SensorMode2"></td>
                    </tr>
                    <tr>
                        <td>灵敏度<input id="SensorSen" name="SensorSen" hidden/></td>
                        <td class="SensorSen0"></td>
                        <td class="SensorSen1"></td>
                        <td class="SensorSen2"></td>
                    </tr>
                    <tr>
                        <td>低频截至频带<input id="SensorLow" name="SensorLow" hidden/></td>
                        <td class="SensorLow0"></td>
                        <td class="SensorLow1"></td>
                        <td class="SensorLow2"></td>
                    </tr>
                    <tr>
                        <td>传感器高频截至频带<input id="SensorHigh" name="SensorHigh" hidden/></td>
                        <td class="SensorHigh0"></td>
                        <td class="SensorHigh1"></td>
                        <td class="SensorHigh2"></td>
                    </tr>
                    <tr>
                        <td>高通滤波器<input id="DataHP" name="DataHP" hidden/></td>
                        <td class="DataHP0"></td>
                        <td class="DataHP1"></td>
                        <td class="DataHP2"></td>
                    </tr>
                    </tbody>
                </table>
                <div class="boxfoot"></div>
            </div>
        </li>
        <li style="width: 30%">
            <div class="bar">
                <div class="barbox">
                    <ul class="clearfix">
                        <li class="pulll_left counter ch1"></li>
                        <li class="pulll_left counter ch2"></li>
                    </ul>
                </div>
                <div class="barbox2">
                    <ul class="clearfix">
                        <li class="pulll_left">GPS状态</li>
                        <li class="pulll_left">GPS精度</li>
                    </ul>
                </div>
            </div>
            <div class="bar">
                <div class="barbox">
                    <ul class="clearfix">
                        <li class="pulll_left counter ch3"></li>
                        <li class="pulll_left counter ch4"></li>
                    </ul>
                </div>
                <div class="barbox2">
                    <ul class="clearfix">
                        <li class="pulll_left ">GPS 位置栅栏</li>
                        <li class="pulll_left">垂直向零位</li>
                    </ul>
                </div>
            </div>
            <div class="bar">
                <div class="barbox">
                    <ul class="clearfix">
                        <li class="pulll_left counter ch5"></li>
                        <li class="pulll_left counter ch6"></li>
                    </ul>
                </div>
                <div class="barbox2">
                    <ul class="clearfix">
                        <li class="pulll_left">东西向零位</li>
                        <li class="pulll_left">北南向零位</li>
                    </ul>
                </div>
            </div>
            <div class="bar">
                <div class="barbox">
                    <ul class="clearfix">
                        <li class="pulll_left counter ch7"></li>
                        <li class="pulll_left counter ch8"></li>
                    </ul>
                </div>
                <div class="barbox2">
                    <ul class="clearfix">
                        <li class="pulll_left">电池电压</li>
                        <li class="pulll_left">主板温度</li>
                    </ul>
                </div>
            </div>
            %{--<div class="map">
                <div class="map1"><img src="${request.getContextPath()}/static/demo/images/lbx.png"></div>
                <div class="map2"><img src="${request.getContextPath()}/static/demo/images/jt.png"></div>
                <!-- <div class="map3"><img src="${request.getContextPath()}/static/demo/images/map.png"></div>
                    <div class="map4" id="map_1"></div> -->
            </div>--}%
            <div class="boxall" style="height:100%;margin-top: 5px;">
                <h3 class="txxs-h3">事件触发记录</h3>
            <div class="monitor panel">
                <div class="inner">
                    <div class="content" style="display: block;">
                        <div class="head">
                            <span class="col">故障时间</span>
                            <span class="col">设备地址</span>
                            <span class="col">异常代码</span>
                        </div>
                        <div class="marquee-view">
                            <div class="marquee">
                                <div class="row">
                                    <span class="col">20180701</span>
                                    <span class="col">11北京市昌平西路金燕龙写字楼</span>
                                    <span class="col">1000001</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190601</span>
                                    <span class="col">北京市昌平区城西路金燕龙写字楼</span>
                                    <span class="col">1000002</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190704</span>
                                    <span class="col">北京市昌平区建材城西路金燕龙写字楼</span>
                                    <span class="col">1000003</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20180701</span>
                                    <span class="col">北京市昌平区建路金燕龙写字楼</span>
                                    <span class="col">1000004</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190701</span>
                                    <span class="col">北京市昌平区建材城西路金燕龙写字楼</span>
                                    <span class="col">1000005</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190701</span>
                                    <span class="col">北京市昌平区建材城西路金燕龙写字楼</span>
                                    <span class="col">1000006</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190701</span>
                                    <span class="col">北京市昌平区建西路金燕龙写字楼</span>
                                    <span class="col">1000007</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190701</span>
                                    <span class="col">北京市昌平区建材城西路金燕龙写字楼</span>
                                    <span class="col">1000008</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190701</span>
                                    <span class="col">北京市昌平区建材城西路金燕龙写字楼</span>
                                    <span class="col">1000009</span>
                                    <span class="icon-dot"></span>
                                </div>
                                <div class="row">
                                    <span class="col">20190710</span>
                                    <span class="col">北京市昌平区建材城西路金燕龙写字楼</span>
                                    <span class="col">1000010</span>
                                    <span class="icon-dot"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


                %{--<ul class="addcar">
                    <li class="addcar-li">
                        <img class="fly-img " src="${request.getContextPath()}/static/demo/images/man3.jpg">
                        <span class="footer">李四</span>
                    </li>
                </ul>--}%
            </div>
        </li>
        <li style="width: 35%">
            <div class="boxall" style="height:10rem">
                <div class="alltitle">设备历史波形<input class="time-input" type="text" value="" id="startTime"></div>

                <div class="linenav" id="monchart4"></div>
                <div class="linenav" id="monchart5"></div>
                <div class="linenav" id="monchart6"></div>
                <div class="linenav" id="monchart7"></div>
                <div class="linenav" id="monchart8"></div>
                <div class="linenav" id="monchart9"></div>
                <div class="linenav" id="monchart10"></div>
                <div class="linenav" id="monchart11"></div>
                <div class="boxfoot"></div>
            </div>
            %{--<div class="boxall" style="height: 3rem">
                <div class="alltitle">模块标题样式22</div>
                <div class="allnav" id="echart6"></div>
                <div class="boxfoot"></div>
            </div>--}%
        </li>
    </ul>
</div>
<div class="back"></div>
<script type="text/javascript" src="${request.getContextPath()}/static/demo/js/china.js"></script>
<script type="text/javascript" src="${request.getContextPath()}/static/demo/js/area_echarts.js"></script>
</body>
</html>