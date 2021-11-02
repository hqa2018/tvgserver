var mapUrl = "/tiaserver/images/maptile_/";
//var mapUrl = "/seidata/map/bmap/maptile_/";
var mapType = "geo";
var manCodeLon = 104.072073;
var manCodeLat = 30.583677;
var mapMode = "2";
/*const colorRangeArray = [
    {min : Number.MIN_SAFE_INTEGER,max : 1,color:"#dde4fd"},
    {min : 1,max : 3,color:"#85eaf4"},
    {min : 3,max : 4,color:"#7cffbb"},
    {min : 4,max : 5,color:"#caff39"},
    {min : 5,max : 6,color:"#ffdc00"},
    {min : 6,max : 7,color:"#ffa600"},
    {min : 7,max : 8,color:"#ff3500"},
    {min : 8,max : 9,color:"#e10000"},
    {min : 9,max : Number.MAX_SAFE_INTEGER,color:"#c80000"}
];*/

const colorRangeArray = [
    {name : "red",color:"red"},
    {name : "orange",color:"orange"},
    {name : "yellow",color:"yellow"},
    {name : "blue",color:"blue"},
    {name : "gray",color:"gray"}
];
//大小级别常量
const sizeRangeArray = [
    {min : Number.MIN_SAFE_INTEGER,max : 3,size:12},
    {min : 3,max : 5,size:15},
    {min : 5,max : 7,size:18},
    {min : 7,max : Number.MAX_SAFE_INTEGER,size:20}
];
let globalEventData = [];
let messageSeriesList = [];
let messageDataList = {};
let networkSeries = {
    name : 'network',
    type : 'scatter',
    coordinateSystem : 'bmap',
    symbol:'image:///tiaserver/images/network.png',
    symbolSize : 15,
    data : [{
        value : [manCodeLon, manCodeLat, 1.2]
    }],
    zlevel : 1
};
let manCode = "";
$(function () {
    //  manCodeLon = $(".manCodeLon").val();
    //   manCodeLat = $(".manCodeLat").val();
    let cookieMapMode = getCookie("mapMode2");
    if (cookieMapMode != ""){
        mapMode = cookieMapMode;
    }

    // manCode = $(".manCode").val();
    manCode = "CD";

    // $("#mapMode option[value='"+mapMode+"']").prop("selected",true);

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
        document.cookie="mapMode2="+mapMode
        location.reload();
    })

    let myChart = initMap(mapMode);//初始化地图
    myChart.on('click', function (params) {
        if (params.componentType === 'series') {    //如果点击series的才带链接
            if (params.seriesName.indexOf("staCode") !== -1){
                setEventDetail(params.data.eewid);
            }else if(params.seriesName.indexOf("network") === -1 && params.seriesName.indexOf("newPoint") === -1){
                getVideoUrl(params.data.manCode,params.data.staCode,params.data.eewid)
                    .then(videoUrlList => setStaCodeDetail(params.data.manCode,params.data.staCode,videoUrlList,params.data.eewid),
                          error => setStaCodeDetail(params.data.manCode,params.data.staCode,[],params.data.eewid))//获取视频url失败处理
                    .catch(error => console.error(error));
            }

        }
    });
    //查询按钮
    $("#search").on("click",function () {
        let keyword = $("#keyword").val();
        let filterList = [];
        if (keyword != ""){
            filterList = globalEventData.filter(data => data.location.indexOf(keyword) != -1);
        }
        $("#eventUl").children().each(function () {
            if (filterList.some(data => data.eewid == $(this).data("eewid"))){
                $(this).find(".div_address").css("color","#1ad1ef");
            }else {
                $(this).find(".div_address").css("color","white");
            }
        })
    })
    //居中按钮
    $("#resetCenter").on("click",function () {
        myChart.setOption({
            bmap : {
                center : [ manCodeLon, manCodeLat ],
                zoom : 10,
                roam : true,
            }
        })
    })
    $(".closeStaCodeTable").on("click",function () {
        $("#staCodeDetailDiv").hide();
    })
    //左边列表点击事件
    $("#eventUl").on("click",">div",function () {
        let localtion = $(this).data("location");
        let lon = $(this).data("lon");
        let lat = $(this).data("lat");
        let time = $(this).data("time");
        let m = $(this).data("m");
        let eewid = $(this).data("eewid");
        setEventDetail(eewid);
        $(this).css("background-color","#04335fd1")
        $(this).siblings().css("background-color","rgba(15,47,72,0.8)")
        let tempYujingData = $.extend(true,[],globalEventData);
        let clickYujingData = tempYujingData.filter(yujingData => yujingData.eewid === eewid);
        let staCodeSeries = [];
        if (clickYujingData.length != 0){
            for(let m=0;m<sizeRangeArray.length;m++){
                if(sizeRangeArray[m].min < clickYujingData[0].m && clickYujingData[0].m <= sizeRangeArray[m].max){
                    staCodeSeries = [{
                        name : "staCode",
                        type : 'effectScatter',
                        coordinateSystem : 'bmap',
                        symbol:"circle",
                        symbolSize : sizeRangeArray[m].size,
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
                                color : "red",
                                shadowBlur : 10,
                                shadowColor : '#333'
                            }
                        },
                        zlevel:99,
                        data:[{
                            "eewid" : clickYujingData[0].eewid,
                            "name" : clickYujingData[0].location,
                            "lon" : clickYujingData[0].eqLon,
                            "lat" : clickYujingData[0].eqLat,
                            "time" : clickYujingData[0].oTime,
                            "m" : clickYujingData[0].m,
                            "value" : [clickYujingData[0].eqLon,clickYujingData[0].eqLat]
                        }]
                    }]
                    break;
                }
            }
        }

        getStationEwarnMsn(manCode,$(this).data("eewid")).then(data => {//通过eewid获取数据
            let tempMessageSeriesList = $.extend(true, [],messageSeriesList);//深拷贝然后再对map的value赋值
            //颜色归类
            for (const item of data) {
                if (item.eventData){
                    for (let c = 0; c < colorRangeArray.length; c++) {
                        if (colorRangeArray[c].color == (item.eventData[0].warninglevel === "noalert" ? "gray" : item.eventData[0].warninglevel)) {
                            let messageSeries = tempMessageSeriesList.filter(series => series.name === colorRangeArray[c].name)
                            if (messageSeries.length != 0){
                                messageSeries[0].data.push({
                                    "name": item.staCname,
                                    "eewid": $(this).data("eewid"),
                                    "staCode": item.staCode,
                                    "manCode": item.manCode,
                                    "value": [item.longitude, item.latitude]
                                })
                            }
                            break;
                        }
                    }
                }else {
                    let messageSeries = tempMessageSeriesList.filter(series => series.name === "gray")
                    if (messageSeries.length != 0){
                        messageSeries[0].data.push({
                            "name": item.staCname,
                            "eewid": $(this).data("eewid"),
                            "staCode": item.staCode,
                            "manCode": item.manCode,
                            "value": [item.longitude, item.latitude]
                        })
                    }
                }
            }
            //设置地图数据
            setMapData(myChart,staCodeSeries,tempMessageSeriesList);
        });
    })
    //地图模式改变事件
    /*$("#mapMode").on("change",function () {
        // let cookie = document.cookie;
        document.cookie="mapMode2="+$(this).val();
        // localStorage.setItem("mapMode",$(this).val())
        location.reload();
    })*/


    let max = 20
    //获取预警事件数据
    getYujingEventData(max).then(eventData => {
        let EwarnCatalogLiss = eventData.EwarnCatalogLiss;
        globalEventData = $.extend(true,[],EwarnCatalogLiss);
        setContent(EwarnCatalogLiss,"time","DESC");
    })
})

