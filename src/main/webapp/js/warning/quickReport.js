var mapType = "geo";
var manCodeLon = 104.470587;
var manCodeLat = 30.679925;
var mapMode = "2";
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
    // manCode = $(".manCode").val();
    manCode = "CD";
    let cookieMapMode = getCookie("mapMode3");
    if (cookieMapMode != ""){
        mapMode = cookieMapMode;
    }
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
        document.cookie="mapMode3="+mapMode
        location.reload();
    })

    let myChart = initMap(mapMode);//初始化地图
    myChart.on('click', function (params) {
        if (params.componentType === 'series') {    //如果点击series的才带链接
            if (params.seriesName.indexOf("staCode") != -1){
                let distance = (getFlatternDistance(Number(params.data.lat),Number(params.data.lon),Number(manCodeLat),Number(manCodeLon)) / 1000).toFixed(2);
                setDetail(params.name,params.data.lon,params.data.lat,formatDay(new Date(params.data.time)),params.data.m,distance)
            }else if (params.seriesName.indexOf("redPoint") != -1){
                let distance = (getFlatternDistance(Number(params.data.lat),Number(params.data.lon),Number(params.data.value[1]),Number(params.data.value[0])) / 1000).toFixed(2);
                setDetail1(params.data.location,params.data.value[0],params.data.value[1],params.data.eventData.receiveTime,params.data.eventData.sendTime,params.name,distance,params.data.m)
            }
        }
    });
    $("#search").on("click",function () {
        let keyword = $("#keyword").val();
        let filterList = [];
        if (keyword != ""){
            filterList = globalEventData.filter(data => data.location.indexOf(keyword) != -1);
        }
        $("#eventUl").children().each(function () {
            if (filterList.some(data => data.msgid == $(this).data("msgid"))){
                $(this).find(".div_address").css("color","#1ad1ef");
            }else {
                $(this).find(".div_address").css("color","white");
            }
        })
    })
    $("#resetCenter").on("click",function () {
        myChart.setOption({
            bmap : {
                center : [ manCodeLon, manCodeLat ],
                zoom : 10,
                roam : true,
            }
        })
    })


    $(".divset_close").on("click",function () {
        $("#staCodeInfoTable").parent().hide();
    })

    $("#eventUl").on("click",">div",function () {
        let localtion = $(this).data("location");
        let lon = $(this).data("lon");
        let lat = $(this).data("lat");
        let time = $(this).data("time");
        let m = $(this).data("m");
        let msgid = $(this).data("msgid");
        $(this).css("background-color","#04335fd1")
        $(this).siblings().css("background-color","rgba(15,47,72,0.8)")
        let tempSubaoData = $.extend(true,[],globalEventData);
        let clickSubaoData = tempSubaoData.filter(subaoData => subaoData.msgid == msgid);
        let staCodeSeries = [];
        if (clickSubaoData.length != 0){
            for(let m=0;m<sizeRangeArray.length;m++){
                if(sizeRangeArray[m].min < clickSubaoData[0].m && clickSubaoData[0].m <= sizeRangeArray[m].max){
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
                            "msgid" : clickSubaoData[0].msgid,
                            "name" : clickSubaoData[0].location,
                            "lon" : clickSubaoData[0].eq_lon,
                            "lat" : clickSubaoData[0].eq_lat,
                            "time" : clickSubaoData[0].ori_time,
                            "m" : clickSubaoData[0].m,
                            "value" : [clickSubaoData[0].eq_lon,clickSubaoData[0].eq_lat]
                        }]
                    }]
                    break;
                }
            }
        }

        // getEqrStationCatalogJson(manCode,$(this).data("msgid")).then(data => {//通过msgid获取数据
        getEqrStationCatalogJson(manCode,msgid).then(data => {//通过msgid获取数据
            let tempMessageSeriesList = $.extend(true, [],messageSeriesList);//深拷贝Series的结构样式(无数据)
            //颜色归类
            for (const item of data) {
                if (item.eventData){
                    let messageSeries = tempMessageSeriesList.filter(series => series.name === "redPoint")
                    if (messageSeries.length != 0){
                        messageSeries[0].data.push({
                            "name": item.staCname,
                            "msgid": $(this).data("msgid"),
                            "staCode": item.staCode,
                            "lon" : clickSubaoData[0].eq_lon,
                            "lat" : clickSubaoData[0].eq_lat,
                            "m" : clickSubaoData[0].m,
                            "manCode": item.manCode,
                            "eventData": item.eventData,
                            "location": clickSubaoData[0].location,
                            "value": [item.longitude, item.latitude]
                        })
                    }
                }else {
                    let messageSeries = tempMessageSeriesList.filter(series => series.name === "grayPoint")
                    if (messageSeries.length != 0){
                        messageSeries[0].data.push({
                            "name": item.staCname,
                            "msgid": $(this).data("msgid"),
                            "staCode": item.staCode,
                            "manCode": item.manCode,
                            "value": [item.longitude, item.latitude]
                        })
                    }
                }
            }
            //设置地图数据
            setMapData(myChart,staCodeSeries,tempMessageSeriesList);
        },error => console.error(error));

    })

    getSubaoEventData(20).then(eventData => {
        let EqrCatalogList = eventData.EqrCatalogList;
        globalEventData = $.extend(true,[],EqrCatalogList);
        setContent(EqrCatalogList,"time","DESC");
    })
})
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
function setContent(eventData,sortField,sortType) {
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
    /* for (const event of eventData) {
         html += '<div data-id="'+event.id+'" data-location="'+event.location+'" data-lon="'+event.eqLon+'" data-lat="'+event.eqLat+'" data-time="'+event.oTime+'" data-m="'+event.m+'">';
         html += '<div><div>'+event.m+'</div></div>';
         html += '<div>';
         html += '<div>'+formatDay(new Date(event.oTime))+'</div>';
         html += '<div>'+event.location+'</div>';
         html += '</div>';
         html += '</div>';
     }*/

    for (const event of eventData) {
        html += '<div data-msgid="'+event.msgid+'" data-location="'+event.location+'" data-lon="'+event.eq_lon+'" data-lat="'+event.eq_lat+'" data-time="'+event.ori_time+'" data-m="'+event.m+'" class="sfzcll_box" style="line-height: 64px;">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';
        html += '<img class="sfzcll_bkJk" src="/tiaserver/images/warning/ksh34.png">';

        html += '<div class="sfzcll_smallBk">';
        html += '<div class="ygl" style="line-height: 62px;">';
        html += '<span>'+event.m+'</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="div_time">'+formatDay(new Date(event.ori_time))+'</div>';
        html += '<div class="div_address">'+event.location+'</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
    }
    $("#eventUl").html(html);
}
function getSubaoEventData(max) {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getSubaoEventData",
            data: {max},
            dataType: "json",
            error:function(){
                reject("获取数据失败!");
            },
            success: function (resp) {
                resolve(resp);
            }
        })
    })
}
function getEqrStationCatalogJson(manCode,id) {
    return new Promise((resolve,reject) =>{
        $.ajax({
            type: "get",
            url: "/tiaserver/warning/getEqrStationCatalogJson",
            data: {manCode,id},
            dataType: "json",
            error:function(){
                reject("获取点击数据失败!");
            },
            success: function (resp) {
                messageDataList = resp;
                resolve(resp);
            }
        })
    })
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

    messageSeriesList.push({
        name: "grayPoint",
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
            color: "gray"
        },
        data:[]
    })
    messageSeriesList.push({
        name: "redPoint",
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
            color: "red"
        },
        data:[]
    })

    var bmapOption = {
        bmap : bmap
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
            name: '线路',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            large: true,
            effect: {
                show: true,
                constantSpeed: 30,
                symbol: 'pin',
                symbolSize: 3,
                trailLength: 0,
            },
            lineStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#58B3CC'
                    }, {
                        offset: 1, color: '#F58158'
                    }], false),
                    width: 1,
                    opacity: 0.2,
                    curveness: 0.1
                }
            },
        },{
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

function setDetail(location,lon,lat,time,m,distance) {
    let html = "";
    html += "<tr><td>震源:</td><td>"+location+"</td></tr>";
    html += "<tr><td>坐标:</td><td>"+lon+","+lat+"</td></tr>";
    html += "<tr><td>时间:</td><td>"+time+"</td></tr>";
    html += "<tr><td>震级:</td><td>"+m+"级</td></tr>";
    html += "<tr><td>震中距:</td><td>"+distance+"km</td></tr>";
    $("#staCodeInfoTable").html(html);
    $("#staCodeInfoTable").parent().show();
}
function setDetail1(location,lon,lat,receiveTime,sendTime,staCode,distance,m) {
    let html = "";
    html += "<tr><td>接收时间:</td><td>"+receiveTime+"</td></tr>";
    html += "<tr><td>震源:</td><td>"+location+"</td></tr>";
    html += "<tr><td>坐标:</td><td>"+Number(lon).toFixed(2)+","+Number(lat).toFixed(2)+"</td></tr>";
    html += "<tr><td>发震时间:</td><td>"+sendTime+"</td></tr>";
    html += "<tr><td>震级:</td><td>"+m+"级</td></tr>";
    html += "<tr><td>震中距:</td><td>"+distance+"km</td></tr>";
    html += "<tr><td>终端:</td><td>"+staCode+"</td></tr>";
    $("#staCodeInfoTable").html(html);
    $("#staCodeInfoTable").parent().show();
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