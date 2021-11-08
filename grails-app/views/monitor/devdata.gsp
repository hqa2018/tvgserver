%{--参考模板66--}%
<%@ page contentType="text/html;charset=UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    %{--<meta name="layout" content="main"/>--}%
    <title><g:pageTitle default="Grails" /></title>
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


.time-button {
    width: 0.7rem;
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
}

button:hover {
    background: rgba(14, 148, 234, 0.6);
    cursor: pointer;
}

.boxall span{
    color: #FFFFFF;
    font-size: 0.16rem;
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
    <h1>历史状态数据查询</h1>
    <div class="weather"><span id="showTime"></span></div>
    <script>
    </script>
</div>
<div class="mainbox">
    <ul class="clearfix">
        <li style="width: 100%">
            <div class="boxall" style="height:32px;">
                <span>代码</span>
                <select id="stadev_list" class="time-input" style="margin-left: 50px">
                </select>
                <span style="margin-left: 210px">日期</span>
                <input class="time-input" type="text" value="" id="startTime" style="margin-left: 300px">
                <button id="devSearch" class="time-button" style="margin-left: 500px">查询</button>
            </div>
            <div class="boxall" style="height:7.5rem;overflow-y: auto">
                <div class="chnav" id="monchart4"></div>
                <div class="chnav" id="monchart5"></div>
                <div class="chnav" id="monchart6"></div>
                <div class="chnav" id="monchart7"></div>
                <div class="chnav" id="monchart8"></div>
                <div class="chnav" id="monchart9"></div>
                <div class="chnav" id="monchart10"></div>
                <div class="chnav" id="monchart11"></div>
                <div class="boxfoot"></div>
            </div>
        </li>
        <li style="width: 30%;display: none">
            <div class="boxall" style="height:10rem;">
                <h3 class="txxs-h3">事件触发记录</h3>
            </div>
        </li>
    </ul>
</div>
<div class="back"></div>
<script type="text/javascript" src="${request.getContextPath()}/static/demo/js/china.js"></script>
<script type="text/javascript" src="${request.getContextPath()}/static/demo/js/area_echarts.js"></script>
</body>
</html>