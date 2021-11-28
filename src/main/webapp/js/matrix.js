var INTERVAL_TIME = 10000;  //定时更新间隔
//最新台站监测数据列表，此数组为原始数据
var lastMonitorDataList = null;
//点击查询按钮过滤后的监测数据列表
var filterMonitorDataList = [];
//当前选择的监测数据列表
var curSelectMonitorDataList = null;
//当前选择状态
var curSelectMonStatus = "ALL"

$(function () {
    initMapSwitch();    //初始化地图切换控件
    queryMapData();
    // setInterval(updateMapData, 10000);
    // setTimeout(updateMapData,10000); //定时加载数据
    // updateMapData();
});

//初始化弹出窗
function initPopup(){
    //状态信息
    $(".divset_close").on("click",function () {
        $("#staCodeInfoTable").parent().hide();
    });

    //基础参数
    $("#editDev").click(function () {
        $("#staCodeInfoTable").parent().hide();
        var code = $(this).val();
        console.log("code:"+code);
        getStaPar(code);
    });


    $(".stapar_close").on("click",function () {
        $("#staInfoTable").parent().hide();
    });

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


/**
 * 更新设备状态数据
 */
function updateMapData() {
    $.getJSON("../monitor/queryMapData",{},function (resp) {
        try {
            lastMonitorDataList = resp
            //进行状态筛选
            renderMonitorDataByStatus(curSelectMonStatus)
        }catch (e) {
            console.log(e);
        }
        // setPieChart();
        setTimeout(updateMapData,INTERVAL_TIME);
    });
}

//根据查询进行过滤显示
function renderMonitorDataBySearch(staCode) {
    filterMonitorDataList.splice(0, filterMonitorDataList.length);
    for (var it in lastMonitorDataList) {
        if(staCode !== ""){
            if (lastMonitorDataList[it].pointid.indexOf(staCode) >= 0)
                filterMonitorDataList.push(lastMonitorDataList[it])
        }else{
            filterMonitorDataList.push(lastMonitorDataList[it])
        }
    }
    curSelectMonitorDataList = filterMonitorDataList;
    curSelectMonitorDataCount = filterMonitorDataList.length;
    renderMonitorData("ALL");
}

//根据仪器状态进行过滤显示
function renderMonitorDataByStatus(dev_status) {
    // console.log("dev_type:"+dev_type)
    if (dev_status === "ALL") {
        curSelectMonitorDataList = lastMonitorDataList;
    } else {
        // curSelectMonitorDataList = lastMonitorDataDict[dev_type];
    }
    renderMonitorData();
}

//渲染数据显示
function renderMonitorData() {
    vectorSource.clear();
    var len = curSelectMonitorDataList.length;
    console.log("curSelectMonitorDataList.length:" + curSelectMonitorDataList.length)
    for (var n = len - 1; n >= 0; n--) {
        var opt = curSelectMonitorDataList[n];
        var feature = parseFeatureDate(opt)
        vectorSource.addFeature(feature);
    }
    map.addLayer(vectorLayer);
    map.getView().fit(vectorSource.getExtent(), map.getSize());
}

/**
 * 解析构建feature对象
 * @param eqobj
 * @returns {Feature|pd}
 */
function parseFeatureDate(eqobj) {
    console.log(eqobj)
    if(eqobj["status"] === "1"){
        statusCount[0]++
    }else if(eqobj["status"] === "2"){
        statusCount[1]++
    }
    var pid = eqobj.pointid.replace(".","_")
    var latLon = [parseFloat(eqobj.lon), parseFloat(eqobj.lat)];
    var point = new ol.geom.Point(latLon);
    point.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
    var feature = new ol.Feature(point);
    feature.type = 'dev';
    feature.pointid = pid
    feature.setId(new Date().getTime()+Math.random());
    feature.setProperties(eqobj);
    // console.log("eqobj.stationid ="+eqobj.stationid)
    feature.setStyle(itemStyle);
    return feature
}

/*解析设备列表*/
function parseTableCell(eqobj) {
    var html = "";
    var pid = eqobj.pointid.replace(".","_");
    html += '<li class=""><div class="fl">'
    if(eqobj["status"] === "1"){
        html += '<span class="m_yellow">正常</span></div>'
    }else if(eqobj["status"] === "2"){
        html += '<span class="m_red">异常</span></div>'
    }
    html += 		'<dl class="fl"><dt>'+eqobj.pointid+'</dt><dd>'
    html += 	'<p class="o_time">'+eqobj.datatime+'</p>'
    html += 		'<p>纬经度: 103.08,27.42</p></dd>'
    html += 			'</dl></li>'

    /*html += '<li data-pointid="'+pid+'" data-devcode="'+eqobj.devcode+'" className="">'
    html += 	'<div className="fl">'
    if(eqobj["status"] === "1"){
        html += 		'<span className="m_yellow">正常</span></div>'
    }else if(eqobj["status"] === "2"){
        html += 		'<span className="m_red">异常</span></div>'
    }
    html += 	'<dl className="fl">'
    html += 		'<dt>SH.ABCD</dt>'
    html += 		'<dd>'
    html += 			'<p className="div_time"></p>'
    html += 			'<p></p></dd>'
    html += 	'</dl>'
    html += '</li>'*/
    //列表显示
    // html += '<div data-pointid="'+pid+'" data-devcode="'+eqobj.devcode+'" ' +
    // 	'data-lon="'+eqobj.lon+'" data-lat="'+eqobj.lat+'" data-time="'+eqobj.datatime+'" ' +
    // 	'class="sfzcll_box" style="line-height: 64px;">';
    // html += '<div class="sfzcll_smallBk">';
    // html += '<div class="ygl" style="line-height: 54px;">';
    // if(eqobj["status"] === "1"){
    // 	html += '<span>'+'正常'+'</span>';
    // }else if(eqobj["status"] === "2"){
    // 	html += '<span style="color: red">'+'异常'+'</span>';
    // }
    // html += '</div>';
    // html += '</div>';
    // html += '<div class="div_time">'+eqobj.datatime+'</div>';
    // html += '<div class="div_address">'+eqobj.pointid+'</div>';
    // html += '<div class="clear"></div>';
    // html += '</div>';
    return html;
}

/*设置饼图*/
function setPieChart(){
    let myChart = echarts.init(document.getElementById('main3'));
    let data = [];
    // let countNumber = breakList1.length + warnList1.length + normalList1.length+noInputList1.length;
    data.push({
        'value': statusCount[2],
        'itemStyle':{
            "color" : "#959696"
        },
        'name': "中断"
    })
    data.push({
        'value': statusCount[0],
        'itemStyle':{
            "color" : "#078a1b"
        },
        'name': "正常"
    })
    data.push({
        'value': statusCount[1],
        'itemStyle':{
            "color" : "#d81e06"
        },
        'name': "异常"
    })
    // var countNumber1 =  "<div style='font-size:25px;padding-left:4px;'>"+countNumber+"</div>";
    // if(countNumber<10)
    // 	countNumber1 = "<div style='font-size:25px;padding-left:11px;'>"+countNumber+"</div>";
    // if(countNumber>99)
    // 	countNumber1 = "<div style='font-size:25px;margin-left:-3px;'>"+countNumber+"</div>";
    // $(".cityCountDiv").html(countNumber1+"<div style='font-size:22px'>(台)</div>");
    // $(".deviceNumber").text(countNumber);

    let option = {
        // color:["#d04da6","#ee9b11","#caeb7d","#ede889","#e9d2a0","#7cdff3","#eb98bc"],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
            x: 25,
            y: 30,
            x2: 0,
            y2: 25,
        },
        series: [
            {
                name: '终端在线数量',
                type: 'pie',
                radius: ['40%', '50%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter:function (data) {
                        return data.name+":"+data.value+"台("+data.percent+"%)"
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '15',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
}