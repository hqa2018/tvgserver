%{--参考模板66--}%
<%@ page contentType="text/html;charset=UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    %{--<meta name="layout" content="main"/>--}%
    <title><g:pageTitle default="Grails" /></title>
    <asset:stylesheet href="layui/css/layui.css"/>
    <link rel="stylesheet" href="${request.getContextPath()}/static/css/eventdata.css">
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
<body>
<input id="devcode" style="display: none" value="${params.devcode}"/>
<div class="canvas" style="opacity: .2">
    <iframe frameborder="0" src="${request.getContextPath()}/static/demo/js/index.html" style="width: 100%; height: 100%"></iframe>
</div>
<div class="loading">
    <div class="loadbox"> <img src="${request.getContextPath()}/static/demo/images/loading.gif"> 页面加载中... </div>
</div>
<div class="head">
    <h1>事件数据查询</h1>
    <div class="weather"><span id="showTime"></span></div>
    <script>
    </script>
</div>
<div class="mainbox">
    <ul class="clearfix">
        <li style="width: 30%;">
            <div class="boxall" style="height:8rem;">
                <h3 class="txxs-h3">事件触发记录</h3>
                <div class="bar">
                    <div class="barbox">
                        <ul class="clearfix">
                            <li class="pulll_left counter">1120</li>
                            <li class="pulll_left counter">1009</li>
                        </ul>
                    </div>
                    <div class="barbox2">
                        <ul class="clearfix">
                            <li class="pulll_left">总押人数 </li>
                            <li class="pulll_left">点到人数</li>
                        </ul>
                    </div>
                </div>
                <div class="bar">
                    <div class="barbox">
                        <ul class="clearfix">
                            <li class="pulll_left counter">880</li>
                            <li class="pulll_left counter">875</li>
                        </ul>
                    </div>
                    <div class="barbox2">
                        <ul class="clearfix">
                            <li class="pulll_left">出工点名应到人数</li>
                            <li class="pulll_left">出工点名实到人数</li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
        <li style="width: 70%">
            <div class="boxall" style="height:32px;">
                <span>代码</span>
                <select id="stadev_list" class="time-input" style="margin-left: 50px"></select>
                <span style="margin-left: 210px">日期</span>
                <select id="month_list" class="time-input" style="margin-left: 300px"></select>
                <select id="file_list" class="time-input" style="margin-left: 450px"></select>
                <input class="time-input" type="text" value="" id="startTime" style="margin-left: 300px;display: none">
                <button id="devSearch" class="time-button" style="margin-left: 600px">查询</button>
            </div>
            <div class="boxall" style="height:7.5rem;overflow-y: auto">
                <div class="event_list middle_top">
                    <g:each in="${[1,2,3,4,5]}" var="num">
                        <div class="info boxstyle">
                            <div class="title">2021-11-03 08:57:39 <button>下载</button></div>
                            <div class="info-main-8 info_lf">
                                <ul>
                                    %{--120.000000,30.000000,2021-11-03 08:57:39,13,625915.3750,625915.3750,-219.9005,625915.1875,未知类型--}%
                                    <li><span> </span><p class="text-info ">120.000000</p></li>
                                    <li><span> </span><p class="text-info ">30.000000</p></li>
                                    <li><span> </span><p class="text-info ">13</p></li>
                                    <li><span> </span><p class="text-info ">625915.3750</p></li>
                                    <li><span> </span><p class="text-info ">625915.3750</p></li>
                                    <li><span> </span><p class="text-info ">-219.9005</p></li>
                                    <li><span> </span><p class="text-info ">625915.1875</p></li>
                                    <li><span> </span><p class="text-info ">未知类型</p></li>
                                </ul>
                            </div>
                        </div>
                    </g:each>
                </div>
                <div class="boxfoot"></div>
            </div>
        </li>
    </ul>
</div>
<div class="back"></div>
<script type="text/javascript" src="${request.getContextPath()}/static/js/eventdata.js"></script>
</body>
</html>