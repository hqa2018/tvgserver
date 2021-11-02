// var mapUrl = "/seidata/map/bmap/maptile_/";
var mapUrl = "/tiaserver/images/maptile_/";
var mapType = "geo";
var manCodeLon = 104.072073;
var manCodeLat = 30.583677;
var mapMode = "2";
var leftClick = false;
var displayPointModeDiv="0";
let dayOfWeek = {
    "1" : "星期一","2" : "星期二","3" : "星期三","4" : "星期四","5" : "星期五","6" : "星期六","0" : "星期天"
}


let levelMode = "size";//color根据震级划分不同颜色级别地图点  size根据震级划分不同大小级别地图点
//颜色级别常量
const colorRangeArray = [
    {min : Number.MIN_SAFE_INTEGER,max : 1,color:"#dde4fd"},
    {min : 1,max : 3,color:"#85eaf4"},
    {min : 3,max : 4,color:"#7cffbb"},
    {min : 4,max : 5,color:"#caff39"},
    {min : 5,max : 6,color:"#ffdc00"},
    {min : 6,max : 7,color:"#ffa600"},
    {min : 7,max : 8,color:"#ff3500"},
    {min : 8,max : 9,color:"#e10000"},
    {min : 9,max : Number.MAX_SAFE_INTEGER,color:"#c80000"}
];
//大小级别常量
const sizeRangeArray = [
    {min : Number.MIN_SAFE_INTEGER,max : 3,size:11},
    {min : 3,max : 5,size:14},
    {min : 5,max : 7,size:20},
    {min : 7,max : Number.MAX_SAFE_INTEGER,size:20}
];

let yujingDataMap = {};//预警全局数据
let subaoDataMap = {};//速报全局数据

let yujingEmptyMap = {};//预警全局数据
let subaoEmptyMap = {};//速报全局数据

let breakList1 = [];
let warnList1 = [];
let normalList1 = [];
let noInputList1 = [];

