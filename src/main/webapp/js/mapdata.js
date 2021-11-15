var w = 0;
var h = 0;
var map = null;
var bmap = null;
var count = 0;
var statusCount = [0,0,0];	//正常,异常，中断
var popupLayer				//定义弹出窗图层
var centerPoint = [111.268,30.609];	//中心点

//初始化全局矢量图
var vectorSource = new ol.source.Vector({
	wrapX: false //不在地图上重复
});
//定义矢量图层
var vectorLayer = new ol.layer.Vector({
	source: vectorSource,
	style: function (feature) {
		return itemStyle(feature);
	}
});

//根据分辨率自动隐藏文字
var itemStyle = function(feature, resolution) {
	var color = "#71ff00";
	if(feature){
		var attribute = feature.getProperties();
		if(attribute["status"] === "1"){
			color = "#71ff00"
		}else if(attribute["status"] === "2"){
			color = "red"
		}
	}

	return new ol.style.Style({
		//填充样式(面)
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.2)'
		}),
		//图像样式
		image:new ol.style.RegularShape({
			fill: new ol.style.Fill({
				color: color
			}),//填充色
			points: 3,//边数
			radius: 15,//半径
			angle: 0//形状的角度(弧度单位)
		}),
		text: new ol.style.Text({
			//位置
			textAlign: 'center',
			//基准线
			textBaseline: 'middle',
			//文字样式
			// font: 'normal 12px 微软雅黑',
			//文本内容
			offsetX:0,//水平文本偏移量（以像素为单位）
			offsetY:16,//垂直文本偏移量（以像素为单位）
			// scale:1,//字体放大倍数
			// rotation:(Math.PI/180)*30,//旋转角度（顺时针旋转）
			text:feature.pointid,//文字内容
			fill:new ol.style.Fill({//文字填充颜色
				color: 'rgba(5,39,175,0.6)'
				// color: 'blue'
			}),
			stroke: new ol.style.Stroke({//描边样式
				color: '#ffcc33',
				width: 1
			})
		})
	});
}


$(document).ready(function(){

	h = $(window).height();			//获取屏幕高度
	w = $(window).width();			//获取屏幕宽度
	// carousel = layui.carousel;

	initGeoMap();					//先初始化一个空地图			//获取用户上次保存的状态
	initPopup();
	// mapSwitch();

	//标注要素弹出窗事件
	//pointermove
	map.on("click",function (evt) {
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature) {
				return feature;
			});
		if (feature) {
			// alert("popover")
			$("#staCodeInfoTable").parent().show();
			var coordinates = feature.getGeometry().getCoordinates();
			var attribute = feature.getProperties();
			// feature.sta_code = attribute.sta_code;
			$("#rebootDev").attr("value",attribute["pointid"])
			$(".param_title").text(attribute["pointid"])
			$(".data_time").text(attribute["datatime"])
			if(attribute["datatime"] == "NULL"){
			}else{
				for(var i=1;i<=8;i++){
					var chnval = attribute["ch"+i];
					if(i==1){
						chnval = parseGSPStatus(attribute["ch"+i])
					}
					if(attribute["ch"+i+"_status"]=="0"){
						$(".ch"+i+"_td").css("color","red")
					}else{
						$(".ch"+i+"_td").css("color","#71ff00")
					}
					$(".ch"+i+"_td").text(chnval);
				}
			}
			$("#editDev").val(attribute["devcode"]);
			$("#alertDev").val(attribute["pointid"]);
		} else {
			//点击地图关闭弹出窗
			console.info("destroy");
			$("#staCodeInfoTable").parent().hide();
			// popupLayer.setPosition(undefined);
		}
	});

	//左边列表点击事件
	$("#deviceUl").on("click",">div",function () {
		let pointid = $(this).data("pointid");
		let lon = $(this).data("lon");
		let lat = $(this).data("lat");
		let time = $(this).data("time");
		// console.log('pointid:'+pointid)
		// console.log('lon:'+lon)
		// console.log('lat:'+lat)
		// console.log('time:'+time)
		// console.log('devcode:'+$(this).data("devcode"))

		var attribute;
		for(var j=0;j<vectorSource.getFeatures().length;j++){
			var feature = vectorSource.getFeatures()[j];
			if(feature){
				console.log("pointid:"+pointid)
				if(pointid == feature["pointid"]){
					console.log("feature.pointid:"+feature["pointid"])
					attribute = feature.getProperties();
					break;
				}
			}
		}

		//打开信息窗口
		if(attribute){
			$("#rebootDev").attr("value",attribute["pointid"])
			$(".param_title").text(attribute["pointid"])
			$(".data_time").text(attribute["datatime"])
			if(attribute["datatime"] == "NULL"){
			}else{
				for(var i=1;i<=8;i++){
					var chnval = attribute["ch"+i];
					if(i==1){
						chnval = parseGSPStatus(attribute["ch"+i])
					}
					if(attribute["ch"+i+"_status"]=="0"){
						$(".ch"+i+"_td").css("color","red")
					}else{
						$(".ch"+i+"_td").css("color","#71ff00")
					}
					$(".ch"+i+"_td").text(chnval);
				}
			}
			$("#editDev").val(attribute["devcode"]);
			$("#alertDev").val(attribute["pointid"]);
			$("#staCodeInfoTable").parent().show();
			map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
		}

	})



	//调整banner内容高度
	var bh = $(".pg-banner").height();
	var lw = $("#left_top").width()-2;
	$("#tb-banner").css("height",bh);
	$("#logo-td").css("width",lw);


})

