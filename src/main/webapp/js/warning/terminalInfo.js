var key
var lastValue = "", nodeList = [], fontCss = {};

var mapUrl = "/tiaserver/images/maptile_/";
//var mapUrl = "/seidata/map/bmap/maptile_/";
var mapType = "geo";
var manCodeLon = 104.072073;
var manCodeLat = 30.583677;
var mapMode = "2";
var leftClick = false;
let manCode = "";

let normalList = [];
let myChart = null;
var setting = {
    view: {
        fontCss: getFontCss,//字体样式
        showLine: true,
        showIcon: false,
        nameIsHTML: true,
        dblClickExpand:false
    },
    callback :{
        onClick :function (event,treeId,treeNode,clickFlag) {
            let nodeLevel = treeNode.level;
            if (nodeLevel == 2){//台站节点重绘地图并设置弹出框
                let staCodeNode = treeNode.getParentNode();
                let netCodeNode = staCodeNode.getParentNode();
                let clickPoint = {
                    name : treeNode.name,
                    lon : treeNode.staLon,
                    lat : treeNode.staLat,
                    staCode : treeNode.staCode,
                    coord : [treeNode.staLon,treeNode.staLat]
                }
                initMapData(myChart,clickPoint);
                setContent(treeNode);
                leftClick = true;
            }else if(nodeLevel == 0){
                initMapData(myChart,null);//点击根节点重绘地图
            }else{
                var zTree = $.fn.zTree.getZTreeObj("manCodetree");//其他节点则动态的进行展开或者折叠子节点
                zTree.expandNode(treeNode);
            }
        },
        beforeCollapse : function(treeId, treeNode) {
            let nodeLevel = treeNode.level;
            if (nodeLevel == 0){//限制根节点不能折叠
                return false;
            }
        }
    }
};
let pattern = /^(-?\d+)(\.\d+)?$/;
$(function () {
    // manCode = $(".manCode").val();
    manCode = "CD";
    getTreeData();

    let cookieMapMode = getCookie("mapMode1");
    if (cookieMapMode != ""){
        mapMode = cookieMapMode;
    }
    if(mapMode=="2"){
        $("#toggle--switch").attr("checked",true);
    }else{
        $("#toggle--switch").attr("checked",false);
    }
    myChart = initMap(mapMode);//初始化地图


    getStationList().then(resp => {
        for (const respElement of resp) {
            normalList.push({
                "name" : respElement.staCname,
                "staCode" : respElement.staCode,
                "value" : [respElement.staLon,respElement.staLat]
            })
        }
        initMapData(myChart,null);
    }).catch(e => console.error("获取台站点数据失败!"))


    $("#search").on("click",function () {
        let keyword = $("#keyword").val();
        searchNode(keyword);
    })
    $(".divset_close").on("click",function () {
        $("#staCodeInfoTable").parent().hide();
    })

    $("#toggle--switch").click(function () {
        if($(this).is(":checked")){
            mapMode="2";
        }else{
            mapMode="0";
        }
        document.cookie="mapMode1="+mapMode
        location.reload();
    })

    //居中按钮
    $("#resetCenter").on("click",function () {
        initMapData(myChart,null)
    })


    $("#main8").on("click",function(){
        // $("#staCodeInfoTable").hide();
        if(leftClick==false)
            $("#staCodeInfoTable").parent().hide();
        else
            leftClick=false;
    })


    $("#updateStaCodeInfo").on("click",function(){
        let data = {};
        $("#staCodeInfoTable tbody tr").each(function (key,value) {
            data[$(this).data("name")] = $(this).find("input").val();
        })
        if (data["staLon"] === ""){
            alert("经度不能为空!");
            return;
        }
        if (!pattern.test(data["staLon"])){
            alert("经度只能为数字!");
            return;
        }
        if (data["staLat"] === ""){
            alert("纬度不能为空!");
            return;
        }

        data["staCode"] = $("#staCodeInfoTable tbody").data("stacode");
        if (!pattern.test(data["staLat"])){
            alert("纬度只能为数字!");
            return;
        }

        $.ajax({
            type: "post",
            url: "/tiaserver/warning/updateStaCodeInfo",
            data: data,
            dataType: "text",
            success: function (resp) {
                if (resp === "true"){
                    $("#staCodeInfoTable").parent().hide();
                    getTreeData();
                    normalList = [];
                    getStationList().then(resp => {
                        for (const respElement of resp) {
                            normalList.push({
                                "name" : respElement.staCname,
                                "staCode" : respElement.staCode,
                                "value" : [respElement.staLon,respElement.staLat]
                            })
                        }
                        initMapData(myChart,null);
                    }).catch(e => console.error("获取台站点数据失败!"))
                }else{
                    alert("修改失败!");
                }
            }
        })
    })

})
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
function getFontCss(treeId, treeNode) {
    return ((!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"white", "font-weight":"normal"})
}
function getFont(treeId, node) {
    return node.font ? node.font : {};
}
function getTreeData() {
    $.ajax({
        type: "get",
        url: "/tiaserver/warning/getTreeData",
        data: {
            manCode
        },
        dataType: "json",
        success: function (resp) {
            let zTreeObj = $.fn.zTree.init($("#manCodetree"), setting, resp);
        }
    })
}
function focusKey(e) {
    if (key.hasClass("empty")) {
        key.removeClass("empty");
    }
}
function blurKey(e) {
    if (key.get(0).value === "") {
        key.addClass("empty");
    }
}
function searchNode(value) {
    var zTree = $.fn.zTree.getZTreeObj("manCodetree");
    if (lastValue === value) return;//防止重复点击提交进行渲染
    lastValue = value;
    updateNodes(false);//先取消所有高亮
    zTree.setting.view.expandSpeed = ""//关闭折叠动画效果,
    var a = zTree.expandAll(false);//折叠所有节点.此操作为异步操作,不关闭动画效果,则节点还没完全折叠完,搜索之后的展开操作又在进行,会出错
    zTree.setting.view.expandSpeed = "fast";//打开折叠动画效果
    if (value === "") return;
    nodeList = zTree.getNodesByParamFuzzy("name", value);//查找匹配的节点
    updateNodes(true,value);//更新高亮节点
}

