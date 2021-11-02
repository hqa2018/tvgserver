var alertMap = {};//监测项字典信息列
var pieChart;           //状态饼图
var batteryObj = {}     //电池电量
var stacount = 0;       //台站总数
var staDeviceMap = {}   //台站设备名称
var alarmContent = "";  //报警内容
var staParams = {}      //台站参数内容

var alarmMode = 0
var alarmMaxData = {};  //报警最大值
var statusArr = [0, 0, 0]
var audioPlay = false
let manCode = "";
let staCode = "";
var closeSta = ""; //关闭窗口时，需解除报警的台站
var closeSign = true; //是否已经点击过关闭窗口

function initAlarmPop() {
    $(".button_close").click(function(){
        closeSign = false
        // clickJcbj(); 解除报警命令
        $("#div_alert").css("display","none");
        $("#alarm_pause").click();
        //设置8秒后重新弹出
        setTimeout(function(){ closeSign = true; }, 1000*10);

    });
}

//初始化报警设置
function initAlarmSetting() {
    //批量设置
    $("#alarm_bat").click(function () {
        $(".alparam_title").text("批量设置报警参数");
        $("#guardEnable").prop('checked',localStorage.getItem("guardEnable"));
        $("#range2").val(localStorage.getItem("range2"));
        $("#range7").val(localStorage.getItem("range7"));
        $("#_range7").val(localStorage.getItem("_range7"));
        $("#range8").val(localStorage.getItem("range8"));
        $("#_range8").val(localStorage.getItem("_range8"));

        $(".save_alarm").attr("id", "all");
        popupCenter($("#div_setQJ"))    //弹窗居中
        $("#div_setQJ").css("display", "block");
        if ($('#menu').is(':visible')) {
            $('#menu').hide();
        }
    });

    //保存报警参数
    $(".save_alarm").click(function () {
        var staid = $(this).attr("id");
        var message = "您确定要执行保存所有报警参数操作吗?";
        if(staid !== "all"){
            staid = staid.replace("_",".")
            message = "您确定要执行保存[" + staid + "]报警参数操作吗?";
        }
        if (confirm(message)) {
            $.post("../monitor/saveAlertConfig", {
                pointid : staid,
                guardEnable : $("#guardEnable").prop("checked"),
                ch1Range : "",
                ch2Range : $("#range2").val(),
                // ch3Range : $("#range3").val()+"#"+$("#_range3").val(),
                // ch4Range : $("#range4").val()+"#"+$("#_range4").val(),
                // ch5Range : $("#range5").val()+"#"+$("#_range5").val(),
                // ch6Range : $("#range6").val()+"#"+$("#_range6").val(),
                ch3Range : "#",
                ch4Range : "#",
                ch5Range : "#",
                ch6Range : "#",
                ch7Range : $("#range7").val()+"#"+$("#_range7").val(),
                ch8Range : $("#range8").val()+"#"+$("#_range8").val()
            },function (resp) {
                if(staid === "all"){
                    localStorage.setItem("guardEnable",$("#guardEnable").prop('checked'));
                    localStorage.setItem("range2",$("#range2").val());
                    localStorage.setItem("range7",$("#range7").val());
                    localStorage.setItem("_range7",$("#_range7").val());
                    localStorage.setItem("range8",$("#range8").val());
                    localStorage.setItem("_range8",$("#_range8").val());
                }
                alert("设置成功");
                $("#div_setQJ").css("display", "none");
            });
        }
    });

    //关闭弹出窗
    $(".alarmpar_close").click(function () {
        $("#div_setQJ").css("display", "none");
    });
}

var startColor = ['#0e94eb', '#c440ef', '#efb013', '#2fda07', '#d8ef13', '#2e4af8', '#0eebc4', '#f129b1', '#17defc', '#f86363'];
var borderStartColor = ['#0077c5', '#a819d7', '#c99002', '#24bc00', '#b6cb04', '#112ee2', '#00bd9c', '#ce078f', '#00b2cd', '#ec3c3c'];