function initMapSwitch() {
	//底图切换
	// alert("mapType-wrapper:"+$("#mapType-wrapper"));
	// if($("#mapType-wrapper"))
	$("#mapType-wrapper").mapTypeSelect({
		onSelect:function(data){
			var type = data.item.mapType;
			// text_visable = data.item.mapType;
			map.getLayers().item(0).setVisible(false)
			map.getLayers().item(1).setVisible(false)
			map.getLayers().item(2).setVisible(false)
			map.getLayers().item(type).setVisible(true)
		},
		data: [ //渲染数据
			{
				image: "../../static/js/mapselect/img/VEC.jpg",
				name: "地图",
				mapType: 0,
				isDefault: true
			}, //地图类型
			{
				image: "../../static/js/mapselect/img/DEM.png",
				name: "地形",
				mapType: 1,
				isDefault: false
			}, //地形类型
			{
				image: "../../static/js/mapselect/img/DOM.png",
				name: "影像",
				mapType: 2,
				isDefault: false
			} //影像类型
		]
	});
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


/**
 * 初始化地图
 */
function initGeoMap(){
	console.log("initGeoMap")
	 map = new ol.Map({
	     target: 'container',
	     layers:[
			 new ol.layer.Group({
				 title: '天地图-道路图',
				 laytype:'tmap_road',
				 type: 'base',
				 combine: true,
				 visible: true,
				 layers: [
					 tmap_roadlayer,
					 tmap_olrlayer
				 ]
			 }),
			 new ol.layer.Group({
				 title: '天地图-地形图',
				 laytype:'tmap_terr',
				 type: 'base',
				 combine: true,
				 visible: false,
				 layers: [
					 tmap_terlayer,
					 tmap_oltlayer
				 ]
			 }),
			 new ol.layer.Group({
				 title: '天地图-影像图',
				 laytype:'tmap_img',
				 type: 'base',
				 combine: true,
				 visible: false,
				 layers: [
					 tmap_imglayer,
					 tmap_olilayer,
					 tmap_ibolayer
				 ]
			 }),
			 /*new ol.layer.Group({
				 title: '百度普通地图',
				 layers: [
					 bmap_layer
				 ]
			 })*/
			/*new ol.layer.Group({
			    'title': '百度地图',
			    layers: [
			        bmap_layer
			    ]
			}),
			new ol.layer.Group({
			    'title': '谷歌地图',
			    layers: [
			        gmap_terlayer,
			        gmap_roadlayer
			    ]
			}), */
         ],
	     //layers: [tmap_roadlayer,tmap_oltlayer],
	     view: new ol.View({
	         center: ol.proj.transform(centerPoint, 'EPSG:4326', 'EPSG:3857'),
	         zoom: 6,
	         minZoom : 3,
	         maxZoom : 12
	     })
	 });
}

/**
 * 获取台站设备数据
 */
function queryMapData() {
	console.log("vectorSource.clear()")
	$.getJSON("../monitor/queryrecord",{},function (resp) {
		statusCount = [0,0,0];	//正常,异常，中断
		vectorSource.clear();
		let count = 0;
		var html = "";
		// $("#deviceUl").empty();
		console.log("resp.length="+resp.length);
		$("#sta_search").empty()
		if(resp.length > 0){
			for(var i=0;i<resp.length;i++){
				var eqobj = resp[i];
				if(eqobj.datatime !== "NULL"){
					vectorSource.addFeature(parseFeatureDate(eqobj));
					html += parseTableCell(eqobj);
				}
				$("#sta_search").append(`<option value="${eqobj.pointid}">${eqobj.pointid}</option>`)
			}
			statusCount[2] = resp.length - statusCount[0] - statusCount[1]
			$("#deviceUl").html(html);
		}
/*		vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			zIndex: 999
		});*/

		map.addLayer(vectorLayer);
		map.getView().fit(vectorSource.getExtent(), map.getSize());
		map.getView().setZoom(8);

		layui.use('form', function(){
			let form = layui.form;
			form.render('select');
			form.on('select(staCode)', function(data){
				// console.log("select(staCode):"+data.value)
				$("#sta_search").val(data.value);
				form.render('select');
				renderMonitorDataBySearch(data.value)
				// setMapData(myChart,data.value);
			});
		})
		// setPieChart();
	});

}



function centerMap(long, lat, zoom) {
	// ol.proj.transform(centerPoint, 'EPSG:4326', 'EPSG:3857')
	map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
	map.getView().setZoom(zoom);
}