let checkPointMode = ["监控台站","地震预警","地震速报"];
let manCode = "";
let backstageTime;
var moniTime = new Date();
$(function () {
    $(".manCodeLon").val() != "" && (manCodeLon = $(".manCodeLon").val());
    $(".manCodeLat").val() != "" && (manCodeLat = $(".manCodeLat").val());

    // manCode = $(".manCode").val();
    manCode = "CD";

    $("#dzyj").css("height","50%")
    $("#dzsb").css("height","50%")
    judgeScreen();

    /*if (localStorage.getItem("mapMode")){
        mapMode = localStorage.getItem("mapMode");
    }*/

    let cookieMapMode = getCookie("mapMode");
    if (cookieMapMode != ""){
        mapMode = cookieMapMode;
    }
  //  $("#mapMode option[value='"+mapMode+"']").prop("selected",true);
    if(mapMode=="2"){
    	$("#toggle--switch").attr("checked",true);
    }else{
    	$("#toggle--switch").attr("checked",false);
    }
    
    
    $("#toggle--switch").click(function () {
    	if($(this).is(":checked")){
    		mapMode="2";
    	}else{
    		mapMode="0";
    	}
    	document.cookie="mapMode="+mapMode
    	location.reload();
    })

    let myChart1 = echarts.init(document.getElementById('main1'));

    getNumber().then(data => {
        let month = new Date().getMonth() + 1;
        let allWaringNumber = 0;
        let monthWaringNumber = data["EwarnCatalog"][month];

        let allSubaoNumber = 0;
        let monthSubaoNumber = data["EqrCatalog"][month];

        $.each(data["EwarnCatalog"],function (key,value) {
            allWaringNumber += value;
        })
        $.each(data["EqrCatalog"],function (key,value) {
            allSubaoNumber += value;
        })
        $(".allWaringNumber").text(allWaringNumber);
        $(".monthWaringNumber").text(monthWaringNumber);
        $(".allSubaoNumber").text(allSubaoNumber);
        $(".monthSubaoNumber").text(monthSubaoNumber);

        setLineChart(myChart1,data);//设置柱状图
    },error => console.error(error))

    let myChart = initMap(mapMode);//初始化地图
    myChart.on('click', function (params) {
        if (params.componentType === 'series') {//如果点击series的才带链接
            if (params.seriesName.indexOf("subao") !== -1){
                $(".param_title1").html('地震速报<div class="dizhen_close" style="float:right;margin-right: 5px;width: 23px;margin-top: 7px;line-height: 20px;float: right;background-color: #34444c;height: 23px;">x</div>');
                let distance = (getFlatternDistance(Number(params.data.lat),Number(params.data.lon),Number(manCodeLat),Number(manCodeLon)) / 1000).toFixed(2);
                setEventDetail(params.data.name,params.data.lon,params.data.lat,formatDay(new Date(params.data.time)),params.data.m,distance)
            }else if(params.seriesName.indexOf("yujing") !== -1){
                $(".param_title1").html('地震预警<div class="dizhen_close" style="float:right;margin-right: 5px;width: 23px;margin-top: 7px;line-height: 20px;float: right;background-color: #34444c;height: 23px;">x</div>');
                let distance = (getFlatternDistance(Number(params.data.lat),Number(params.data.lon),Number(manCodeLat),Number(manCodeLon)) / 1000).toFixed(2);
                setEventDetail(params.data.name,params.data.lon,params.data.lat,formatDay(new Date(params.data.time)),params.data.m,distance)
            }else{
                if(params.data.mondatas!==undefined){
                    $("#eventInfoTable").parent().hide();
                    var html = staCodeHtml(params);
                    $("#staCodeInfoDiv").html(html);
                    $("#staCodeInfoDiv").show();
                    leftClick = true;
                }
            }
        }
    });
    Date.prototype.format = function (fmt) {
        var o = {
            "y+": this.getFullYear, //年
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds() //秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    setInterval("document.getElementById('dateTime').innerHTML = (new Date()).format('yyyy-MM-dd hh:mm:ss');", 1000);
    getWeather();
    setTimeout(setTimeOutGetData,1000*60)
/*    window.setInterval(function () {
        let now = new Date();
        if (now.getTime() - backstageTime.getTime() >= 1000 * 60 * 60 * 2){
            getWeather();
        }else{
            backstageTime = now;
            $(".table_tianqi .datetime").text(getDay(backstageTime));
        }
        if (now.getTime() - moniTime.getTime() >= 1000 * 60 * 10){
            fetchMonitorData().then(() => setMapData(myChart));
            moniTime = now;
        }
    },1000*60)*/
    
    function setTimeOutGetData(){
        let now = new Date();
        if (now.getTime() - backstageTime.getTime() >= 1000 * 60 * 60 * 2){
            getWeather();
        }
        if (now.getTime() - moniTime.getTime() >= 1000 * 60 * 10){
            timeTask(myChart);
            moniTime = now;
        }
        setTimeout(setTimeOutGetData,1000*60)
    }

    timeTask(myChart);

    $(document).on("click",".divset_close",function () {
        $("#staCodeInfoDiv").hide();
    })

    $(".param_title1").on("click",".dizhen_close",function () {
        $("#eventInfoDiv").hide();
    })
   
    $("#displayPointMode").on("click",function () {
    	if( displayPointModeDiv=="0"){
    		$("#displayPointModeDiv").show();
    		displayPointModeDiv="1";
    	}else{
    		$("#displayPointModeDiv").hide();
    		displayPointModeDiv="0";
    	}
    })

    $(".toggle--knob input[type='checkbox']").on("change",function () {
        checkPointMode = [];
        $.each($(".toggle--knob input[type='checkbox']").not(":checked"),function () {
            checkPointMode.push($(this).val());
        })
        setMapData(myChart);//重新绘制地图点
    })

    $("#staCodeInfoDiv").on("click","#switchTable tr",function(){
        var staCode = $("#staCodeInfoDiv").data("stacode");
        var monitorType = $("#staCodeInfoDiv").data("monitortype");
        var deviceType = $("#staCodeInfoDiv").data("devicetype");
        var switchTime = formatDay(new Date());
        var number = $(this).data("switchid").toString();;
        var value = "1";
        var apikey = "4fe5ab69de5970fd48bab87ee59a5e94";
        var json = {
            "apikey": apikey,
            "manCode": manCode,
            "staCode": staCode,
            "monitorType": monitorType,
            "deviceType": deviceType,
            "switchTime": switchTime,
            "number":number,
            "value": value
        }

        var jsonStr = JSON.stringify(json);
        var r=confirm("确定要执行开关?");
        if (r){
            $.ajax({
                type: 'POST',
                url: '/tiaserver/monitor/updateswitch',
                data: {json: jsonStr},
                dataType: 'json',
                success: function (resp){
                    if(resp.ackcode=="1")
                        alert("操作成功");
                    else
                        alert("操作失败,错误:"+resp.msg);
                }
            });
        }
    });


    $("#resetCenter").on("click",function () {
        myChart.setOption({
            bmap : {
                center : [ manCodeLon, manCodeLat ],
                zoom : 10,
                roam : true,
            }
        })
    })

/*    $("#mapMode").on("change",function () {
        // let cookie = document.cookie;
        document.cookie="mapMode="+$(this).val();
        // localStorage.setItem("mapMode",$(this).val())
        location.reload();
    })*/

    var a=$('.visualSssf_left a')
    for(var i=0;i<a.length;i++){
        a[i].index=i;
        a[i].onclick=function(){
            for(var i=0;i<a.length;i++){
                a[i].className=''
            }
            this.className='active'
        }
    }

    var sfzcllH=$('.sfzcll_box').height()
    var sfzcllHtwo=sfzcllH-2
    $('.sfzcll_box').css('line-height',sfzcllH+'px')
    $('.sfzcll_smallBk>div').css('line-height',sfzcllHtwo+'px')

    //删除加载动画
    $('#load').fadeOut(1000)
    setTimeout(function(){
        $('#load').remove()
    },1100);

    $("#main8").on("click",function(){
        // $("#staCodeInfoTable").hide();
        if(leftClick==false){
            $("#staCodeInfoDiv").hide();
            $("#displayPointModeDiv").hide();
            displayPointModeDiv="0";
        }else{
            leftClick=false;
        }
    })
    $(".divset_close").on("click",function () {
        $("#eventInfoTable").parent().hide();
    })
})

function timeTask(myChart){
    let max = 10;
    let promise1 = getYujingEventData(max);//获取预警数据
    let promise2 = getSubaoEventData(max);//获取速报数据
    let promise3 = fetchMonitorData();//获取台站数据

    promise1.then(eventData => {
        let EwarnCatalogLiss = eventData.EwarnCatalogLiss;
        setEventContent(EwarnCatalogLiss,"time","DESC");//设置预警数据列表
        $(".visual_right .sfzcll .sfzcll_box .sfzcll_smallBk .ygl").css("line-height","47px");
        yujingDataMap = $.extend(true,{},yujingEmptyMap);
        for (let i = 0; i < EwarnCatalogLiss.length; i++) {
            for(let m=0;m<sizeRangeArray.length;m++){
                if(sizeRangeArray[m].min < EwarnCatalogLiss[i].m && EwarnCatalogLiss[i].m <= sizeRangeArray[m].max){//判断震级在哪个颜色级别
                    if (i == 0){//涟漪点
                        yujingDataMap["yujingNew"].push({
                            "name" : EwarnCatalogLiss[i].location,
                            "value" : [EwarnCatalogLiss[i].eqLon,EwarnCatalogLiss[i].eqLat],
                            "lon" : EwarnCatalogLiss[i].eqLon,
                            "lat" : EwarnCatalogLiss[i].eqLat,
                            "time" : EwarnCatalogLiss[i].oTime,
                            "m" : EwarnCatalogLiss[i].m,
                            "size" : sizeRangeArray[m].size
                        });
                    }else{
                        yujingDataMap["yujing"+m].push({//把该点放入相应的颜色级别中
                            "name" : EwarnCatalogLiss[i].location,
                            "value" : [EwarnCatalogLiss[i].eqLon,EwarnCatalogLiss[i].eqLat],
                            "lon" : EwarnCatalogLiss[i].eqLon,
                            "lat" : EwarnCatalogLiss[i].eqLat,
                            "time" : EwarnCatalogLiss[i].oTime,
                            "m" : EwarnCatalogLiss[i].m,
                        });
                    }
                    break;
                }
            }
        }
    },error => console.error(error))
    promise2.then(eventData => {
        let EqrCatalogList = eventData.EqrCatalogList;
        setSubaoEventContent(EqrCatalogList,"time","DESC");//设置速报数据列表
        subaoDataMap = $.extend(true,{},subaoEmptyMap);
        for (let i = 0; i < EqrCatalogList.length; i++) {
            for(let m=0;m<sizeRangeArray.length;m++){
                if(sizeRangeArray[m].min < EqrCatalogList[i].m && EqrCatalogList[i].m <= sizeRangeArray[m].max){
                    if (i == 0) {//涟漪点
                        subaoDataMap["subaoNew"].push({
                            "name" : EqrCatalogList[i].location,
                            "value" : [EqrCatalogList[i].eq_lon,EqrCatalogList[i].eq_lat],
                            "lon" : EqrCatalogList[i].eq_lon,
                            "lat" : EqrCatalogList[i].eq_lat,
                            "time" : EqrCatalogList[i].ori_time,
                            "m" : EqrCatalogList[i].m,
                            "size" : sizeRangeArray[m].size
                        });
                    }else{
                        subaoDataMap["subao"+m].push({
                            "name" : EqrCatalogList[i].location,
                            "value" : [EqrCatalogList[i].eq_lon,EqrCatalogList[i].eq_lat],
                            "lon" : EqrCatalogList[i].eq_lon,
                            "lat" : EqrCatalogList[i].eq_lon,
                            "time" : EqrCatalogList[i].ori_time,
                            "m" : EqrCatalogList[i].m,
                        });
                    }
                    break;
                }
            }
        }
    },error => console.error(error))
    ////设置饼图
    promise3.then(() =>setPieChart())

    //台站点、预警点、速报点全部获取完再去设置地图数据
    Promise.all([promise1,promise2,promise3]).then(
        () => setMapData(myChart),//成功则设置地图数据
        () => setMapData(myChart)//不管三种数据哪个获取失败了,都进行设置地图数据
    )
}

function setMapData(myChart) {
    //设置地图
    let series = [];
    var window_height = $(window).height()
    $.each(yujingDataMap,function (key,value) {//预警地图点
        if (key === "yujingNew"){
            if(value.length != 0){
                series.push({
                    name : key,
                    symbolSize : value[0].size,
                    data : checkPointMode.indexOf("地震预警") !== -1 ? value : []
                })
            }
        }else{
            series.push({
                name : key,
                data : checkPointMode.indexOf("地震预警") !== -1 ? value : []
            })
        }
    })
    $.each(subaoDataMap,function (key,value) {//速报地图点
        if (key === "subaoNew"){
            if(value.length != 0){
                series.push({
                    name : key,
                    symbolSize : value[0].size,
                    data : checkPointMode.indexOf("地震速报") !== -1 ? value : []
                })
            }
        }else {
            series.push({
                name : key,
                data : checkPointMode.indexOf("地震速报") !== -1 ? value : []
            })
        }
    })
    series.push({
        name : 'Break1',
        data : checkPointMode.indexOf("监控台站") !== -1 ? convertData(breakList1) : [],
    },{
        name : 'Normal1',
        data : checkPointMode.indexOf("监控台站") !== -1 ? convertData(normalList1) : [],
    },{
        name : 'Warn1',
        data : checkPointMode.indexOf("监控台站") !== -1 ? convertData(warnList1) : [],
    },{
        name : 'NoInput1',
        data : checkPointMode.indexOf("监控台站") !== -1 ? convertData(noInputList1) : [],
    })

    myChart.setOption({
        tooltip : {
            trigger: 'item',
            position: [2,2],
            formatter:function () {
                return null;
            }
        },
        series : series
    });
}
function setEventDetail(location,lon,lat,time,m,distance) {
    let html = "";
    html += "<tr><td>震源:</td><td>"+location+"</td></tr>";
    html += "<tr><td>坐标:</td><td>"+lon+","+lat+"</td></tr>";
    html += "<tr><td>时间:</td><td>"+time+"</td></tr>";
    html += "<tr><td>震级:</td><td>"+m+"级</td></tr>";
    html += "<tr><td>震中距:</td><td>"+distance+"km</td></tr>";
    $("#eventInfoTable").html(html);
    $("#eventInfoTable").parent().show();
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function setSubaoEventContent(eventData,sortField,sortType) {
    let html = "";
    eventData.sort((value1,value2) => {
        let v1,v2;
        if (sortField == "time"){
            v1 = new Date(value1.ori_time);v2 = new Date(value2.ori_time);
        }else if (sortField == "m"){
            v1 = value1.m;v2 = value2.m;
        }
        return sortType == "DESC" ? v2 - v1 : v1 - v2;
    })

    let count = 0;
    for (const event of eventData) {
        // $(".subaoDataDiv>div:eq("+count+")").find(".ygl span").text(Number(event.m).toFixed(1));
        // $(".subaoDataDiv>div:eq("+count+")").find(".div_time").text(formatDay(new Date(event.ori_time)));
        // $(".subaoDataDiv>div:eq("+count+")").find(".div_address").text(event.location);

        html += '<div class="sfzcll_box" style="line-height: 53px;">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';

        html += '<div class="sfzcll_smallBk">';
        html += '<div class="ygl" style="line-height: 47px;">';
        html += '<span>'+Number(event.m).toFixed(1)+'</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="div_time">'+formatDay(new Date(event.ori_time))+'</div>';
        html += '<div class="div_address">'+event.location+'</div>';
        html += '<div class="clear"></div>';
        html += '</div>';

        count ++ ;
    }
    $(".subaoDataDiv").html(html);
}

function getRad(d){
    return d*Math.PI/180.0;
}
//计算两个坐标点之间的距离（单位：米）
function getFlatternDistance(lat1,lng1,lat2,lng2){
    var EARTH_RADIUS = 6378137.0;    //单位M
    var f = getRad((lat1 + lat2)/2);
    var g = getRad((lat1 - lat2)/2);
    var l = getRad((lng1 - lng2)/2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s,c,w,r,d,h1,h2;
    var a = EARTH_RADIUS;
    var fl = 1/298.257;

    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;

    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;

    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;

    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
}
function setEventContent(eventData,sortField,sortType) {
    let html = "";
    eventData.sort((value1,value2) => {
        let v1,v2;
        if (sortField == "time"){
            v1 = new Date(value1.oTime);v2 = new Date(value2.oTime);
        }else if (sortField == "m"){
            v1 = value1.m;v2 = value2.m;
        }
        return sortType == "DESC" ? v2 - v1 : v1 - v2;
    })

    let count = 0;
    for (const event of eventData) {
        // if (count == 5){
        //     break;
        // }

        // $(".yujingDataDiv>div:eq("+count+")").find(".ygl span").text(Number(event.m).toFixed(1));
        // $(".yujingDataDiv>div:eq("+count+")").find(".div_time").text(formatDay(new Date(event.oTime)));
        // $(".yujingDataDiv>div:eq("+count+")").find(".div_address").text(event.location);
        html += '<div class="sfzcll_box" style="line-height: 53px;">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';

        html += '<div class="sfzcll_smallBk">';
        html += '<div class="ygl" style="line-height: 47px;">';
        html += '<span>'+event.m+'</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="div_time">'+formatDay(new Date(event.oTime))+'</div>';
        html += '<div class="div_address">'+event.location+'</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        // count ++ ;
    }
    $(".yujingDataDiv").html(html);
   
}
function formatDay(day){
    let y=day.getFullYear();
    let M=day.getMonth()+1;
    let d=day.getDate();
    let H=day.getHours();
    let m=day.getMinutes();
    let s=day.getSeconds();

    M = M < 10 ? "0"+M : M;
    d = d < 10 ? "0"+d : d;

    H = H < 10 ? "0"+H : H;
    m = m < 10 ? "0"+m : m;
    s = s < 10 ? "0"+s : s;
    return y+"-"+M+"-"+d+" "+H+":"+m+":"+s;
}
function getYujingEventData(max) {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getYujingEventData",
            data: {max},
            dataType: "json",
            error:function(){
                reject("获取预警数据失败!");
            },
            success: function (resp) {
                resolve(resp);
            }
        })
    })
}
function getSubaoEventData(max) {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getSubaoEventData",
            data: {max},
            dataType: "json",
            error:function(){
                reject("获取速报数据失败!");
            },
            success: function (resp) {
                resolve(resp);
            }
        })
    })
}
function exchange(el1, el2){
    var ep1 = el1.parentNode,
        ep2 = el2.parentNode,
        index1 = Array.prototype.indexOf.call(ep1.children, el1),
        index2 = Array.prototype.indexOf.call(ep2.children, el2);
    ep2.insertBefore(el1,ep2.children[index2]);
    ep1.insertBefore(el2,ep1.children[index1]);
}

