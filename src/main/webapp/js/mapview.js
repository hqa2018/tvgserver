
var INTERVAL_TIME = 10000;  //定时更新间隔

$(function () {
    initMapSwitch();    //初始化地图切换控件
    queryMapData();
    initControlListener();
    // setInterval(updateMapData, 5000);
    // setTimeout(updateMapData,2000); //定时加载数据
    updateMapData();

    var a = $('.visualSssf_left a')
    for (var i = 0; i < a.length; i++) {
        a[i].index = i;
        a[i].onclick = function () {
            for (var i = 0; i < a.length; i++) {
                a[i].className = ''
            }
            this.className = 'active'
        }
    }

    var sfzcllH = $('.sfzcll_box').height()
    var sfzcllHtwo = sfzcllH - 2
    $('.sfzcll_box').css('line-height', sfzcllH + 'px')
    $('.sfzcll_smallBk>div').css('line-height', sfzcllHtwo + 'px')

    //删除加载动画
    $('#load').fadeOut(1000)
    setTimeout(function () {
            $('#load').remove()
        }
        , 1100);
});

function initControlListener() {
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
            $.post("../monitor/savepar",$("#par_form").serialize(),function (resp) {
                alert(resp);
            });
        }
    });

    //重启按钮
    $("#rebootDev").bind("click", function () {
        var pointid = $(this).attr("value");
        var message = "您确定要进行重启操作吗?"+pointid;
        if (confirm(message)) {
            $.getJSON("../monitor/restart",{pointid:pointid},function (resp) {
                alert("重启完成");
                // alert(resp);
            });
        }
    });

    //保存报警参数
    $("#saveAlarm").click(function () {
        var staid = $(this).attr("value");
        var message = "您确定要执行保存[" + staid + "]报警参数操作吗?";
        console.log("range2:"+$("#range2").val());
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
                ch3Range : "",
                ch4Range : "",
                ch5Range : "",
                ch6Range : "",
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
            });
        }
    });
}

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
    $.getJSON("../monitor/queryrecord",{},function (resp) {
        try {
            statusCount = [0,0,0];	//正常,异常，中断
            vectorSource.clear();
            var html = "";
            if(resp.length > 0){
                for(var i=0;i<resp.length;i++){
                    var eqobj = resp[i];
                    if(eqobj.datatime !== "NULL"){
                        vectorSource.addFeature(parseFeatureDate(eqobj));
                        html += parseTableCell(eqobj);
                    }
                }
                statusCount[2] = resp.length - statusCount[0] - statusCount[1]
                $("#deviceUl").html(html);
            }

        }catch (e) {
            console.log(e);
        }
        // setPieChart();
        setTimeout(updateMapData,INTERVAL_TIME);
    });
}

/**
 * 解析构建feature对象
 * @param eqobj
 * @returns {Feature|pd}
 */
function parseFeatureDate(eqobj) {
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