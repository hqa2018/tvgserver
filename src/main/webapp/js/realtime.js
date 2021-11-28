let root_path = "tvgserver/"
var alertMap = {};//监测项字典信息列
var pieChart;           //状态饼图
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
let cur_devcode = "";   //当前设备代码
let cur_pointid = "";   //当前设备台网台站代码

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

    //保存参数
    $("#saveParam").click(function () {
        var staid = $(this).attr("value");
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
            $.get("../monitor/savepar",$("#par_form").serialize(),function (resp) {
                alert("已发送修改指令");
            });
        }
    });

    //保存报警参数
    /*$(".save_alarm").click(function () {
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
    });*/

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
    echarts_1();
    echarts_4();

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
            $.post("..monitor/savepar",$("#par_form").serialize(),function (resp) {
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
        // console.log("content="+alarmobj.content)
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

//过滤通道
var chFilter = [6,7,8,9]

//加载基本信息
function initInfo() {
    $.ajax({
        type: 'GET',
        url: '../monitor/fetchMonStatusData',
        data: {
            manCode, staCode
        },
        dataType: 'json',
        success: function (resp) {
            $(".info_list").empty()
            var HTML = ""
            stacount = resp.length;
            resp = sortDataList(resp)      //按状态进行排序
            for (var i = 0; i < resp.length; i++) {
                var stacode = resp[i].pointid.split(".")[1]
                var pointid = resp[i].pointid
                //获取par文件参数内容
                //batteryObj[stacode] = 0
                var alertvalue = resp[i]
                HTML += "<div id=\"" + pointid.replace(".","_") + "\" type=\""+resp[i].devcode+"\" class=\"info boxstyle\" style='margin-left: 5px'>";
                HTML += "<div class=\"title\"><img src=\"../static/images/info-img-3.png\" width=\"30\">[" + resp[i].pointid + "] <span id='" + stacode + "_time' class=\"title-time\">"+resp[i].datatime+"</span></div>"
                HTML += "<div class=\"" + stacode + "_info info-main-9 info_lf\">"
                HTML += "<ul>"
                var img = alertvalue.status == "0" ? "gray_0" : "green_0";

                HTML += "<li id=\"" + stacode + "_0" + "\"><span></span><img src=\"../static/images/"+img+".png\" style=\"margin-top: 3px;margin-bottom: 3px;width:30px\"></li>"
                for(var j=1;j<=11;j++){
                    //过滤通道
                    if(chFilter.indexOf(j) > -1){
                        continue;
                    }
                    var ch_name = alertvalue["ch"+j+"_name"];
                    var ch_val = Number(alertvalue["ch"+j]);
                    if(j==4){
                        ch_val = parseGSPStatus(alertvalue["ch"+j])
                    }
                    // console.log("ch_val="+ch_val)
                    // if(j>3)
                    //     ch_val = Number(alertvalue["ch"+j]).toFixed(2)
                    if(resp[i].datatime == "NULL"){
                        HTML += "<li><span>"+ch_name+"</span><p id=\"" + stacode + "_ch"+j+"\" class=\"text-muted \"> - </p></li>"
                    }else{
                        // console.log(ch_name+"="+ch_val)
                        HTML += "<li><span>"+ch_name+"</span><p id=\"" + stacode + "_ch"+j+"\" class=\"text-success \">" + ch_val + "</p></li>"
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
                    $.getJSON("../monitor/restart",{pointid:pointid},function (resp) {
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
    console.log("updateStationData----")
    //获取par文件参数内容
    $.ajax({
        type: "GET",
        url: "../monitor/fetchMonStatusData",
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
                    $("#" + stacode + "_time").text("中断");      //数据时间
                    for (var n = 1; n <= 8; n++) {
                        $("#" + stacode + "_ch" + n).text("-");
                    }
                }else{
                    var alarm_trig = false;    //报警触发
                    //防盗未启用
                    if(staint["status"] === "0"){
                        if($("#"+stacode+"_0 img").attr("src").indexOf("gray") === -1)
                            $("#"+stacode+"_0 img").attr("src","../static/images/green_0.png?t=" + new Date().getTime())
                            // $("#"+stacode+"_0 img").attr("src","../static/images/gray_0.png?t=" + new Date().getTime())
                    }
                    //防盗正常
                    if(staint["status"] === "1"){
                        if($("#"+stacode+"_0 img").attr("src").indexOf("green") === -1)
                            $("#"+stacode+"_0 img").attr("src","../static/images/green_0.png?t=" + new Date().getTime())
                    }
                    //防盗报警触发
                    if(staint["status"] === "2"){
                        alarm_trig = true;
                        if($("#"+stacode+"_0 img").attr("src").indexOf("red") === -1)
                            $("#"+stacode+"_0 img").attr("src","../static/images/red_0.png?t=" + new Date().getTime())
                    }
                    // console.log("../static/images/gray_0.png?t=" + new Date().getTime())
                    for (var n = 1; n <= 11; n++) {
                        //过滤通道
                        if(chFilter.indexOf(n) > -1){
                            continue;
                        }
                        var ch_val = staint["ch"+n];
                        if(n==4){
                            // console.log("GPS:"+ch_val)
                            ch_val = parseGSPStatus(ch_val)
                        }
                        $("#" + stacode + "_ch" + n).text(ch_val);
                        if(staint["ch"+n+"_status"] === "0"){
                            alarm_trig = true;
                            $("#" + stacode + "_ch" + n).attr("class","text-danger")
                        }else{
                            $("#" + stacode + "_ch" + n).attr("class","text-success")
                        }
                    }

                    //触发报警弹出窗
                    if(alarm_trig){
                        // console.log("报警台站:"+staint.pointid);
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

            console.log("successcount:"+successcount)

            //饼图更新
            var failcount = stacount - warncount - successcount
            if (statusArr.toString() != [successcount, warncount, failcount].toString()) {
                statusArr = [successcount, warncount, failcount];
                chart1();
                /*var option = pieChart.getOption();
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
                pieChart.setOption(option);*/
                //console.info("update pie ="+statusArr)
            }

        }
    });
}

//加载图标
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

function sortDataList(resp) {
    var arr = []
    for (var i = 0; i < resp.length; i++) {
        var obj = resp[i]
        arr.push([obj.status, obj])
    }
    ;

    arr.sort(function (a, b) {
        return b[0].localeCompare(a[0]);
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

    layui.use(['dropdown', 'util', 'layer', 'table'], function(){
        var dropdown = layui.dropdown;
        //右键菜单
        var inst = dropdown.render({
            elem: '.info' //也可绑定到 document，从而重置整个右键
            ,trigger: 'contextmenu' //contextmenu
            ,isAllowSpread: false //禁止菜单组展开收缩
            ,style: 'width: 200px' //定义宽度，默认自适应
            ,id: 'dev_control' //定义唯一索引
            ,data: [{
                title: '参数设置'
                ,id: 'setpar'
            },{
                title: '重启设备'
                ,type:'control'
                ,id: 'reboot'
            },{
                title: '采集状态数据'
                ,type:'control'
                ,id: 'monitor'
            }
            ,{
                title: '设置防盗参数'
                ,type:'control'
                ,id: 'alert'
            }
            ,{
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
            }
            /*,{
                title: '事件下载'
                ,id: 'download'
            }*/
            ]
            ,className: 'site-dropdown-custom'
            ,click: function(obj, othis){
                if(obj.id === 'setpar'){
                    popupCenter($("#staInfoTable").parent())    //弹窗居中
                    $("#staInfoTable").parent().css("display", "block");
                    getStaPar($(this).attr("devcode"));
                    // layer.msg('click');
                } else if(obj.id === 'print'){
                    window.print();
                } else if(obj.id === 'reload'){
                    location.reload();
                }else{
                    //设备控制
                    if(obj.type == "control"){
                        // alert("set:"+cur_pointid);
                        if(confirm("确定对"+cur_pointid+"执行指令?")){
                            $.get("../monitor/control",{pointid:cur_pointid,cmd:obj.id,type:obj.value},function (resp) {
                                alert(cur_pointid+"成功执行指令");
                            });
                        }
                    }
                }
            }
        });
    });

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
            // event.preventDefault();
            // menu.style.display = "block";
            // menu.style.left = event.pageX + "px";
            // menu.style.top = event.pageY + "px";
            // //判断是否为屏幕底部
            // var screenHeight = $(window).height();
            // var objTop = screenHeight - event.pageY;
            // if (objTop < 160)
            //     menu.style.top = (event.pageY - 160) + "px";
            //obj.css({left: objLeft + 'px', top: objTop + 'px'});
            //console.info("menuTop="+menu.style.top);
            var staid = $(this).attr("id").replace("_",".");
            var type = $(this).attr("type")
            cur_devcode = $(this).attr("type");
            cur_pointid = $(this).attr("id").replace("_",".");
            console.log("staid:"+staid)
            console.log("type:"+type)
            //修改参数
            // $("#editDev").val(type)
            // $("#saveParam").val(staid);d
            // $(".set_control").attr("pointid",staid)
            //
            // $("#editDev").attr("devcode",type);
            //
            // $("#waveBtn").attr("devcode",type);
            //
            // $("#alertDev").attr("pointid",staid);
            //
        });
    }

    $(".set_control").click(function () {
        // alert($(this).attr("pointid")+"_"+$(this).attr("id"))
        var pointid = $(this).attr("pointid");
        var cmd = $(this).attr("id");
        var type = "0";
        $.get("../monitor/control",{pointid:pointid,cmd:cmd,type:type},function (resp) {
            alert(resp);
        })
    })

    //修改参数
    $("#editDev").click(function () {
        popupCenter($("#staInfoTable").parent())    //弹窗居中
        $("#staInfoTable").parent().css("display", "block");
        if ($('#menu').is(':visible')) {
            $('#menu').hide();
        }
        getStaPar($(this).attr("devcode"));
    });
    $(".stapar_close").on("click",function () {
        $("#staInfoTable").parent().hide();
    });

    //修改报警参数
    $("#alertDev").click(function () {
        popupCenter($("#staAlarmTable").parent())    //弹窗居中
        $("#staAlarmTable").parent().hide();
        if ($('#menu').is(':visible')) {
            $('#menu').hide();
        }
        getAlarmPar($(this).attr("pointid"));
    });
    $(".alarm_close").click(function () {
        $("#staAlarmTable").parent().hide();
    })

    //打开波形界面
    $("#waveBtn").click(function () {
        alert($(this).attr("devcode"))
        // window.open("../monitor/devdata?devcode="+$(this).attr("type"))
    })
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

function getAlarmPar(staid) {
    // console.log("staid:"+staid );
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

function echarts_1() {


    console.log("echarts_1")
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));
    option = {
        //  backgroundColor: '#00265f',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '0%',
            top:'10px',
            right: '0%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['CN.23540', 'SH.49811', 'SH.00003'],
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel:  {
                interval: 0,
                // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
            },
        }],
        yAxis: [{
            type: 'value',
            axisLabel: {
                //formatter: '{value} %'
                show:true,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: '12',
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1	)",
                    width: 1,
                    type: "solid"
                },
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                }
            }
        }],
        series: [
            {
                type: 'bar',
                data: [20, 10, 5],
                barWidth:'35%', //柱子宽度
                // barGap: 1, //柱子之间间距
                itemStyle: {
                    normal: {
                        color:'#2f89cf',
                        opacity: 1,
                        barBorderRadius: 5,
                    }
                }
            }

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

function echarts_4() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart4'));

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#dddc6b'
                }
            }
        },
        // legend: {
        //     top:'0%',
        //     data:['点到','未点到'],
        //     textStyle: {
        //         color: 'rgba(255,255,255,.5)',
        //         fontSize:'12',
        //     }
        // },
        grid: {
            left: '10',
            top: '30',
            right: '10',
            bottom: '10',
            containLabel: true
        },

        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLabel:  {
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize:12,
                },
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.2)'
                }

            },
            //日期
            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

        }, {

            axisPointer: {show: false},
            axisLine: {  show: false},
            position: 'bottom',
            offset: 20,



        }],

        yAxis: [{
            type: 'value',
            axisTick: {show: false},
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.1)'
                }
            },
            axisLabel:  {
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize:12,
                },
            },

            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.1)'
                }
            }
        }],
        series: [
            {
                name: '点到',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {

                    normal: {
                        color: '#0184d5',
                        width: 2
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(1, 132, 213, 0.4)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(1, 132, 213, 0.1)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#0184d5',
                        borderColor: 'rgba(221, 220, 107, .1)',
                        borderWidth: 12
                    }
                },
                data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4,3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]

            },
        ]

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}


