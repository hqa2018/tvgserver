//var source_url = "http://120.25.123.11:8080"
var source_url = "http://192.168.0.4/res/mapsource/"
// var source_url = "/res/mapsource/"
//var source_url = $("#mapTileServer").val() + "/seidata/map/"
//道路图底图
var tmap_roadlayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: source_url + "tianditu/general/roadmap/{z}/{x}/{y}.png"
    })
});

//道路图标注层
var tmap_olrlayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: source_url + "tianditu/general/overlay_r/{z}/{x}/{y}.png"
    })
});

//地形图底图
var tmap_terlayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: source_url + "tianditu/relief/termap/{z}/{x}/{y}.png"
    })
});

//地形图标注
var tmap_oltlayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: source_url + "tianditu/relief/overlay_t/{z}/{x}/{y}.png"
    })
});

//影像图底图
var tmap_imglayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: source_url + "tianditu/images/imgmap/{z}/{x}/{y}.png"
    })
});
//影像图标注
var tmap_olilayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: source_url + "tianditu/images/imglay_r/{z}/{x}/{y}.png"
    })
});
//影像路线图标注
var tmap_ibolayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: source_url + "tianditu/images/ibolay_r/{z}/{x}/{y}.png"
    })
});

//谷歌道路图
var gmap_roadlayer = new ol.layer.Tile({
	title: '街道图',
	laytype:'gmap_road',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
      url: source_url + "google/roadmap/{z}/{x}/{y}.png"
    })
});

//谷歌地形图
var gmap_terlayer = new ol.layer.Tile({
	title: '地形图',
	laytype:'gmap_terr',
    type: 'base',
    visible: false,
    source: new ol.source.XYZ({
      url: source_url + "google/termap/{z}/{x}/{y}.jpg"
    })
});

//谷歌卫星图
var gmap_sitelayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: source_url + "google/sitemap/{z}/{x}/{y}.jpg"
    })
});

/**
 * 地图图层分组对象
 */
//百度地图组
var bmap_group = new ol.layer.Group({
    'title': '百度地图',
    layers: [
        bmap_layer
    ]
});

//谷歌地图组
var gmap_group = new ol.layer.Group({
    'title': '谷歌地图',
    layers: [
        gmap_terlayer,
        gmap_roadlayer
    ]
});

//天地图地图组
var tmap_group = new ol.layer.Group({
    'title': '天地图',
    layers: [
        new ol.layer.Group({
            title: '地形图',
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
            title: '道路图',
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
            title: '影像图',
            laytype:'tmap_img',
            type: 'base',
            combine: true,
            visible: true,
            layers: [
                tmap_imglayer,
                tmap_olilayer,
                tmap_ibolayer
            ]
        })
    ]
});