function judgeScreen(){
    var w = $(window).width();
    var h = $(window).height();
    if(w<h){
        /*	  var newObj1 = document.createElement("div");
              newObj1.setAttribute("id","new");
              var d1 = document.getElementById("left_div");
              var d2 = document.getElementById("con_div");
              d1.parentElement.insertBefore(newObj1,con_div);
              d1.parentElement.insertBefore(con_div,left_div);
              d1.parentElement.insertBefore(left_div,newObj1);
              d1.parentElement.removeChild(newObj1);*/

        exchange(left_div,con_div)

        /*  var newObj = document.createElement("div");
          newObj.setAttribute("id","new");
          var d5 = document.getElementById("yjtj");
          var d6 = document.getElementById("zdzx");
          d5.parentElement.insertBefore(newObj,yjtj);
          d5.parentElement.insertBefore(yjtj,zdzx);
          d5.parentElement.insertBefore(zdzx,newObj);
          d5.parentElement.removeChild(newObj);*/

        $(".visual_left").css("height","23%");
        $(".visual_left").css("width","100%");
        $(".visual").css("height","49%");
        $(".visual").css("width","100%");
        $(".visual_con").css("width","100%");
        $(".visual_right").css("height","28%");
        $(".visual_right").css("width","100%");

        //  $(".visual_left").css("padding","25px 20px 0 20px");

        $(".visual_box").css("height","100%");

        $(".visual_box").css("width","50%");

        $("#tianqi").hide();
        //  $("#tianqi").css("height","50%");
        $("#zdzx").css("height","100%");
        $("#yjtj").css("height","100%");
        $("#yjtj").css("width","50%");

        $(".ksh").css("overflow-y","auto");

        $(".visual_con .visual_conTop .visual_conTop_box>div h3").css("padding","9px 0 0 20px");
        $(".visual_con .visual_conTop .visual_conTop_box>div p").css("font-size","35px");
        $(".visual_con .visual_conTop .visual_conTop_box>div .conTop_smil").css("padding-top","5px");
        $(".visual_con .visual_conTop .visual_conTop_box>div p").css("line-height","55px");
        $(".visual_con .visual_conTop").css("height","80px");
        $(".visual_con .visual_conBot").css("height","calc(100% - 80px)");
        $(".head_top p").css("top","-5px");
        $(".head_top p").css("font-size","18px");

        $("#yjtj").css("padding","15px 10px 0 20px");
        $("#zdzx").css("padding","15px 20px 0 10px");
        $("#dzyj").css("padding","0px 10px 0 20px");
        $("#dzsb").css("padding","0px 20px 0 10px");

        $(".visual_con").css("padding","10px 20px 0 20px");

        $(".div_time").css("font-size","12px");
        $(".div_address").css("font-size","12px");

        $(".visual_right .sfzcll .sfzcll_box").css("margin-top","8px");
        $(".visual_right .sfzcll .sfzcll_box").css("height","calc(20% - 3px)");

        $(".visual_box .visual_title span").css("font-size","15px");


    }
}