$(document).ready(function(){
    manCode = $(".manCode").val();
    staCode = $(".staCode").val();

    $(".loading").fadeOut()
    // initStationParam();
    // initEcharts();
    initInfo();
    initAlarmPop();
    initAlarmSetting();
    // chart1();

    setInterval(updateStationData, 1000*60);    //定时1分钟加载数据
    // setInterval(refreshPage, 5 * 60 * 1000);    //定时5分钟刷新页面

    $(".button_close").click(function () {
        closeSign = false
        // clickJcbj();
        $("#div_alert").css("display", "none");
        $("#alarm_pause").click();
        setTimeout(function () {
            closeSign = true;
        }, 10000);
    });

    $('.data-content').click(function (e) {
        if (e.target.id != 'menu')
            if ($('#menu').is(':visible')) {
                $('#menu').hide();
            }
    })

    $(".divset_close").click(function () {
        $("#div_setLF").css("display", "none");
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

    //获取par文件参数内容
    $.ajax({
        type: "get",
        async: false,
        url: "/tsa/tsareal/getBaseData",
        data: {manCode, staCode},
        datatype: "json",
        error: function (a, b, c) {
            console.log(c);
        },
        success: function (resp) {
            for (const item of resp) {
                staParams[item.split(",")[1] + "." + item.split(",")[2]] = item;
            }
        }
    });
});


//报警操作
function alarmHandle(alarmList){
    console.log("alarmHandle");
    //$("#div_alert .div_set_main").empty();
    var html = ""
    var height = alarmList.length*130 + 100
    $("#div_alert").css("height",height+"px");
    popupCenter($("#div_alert"))    //弹窗居中
    for(var i=0;i<alarmList.length;i++){
        var alarmobj = alarmList[i]
        var sta_code = alarmobj.stacode.split(".")[1]
        console.log("content="+alarmobj.content)
        closeSta = alarmobj.stacode
        html += alarmobj.content
    }

    //判断不重复报警
    if(closeSign){
        $("#div_alert").css("display","block");
        $("#div_alert .div_set_main").html(html);
    }
    /*if(alarmContent != html&&closeSign){
        $("#div_alert").css("display","block");
        $("#div_alert .div_set_main").html(html);

        for(var i=0;i<alarmList.length;i++){
            var alarmobj = alarmList[i]
            var sta_code = alarmobj.stacode.split(".")[1]
            //报警窗最大值
            for(var n=3; n<=9; n++){
                if($("#"+sta_code+"-"+n).length > 0){
                    $("#"+sta_code+"-"+n).text(alarmMaxData[sta_code+"-"+n])
                }
            }
        }
        alarmContent = html;
    }*/
}

//加载基本信息
function initInfo() {
    $.ajax({
        type: 'GET',
        url: '../monitor/queryrecord',
        data: {
            manCode, staCode
        },
        dataType: 'json',
        success: function (resp) {
            $(".info_list").empty()
            var HTML = ""
            stacount = resp.length;
            // resp = sortDataList(resp)      //按设备类型排序
            for (var i = 0; i < resp.length; i++) {
                var stacode = resp[i].pointid.split(".")[1]
                var pointid = resp[i].pointid

                //获取par文件参数内容
                //初始化最大值
                for (var k = 3; k <= 9; k++) {
                    alarmMaxData[stacode + "-" + k] = 0
                }
                //batteryObj[stacode] = 0
                var alertvalue = resp[i]
                HTML += "<div id=\"" + pointid.replace(".","_") + "\" type=\""+resp[i].devcode+"\" class=\"info boxstyle\">";
                HTML += "<div class=\"title\"><img src=\"/static/images/info-img-3.png\" width=\"36\">TVG-60[" + resp[i].pointid + "] <span id='" + stacode + "_time' class=\"title-time\">"+resp[i].datatime+"</span></div>"
                HTML += "<div class=\"" + stacode + "_info info-main-9 info_lf\">"
                HTML += "<ul>"
                HTML += "<li id=\"" + stacode + "_0" + "\"><span>防盗报警</span><img src=\"/static/images/gray_0.png\" style=\"margin-top: 3px;margin-bottom: 3px;width:30px\"></li>"
                for(var j=1;j<=8;j++){
                    alertMap[resp[i].pointid + "ch"+j] = Number(alertvalue["ch"+j]);
                    var ch_name = alertvalue["ch"+j+"_name"];
                    var ch_val = Number(alertvalue["ch"+j]);
                    if(j==1){
                        ch_val = parseGSPStatus(alertvalue["ch"+j])
                    }
                    console.log("ch_val="+ch_val)
                    if(j>3)
                        ch_val = Number(alertvalue["ch"+j]).toFixed(2)
                    if(resp[i].datatime == "NULL"){
                        HTML += "<li><span>"+parseChName(j)+"</span><p id=\"" + stacode + "_ch"+j+"\" class=\"text-muted \"> - </p><span>"+parseChUnit(j)+"</span></li>"
                    }else{
                        HTML += "<li><span>"+parseChName(j)+"</span><p id=\"" + stacode + "_ch"+j+"\" class=\"text-success \">" + ch_val + "</p><span>"+parseChUnit(j)+"</span></li>"
                    }
                }
                HTML += "</ul>"
                HTML += "</div>"
                HTML += "</div>"
            }
            $(".info_list").append(HTML)
            // initStationParam();
            // setTimeout(echarts_5, 2000);
            rightclick();

            //报警按钮
            $(".alertBtn").bind("click", function () {
                if ($('#menu').is(':visible')) {
                    $('#menu').hide();
                }
                var stationId = $(this).attr("id");
                var spsId = stationId.split("_");
                var message = "您确定要对" + $(this).text() + "执行操作吗?";
                if (confirm(message)) {
                    $.ajax({
                        type: 'GET',
                        url: '/tsa/tsareal/intensityservice',
                        data: {
                            operation: 'alertset',
                            pointid: spsId[0],
                            cmd: spsId[1]
                        },
                        dataType: 'text',
                        success: function (resp) {
                            alert("操作成功！")
                        },
                        error: function () {
                            alert("操作成功！")
                        }
                    });
                }
            });


            //重启按钮
            $(".rebootBtn").bind("click", function () {
                if ($('#menu').is(':visible')) {
                    $('#menu').hide();
                }
                var stationId = $(this).attr("id");
                var pointid = stationId.split("_")[0];
                var message = "您确定要进行重启操作吗?"+pointid;
                if (confirm(message)) {
                    $.getJSON("/static/monitor/restart",{pointid:pointid},function (resp) {
                        alert(resp);
                    })
                }
            });
        }
    });
}


/**
 * 定时更新数据
 */
function updateStationData() {
    //获取par文件参数内容
    $.ajax({
        type: "GET",
        url: "../monitor/queryrecord",
        data:{},
        // data: {pointid: "all", manCode: manCode, staCode: staCode},
        success: function (data) {
            var successcount = 0;
            var warncount = 0;
            var alarmList = [];
            let alarmDeviceList = [];
            for (var i = 0; i < data.length; i++) {
                var staint = data[i]
                if (staint == null || staint == "")
                    continue;
                var stacode = staint.pointid.split(".")[1]
                var alarmtext = ""
                //数据解析
                $("#" + stacode + "_time").text(staint.datatime);      //数据时间
                if(staint.datatime == "NULL"){
                    for (var n = 1; n <= 8; n++) {
                        $("#" + stacode + "_ch" + n).text("-");
                    }
                }else{
                    var alarm_trig = false;    //报警触发
                    //防盗未启用
                    if(staint["guard_status"] === "0"){
                        if($("#"+stacode+"_0 img").attr("src").indexOf("gray") === -1)
                            $("#"+stacode+"_0 img").attr("src","/static/images/gray_0.png?t=" + new Date().getTime())
                    }
                    //防盗正常
                    if(staint["guard_status"] === "1"){
                        if($("#"+stacode+"_0 img").attr("src").indexOf("green") === -1)
                            $("#"+stacode+"_0 img").attr("src","/static/images/green_0.png?t=" + new Date().getTime())
                    }
                    //防盗报警触发
                    if(staint["guard_status"] === "2"){
                        alarm_trig = true;
                        if($("#"+stacode+"_0 img").attr("src").indexOf("red") === -1)
                            $("#"+stacode+"_0 img").attr("src","/static/images/red_0.png?t=" + new Date().getTime())
                    }

                    //阈值触发
                    for (var n = 3; n <= 8; n++) {
                        var ch_val = staint["ch"+n];
                        if(n==1){
                            ch_val = parseGSPStatus(ch_val)
                        }
                        $("#" + stacode + "_ch" + n).text(ch_val);
                        console.log("ch"+n+"_status:"+staint["ch"+n+"_status"])
                        if(staint["ch"+n+"_status"] === "0"){
                            alarm_trig = true;
                            $("#" + stacode + "_ch" + n).attr("class","text-danger")
                        }else{
                            $("#" + stacode + "_ch" + n).attr("class","text-success")
                        }
                    }

                    //触发报警弹出窗
                    if(alarm_trig){
                        console.log("报警台站:"+staint.pointid);
                        // alarmtext += $("#"+staint.pointid).prop("outerHTML").allReplace(stacode+"_",stacode+"-");
                        var pointid = staint.pointid.replace(".","_")
                        alarmtext += $("#"+pointid).prop("outerHTML");
                        var alarmObj = {
                            stacode     : staint.pointid,
                            content     : alarmtext
                            // data        : alarmDevice
                        }
                        alarmList.push(alarmObj);
                        alarm_trig = true;
                        warncount++
                    }else{
                        successcount++
                    }
                }
            }

            if(warncount > 0){
                console.log("报警弹出"+new Date());
                alarmHandle(alarmList)
            }

            //饼图更新
            var failcount = stacount - warncount - successcount
            if (statusArr.toString() != [successcount, warncount, failcount].toString()) {
                statusArr = [successcount, warncount, failcount];

                var option = pieChart.getOption();
                var piedata = []
                var colordata = []

                if (successcount > 0) {
                    piedata.push({value: successcount, name: '正常'});
                    colordata.push('#00FF00')
                }
                if (warncount > 0) {
                    piedata.push({value: warncount, name: '报警'});
                    colordata.push('#FF0000')
                }
                if (failcount > 0) {
                    piedata.push({value: failcount, name: '离线'});
                    colordata.push('#666666')
                }

                //状态饼图
                option.series[0].data = piedata;
                option.series[0].color = colordata;
                pieChart.setOption(option);
                //console.info("update pie ="+statusArr)
            }

        }
    });
}

//加载图标
function chart1() {
    //data 为模拟数据
    var data = [{
        name: '正常',
        value: 10,
        percent: '30.8721',
    }, {
        name: '异常',
        value: 5,
        percent: '34.076',
    }, {
        name: '中断',
        value: 1,
        percent: '35.49',
    }];
    var myChart = echarts.init(document.getElementById('pie'));
    // var myChart1 = echarts.init(document.getElementById('pie1'));
    window.addEventListener('resize', function () {
        myChart.resize();
        // myChart1.resize();
    });

    var str = '';
    for (var i = 0; i < data.length; i++) {
        str += '<p><span><i class="legend" style="background:' + startColor[i] + '"></i></span>' + data[i].name + '<span class="pie-number" style="color:' + startColor[i] + '">' + data[i].value + '</span>' + Number(data[i].percent).toFixed(2) + '%</p>';
    }

    $('.pie-data').append(str);


    function deepCopy(obj) {
        if (typeof obj !== 'object') {
            return obj;
        }
        var newobj = {};
        for (var attr in obj) {
            newobj[attr] = obj[attr];
        }
        return newobj;
    }
    var xData = [],
        yData = [];
    data.map((a, b) => {
        xData.push(a.name);
        yData.push(a.value);
    });


    var RealData = [];
    var borderData = [];
    data.map((item, index) => {
        var newobj = deepCopy(item);
        var newobj1 = deepCopy(item);
        RealData.push(newobj);
        borderData.push(newobj1);
    });
    RealData.map((item, index) => {
        item.itemStyle = {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: startColor[index] // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: startColor[index] // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
            }
        }
    });
    borderData.map((item, index) => {
        item.itemStyle = {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: borderStartColor[index] // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: borderStartColor[index] // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
            }
        }
    });
    var option = {
        tooltip: {
            trigger: 'item',
            //            position: ['30%', '50%'],
            confine: true,
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            // 主要展示层的
            {
                radius: ['50%', '85%'],
                center: ['50%', '50%'],
                type: 'pie',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                name: "派件入库量占比内容",
                data: RealData
            },
            // 边框的设置
            {
                radius: ['45%', '50%'],
                center: ['50%', '50%'],
                type: 'pie',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                animation: false,
                tooltip: {
                    show: false
                },
                data: borderData
            }
        ]
    };

    myChart.setOption(option);
    // myChart1.setOption(option);
}

