<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit"/>
    <meta name="force-rendering" content="webkit"/>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><g:pageTitle default="Grails" /></title>
    <!-- CSS -->
    <asset:stylesheet href="list.css"/>
    <asset:stylesheet href="children.css"/>
    %{--<link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/children.css?v=004">--}%

    <!-- 在线图标库 地址：http://fontawesome.dashgame.com/-->
    <asset:stylesheet href="font-awesome.min.css"/>

    <!-- layui css -->
    <asset:stylesheet href="layui/css/layui.css"/>
    <asset:javascript src="jquery-3.3.1.min.js"/>
    <!-- layui js -->
    <asset:javascript src="layui/layui.js"/>
    <asset:javascript src="laydate/laydate.js"/>
</head>

<body>
<div class="wangid_conbox">
    <!-- 当前位置 -->
    <div class="zy_weizhi bord_b">
        <i class="fa fa-home fa-3x"></i>
        <a>首页</a>
        <span>台站基础数据列表</span>
    </div>
    <!-- 筛选 -->
    <div class="shuaix">
        <div class="right">
            <select id="search_type_select">
                <option value="null">-选择查询栏目-</option>
                <option value="stacode">台站代码</option>
                <option value="staname">台站名称</option>
            </select>
            <input type="text" id="search_value" placeholder="请输入关键词查询">
            <a href="#" id="bt_searth">查询</a>
        </div>
    </div>
    <!-- 下面写内容 -->
    <table class="layui-hide" id="tb_content" lay-filter="mylist"></table>

    <script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs" lay-event="gather">采集</a>
    </script>

    <script type="text/html" id="toolbarDemo">
    <div class="layui-btn-container">
        <button class="layui-btn layui-btn-sm" lay-event="gatherAll">批量采集</button>
    </div>
    </script>
</div>
<asset:javascript src="utils.js"/>
<asset:javascript src="list.js"/>
%{--<script type="text/javascript" src="js/baseinfo_list.js?t=004"></script>--}%
</body>
</html>