function getWeather() {
    return new Promise((resolve,reject) => {
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getWeather",
            data: {
                longitude : manCodeLon,
                latitude : manCodeLat
            },
            dataType: "json",
            success: function (resp) {
                let sevenDayWeather = resp.sevenDayWeather;
                let toDayWeather = resp.toDayWeather;
                if (sevenDayWeather.weather.code = "200"){
                    let daily = sevenDayWeather.weather.daily;
                    for (let i = 0; i < daily.length; i++) {
                        $(".div_tianqi>ul:eq("+i+")").find("li:eq(0) img").prop("src","/tiaserver/images/warning/w/w"+daily[i].iconDay+".png");
                        $(".div_tianqi>ul:eq("+i+")").find("li:eq(1)").text(dayOfWeek[new Date(daily[i].fxDate).getDay()]);
                        $(".div_tianqi>ul:eq("+i+")").find("li:eq(2)").text(daily[i].tempMin+"~"+daily[i].tempMax+"°C");
                    }
                }

                backstageTime = new Date(toDayWeather.dateTime);

                $(".table_tianqi .city span").text(toDayWeather.weather.HeWeather6[0].basic.parent_city);
                // $(".table_tianqi .datetime").text(resp.weather.HeWeather6[0].update.loc);
             //   $(".table_tianqi .datetime").text(getDay(new Date()));
                $(".table_tianqi .temp span").text(toDayWeather.weather.HeWeather6[0].now.tmp);
                $(".table_tianqi .textDay").text(toDayWeather.weather.HeWeather6[0].now.cond_txt);
                $(".table_tianqi .textWind").text(toDayWeather.weather.HeWeather6[0].now.wind_dir+toDayWeather.weather.HeWeather6[0].now.wind_sc+"级");


                resolve();
            }
        })
    })
    /*$.ajax({
        type: "get",
        url: "/tiaserver/warning/getCity",
        // url: "https://free-api.heweather.net/s6/weather/now?location=104.470587,30.679925&key=e10c768a33584832998c4d91bcab29eb",
        data: {
            longitude : manCodeLon,
            latitude : manCodeLat
        },
        dataType: "json",
        success: function (resp) {
            $(".table_tianqi .city span").text(resp.weather.HeWeather6[0].basic.parent_city);
            // $(".table_tianqi .datetime").text(resp.weather.HeWeather6[0].update.loc);
            $(".table_tianqi .datetime").text(getDay(new Date(resp.dateTime)));
            $(".table_tianqi .temp span").text(resp.weather.HeWeather6[0].now.tmp);
            $(".table_tianqi .textDay").text(resp.weather.HeWeather6[0].now.cond_txt);
            $(".table_tianqi .textWind").text(resp.weather.HeWeather6[0].now.wind_dir+resp.weather.HeWeather6[0].now.wind_sc+"级");
        }
    })
    $.ajax({
        type: "get",
        url: "/tiaserver/warning/getWeather",
        // url: "https://devapi.qweather.com/v7/weather/7d?location=104.470587,30.679925&key=54d0408b5b7e43ddb6e07ef767ad0509",
        data: {
            longitude : manCodeLon,
            latitude : manCodeLat
        },
        dataType: "json",
        success: function (resp) {
            if (resp.weather.code = "200"){
                let daily = resp.weather.daily;
                for (let i = 0; i < daily.length; i++) {
                    $(".div_tianqi>ul:eq("+i+")").find("li:eq(0) img").prop("src","/tiaserver/images/warning/w/w"+daily[i].iconDay+".png");
                    $(".div_tianqi>ul:eq("+i+")").find("li:eq(1)").text(dayOfWeek[new Date(daily[i].fxDate).getDay()]);
                    $(".div_tianqi>ul:eq("+i+")").find("li:eq(2)").text(daily[i].tempMin+"~"+daily[i].tempMax+"°C");
                }
            }
        }
    })*/
}
function initMap(mapMode) {
    var myChart = echarts.init(document.getElementById('main8'));
    //离线
    var bmap = {
        center : [ manCodeLon, manCodeLat ],
        zoom : 10,
        roam : true,
    }
    if (mapMode == "0"){
        bmap["mapStyle"] = mapStyle;
    }else if(mapMode == "2"){
    	bmap["mapStyle"] = mapStyle1;
    }
    let staCodeSeries = [{
        name : 'Break1',
        type : 'scatter',
        coordinateSystem : 'bmap',
        symbol:'triangle',
        symbolSize : 18,
        label : {
            emphasis : {
                show : true,
                formatter : '{b}',
                position : 'right',
                color:"black"
            }
        },
        itemStyle: {
            borderColor: "black",
            borderWidth: 1,
            color: "black"
        }
    },{
        name : 'Normal1',
        type : 'scatter',
        coordinateSystem : 'bmap',
        symbol:'triangle',
        symbolSize : 18,
        label : {
            emphasis : {
                show : true,
                formatter : '{b}',
                position : 'right',
                color:"black"
            }
        },
        itemStyle: {
            borderColor: "black",
            borderWidth: 1,
            color: "green"
        }
    }, {
        name : 'Warn1',
        type : 'scatter',
        coordinateSystem : 'bmap',
        symbol:'triangle',
        symbolSize : 18,
        label : {
            normal:{
                show : true,
                formatter : '{b}',
                position : 'right',
                color:"black"
            },
            emphasis : {
                show : true,
                formatter : '{b}',
                position : 'right',
                color:"black"
            }
        },
        itemStyle: {
            borderColor: "black",
            borderWidth: 1,
            color: "red"
        }
    }, {
        name : 'NoInput1',
        type : 'scatter',
        coordinateSystem : 'bmap',
        symbol:'triangle',
        symbolSize : 18,
        label : {
            emphasis : {
                show : true,
                formatter : '{b}',
                position : 'right',
                color:"black"
            }
        },
        itemStyle: {
            borderColor: "black",
            borderWidth: 1,
            color: "blue"
        }
    },{
        name : 'network',
        type : 'scatter',
        coordinateSystem : 'bmap',
        symbol:'image:///tiaserver/images/network.png',
        symbolSize : 18,
        data : [{
            value : [manCodeLon, manCodeLat, 1.2]
        }],
        zlevel : 1
    }];
    let yujingSeries = [];
    let subaoSeries = [];

    if (levelMode === "size"){
        for(let i=0;i<sizeRangeArray.length;i++) {
            yujingEmptyMap["yujing"+i] = [];
            subaoEmptyMap["subao"+i]   = [];
            yujingSeries.push({
                name: "yujing" + i,
                type: 'scatter',
                coordinateSystem: 'bmap',
                symbol: "circle",
                symbolSize : sizeRangeArray[i].size,
                label : {
                    normal : {
                        formatter : '{b}',
                        position : 'right',
                        show : false
                    },
                    emphasis : {
                        show : true
                    }
                },
                itemStyle: {
                    borderColor: "black",
                    borderWidth: 1,
                    color: "red"
                }
            })
            subaoSeries.push({
                name: "subao" + i,
                type: 'scatter',
                coordinateSystem: 'bmap',   
                symbol: "square",
                symbolSize : sizeRangeArray[i].size,
                label : {
                    normal : {
                        formatter : '{b}',
                        position : 'right',
                        show : false
                    },
                    emphasis : {
                        show : true
                    }
                },
                itemStyle: {
                    borderColor: "black",
                    borderWidth: 1,
                    color: "red"
                }
            })
        }
    }else if(levelMode === "color"){
        for(var i=0;i<colorRangeArray.length;i++) {
            yujingEmptyMap["yujing"+i] = [];
            subaoEmptyMap["subao"+i]   = [];
            yujingSeries.push({
                name: "yujing" + i,
                type: 'scatter',
                coordinateSystem: 'bmap',
                symbol: "circle",
                symbolSize : 15,
                label : {
                    normal : {
                        formatter : '{b}',
                        position : 'right',
                        show : false
                    },
                    emphasis : {
                        show : true
                    }
                },
                itemStyle: {
                    borderColor: "black",
                    borderWidth: 1,
                    color: colorRangeArray[i].color
                }
            })
            subaoSeries.push({
                name: "subao" + i,
                type: 'scatter',
                coordinateSystem: 'bmap',
                symbol: "square",
                symbolSize : 15,
                label : {
                    normal : {
                        formatter : '{b}',
                        position : 'right',
                        show : false
                    },
                    emphasis : {
                        show : true
                    }
                },
                itemStyle: {
                    borderColor: "black",
                    borderWidth: 1,
                    color: colorRangeArray[i].color
                }
            })
        }
    }

    //最新涟漪点
    yujingEmptyMap["yujingNew"] = [];
    subaoEmptyMap["subaoNew"]   = [];
    yujingSeries.push({
        name : 'yujingNew',
        type : 'effectScatter',
        coordinateSystem : 'bmap',
        symbol:"circle",
        showEffectOn : 'render',
        rippleEffect : {
            brushType : 'stroke'
        },
        hoverAnimation : true,
        label : {
            normal : {
                formatter : '{b}',
                position : 'right',
                show : true,
                color:"black"
            }
        },
        itemStyle : {
            normal : {
                color : "red",
                shadowBlur : 10,
                shadowColor : '#333'
            }
        },
        zlevel : 1
    })
    subaoSeries.push({
        name : 'subaoNew',
        type : 'effectScatter',
        coordinateSystem : 'bmap',
        symbol:"square",
        showEffectOn : 'render',
        rippleEffect : {
            brushType : 'stroke'
        },
        hoverAnimation : true,
        label : {
            normal : {
                formatter : '{b}',
                position : 'right',
                show : true,
                color:"black"
            }
        },
        itemStyle : {
            normal : {
                color : "red",
                shadowBlur : 10,
                shadowColor : '#333'
            }
        },
        zlevel : 1
    })
    var bmapOption = {
        bmap : bmap,
        series : staCodeSeries.concat(yujingSeries,subaoSeries)
    }
    //矢量
    var geoOption = {
        geo: {
            map: '四川',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: 'rgba(7,21,57,0.5)',
                    borderColor: '#0177ff'
                },
                emphasis: {
                    areaColor: '#071537'//鼠标指上市时的颜色
                }
            }
        },
        series: [{
            name : 'Error',
            type : 'scatter',
            coordinateSystem : 'geo',
            symbol:"triangle",
            symbolSize : function(val) {
                return 15;
            },
            label : {
                normal : {
                    formatter : '{b}',
                    position : 'right',
                    show : false
                },
                emphasis : {
                    show : true
                }
            },
            itemStyle : {
                normal : {
                    color : 'black'
                }
            }
        },{
            name : 'Normal',
            type : 'scatter',
            coordinateSystem : 'geo',
            symbol:"triangle",
            symbolSize : function(val) {
                return 15;
            },
            label : {
                normal : {
                    formatter : '{b}',
                    position : 'right',
                    show : false
                },
                emphasis : {
                    show : true
                }
            },
            itemStyle : {
                normal : {
                    color : 'green',
                }
            },
            zlevel : 1
        }, {
            name : 'Warn',
            type : 'effectScatter',
            coordinateSystem : 'geo',
            symbol:"triangle",
            symbolSize : function(val) {
                return 15;
            },
            showEffectOn : 'render',
            rippleEffect : {
                brushType : 'stroke'
            },
            hoverAnimation : true,
            label : {
                normal : {
                    formatter : '{b}',
                    position : 'right',
                    show : true
                }
            },
            itemStyle : {
                normal : {
                    color : 'red',
                    shadowBlur : 10,
                    shadowColor : '#333'
                }
            },
            zlevel : 1
        },{
            name : 'network',
            type : 'scatter',
            coordinateSystem : 'geo',
            symbol:'image:///tiaserver/images/network.png',
            symbolSize : function(val) {
                return 15;
            },
            data : [{
                value : [manCodeLon, manCodeLat, 1.2]
            }],
            zlevel : 1
        }]
    }

    // myChart.clear();
    if (mapMode == "0" || mapMode == "2"){
        // jQuery.getScript("/tiaserver/js/map/static/appiv3.0.js",function(response,status){
        myChart.setOption(bmapOption);
        let map = myChart.getModel().getComponent('bmap').getBMap();
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        map.addControl(new BMap.NavigationControl({
            type : BMAP_NAVIGATION_CONTROL_ZOOM, //缩放控件类型 仅包含缩放按钮
            anchor : BMAP_ANCHOR_BOTTOM_RIGHT, //右下角
            offset : new BMap.Size(15,45) //进一步控制缩放按钮的水平竖直偏移量
        }));
        // })
    }else{
        // jQuery.getScript("/tiaserver/js/warning/sichuan.js",function(response,status){
        myChart.setOption(geoOption);
        // })
    }
    return myChart;
}