function setContent(eventData,sortField,sortType) {
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
    for (const event of eventData) {
        html += '<div data-eewid="'+event.eewid+'" data-id="'+event.id+'" data-location="'+event.location+'" data-lon="'+event.eqLon+'" data-lat="'+event.eqLat+'" data-time="'+event.oTime+'" data-m="'+event.m+'" class="sfzcll_box" style="line-height: 64px;">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';

        html += '<div class="sfzcll_smallBk">';
        html += '<div class="ygl" style="line-height: 54px;">';
        html += '<span>'+Number(event.m).toFixed(1)+'</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="div_time">'+formatDay(new Date(event.oTime))+'</div>';
        html += '<div class="div_address">'+event.location+'</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
    }
    $("#eventUl").html(html);
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

    for(var i=0;i<colorRangeArray.length;i++) {
        messageSeriesList.push({
            name: colorRangeArray[i].name,
            type: 'scatter',
            coordinateSystem: 'bmap',
            symbol: "triangle",
            symbolSize : 18,
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
            },
            data:[]
        })
    }
    let bmapOption = {
        bmap : bmap
    }

    myChart.setOption(bmapOption);
    let map = myChart.getModel().getComponent('bmap').getBMap();
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.addControl(new BMap.NavigationControl({
        type : BMAP_NAVIGATION_CONTROL_ZOOM, //缩放控件类型 仅包含缩放按钮
        anchor : BMAP_ANCHOR_BOTTOM_RIGHT, //右下角
        offset : new BMap.Size(15,45) //进一步控制缩放按钮的水平竖直偏移量
    }));

    return myChart;
}
/**
 *
 * @param myChart
 * @param staCodeSeries
 * @param messageSeries
 */
function setMapData(myChart,staCodeSeries,messageSeries) {
    myChart.setOption({
        series : staCodeSeries.concat(messageSeries,[networkSeries])
    });
}

