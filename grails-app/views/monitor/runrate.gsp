<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit"/>
    <meta name="force-rendering" content="webkit"/>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="名榜,wangid">
    <title>TDEMonitor地震台站监控运维管理系统</title>

    <!-- CSS -->
    <asset:stylesheet href="style.css"/>
    <asset:stylesheet href="children.css"/>
    %{--<link rel="stylesheet" href="css/children.css?v=003">--}%

    <!-- 在线图标库 地址：http://fontawesome.dashgame.com/-->
    <asset:stylesheet href="font-awesome.min.css"/>
    %{--<link href="css/font-awesome.min.css" rel="stylesheet">--}%

    <!-- layui css -->
    <asset:stylesheet href="layui/css/layui.css"/>
    <asset:javascript src="jquery-3.3.1.min.js"/>
    <asset:javascript src="utils.js"/>
    <!-- layui js -->
    <asset:javascript src="layui/layui.js"/>
</head>

<body>
<g:render template="popup1" />
<div class="wangid_conbox">
    <!-- 当前位置 -->
    <div class="zy_weizhi bord_b">
        <i class="fa fa-home fa-3x"></i>
        <a>首页</a>
        <span>台站监测数据列表</span>
    </div>
    <!-- 筛选 -->
    <div class="shuaix">
        <div class="left">
            <select id="dev_status_select">
                <option value="null">-筛选设备状态-</option>
                <option value="ALL">全部</option>
                <option value="1">触发</option>
                <option value="2">报警</option>
            </select>
        </div>
        <div class="right">
            <input type="text" id="search_date" placeholder="请选择日期">
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
    %{--<table class="layui-hide" id="tb_content" lay-filter="mylist"></table>--}%
    <table class="layui-hide" id="test" lay-filter="rateEvent"></table>
    <script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs" lay-event="setpar">设置</a>
    <a class="layui-btn layui-btn-xs" lay-event="more">更多<i class="layui-icon layui-icon-down"></i></a>
    %{--<a class="layui-btn layui-btn-xs" lay-event="reboot">重启</a>--}%
    %{--<a class="layui-btn layui-btn-xs" lay-event="monitor">采集</a>
    <a class="layui-btn layui-btn-xs" lay-event="mode">模式</a>
    <a class="layui-btn layui-btn-xs" lay-event="alert">报警</a>
    <a class="layui-btn layui-btn-xs" lay-event="tf">格式化</a>
    <a class="layui-btn layui-btn-xs" lay-event="download">下载</a>--}%
    %{--<a class="layui-btn layui-btn-xs" lay-event="stop">停止</a>--}%
    </script>

    <script type="text/html" id="toolbarDemo">
    <div class="layui-btn-container">
        <button class="layui-btn layui-btn-sm" lay-event="gatherAll">批量采集</button>
        <button class="layui-btn layui-btn-sm" lay-event="rebootAll">批量重启</button>
        <button class="layui-btn layui-btn-sm" lay-event="modeAll">批量模式</button>
        <button class="layui-btn layui-btn-sm" lay-event="tfAll">批量格式化</button>
        <button class="layui-btn layui-btn-sm" lay-event="downloadAll">批量下载</button>
    </div>
    </script>