function setLineChart(myChart,resp){
    let yujingData = [];
    let subaoData = [];
    for (let key in resp["EwarnCatalog"]){
        yujingData.push(resp["EwarnCatalog"][key]);
    }
    for (let key in resp["EqrCatalog"]){
        subaoData.push(resp["EqrCatalog"][key]);
    }
    myChart.setOption({
        title: {
            show: false,
            text: "data.title",
            subtext: "data.subTitle",
            link: '1111'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none'
            },
        },
        legend: {
            right: data.legendRight || '30%',
            top: 5,
            right:10,
            itemGap: 16,
            itemWidth: 10,
            itemHeight: 10,
            data: [{name: "预警"},{name: "速报"}],
            textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12,
            }
        },
        grid: {
            x: 45,
            y: 40,
            x2: 20,
            y2: 30,
        },
        xAxis: {
            type: 'category',
            data: Object.keys(resp["EwarnCatalog"]).map(s => s + "月"),
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {       //轴标
                show: true,
                interval: '0',
                textStyle: {
                    lineHeight:5,
                    padding: [2, 2, 0, 2],
                    height: 50,
                    fontSize: 12,
                    color:'#fff',
                },
                rich: {
                    Sunny: {
                        height: 50,
                        // width: 60,
                        padding: [0, 5, 0, 5],
                        align: 'center',
                    },
                },
                formatter: function(params, index) {
                    var newParamsName = "";
                    var splitNumber = 5;
                    var paramsNameNumber = params && params.length;
                    if (paramsNameNumber && paramsNameNumber <= 4) {
                        splitNumber = 4;
                    } else if (paramsNameNumber >= 5 && paramsNameNumber <= 7) {
                        splitNumber = 4;
                    } else if (paramsNameNumber >= 8 && paramsNameNumber <= 9) {
                        splitNumber = 5;
                    } else if (paramsNameNumber >= 10 && paramsNameNumber <= 14) {
                        splitNumber = 5;
                    } else {
                        params = params && params.slice(0, 15);
                    }

                    var provideNumber = splitNumber; //一行显示几个字
                    var rowNumber = Math.ceil(paramsNameNumber / provideNumber) || 0;
                    if (paramsNameNumber > provideNumber) {
                        for (var p = 0; p < rowNumber; p++) {
                            var tempStr = "";
                            var start = p * provideNumber;
                            var end = start + provideNumber;
                            if (p == rowNumber - 1) {
                                tempStr = params.substring(start, paramsNameNumber);
                            } else {
                                tempStr = params.substring(start, end) + "\n";
                            }
                            newParamsName += tempStr;
                        }

                    } else {
                        newParamsName = params;
                    }
                    params = newParamsName
                    return '{Sunny|' + params + '}';
                },
                color: '#687284',
            },

        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: true,
                textStyle: {
                    lineHeight:5,
                    padding: [2, 2, 0, 2],
                    height: 50,
                    fontSize: 12,
                    color:'#fff',
                },
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#F1F3F5',
                    type: 'solid'
                },
                interval: 2
            },
            splitNumber: 4,
        },
        series: [{
            barGap: "0.5px",
            barWidth: 12,
            data: yujingData,
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    color: "#63e1f9"
                }
            },
            label: {
                normal: {
                    formatter: "{c} ",
                    position: "top",
                    show: false,
                    textStyle:{
                        color: "#000",
                        fontFamily: "微软雅黑",
                        fontSize: 11,
                        fontStyle: "normal",
                        textAlign: "left"
                    }
                }
            },
            name: "预警",
            type: "bar"
        },{
            barGap: "0.5px",
            barWidth: 12,
            data: subaoData,
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    color: "#296df7"
                }
            },
            label: {
                normal: {
                    formatter: "{c} ",
                    position: "top",
                    show: false,
                    textStyle:{
                        color: "#000",
                        fontFamily: "微软雅黑",
                        fontSize: 11,
                        fontStyle: "normal",
                        textAlign: "left"
                    }
                }
            },
            name: "速报",
            type: "bar"
        }]
    })
}