function setStaCodeDetail(manCode,staCode,videoUrlList,eewid) {
    let html = "";
    let dataList = messageDataList.filter(messageData => messageData.manCode === manCode && messageData.staCode === staCode);
    let globalEvent = globalEventData.filter(globalEvent => globalEvent.eewid === eewid);
    if (dataList.length != 0){
        if (!dataList[0].eventData){
            return;
        }

        let eqLon,eqLat,location,oTime;
        if (globalEvent.length != 0){
            eqLon = globalEvent[0].eqLon;
            eqLat = globalEvent[0].eqLat;
            location = globalEvent[0].location;
            oTime = globalEvent[0].oTime;
        }

        let eventDataList = dataList[0].eventData.reverse();
        html += "<table border=\"1px solid #fdfdfd\" style='margin:2px 5px;'>";
        html += "<tr><th style='text-align:center;width:80px;height:30px;'>报数</th>";
        html += "<th style='text-align:center;width:170px;'>接收时间</th>";
        html += "<th style='text-align:center;width:110px;'>本地烈度</th>";
        html += "<th style='text-align:center;width:130px;'>预警时间(秒)</th>";
        html += "<th style='text-align:center;width:100px;'>震中距</th>";
        html += "<th style='text-align:center;width:50px;'>经度</th>";
        html += "<th style='text-align:center;width:50px;'>纬度</th>";
        html += "<th style='text-align:center;width:170px;'>震源</th>";
        html += "<th style='text-align:center;width:170px;'>地震时间</th></tr>";
        for (let e=0;e<eventDataList.length;e++){
            html += "<tr><td style='text-align:center;'>第"+(e+1)+"报</td>";
            html += "<td style='text-align:center;'>"+eventDataList[e].receivetime+"</td>";
            html += "<td style='text-align:center;'>"+eventDataList[e].localintensity+"</td>";
            html += "<td style='text-align:center;'>"+eventDataList[e].ewarntime+"</td>";
            html += "<td style='text-align:center;'>"+Math.round(eventDataList[e].distance)+"</td>";
            html += "<td style='text-align:center;'>"+Number(eqLon).toFixed(3)+"</td>";
            html += "<td style='text-align:center;'>"+Number(eqLat).toFixed(3)+"</td>";
            html += "<td style='text-align:center;'>"+location+"</td>";
            html += "<td style='text-align:center;'>"+oTime+"</td></tr>";

        }
        html += "</table>";
    }
    var ii=0;
    for (const videoUrl of videoUrlList) {
    	 ii++;
    	 html += "<table border=\"1px solid #fdfdfd\" style='margin:2px 5px;'>";
         html += "<tr><td>预警视频（"+ii+"）";
         html += "</td></tr>";
         html += "<tr><td>";
         html += '<video width="242" height="200" controls="controls" type="video/mp4" preload="auto">' +
            '<source src="'+videoUrl+'" autostart="false"/>'+
            '</video>'
         html += "</td></tr</table>";   
    }
    $("#staCodeDetailDiv .body").html(html);
    $("#staCodeDetailDiv").show();
}

function setEventDetail(eewid) {
    let html = "";
    let dataList = globalEventData.filter(globalEvent => globalEvent.eewid === eewid);
    if (dataList.length != 0){
        html += "<table border=\"1px solid #fdfdfd\" style='margin:2px 5px;'>";
        html += "<tr><td style='text-align:center;width:100px;'>震源</td>";
        html += "<td style='text-align:center;'>"+dataList[0].location+"</td></tr>";
        html += "<tr><td style='text-align:center;width:100px;'>坐标</td>";
        html += "<td style='text-align:center;'>"+dataList[0].eqLon+","+dataList[0].eqLat+"</td></tr>";
        html += "<tr><td style='text-align:center;width:100px;'>时间</td>";
        html += "<td style='text-align:center;'>"+dataList[0].oTime+"</td></tr>";
        html += "<tr><td style='text-align:center;width:100px;'>震级</td>";
        html += "<td style='text-align:center;'>"+dataList[0].m+"</td></tr>";
       /* html += "<tr><td style='text-align:center;width:100px;'>震中距</td>";
        html += "<td style='text-align:center;'>震中距</td></tr>";*/
        html += "<tr><td style='text-align:center;width:100px;'>深度</td>";
        html += "<td style='text-align:center;'>"+dataList[0].depth+"KM</td></tr>";
        /*html += "<tr><td style='text-align:center;width:100px;'>本地烈度</td>";
        html += "<td style='text-align:center;'>烈度</td></tr>";*/








        html += "</table>";
    }
    $("#staCodeDetailDiv .body").html(html);
    $("#staCodeDetailDiv").show();
}

function getStationEwarnMsn(manCode,id) {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getStationEwarnMsn",
            data: {manCode,id},
            dataType: "json",
            error:function(){
                reject(new Error("获取数据失败!"));
            },
            success: function (resp) {
                messageDataList = resp;
                resolve(resp);
            }
        })
    })
}
function getYujingEventData(max) {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getYujingEventData",
            data: {max},
            dataType: "json",
            error:function(){
                reject(new Error("获取数据失败!"));
            },
            success: function (resp) {
                resolve(resp);
            }
        })
    })
}
function getVideoUrl(manCode,staCode,eewid){
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getVideoUrl",
            data: {manCode,staCode,eewid},
            dataType: "json",
            error:function(){
                reject("获取视频url失败!");
            },
            success: function (resp) {
                resolve(resp);
            }
        })
    })
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++){
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
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