function initEcharts() {
    // 基于准备好的dom，初始化echarts实例
    pieChart = echarts.init(document.getElementById('echarts_4'));

    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: <br/>  {c} ({d}%)"
        },

        toolbox: {
            show: false,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        series: [
            {
                name: '排名',
                type: 'pie',
                color: ['#00FF00', '#FF0000', '#666666'],
                radius: [20, 70],
                center: ['50%', '50%'],
                roseType: 'radius',
                data: [
                    {value: 0, name: '正常'},
                    {value: 0, name: '报警'},
                    {value: 0, name: '离线'},

                ]
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    pieChart.setOption(option);
    window.addEventListener("resize", function () {
        pieChart.resize();
    });
}

//电池电量排行图表
function echarts_5() {
    //console.info("echarts_5");
    var myChart = echarts.init(document.getElementById('echarts_5'));
    var xData = [];
    var data = []

    var dataList = sortObj(batteryObj)
    for (var i = 0; i < dataList.length; i++) {
        xData.push(dataList[i]["key"]);
        data.push(dataList[i]["value"]);
    }

    option = {
        tooltip: {
            show: "true",
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.4)', // 背景
            padding: [8, 10], //内边距
            // extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
            formatter: function (params) {
                if (params.seriesName != "") {
                    return staDeviceMap[params.name.split(".")[1]] + '[' + params.name + ']电量' + ' ：' + params.value + '%';
                }
            },

        },
        grid: {
            borderWidth: 0,
            top: 20,
            bottom: 35,
            left: 40,
            right: 10,
            textStyle: {
                color: "#fff"
            }
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },

            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)',
                }
            },
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#bac0c0',
                    fontWeight: 'normal',
                    fontSize: '12',
                },
                // formatter:function(val){
                //     return val.split("").join("\n")
                // },
            },
            data: xData,
        }, {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: xData,
        }],
        yAxis: {
            min: 0,
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.2)',
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.1)',
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#bac0c0',
                    fontWeight: 'normal',
                    fontSize: '12',
                },
                formatter: '{value}',
            },
        },
        series: [{
            type: 'bar',
            itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#00c0e9'
                    }, {
                        offset: 1,
                        color: '#3b73cf'
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,
                },
                emphasis: {
                    shadowBlur: 15,
                    shadowColor: 'rgba(105,123, 214, 0.7)'
                }
            },
            zlevel: 2,
            barWidth: '20%',
            data: data,
        }
        ]
    }


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

