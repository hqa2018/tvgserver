<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Layui</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <asset:stylesheet href="layui/css/layui.css"/>
    <asset:javascript src="jquery-3.3.1.min.js"/>
    <asset:javascript src="utils.js"/>
    <style type="text/css">
        .layui-table-cell {
            padding: 0 5px;
        }
        .layui-table-header table .layui-table-cell {
            padding: 0 5px;
            font-size: 10px;
            /*line-height: 29px;*/
        }
    </style>
</head>
<body>
<table class="layui-hide" id="test" lay-filter="rateEvent"></table>
<asset:javascript src="layui/layui.js"/>
<script>
    //当前选择数据列表
    var curSelectDataList = null;
    var select_month = "2021-11"

    function buildColumn(select_month) {
        var cols = [];
        var h = [
            {type: 'checkbox', fixed: 'left'}
            , {field: 'pointid', title: '台站代码', sort: true, align: 'center'}
            // , {field: 'stacode', title: '台站代码', align: 'center'}
            // , {field: 'staname', title: '台站名称', align: 'center', width: 150}
        ]
        var d = [];
        for(var i=1;i<=TimeFrameUtil.daysInMonth(select_month);i++){
            var datestr = select_month + "-" +(i < 10 ? "0"+i : i);
            // console.log(datestr)
            d.push({field: datestr, title: datestr.split("-")[2], width: 35,event: datestr, align: 'center'})

        }
            /*[
                {field: 'VM1_status', title: 'CH1零位', align: 'center',
                    templet:function (d) {return parseMonChnData(d.recorder,"VM1_status",d.VM1_status)}}
                , {field: 'VM2_status', title: 'CH2零位', align: 'center',
                    templet:function (d) {return parseMonChnData(d.recorder,"VM2_status",d.VM2_status)}}
            ];*/

        cols.push($.merge(h, d));
        return cols;
    }

    //构建列表显示
    function renderMonitorData() {
        layui.use(['table','dropdown'], function(){
            var dropdown = layui.dropdown;
            var table = layui.table;
            table.render({
                elem: '#test'
                ,id:"quality"
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

            //监听单元格事件
            table.on('tool(rateEvent)', function(obj){
                var that = this
                // var data = obj.data;
                var field = obj.event;
                var value = obj.data[obj.event];

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
                            window.open("../monitor/devdata?devcode=660494981160")
                            // layer.confirm('真的删除行么', function(index){
                            //     obj.del();
                            //     layer.close(index);
                            // });
                        } else {
                            layer.msg('得到表格下拉菜单 id：'+ data.id);
                        }
                    }
                    ,align: 'right' //右对齐弹出（v2.6.8 新增）
                    ,style: 'box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);' //设置额外样式
                });

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

    $(function () {
        fetchLastData()
    })
</script>
</body>
</html>