function getDay(day){
    var y=day.getFullYear();
    var M=day.getMonth()+1;
    var d=day.getDate();

    var H=day.getHours();
    var m=day.getMinutes();
    var s=day.getSeconds();

    M = M < 10 ? "0"+M : M;
    d = d < 10 ? "0"+d : d;
    H = H < 10 ? "0"+H : H;
    m = m < 10 ? "0"+m : m;
    return y+"-"+M+"-"+d+" "+H+":"+m;
}
function setPieChart(){
    let myChart = echarts.init(document.getElementById('main3'));
    let data = [];
    let countNumber = breakList1.length + warnList1.length + normalList1.length+noInputList1.length;
    data.push({
        'value': breakList1.length,
        'itemStyle':{
            "color" : "#959696"
        },
        'name': "中断"
    })
    data.push({
        'value': normalList1.length,
        'itemStyle':{
            "color" : "#078a1b"
        },
        'name': "正常"
    })
    data.push({
        'value': warnList1.length,
        'itemStyle':{
            "color" : "#d81e06"
        },
        'name': "异常"
    })
    data.push({
        'value': noInputList1.length,
        'itemStyle':{
            "color" : "#0251ef"
        },
        'name': "未审核"
    })
    var countNumber1 =  "<div style='font-size:25px;padding-left:4px;'>"+countNumber+"</div>";
    if(countNumber<10)
    	countNumber1 = "<div style='font-size:25px;padding-left:11px;'>"+countNumber+"</div>";
    if(countNumber>99)
    	countNumber1 = "<div style='font-size:25px;margin-left:-3px;'>"+countNumber+"</div>";
    $(".cityCountDiv").html(countNumber1+"<div style='font-size:22px'>(台)</div>");
    $(".deviceNumber").text(countNumber);



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
function getDataStatus(data){
    var status = 1;
    if(data.minval==""||data.maxval==""||data.minval=="null"||data.maxval=="null"){
        status = 1;
    }else{
        if(Number(data.value) < Number(data.minval) || Number(data.value) > Number(data.maxval)){
            status = 2;
        }else{
            status = 1;
        }
    }
    return status
}

function fetchMonitorData() {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "POST",
            url: "/tiaserver/warning/fetchMonitorStatus",
            data : {
                manCode : manCode,
            },
            dataType: "json",
            error:function(){
                reject(new Error("获取数据失败!"));
            },
            success: function (resp) {
                noInputList1 = [];
                normalList1 = [];
                warnList1 = [];
                breakList1 = [];
                for(var i=0;i<resp.length;i++){
                    var staData = resp[i];
                    var status = 0;
                    if (staData.dataTime == null){
                        status = 0;
                    }else if(Math.abs(new Date(staData.dataTime).getTime() - new Date().getTime()) >= 1000*60*60){
                        status = 0;
                    }else if(staData.mondatas!==undefined){
                        if(staData.mondatas.length>0)
                            status = 1;
                        for(var m=0;m<staData.mondatas.length;m++){
                            var mondata = staData.mondatas[m]
                            if(getDataStatus(mondata)==2){
                                status = 2;
                            }
                        }
                    }else{
                        status = 0;
                    }

                    if (staData.systemStatus == 0){//未录入
                        noInputList1.push(staData);
                    }else{
                        if(status==1){
                            normalList1.push(staData);
                        }else if(status==2){
                            warnList1.push(staData);
                        }else if(status==0){
                            breakList1.push(staData);
                        }
                    }
                }
                resolve();
            }
        })
    })
}
function getNumber() {
    return new Promise((resolve,reject) => {
        $.ajax({
            type: "POST",
            url: "/tiaserver/warning/getNumber",
            data: {},
            dataType: "json",
            success: function (resp) {
                resolve(resp);
            },
            error:function () {
                reject("获取月份统计数据失败!");
            }
        })
    })
}

//生成地图散点图标
function convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = [];
        geoCoord.push(data[i].staLon);
        geoCoord.push(data[i].staLat);
        if (geoCoord) {
            res.push({
                name : '['+data[i].staCname+']'+data[i].staCode,
                deviceType : data[i].deviceType,
                moniType : data[i].moniType,
                mondatas : data[i].mondatas,
                staCode : data[i].staCode,
                receiveTime : data[i].receiveTime,
                dataTime : data[i].dataTime,
                switchs : data[i].switchs,
                ip : data[i].ip,
                //value: geoCoord.concat(data[i].value)
                value : geoCoord
            });
        }
    }
    return res;
}

