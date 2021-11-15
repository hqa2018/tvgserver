<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="main"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/static/css/common.css?t=139">
    <link rel="stylesheet" href="/static/css/mapview.css?t=139">
    <link rel="stylesheet" href="/static/fonts/iconfont.css">
    <asset:stylesheet href="layui/css/layui.css"/>
    <script src="/static/js/echarts.min.js"></script>
    <script src="/static/js/macarons.js"></script>
    <link href="/static/js/mapselect/css/mapTypeSelect.css?t=017" rel="stylesheet">
    <link href="/static/css/olmap.css?t=018" rel="stylesheet">
    <script src="/static/js/mapselect/js/mapTypeSelect.js?t=018"></script>
</head>
<body>
<div class="first-screen root-wrap">
    <header>
        <span id="span_title"><g:pageTitle/></span>
        <div class="title_img">
        </div>
        <!-- <span class="month-tip">2017年1月</span> -->
    </header>
    <div class="mainout clearfix">
        <div class="aside-left fl">
            <h3>监测设备</h3>
            %{--<ul id="eventUl" class="clearfix">--}%
            <ul id="deviceUl" class="clearfix">
                <li class=""><div class="fl">
                    <span class="m_yellow">正常</span></div>
                    <dl class="fl"><dt>SH.ABCD</dt><dd>
                        <p class="o_time">数据时间: 2021-07-21 03:01:17</p>
                        <p>纬经度: 103.08,27.42</p></dd>
                    </dl></li>
            </ul>
        </div>
        <div class="middle_con fl">
            %{--设备状态信息详情--}%
            <div class="table_info">
                <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
                    <div class="span_title param_title">
                        <div class="divset_close btn-close"
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
            %{--加载设置弹出窗--}%
            <g:render template="popup" />
            <div id="container" class="middle_top">
                <div id="mapType-wrapper"/>
            </div>
            %{--台站筛选--}%
            <div class="layui-form layui-form-item top_select">
                <select id="sta_search" name="modules" lay-verify="required" lay-search="" lay-filter="staCode">
                    <option value="">搜索台站</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>

            %{--报警信息--}%
            <div class="alarm-box">
                <div>
                    <p style="font-size:18px;color:#cdddf7">当前报警</p>
                    <p class="ss" style="font-size:18px;color:#cc4125;text-align:center"><span id="alarm_num">0</span>（台）</p>
                </div>
            </div>
        </div>
    </div>
</div>
<asset:javascript src="layui/layui.all.js"/>
<link rel="stylesheet" href="/static/js/openlayers/ol.css" type="text/css">
<script type="text/javascript" src="/static/js/openlayers/ol.js"></script>
<script type="text/javascript" src="/static/js/openlayers/bmaplayer.js?t=002"></script>
<script type="text/javascript" src="/static/js/openlayers/sourcelayers.js?v=080201"></script>
<script src="/static/js/mapdata.js?v=080201" type="text/javascript"></script>
<script src="/static/js/mapview.js?v=080201" type="text/javascript"></script>
</body>
</html>