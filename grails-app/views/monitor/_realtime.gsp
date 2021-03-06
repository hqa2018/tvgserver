<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="main"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="${request.getContextPath()}/static/css/common.css?t=155">
    <link rel="stylesheet" href="${request.getContextPath()}/static/css/first.css?t=155">
    <link rel="stylesheet" href="${request.getContextPath()}/static/fonts/iconfont.css">
    <link rel="stylesheet" href="${request.getContextPath()}/static/css/realtime.css">
    <script src="${request.getContextPath()}/static/js/echarts.min.js"></script>
    <script src="${request.getContextPath()}/static/js/macarons.js"></script>
    %{--<script src="${request.getContextPath()}/static/js/countUp.js"></script>--}%
    <asset:stylesheet href="layui/css/layui.css"/>
    <style>
    </style>
</head>
<body>
<div class="first-screen root-wrap data-content">
    <header>
        <span><g:pageTitle default="Grails" /></span>
        %{--<div class="title_img">
            <img src="${request.getContextPath()}/static/images/hblogo1.png" alt="">
        </div>--}%
        <!-- <span class="month-tip">2017年1月</span> -->
    </header>
    <div id="menu">
        <ul>
            <li id="editDev" class="li_scssz">参数设置</li>
            <li id="monitor" class="li_scssz set_control">获取状态数据</li>
            <li id="alert" class="li_scssz set_control">设置监测参数</li>
            <li id="mode" class="li_scssz set_control">工作模式</li>
            <li id="tf" class="li_scssz set_control">TF卡格式化</li>
            <li id="download" class="li_scssz set_control">下载参数</li>
            <li id="stop" class="li_scssz set_control">停止下载</li>
            <li id="alertDev" class="alert_scssz">报警设置</li>
            <li id="waveBtn" class="li_scssz">波形数据</li>
            <li class="rebootBtn">设备重启</li>
        </ul>
    </div>
    <g:render template="popup" />
    <div class="mainout clearfix">
        <div class="middle_con fl">
            <div class="info_list middle_top">
                <g:each in="${[1,2,3,4,5,6,7,8]}" var="num">
                    <div class="info boxstyle">
                        <div class="title info_menu">
                            <img src="${request.getContextPath()}/static/images/info-img-3.png" width="36">[SH.REDS3]
                        </div>
                        <div class="info-main-8 info_lf">
                            <ul>
                                <li><span>GPS状态    </span><p id="ch1" class="text-success ">21</p></li>
                                <li><span>GPS精度    </span><p id="ch2" class="text-danger  ">100</p></li>
                                <li><span>GPS位置栅栏 </span><p id="ch3" class="text-success ">65</p></li>
                                <li><span>垂直向零位  </span><p id="ch4" class="text-success ">32</p></li>
                                <li><span>东西向零位  </span><p id="ch5" class="text-success ">23</p></li>
                                <li><span>北南向零位  </span><p id="ch6" class="text-success ">68</p></li>
                                <li><span>电池电压    </span><p id="ch7" class="text-success ">68</p></li>
                                <li><span>PCB温度    </span><p id="ch8" class="text-success ">68</p></li>
                            </ul>
                        </div>
                    </div>
                </g:each>
            </div>
        </div>
        %{-- 暂时隐藏弃用 --}%
        <div class="aside-right clearfix fl" style="display: none">
            <div class="pie clearfix">
                <div class="chart-box pie-chart">
                    <div id="pie"></div>
                    <div>
                        <div class="pie-data">
                        </div>
                    </div>
                </div>
            </div>
            <div class="area-rank">
                <h3>事件触发排行</h3>
                <div class="con" id="echart1">
                    %{--                <div class="allnav" id="echart1"></div>--}%
                </div>
            </div>
            <div class="trend">
                <h3>近一个月触发记录</h3>
                <div class="con" id="echart4" style="height: calc(100% - 35px);"></div>
                %{--            <div id="trendBar1" style="width: 100%;height: 80%;"></div>--}%
            </div>
        </div>
    </div>
    <asset:javascript src="layui/layui.js"/>
    <script src="${request.getContextPath()}/static/js/realtime.js?time=005"></script>
    <asset:javascript src="base.js"/>
</body>
</html>