function staCodeHtml(params){
    $("#staCodeInfoDiv").data("mancode",params.data.manCode);
    $("#staCodeInfoDiv").data("stacode",params.data.staCode);
    $("#staCodeInfoDiv").data("monitortype",params.data.moniType);
    $("#staCodeInfoDiv").data("devicetype",params.data.deviceType);
    var window_height = $(window).height()
    var td_length = Math.ceil((window_height-210)/25)
    var html = "";

    if (params.data.dataTime == null || Math.abs(new Date(params.data.dataTime).getTime() - new Date().getTime()) >= 1000*60*60){
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getStationByManCode",
            data: {
                manCode:manCode,
                staCode:params.data.staCode
            },
            async:false,
            dataType: "json",
            success: function (resp) {
                if (resp != null){
                    html = '<div class="col-md-4 div_layar_monioff" style="color:#ffffff;width:400px;padding-left:2px;padding-right: 0px">';
                    html +=	'<table class="text-center" border="1px solid #fdfdfd" width="100%" >';
                    html +=	'<thead>';
                    html += '<tr>';
                    html += '<td colspan="3" style="font-size:14px;background:#061537;" ><span>终端监控</span><div class="divset_close" style="float:right;margin-right: 5px;width: 23px;line-height: 20px;float: right;background-color: #34444c;height: 23px;">x</div></td>';
                    html += '</tr>';
                    html += '<tr>';
                    html += '<td style="text-align:left;" ><span>终端名称</span></td>'
                    html += '<td colspan="2" style="font-size:14px;text-align:left;" ><span>'+ resp.staCname +'</span></td>'
                    html += '</tr>';

                    html += '<tr>';
                    html += '<td style="text-align:left;" ><span>终端经纬度</span></td>'
                    html += '<td colspan="2" style="font-size:14px;text-align:left;" ><span>'+ resp.staLon+','+resp.staLat +'</span></td>'
                    html += '</tr>';

                    html += '<tr>';
                    html += '<td style="text-align:left;" ><span>终端地址</span></td>'
                    html += '<td colspan="2" style="font-size:14px;text-align:left;" ><span>'+ resp.staAddress +'</span></td>'
                    html += '</tr>';

                    html += '<tr>';
                    html += '<td style="text-align:left;" ><span>单位联系人</span></td>'
                    html += '<td colspan="2" style="font-size:14px;text-align:left;" ><span>'+ resp.staDirector +'</span></td>'
                    html += '</tr>';

                    html += '<tr>';
                    html += '<td style="text-align:left;" ><span>联系人电话</span></td>'
                    html += '<td colspan="2" style="font-size:14px;text-align:left;" ><span>'+ resp.staTelphone +'</span></td>'
                    html += '</tr>';

                    html +=	'</thead>';
                    html +=	'<tbody>';
                    
                }
            }
        })
       
        return html
    }

    html = '<div class=" div_layar_moni" style="color:#ffffff;width:500px;padding-left:2px;padding-right: 0px">';
    html +=	'<table class="text-center" border="1px solid #fdfdfd" width="100%" >';
    html += '<tr>';
    html += '<td colspan="2" style="font-size:16px;background:#061537;" >'
    html += '<span >终端监控</span>'
    html += '<div class="divset_close" style="float:right;margin-right: 5px;width: 23px;line-height: 20px;float: right;background-color: #34444c;height: 23px;">x</div>'
    html += '<tr>';
    html += '<td  colspan="2" style="font-size:14px;" >'
    html += '<span style="padding-right:20px;">'+ params.name +'</span>'
   
    html += '<span style="text-align:right;">更新时间：'+ params.data.dataTime+'</span>'
    html +=	'</td>';
    html += '</tr>';
    	
    html +=	'</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td width="320px">'
    html +=	'<table class="text-center" border="1px solid #fdfdfd" width="100%" >';
    html +=	'<thead>';

    /*html += '<tr>';
    html += '<td ><span>数据时间</span></td>'
    html += '<td  style="font-size:14px;" ><span>'+ params.data.receiveTime +'</span></td>'
    html += '</tr>';*/
    html += '<tr style="font-weight:bold">';
    html +=	'<td width="150px" class="text-center" >监测项</td>';
    html +=	'<td width="100px" class="text-center" >数值</td>'	;
    html +=	'<td width="70px" class="text-center" >状态</td>'	;
    html +=	'</tr>';
    html +=	'</thead>';
    html +=	'<tbody>';
    if(params.data.mondatas.length<td_length){
        for(var i=0;i<params.data.mondatas.length;i++){
            var mondata = params.data.mondatas[i];
            var monvalue = mondata.value;
            html += '<tr>'
            html += '<td  style="table-layout:fixed;word-break:break-all;">'+mondata.monName+'</td>';
            if(monvalue==""||monvalue=="null")
                monvalue = "-/-";
            if (monvalue.length > 12 && monvalue.indexOf("_") != -1){
                monvalue = ""
                var sss = mondata.value.split("_")
                for(j = 0;j<sss.length;j++ ){
                    if(mondata.unitName != "" && mondata.unitName != "null" && mondata.unitName != null){
                        monvalue = monvalue +sss[j] + mondata.unitName + "<br/>"
                    }else{
                        monvalue = monvalue +sss[j] + "<br/>"
                    }

                }
            }
            if(mondata.unitName != "" && mondata.unitName != "null" && mondata.unitName != null){
                monvalue += mondata.unitName;
            }
            html += '<td  style="table-layout:fixed;word-break:break-all;">'+monvalue+'</td>';

            var monstatus = getDataStatus(mondata)
            if(monstatus==1)
                html += '<td style="color:#00cc00;table-layout:fixed;word-break:break-all;">正常</td>'
            else if(monstatus==2)
                html += '<td class="font-bold" style="color:red">异常</td>';
            html += '</tr>';
        }
    }else{
        for(var i=0;i<td_length;i++){
            var mondata = params.data.mondatas[i];
            var monvalue = mondata.value;
            html += '<tr>'
            html += '<td style="table-layout:fixed;word-break:break-all;">'+mondata.monName+'</td>';
            if(monvalue==""||monvalue=="null")
                monvalue = "-/-";
            if (monvalue.length > 12 && monvalue.indexOf("_") != -1){
                monvalue = ""
                var sss = mondata.value.split("_")
                for(j = 0;j<sss.length;j++ ){
                    if(mondata.unitName != "" && mondata.unitName != "null" && mondata.unitName != null){
                        monvalue = monvalue +sss[j] + mondata.unitName + "<br/>"
                    }else{
                        monvalue = monvalue +sss[j] + "<br/>"
                    }

                }
            }
            if(mondata.unitName != "" && mondata.unitName != "null" && mondata.unitName != null){
                monvalue += mondata.unitName;
            }
            html += '<td  style="table-layout:fixed;word-break:break-all;">'+monvalue+'</td>';
            var monstatus = getDataStatus(mondata)
            if(monstatus==1)
                html += '<td  style="color:#00cc00;table-layout:fixed;word-break:break-all;">正常</td>'
            else if(monstatus==2)
                html += '<td class="font-bold" style="color:red">异常</td>';
            html += '</tr>';
        }
    }
    html +=	'</tbody>';
    html +=	'</table>';
    html +=	'</td>';


 /*   if(params.data.mondatas.length>td_length){
        html +=	'<table class="text-center" border="1px solid #fdfdfd" width="80px" >';
        for(var i=td_length;i<params.data.mondatas.length;i++){
            var mondata = params.data.mondatas[i];
            var monvalue = mondata.value;
            html += '<tr>'
            html += '<td width="130px" style="table-layout:fixed;word-break:break-all;">'+mondata.monName+'</td>';
            if(monvalue==""||monvalue=="null")
                monvalue = "-/-";
            if (monvalue.length > 12 && monvalue.indexOf("_") != -1){
                monvalue = ""
                var sss = mondata.value.split("_")
                for(j = 0;j<sss.length;j++ ){
                    if(mondata.unitName != "" && mondata.unitName != "null" && mondata.unitName != null){
                        monvalue = monvalue +sss[j] + mondata.unitName + "<br/>"
                    }else{
                        monvalue = monvalue +sss[j] + "<br/>"
                    }

                }
            }
            if(mondata.unitName != "" && mondata.unitName != "null" && mondata.unitName != null){
                monvalue += mondata.unitName;
            }
            html += '<td width="60px" style="table-layout:fixed;word-break:break-all;">'+monvalue+'</td>';


            var monstatus = getDataStatus(mondata)
            if(monstatus==1)
                html += '<td width="55px" style="color:#00cc00;table-layout:fixed;word-break:break-all;">正常</td>'
            else if(monstatus==2)
                html += '<td class="font-bold" style="color:red">异常</td>';
            html += '</tr>';
        }
        html +=	'</table>';
        html +=	'</td>';
    }*/


    if (params.data.switchs.length > 0){
    	html +=	'<td width="180px" style=" vertical-align:text-top;">';
        html +=	'<table id="switchTable" class="text-center" border="1px solid #fdfdfd" width="100%">';
        html += '<tr >'
        html += '<td style="table-layout:fixed;word-break:break-all;font-weight:bold">操作</td>';
        html += '</tr>';
        for (let i=0;i<params.data.switchs.length;i++){
            if(params.data.switchs[i].switchId == "2" || params.data.switchs[i].switchId == "3" || params.data.switchs[i].switchId == "4" || params.data.switchs[i].switchId == "9"){
                continue;
            }
            html += '<tr data-switchid="'+params.data.switchs[i].switchId+'">'
            html += '<td style="table-layout:fixed;word-break:break-all;"><input type="button" style="color:#fdfdfd;background:#435261;width:105px;" value="'+params.data.switchs[i].switchName+'"/></td>';
            html += '</tr>';
        }
        html +=	'</table>';
        html +=	'</td>';
    }
    html +=	'</tr>';
    html +=	'</table>';
    html +=	'</div>';
   
    return html;
}
var mapStyle = {
    styleJson: [
        /*{
            'featureType': 'highway',     //调整高速道路颜色
            'elementType': 'geometry',
            'stylers': {
           // 'color': '#f1e1a6',
            'visibility': 'off'
            }
        },

        {
            'featureType': 'highway',    //调整高速名字是否可视
            'elementType': 'labels',
            'stylers': {
           'visibility': 'off'
            }
        },
        {
            'featureType': 'arterial',   //调整一些干道颜色
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
            }
        },
        {
            'featureType': 'green',
            'elementType': 'geometry',
            'stylers': {
            }
        },
        {
            'featureType': 'subway',    //调整地铁颜色
            'elementType': 'geometry.stroke',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'subway',
            'elementType': 'labels',
            'stylers': {
            }
        },
        {
            'featureType': 'railway',		//铁路
            'elementType': 'geometry',
            'stylers': {
            'visibility': 'off'
            }
        },
        {
            'featureType': 'railway',	//铁路
            'elementType': 'labels',
            'stylers': {
            'visibility': 'off'
            }
        },*/

        {
            'featureType': 'water',
            'elementType': 'geometry',
            'stylers': {
                'color': '#414a59'
            }
        },
        {
            'featureType': 'building',   //调整建筑物颜色
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'building',   //调整建筑物标签是否可视
            'elementType': 'labels',
            'stylers': {
                //   'visibility': 'off'
            }
        },

        {
            'featureType': 'highway',     //调整高速道路颜色
            'elementType': 'geometry',
            'stylers': {
                'color': '#5bd2ff',
                'weight': '0.5',
                //   'visibility': 'off'
            }
        },

        {
            'featureType': 'highway',    //调整高速名字是否可视
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'arterial',   //调整一些干道颜色
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
            }
        },
        {
            'featureType': 'green',
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'subway',    //调整地铁颜色
            'elementType': 'geometry.stroke',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'subway',
            'elementType': 'labels',
            'stylers': {
            }
        },
        {
            'featureType': 'railway',		//铁路
            'elementType': 'geometry',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'railway',	//铁路
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        },
        {
            'featureType': 'all',     //调整所有的标签的边缘颜色
            'elementType': 'labels.text.stroke',
            'stylers': {
                  'color': '#0e265261',
                //'color': '#000000',
            }
        },
        {
            'featureType': 'all',     //调整所有标签的填充颜色
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#ffffff'
                //	  'visibility': 'off'
            }
        },


        {
            'featureType': 'manmade',
            'elementType': 'geometry',
            'stylers': {
            }
        },
        {
            'featureType': 'manmade',
            'elementType': 'labels',
            'stylers': {
            }
        },
        {
            'featureType': 'local',
            'elementType': 'geometry',
            'stylers': {
            }
        },
        {
            'featureType': 'subway',
            'elementType': 'geometry',
            'stylers': {
                'lightness': -65
            }
        },
        {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
                'lightness': -40
            }
        },

        {
            'featureType': 'all',     //调整所有标签的填充颜色   省市名称
            'elementType': 'labels.text.fill',
            'stylers': {
                //     'visibility': 'off'
                'color': '#000000',
            }
        },
        {
            "featureType": "label",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffff",
            }
        },

        {
            'featureType': 'boundary',                 //中国边缘
            'elementType': 'geometry',
            'stylers': {
                'color': '#000000',
                'weight': '2',
                'lightness': 30
            }
        },

        {
            'featureType': 'land',     //调整土地颜色
            'elementType': 'geometry',
            'stylers': {

                'color': '#0e265261'
            }
        },
        {
            'featureType': 'highway',    //调整高速名字是否可视
            'elementType': 'labels',
            'stylers': {
                //     'visibility': 'off'
            }
        },
        /*    { "featureType": "label",
            "elementType": "all",
            "stylers": {

                "color": "#ffffff"
            }
        },*/

    ]
}

