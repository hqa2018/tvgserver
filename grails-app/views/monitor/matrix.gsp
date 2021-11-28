<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="layout" content="main"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="${request.getContextPath()}/static/css/common.css?t=139">
    <link rel="stylesheet" href="${request.getContextPath()}/static/css/mapview.css?t=139">
    <link rel="stylesheet" href="${request.getContextPath()}/static/fonts/iconfont.css">
    <asset:stylesheet href="layui/css/layui.css"/>
    <script src="${request.getContextPath()}/static/js/echarts.min.js"></script>
    <script src="${request.getContextPath()}/static/js/macarons.js"></script>
    <link href="${request.getContextPath()}/static/js/mapselect/css/mapTypeSelect.css?t=017" rel="stylesheet">
    <link href="${request.getContextPath()}/static/css/olmap.css?t=018" rel="stylesheet">
    <script src="${request.getContextPath()}/static/js/mapselect/js/mapTypeSelect.js?t=018"></script>
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
        <div class="aside-left fl " style="display: none">
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
            <div class="table_info" style="display: inline;">
                <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
                    <div class="span_title param_title">
                    </div>
                </div>
                <table class="info-table">
                    <tbody data-stacode="CDGBT">
                    <tr><td>经度</td><td><input id="mlon" style="width:120px" value="0"/></td>
                        <td>纬度</td><td><input id="mlat" style="width:120px" value="0"/></td></tr>
                    <tr><td>行数</td><td><input id="mrow" style="width:120px" value="0"/></td>
                        <td>列数</td><td><input id="mcol" style="width:120px" value="0"/></td></tr>
                    <tr><td>间距</td><td><input id="mgap" style="width:120px" value="0"/></td>
                        <td>夹角</td><td><input id="mangle" style="width:120px" value="0"/></td></tr>
                    </tbody>
                </table>
                <button id="editDev" class="btn-sm btn-default bat_button"
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">起始点</button>
                <button id="start_render" class="btn-sm btn-default bat_button" value="AAA"
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">开始描绘</button>
                <button id="alertDev" class="btn-sm btn-default bat_button"
                        style="background: #747577;margin:5px 0;border:0px solid #fff;padding:3px 10px;color:#fff;">更多操作</button>
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
            <div class="alarm-box" style="display: none">
                <div>
                    <p style="font-size:18px;color:#cdddf7">当前报警</p>
                    <p class="ss" style="font-size:18px;color:#cc4125;text-align:center"><span id="alarm_num">0</span>（台）</p>
                </div>
            </div>
        </div>
    </div>
</div>
<asset:javascript src="layui/layui.all.js"/>
<link rel="stylesheet" href="${request.getContextPath()}/static/js/openlayers/ol.css" type="text/css">
<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/ol.js"></script>
<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/bmaplayer.js?t=002"></script>
%{--<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/sourcelayers.js?v=080201"></script>--}%
<script type="text/javascript" src="${request.getContextPath()}/static/js/openlayers/onlinelayers.js?v=080201"></script>
<script src="${request.getContextPath()}/static/js/matmap.js?v=080201" type="text/javascript"></script>
<script src="${request.getContextPath()}/static/js/matrix.js?v=080201" type="text/javascript"></script>
</body>
</html>