function sortDataList(resp) {
    var arr = []
    for (var i = 0; i < resp.length; i++) {
        var obj = resp[i]
        arr.push([obj.type, obj])
    }
    ;

    arr.sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    });

    var resp_arr = []
    for (var j = 0; j < arr.length; j++) {
        resp_arr.push(arr[j][1])
    }
    return resp_arr;
}

function sortObj(obj) {
    var arr = [];
    for (var i in obj) {
        arr.push([obj[i], i]);
    }
    ;
    arr.sort(function (a, b) {
        return a[0] - b[0];
    });
    var len = arr.length;

    var objarr = []
    //var newobj = {};
    for (var i = 0; i < len; i++) {
        //newobj[arr[i][1]] = arr[i][0];
        //console.info(arr[i][1]+"=="+arr[i][0])
        objarr.push({key: arr[i][1], value: arr[i][0]})
    }
    return objarr;
}

/*
 * 播放声音
 * 	1、是否自动播放：
 *		autostart=true、false
 *	2、循环播放次数：
 *		loop=正整数、true、false
 *	3、面板是否显示：
 *		hidden=ture、no
 */
function playSound() {
    //非IE内核浏览器
    var strAudio = "<audio id='audioPlay' src='/static/images/alarm.m4a?t=" + new Date().getTime() + "' hidden='true' >";
    if ($("body").find("audio").length <= 0)
        $("body").append(strAudio);
    var audio = document.getElementById("audioPlay");
    //浏览器支持 audio
    audio.play();
    audioPlay = true;
    // $("body").find('audio').get(0).play();
    // $("body").find("audio").bind('ended',function () {
    // $(this).get(0).play();
    // });
}

