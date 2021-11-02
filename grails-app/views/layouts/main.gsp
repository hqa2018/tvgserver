<!DOCTYPE html>
<html>
<head>
    <title><g:pageTitle default="Grails" /></title>
    <asset:stylesheet href="bootstrap.css"/>
    <asset:javascript src="jquery-3.3.1.min.js"/>
    <asset:link rel="icon" href="favicon.ico" type="image/x-ico"/>
    <asset:javascript src="utils.js"/>
    <asset:javascript src="bootstrap.js"/>
    <g:layoutHead />
    <g:javascript library="application" />
</head>
<body>
<ul class="nav">
    <li class="drop-down">
        <a href="#"></a>
        <ul class="drop-down-content">
            <li>
                <a href="./home.html">自动切换</a>
            </li>
            <li>
                <a href="./realtime">第一屏</a>
            </li>
            <li>
                <a href="./mapview">第二屏</a>
            </li>
            %{--<li>
                <a href="./third.html">第三屏</a>
            </li>--}%
            <li>
                <a href="#" id="openDialog1">设置</a>
            </li>
        </ul>
    </li>
</ul>
<g:layoutBody />
</body>
</html>