var mapStyle1 = {
	styleJson: [
        {
                  'featureType': 'building',   //调整建筑物颜色
                  'elementType': 'geometry',
                  'stylers': {
                             'visibility': 'off'
                  }
        },
       {
                  'featureType': 'building',   //调整建筑物标签是否可视
                  'elementType': 'labels',
                  'stylers': {
               //   'visibility': 'off'
                  }
        },


        {
                  'featureType': 'highway',    //调整高速名字是否可视
                  'elementType': 'labels',
                  'stylers': {
                 'visibility': 'off'
                  }
        },
        {
                  'featureType': 'arterial',   //调整一些干道颜色
                  'elementType': 'geometry',
                  'stylers': {
                      'visibility': 'off'
                  }
        },
        {
                  'featureType': 'arterial',
                  'elementType': 'labels',
                  'stylers': {
                  }
        },
        {
                  'featureType': 'green',
                  'elementType': 'geometry',
                  'stylers': {
                	  'visibility': 'off'
                  }
        },
        {
                  'featureType': 'subway',    //调整地铁颜色
                  'elementType': 'geometry.stroke',
                  'stylers': {
                      'visibility': 'off'
                  }
        },
        {
                  'featureType': 'subway',
                  'elementType': 'labels',
                  'stylers': {
                  }
        },
        {
                  'featureType': 'railway',		//铁路
                  'elementType': 'geometry',
                  'stylers': {
                  'visibility': 'off'
                  }
        },
        {
                  'featureType': 'railway',	//铁路
                  'elementType': 'labels',
                  'stylers': {
                  'visibility': 'off'
                  }
        },

        {
                  'featureType': 'manmade',
                  'elementType': 'geometry',
                  'stylers': {
                  }
        },
        {
                  'featureType': 'manmade',
                  'elementType': 'labels',
                  'stylers': {
                  }
        },
        {
                  'featureType': 'local',
                  'elementType': 'geometry',
                  'stylers': {
                  }
        },
        {
                  'featureType': 'subway',
                  'elementType': 'geometry',
                  'stylers': {
                            'lightness': -65
                  }
        },
        {
                  'featureType': 'railway',
                  'elementType': 'all',
                  'stylers': {
                            'lightness': -40
                  }
        },
       

          {
              'featureType': 'highway',    //调整高速名字是否可视
              'elementType': 'labels',
              'stylers': {
        //     'visibility': 'off'
              }
          },

	]
}