function playPause() {
    //非IE内核浏览器
    var strAudio = "<audio id='audioPlay' src='/static/images/alarm.m4a?t=" + new Date().getTime() + "' hidden='true' >";
    if ($("body").find("audio").length <= 0)
        $("body").append(strAudio);
    var audio = document.getElementById("audioPlay");
    //浏览器支持 audio
    audio.pause();
    audioPlay = false

}

//右键点击方法
function rightclick() {
    $(".info").bind("contextmenu", function () {
        return false;
    })
    $("#alert_setLF").css("display", "none");
    $("#div_setLF").css("display", "none");
    var menu = document.querySelector("#menu");
    var div = document.querySelectorAll(".info");
    // var type = $(this).attr("type")
    // alert(type)
    for (var i = 0; i < div.length; i++) {
        div[i].addEventListener("contextmenu", function (event) {
            event.preventDefault();
            menu.style.display = "block";
            menu.style.left = event.pageX + "px";
            menu.style.top = event.pageY + "px";
            //判断是否为屏幕底部
            var screenHeight = $(window).height();
            var objTop = screenHeight - event.pageY;
            if (objTop < 160)
                menu.style.top = (event.pageY - 160) + "px";
            //obj.css({left: objLeft + 'px', top: objTop + 'px'});
            //console.info("menuTop="+menu.style.top);

            var staid = $(this).attr("id").replace("_",".");
            var type = $(this).attr("type")

            //修改参数
            // $("#editDev").val(type)
            // $("#saveParam").val(staid);d
            $("#editDev").click(function () {
                popupCenter($("#staInfoTable").parent())    //弹窗居中
                $("#staInfoTable").parent().css("display", "block");
                if ($('#menu').is(':visible')) {
                    $('#menu').hide();
                }
                getStaPar(type);
            });

            $(".stapar_close").on("click",function () {
                $("#staInfoTable").parent().hide();
            });

            //报警参数
            $("#alertDev").click(function () {
                popupCenter($("#staAlarmTable").parent())    //弹窗居中
                $("#staAlarmTable").parent().hide();
                var code = $(this).val();
                if ($('#menu').is(':visible')) {
                    $('#menu').hide();
                }
                getAlarmPar(code);
            });

            $(".alarm_close").click(function () {
                $("#staAlarmTable").parent().hide();
            })

            $("#menu li").each(function () {
                if ($(this).hasClass("alarm_on")) {
                    $(this).attr("id", staid + "_1")
                }
                if ($(this).hasClass("alarm_off")) {
                    $(this).attr("id", staid + "_2")
                }
                if ($(this).hasClass("alarm_ban")) {
                    $(this).attr("id", staid + "_0")
                }
                if ($(this).hasClass("rebootBtn")) {
                    $(this).attr("id", staid + "_0")
                }
            });



            //修改报警值
            /*$(".alert_scssz").click(function () {
                // console.log("staid:"+staid);
                // var pointid = staid.replace("_",".")
                // console.log("pointid:"+pointid);
                $.getJSON("../monitor/getAlertConfig",{pointid:staid},function (resp) {
                    $("#guardEnable").prop('checked',resp["guardEnable"]);
                    $("#range2").val(resp["ch2Range"]);
                    for(var i=3;i<=8;i++){
                        var range = resp["ch"+i+"Range"];
                        if(range !== "#" && range !== ""){
                            $("#range"+i).val(range.split("#")[0]);
                            $("#_range"+i).val(range.split("#")[1]);
                        }else{
                            $("#range"+i).val("");
                            $("#_range"+i).val("");
                        }
                    }
                });
                $(".save_alarm").attr("id", staid);
                popupCenter($("#div_setQJ"))    //弹窗居中
                $("#div_setQJ").css("display", "block");
                if ($('#menu').is(':visible')) {
                    $('#menu').hide();
                }
            })*/
        });
    }
}

//初始化弹出窗
function initPopup(){


    //报警参数
    $("#alertDev").click(function () {
        $("#staCodeInfoTable").parent().hide();
        var code = $(this).val();
        // console.log("code:"+code);
        getAlarmPar(code);
    });

    $(".alarm_close").click(function () {
        $("#staAlarmTable").parent().hide();
    })
}

/**
 * 获取基础参数
 * @param type
 */
function getStaPar(type){
    $.getJSON("../monitor/getdevinfo",{code:type},function (result) {
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

function getAlarmPar(staid) {
    console.log("staid:"+staid );
    $("#staAlarmTable").parent().show();
    $.getJSON("../monitor/getAlertConfig",{pointid:staid},function (resp) {
        $("#guardEnable").prop('checked',resp["guardEnable"]);
        $("#range2").val(resp["ch2Range"]);
        for(var i=3;i<=8;i++){
            var range = resp["ch"+i+"Range"];
            console.log("range:"+range)
            if(range == null || range === ""){
                $("#range"+i).val("");
                $("#_range"+i).val("");
            }else{
                $("#range"+i).val(range.split("#")[0]);
                $("#_range"+i).val(range.split("#")[1]);
            }
        }
    });
    $("#saveAlarm").val(staid);
}


