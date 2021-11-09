<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><g:pageTitle default="Grails"/>测试Git直接push操作</title>
    <asset:stylesheet src="Desktop/css/style.css?t=2"/>
    <asset:stylesheet src="Desktop/css/nprogress.css"/>
</head>

<body>
<div class="topbnt_left">
    <img src="lasteq/static/img/hblogo1.png" alt="" width="350px">
</div>
<div id="desktop">
    <div class="lantern"></div>
    <ul class="list">
        <li data-href="../monitor/realtime"><asset:image src="Desktop/images/td-icon22.png"/><span>实时监控</span></li>
        <li data-href="../monitor/mapview"><asset:image src="Desktop/images/td-icon4.png"/><span>地图监控</span></li>
        <li data-href="../monitor/eventdata"><asset:image src="Desktop/images/td-icon29.png"/><span>事件数据</span></li>
        <li data-href="../monitor/devdata"><asset:image src="Desktop/images/td-icon42.png"/><span>历史波形</span></li>
        <li data-href="../monitor/config"><asset:image src="Desktop/images/td-icon3.png"/><span>参数设置</span></li>
    </ul>
    <div class="date">
        <div class="date-wrapper">
            <div class="mask"></div>
            <div class="left"></div>
            <div class="right">
                <p class="time">21 : 13 : 34</p>
                <p class="day">2017年08月17日</p>
                <p class="week">星期四</p>
            </div>
        </div>
        <div class="close"></div>
    </div>
    <div class="about">
        <ul>
            <li>系统名称: SeisMIS地震信息发布管理平台</li>
            <li>版本号: V5.20210406</li>
        </ul>
        <div class="mask"></div>
        <div class="close"></div>
    </div>
    <div class="dragSelect"></div>
    <div class="contextmenu">
        <ul>
            <li data-value="refresh"><img src="static/Desktop/images/refresh.png" alt="#">刷新</li>
        </ul>
    </div>
    <div class="dialog">
        <div class="cont">
            <input type="text" placeholder="Title Name">
            <input type="text" placeholder="Images URL">
            <input type="text" placeholder="Address URL">
            <span>Confirm</span>
            <span>Cancel</span>
        </div>
    </div>
</div>
<asset:javascript src="Desktop/js/tools.js"/>
<asset:javascript src="Desktop/js/tween.js"/>
<asset:javascript src="Desktop/js/requestAnimate.js"/>
<asset:javascript src="Desktop/js/startMove.js"/>
<asset:javascript src="Desktop/js/object.js"/>
<asset:javascript src="Desktop/js/nprogress.js"/>
<asset:javascript src="Desktop/js/index.js"/>
<!-- Lantern -->
<asset:javascript src="Desktop/js/jquery.min.js"/>
<asset:javascript src="Desktop/js/velocity.min.js"/>
</body>
</html>