function searchNode1(e) {
    var zTree = $.fn.zTree.getZTreeObj("manCodetree");
    var value = $.trim(key.get(0).value);
    if (key.hasClass("empty")) {
        value = "";
    }
    if (lastValue === value) return;
    lastValue = value;
    updateNodes(false);
    zTree.setting.view.expandSpeed = ""
    var a = zTree.expandAll(false);//折叠所有节点
    zTree.setting.view.expandSpeed = "fast";//打开折叠动画效果
    if (value === "") return;
    nodeList = zTree.getNodesByParamFuzzy("name", value);
    updateNodes(true,value);
}
function updateNodes(highlight,value) {
    var zTree = $.fn.zTree.getZTreeObj("manCodetree");
    // "<span style='color:blue;margin-right:0px;'>view</span>.<span style='color:red;margin-right:0px;'>nameIsHTML</span>"
    for( var i=0, l=nodeList.length; i<l; i++ ){
        // let frontString = "";
        // let centerString = "";
        // let behindString = "";
        // let index = nodeList[i].name.indexOf(value);
        // nodeList[i].name = nodeList[i].name;
        nodeList[i].highlight = highlight;
        zTree.updateNode(nodeList[i]);
        //     zTree.expandNode(parentNode);//展开该节点
        // zTree.selectNode(nodeList[i],false,true);//展开该节点所在父节点

        let parentNode = nodeList[i].getParentNode();
        zTree.expandNode(parentNode,true,false,true);//展开该节点所在父节点
    }
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

    var bmapOption = {
        bmap : bmap,
        series : [{
            name : 'Normal',
            type : 'scatter',
            coordinateSystem : 'bmap',
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
        },{
            name : 'clickPoint',
            type : 'scatter',
            coordinateSystem : 'bmap',
            markPoint: {
                animationDuration:0,
                animationDurationUpdate:0,
                symbolSize:18,
                label: {
                    show: true,
                    position:'right',
                    formatter : '{b}',
                    color : 'black'
                },
                itemStyle:{
                    borderColor :"black",
                    borderWidth:1,
                    color:"red"
                },
                data: []
            },
            zlevel: 999999


           /* symbol:"triangle",
            symbolSize : function(val) {
                return 15;
            },
            label : {
                normal : {
                    formatter : '{b}',
                    position : 'right',
                    color : "black",
                    show : true
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
            zlevel : 1*/
        },{
            name : 'network',
            type : 'scatter',
            coordinateSystem : 'bmap',
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

    // myChart.clear();
    if (mapMode == "0" || mapMode == "2"){
        // jQuery.getScript("/tiaserver/js/map/static/appiv3.0.js",function(response,status){
        myChart.setOption(bmapOption);
        let map = myChart.getModel().getComponent('bmap').getBMap();
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        map.addControl(new BMap.NavigationControl({
            type : BMAP_NAVIGATION_CONTROL_ZOOM, //缩放控件类型 仅包含缩放按钮
            anchor : BMAP_ANCHOR_BOTTOM_RIGHT, //右下角
            // offset : new BMap.Size(1,1) //进一步控制缩放按钮的水平竖直偏移量
        }));
        // })
    }else{
        // jQuery.getScript("/tiaserver/js/warning/sichuan.js",function(response,status){
        myChart.setOption(geoOption);
        // })
    }
    return myChart;
}


async function getStationList() {
    return $.ajax({
        type: "get",
        url: "/tiaserver/warning/getStationListByManCode",
        data: {
            manCode: manCode,
            mNetCode: ""
        },
        dataType: "json",
    })
}

function initMapData(myChart,clickPoint) {
    let seriesList = [];
    let bmap = {};
    if (clickPoint != null){
        let tempPoint = $.extend(true,[],normalList);
        seriesList.push({
            name : 'clickPoint',
            markPoint : {
                data : [clickPoint],
            }
        })
        seriesList.push({
            name : 'Normal',
            data : tempPoint.filter(point => point.staCode != clickPoint.staCode),
        })
        bmap["center"] = [clickPoint.lon,clickPoint.lat]
        bmap["zoom"] = 11
    }else{
        seriesList.push({
            name : 'clickPoint',
            markPoint : {
                data : []
            }
        })
        seriesList.push({
            name : 'Normal',
            data : normalList,
        })
        bmap["center"] = [manCodeLon, manCodeLat]
        bmap["zoom"] = 10
    }

    myChart.setOption({
        bmap:bmap,
        series : seriesList
    });

    myChart.off("click")
    myChart.on('click', function (params,e) {
        if (params.componentType === 'series' || params.componentType === 'markPoint') {    //如果点击series的才带链接
            if(params.name){
                let zTree = $.fn.zTree.getZTreeObj("manCodetree");
                let staCodeNode = zTree.getNodeByParam("staCode", params.data.staCode, null);
                if(staCodeNode != null){
                    let level = staCodeNode.level;
                    if (level == 2){
                        let netCodeNode = staCodeNode.getParentNode();
                        let deviceNodes = staCodeNode.children;
                        setContent(staCodeNode);
                        leftClick = true;
                    }
                }
            }
        }
    });
}
function setContent(staCodeNode) {
    let html = "";
    let staCname = staCodeNode.name;
    let staLon = staCodeNode.staLon;
    let staLat = staCodeNode.staLat;
    let staAddress = staCodeNode.staAddress ? staCodeNode.staAddress : "";
    let staTelphone = staCodeNode.staTelphone ? staCodeNode.staTelphone : "";
    let staDirector = staCodeNode.staDirector ? staCodeNode.staDirector : "";
    html += "<tbody data-stacode='"+staCodeNode.staCode+"'>";
    html += "<tr data-name='staCname'><td>终端名称:</td><td><input value="+staCname+"></td></tr>";
    html += "<tr data-name='staLon'><td>经度:</td><td><input value="+staLon+"></td></tr>";
    html += "<tr data-name='staLat'><td>纬度:</td><td><input value="+staLat+"></td></tr>";
    html += "<tr data-name='staAddress'><td>终端地址:</td><td><input value="+staAddress+"></td></tr>";
    html += "<tr data-name='staDirector'><td>联系人:</td><td><input value="+staDirector+"></td></tr>";
    html += "<tr data-name='staTelphone'><td>联系电话:</td><td><input value="+staTelphone+"></td></tr>";
    html += "</tbody>";
    $("#staCodeInfoTable").html(html);
    $("#staCodeInfoTable").parent().show();
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