</div>
%{--<div id="date_popup" style="width: 500px; height: 230px;display: none">
    <form class="layui-form layui-form-pane" action="">
        <div class="layui-form-item">
            <label class="layui-form-label">选择日期</label>
            <div class="layui-input-inline">
                <input type="text" name="date" id="search_date" placeholder="yyyy-MM-dd" autocomplete="off"
                       class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <button id="log_download" type="button" class="layui-btn layui-btn-danger layui-btn-xs">下载</button>
            </div>
        </div>
    </form>
</div>--}%
<script>
    //当前选择数据列表
    var curSelectDataList = null;
    var select_month = "2021-11"

    function buildColumn(select_month) {
        var cols = [];
        var h = [
            {type: 'checkbox', fixed: 'left'}
            , {field: 'pointid', title: '台站代码',width:120, sort: true, align: 'center'}
            // , {field: 'stacode', title: '台站代码', align: 'center'}
            // , {field: 'staname', title: '台站名称', align: 'center', width: 150}
        ]
        var d = [];
        for(var i=1;i<=TimeFrameUtil.daysInMonth(select_month);i++){
            var datestr = select_month + "-" +(i < 10 ? "0"+i : i);
            // console.log(datestr)
            d.push({field: datestr, title: datestr.split("-")[2], width: 45,event: datestr, align: 'center'})
        }
        d.push({field: 'option', title: '操作', align: 'center', width: 160, toolbar: '#barDemo', fixed: 'right'})
        cols.push($.merge(h, d));
        return cols;
    }

    //构建列表显示
    function renderMonitorData() {
        layui.use(['table','dropdown','laydate'], function(){
            var laydate = layui.laydate
            var dropdown = layui.dropdown;
            var table = layui.table;
            table.render({
                elem: '#test'
                ,id:"quality"
                , toolbar: '#toolbarDemo'//工具栏
                // ,url:'/demo/table/user.json'
                ,cellMinWidth: 30 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                ,cols: buildColumn(select_month)
                ,data: curSelectDataList
                ,done: function (res, curr, count) {
                    $('th').css({ 'background-color':'#bdccea', 'color': 'black', 'font-weight': '500', 'font-size': '8px', 'line-height':'10px' });
                    for(var i in res.data){
                        var item = res.data[i];		//获取当前行数据
                        for(var d=1;d<=TimeFrameUtil.daysInMonth(select_month);d++){
                            var datestr = select_month + "-" +(d < 10 ? "0"+d : d);
                            console.log(item[datestr])
                            if(item[datestr] == 100) {
                                $('div[lay-id="quality"]').
                                find('tr[data-index="' + i + '"]').
                                find('td[data-field="'+datestr+'"]').
                                css('background-color', '#59ff00');
                            }else if(item[datestr] > 0){
                                $('div[lay-id="quality"]').
                                find('tr[data-index="' + i + '"]').
                                find('td[data-field="'+datestr+'"]').
                                css('background-color', '#ffaa00');
                            }else{
                                $('div[lay-id="quality"]').
                                find('tr[data-index="' + i + '"]').
                                find('td[data-field="'+datestr+'"]').
                                css('background-color', '#a1a1a1');
                            }
                        }
                        // if (item.Estimate == 0)
                        //     $('div[lay-id="quality"]').
                        //     find('tr[data-index="' + index + '"]').
                        //     find('td[data-field="Estimate"]').
                        //     css('background-color', '#FF5722');
                        // else
                        //     $('div[lay-id="quality"]').
                        //     find('tr[data-index="' + index + '"]').
                        //     find('td[data-field="Estimate"]').
                        //     css('background-color', '#009688');
                    }

                }
            });

            laydate.render({
                elem: '#search_date' //指定元素
                ,value: select_month
                ,type: 'month'
                ,isInitValue: true
                ,done: function(value, date){
                    alert("选中："+value)
                    select_month = value;
                    fetchLastData()
                }
            });

            //监听单元格事件
            table.on('tool(rateEvent)', function(obj){
                var that = this
                var data = obj.data;
                var devcode = data["devcode"];
                var pointid = data["pointid"];
                if(obj.event === "setpar"){
                    popupCenter($("#staInfoTable").parent())    //弹窗居中
                    $("#staInfoTable").parent().css("display", "block");
                    getStaPar(devcode);
                }else if(obj.event === "more"){
                    //更多下拉菜单
                    dropdown.render({
                        elem: that
                        ,show: true //外部事件触发即显示
                        ,data: [{
                            title: '重启设备'
                            ,type:'control'
                            ,id: 'reboot'
                        },{
                            title: '采集数据'
                            ,type:'control'
                            ,id: 'monitor'
                        },{
                            title: '设置报警'
                            ,type:'control'
                            ,id: 'alert'
                        },{
                            title: '工作模式'
                            ,id: '#3'
                            ,child: [{
                                title: '4G不工作模式'
                                ,type:'control'
                                ,id: 'mode'
                                ,value:'0'
                            },{
                                title: '4G实时数据模式'
                                ,type:'control'
                                ,id: 'mode'
                                ,value:'1'
                            },{
                                title: '4G 非实时监测模式'
                                ,type:'control'
                                ,id: 'mode'
                                ,value:'2'
                            }]
                        },{
                            title: 'TF卡格式化'
                            ,id: '#3'
                            ,child: [{
                                title: '格式化为 FM_FAT32'
                                ,type:'control'
                                ,id: 'tf'
                                ,value:'0'
                            },{
                                title: '格式化为 FM_EXFAT'
                                ,type:'control'
                                ,id: 'tf'
                                ,value:'1'
                            }]
                        },{
                            title: '数据下载'
                            ,id: 'download'
                        }]
                        ,click: function(obj, othis){
                            if(obj.id === 'download'){
                                alert("打开数据下载窗口")
                            }else{
                                //设备控制
                                if(obj.type == "control"){
                                    if(confirm("确定对"+pointid+"执行指令?")){
                                        $.get("../monitor/control",{pointid:pointid,cmd:obj.id,type:obj.value},function (resp) {
                                            alert(pointid+"成功执行指令");
                                        });
                                    }
                                }
                            }
                        }
                        ,align: 'right' //右对齐弹出（v2.6.8 新增）
                        // ,style: 'box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);' //设置额外样式
                    });
                }else{
                    var field = obj.event;
                    var value = data[devcode];
                    dropdown.render({
                        elem: that
                        ,show: true //外部事件触发即显示
                        ,data: [{
                            title: '查看波形数据'
                            ,id: 'waveform'
                        }, {
                            title: '下载实时数据'
                            ,id: 'trace'
                        }, {
                            title: '下载触发事件'
                            ,id: 'trigger'
                        }]
                        ,click: function(data, othis){
                            //根据 id 做出不同操作
                            if(data.id === 'waveform'){
                                window.open("../monitor/devdata?devcode="+devcode+"&date="+field)
                            } else if(data.id === 'trace') {
                                layer.msg('得到表格下拉菜单 id：'+ data.id);
                            }
                        }
                        ,align: 'right' //右对齐弹出（v2.6.8 新增）
                        ,style: 'box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);' //设置额外样式
                    });
                }
                // layer.prompt({
                //     formType: 2
                //     ,title: '修改 ID 为 ['+ data.id +'] 的用户签名'
                //     ,value: data.sign
                // }, function(value, index){
                //     layer.close(index);
                //     //这里一般是发送修改的Ajax请求
                //     //同步更新表格和缓存对应的值
                //     obj.update({
                //         sign: value
                //     });
                // });
            });
        });
    }

    //下载更新台站监测数据信息
    function fetchLastData() {
        $.getJSON("../monitor/fetchMonitorRunrate",{month:select_month},function (result) {
            curSelectDataList = result;
            renderMonitorData();
        });
        /*$.ajax({
            ///monitor/fetchMonitorRunrate?pointid=CN.23540&month=2021-11
            url: "../monitor/fetchMonitorRunrate.json?t=" + new Date().getTime(), success: function (result) {
                lastMonitorDataList = result;
                console.log("Downloa real_monitor_data.json succ...");
                for (var it in lastMonitorDataList) {
                    if (lastMonitorDataDict[lastMonitorDataList[it].recorder] == null) {
                        lastMonitorDataDict[lastMonitorDataList[it].recorder] = [];
                    }
                    lastMonitorDataList[it].status = parseDevStatus(lastMonitorDataList[it])
                    lastMonitorDataDict[lastMonitorDataList[it].recorder].push(lastMonitorDataList[it])
                }
                //console.log(lastMonitorDataDict);
                var dev_type = $("#dev_type_select").val()=="null"?"ALL":$("#dev_type_select").val();
                renderMonitorDataByDevType(dev_type);
            }
        });*/
    }

    //设备控制指令
    function devcontrol(pointid,cmd,type){
        if(confirm("确定对"+pointid+"执行指令?")){
            $.get("../monitor/control",{pointid:pointid,cmd:cmd,type:type},function (resp) {
                alert(pointid+"成功执行指令");
            });
        }
    }

    /**
     * 获取基础参数
     * @param type
     */
    function getStaPar(type){
        $.getJSON("../monitor/getdevinfo",{code:cur_devcode},function (result) {
            $("#staInfoTable").parent().show();
            $.each(result,function (key,value) {
                // console.log("key:"+value)
                $("#"+key).val(value);
            });
            for(var i=0;i<3;i++){
                $("#ChCode"+i).val(result["ChCode"].split(",")[i]);
                $("#LocID"+i).val(result["LocID"].split(",")[i]);
                $("#Gain"+i).val(result["Gain"].split(",")[i]);
                $("#SensorMode"+i).val(result["SensorMode"].split(",")[i]);
                $("#SensorSen"+i).val(result["SensorSen"].split(",")[i]);
                $("#SensorLow"+i).val(result["SensorLow"].split(",")[i]);
                $("#SensorHigh"+i).val(result["SensorHigh"].split(",")[i]);
                $("#DataHP"+i).val(result["DataHP"].split(",")[i]);
            }
            //"NetCode":"SH","StaCode":"49811"
            $(".stapar_title").text("["+result["NetCode"]+"."+result["StaCode"]+"]台站参数修改");
            $("#saveParam").val(result["NetCode"]+"."+result["StaCode"]);
        });
    }

    $(function () {
        fetchLastData()

        $(".stapar_close").on("click",function () {
            $("#staInfoTable").parent().hide();
        });
        //保存参数
        $(".save_params").click(function () {
            var staid = $(this).attr("id");
            var message = "您确定要执行保存[" + staid + "]参数操作吗?";
            var ChCode = [];
            var LocID = [];
            var Gain = [];
            var SensorMode = [];
            var SensorSen = [];
            var SensorLow = [];
            var SensorHigh = [];
            var DataHP = [];
            for(var i=0;i<3;i++){
                ChCode.push($("#ChCode"+i).val());
                LocID.push($("#LocID"+i).val());
                Gain.push($("#Gain"+i).val());
                SensorMode.push($("#SensorMode"+i).val());
                SensorSen.push($("#SensorSen"+i).val());
                SensorLow.push($("#SensorLow"+i).val());
                SensorHigh.push($("#SensorHigh"+i).val());
                DataHP.push($("#DataHP"+i).val());
            }
            $("#ChCode").val(ChCode.toString());
            $("#LocID").val(LocID.toString());
            $("#Gain").val(Gain.toString());
            $("#SensorMode").val(SensorMode.toString());
            $("#SensorSen").val(SensorSen.toString());
            $("#SensorLow").val(SensorLow.toString());
            $("#SensorHigh").val(SensorHigh.toString());
            $("#DataHP").val(DataHP.toString());
            if (confirm(message)) {
                $.post("/static/monitor/savepar",$("#par_form").serialize(),function (resp) {
                    alert(resp);
                });
            }
        });
    })
</script>
</body>
</html>
