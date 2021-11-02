var DEV_CODE = "";
var POINT_ID = "";
var mdate;  //监控数据日期选择
var tdate;  //触发数据日期选择
//时间选择器
// var startV = '';
// laydate.skin('danlan');
// var startTime = {
//     elem: '#startTime',
//     format: 'YYYY-MM-DD',
//     min: '1997-01-01', //设定最小日期为当前日期
//     max: laydate.now(), //最大日期
//     istime: true,
//     istoday: true,
//     fixed: false,
//     choose: function (datas) {
//         startV = datas;
//         // endTime.min = datas; //开始日选好后，重置结束日的最小日期
//     }
// };
// laydate(startTime);

//初始化基础数据
function fetchBaseInfo() {
    DEV_CODE = $("#devcode").val();
    $.ajaxSettings.async = false;
    $.getJSON("../monitor/getdevinfo",{code:DEV_CODE},function (result) {
        POINT_ID = result["NetCode"]+"."+result["StaCode"];
        $.each(result, function (key, value) {
            // console.log(key,value)
            $("."+key).text(value);
        });
    });
    $.ajaxSettings.async = true;
    $("#startTime").val(TimeFrameUtil.format(new Date(),"yyyy-MM-dd"))
    mdate = $("#startTime").val();
}

//获取实时数据
function fetchMonitorData() {
    $.getJSON("../monitor/queryrecord",{pointid:POINT_ID},function (result) {
        $.each(result[0], function (key, value) {
            $("."+key).text(value);
        });
    });
}

function fetchTrigerData() {
    //滚动
    //原理：把marquee下面的子盒子都复制一遍 加入到marquee中
    //      然后动画向上滚动，滚动到一半重新开始滚动
    //因为选取的是两个marquee  所以要遍历
    $('.monitor .marquee').each(function (index, dom) {
        //将每个 的所有子级都复制一遍
        var rows = $(dom).children().clone();
        //再将新的到的加入原来的
        $(dom).append(rows);
    });

    $.getJSON("../monitor/getTrigerData",{pointid:POINT_ID,date:mdate},function (result) {
        console.log("TrigerData------------------")
        for(var i=0;i<result.length;i++){
            console.log(result[i]);
        }
    });
}

$(function () {
    fetchBaseInfo();
    fetchMonitorData();
    fetchTrigerData();
    echarts_4();

    function echarts_4() {
        $.getJSON("../monitor/getMonStoreData",{pointid:POINT_ID,date:mdate},function (result) {
            for(var i=4;i<=11;i++){
                echarts_waveform(result["ch"+i],result["time"],"monchart"+i,parseChName((i-3)));
            }
        });
    }
    function echarts_waveform(ydata,xdata,id,title) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        option = {
            title: [
                {
                    left: 'center',
                    text: title,
                    textStyle: {
                        color: '#0184d5',
                        fontSize: '12',
                    }
                }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                }
            },
            /*legend: {
                top: '0%',
                data: ['点到', '未点到'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },*/
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
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 12,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                    }
                },
                data: xdata
            }, {
                axisPointer: {show: false},
                axisLine: {show: false},
                position: 'bottom',
                offset: 20,
            }],
            yAxis: [{
                type: 'value',
                scale: true,
                axisTick: {show: false},
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 12,
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
                    name: '值',
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
                    /*areaStyle: {
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
                    },*/
                    itemStyle: {
                        normal: {
                            color: '#0184d5',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: ydata
                },
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        /*window.addEventListener("resize", function () {
            myChart.resize();
        });*/
    }

    function echarts_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart6'));

        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                //shadowBlur: 40,
                //shadowColor: 'rgba(40, 40, 40, 1)',
            }
        };
        var placeHolderStyle = {
            normal: {
                color: 'rgba(255,255,255,.05)',
                label: {show: false,},
                labelLine: {show: false}
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
        option = {
            color: ['#0f63d6', '#0f78d6', '#0f8cd6', '#0fa0d6', '#0fb4d6'],
            tooltip: {
                show: true,
                formatter: "{a} : {c} "
            },
            legend: {
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 12,
                bottom: '3%',

                data: ['一监区', '二监区', '三监区', '四监区', '五监区'],
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
            },

            series: [
                {
                    name: '一监区',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '42%'],
                    radius: ['59%', '70%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                        value: 80,
                        name: '01'
                    }, {
                        value: 20,
                        name: 'invisible',
                        tooltip: {show: false},
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '二监区',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '42%'],
                    radius: ['49%', '60%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                        value: 70,
                        name: '02'
                    }, {
                        value: 30,
                        name: 'invisible',
                        tooltip: {show: false},
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '三监区',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['39%', '50%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 65,
                        name: '03'
                    }, {
                        value: 35,
                        name: 'invisible',
                        tooltip: {show: false},
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '四监区',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['29%', '40%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 60,
                        name: '04'
                    }, {
                        value: 40,
                        name: 'invisible',
                        tooltip: {show: false},
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '五监区',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['20%', '30%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 50,
                        name: '05'
                    }, {
                        value: 50,
                        name: 'invisible',
                        tooltip: {show: false},
                        itemStyle: placeHolderStyle
                    }]
                },]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

})



		
		
		


		









