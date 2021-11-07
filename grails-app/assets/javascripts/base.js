var startColor = ['#2fda07', '#f86363',  '#909090'];
var borderStartColor = ['#24bc00', '#ec3c3c',  '#686868'];
var myChart

//入库量占比，带边框效果的饼图
function chart1() {
    //data 为模拟数据
    var data = [{
        name: '正常',
        value: statusArr[0],
        percent: '30.8721',
    }, {
        name: '异常',
        value: statusArr[1],
        percent: '34.076',
    }, {
        name: '中断',
        value: statusArr[2],
        percent: '35.49',
    }];
    myChart = echarts.init(document.getElementById('pie'));
    window.addEventListener('resize', function () {
        myChart.resize();
    });

    $('.pie-data').empty();
    var str = '';
    for (var i = 0; i < data.length; i++) {
        str += '<p><span><i class="legend" style="background:' + startColor[i] + '"></i></span>' + data[i].name + '<span class="pie-number" style="color:' + startColor[i] + '">' + data[i].value + '</span>' + '</p>';
        // str += '<p><span><i class="legend" style="background:' + startColor[i] + '"></i></span>' + data[i].name + '<span class="pie-number" style="color:' + startColor[i] + '">' + data[i].value + '</span>' + Number(data[i].percent).toFixed(2) + '%</p>';
    }

    $('.pie-data').append(str);


    function deepCopy(obj) {
        if (typeof obj !== 'object') {
            return obj;
        }
        var newobj = {};
        for (var attr in obj) {
            newobj[attr] = obj[attr];
        }
        return newobj;
    }
    var xData = [],
        yData = [];
    data.map((a, b) => {
        xData.push(a.name);
        yData.push(a.value);
    });


    var RealData = [];
    var borderData = [];

    data.map((item, index) => {
        var newobj = deepCopy(item);
        var newobj1 = deepCopy(item);
        RealData.push(newobj);
        borderData.push(newobj1);
    });

    RealData.map((item, index) => {
        item.itemStyle = {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: startColor[index] // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: startColor[index] // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
            }
        }
    });
    borderData.map((item, index) => {
        item.itemStyle = {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: borderStartColor[index] // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: borderStartColor[index] // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
            }
        }
    });
    var option = {
        tooltip: {
            trigger: 'item',
            //            position: ['30%', '50%'],
            confine: true,
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            // 主要展示层的
            {
                radius: ['50%', '85%'],
                center: ['50%', '50%'],
                type: 'pie',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                name: "派件入库量占比内容",
                data: RealData
            },
            // 边框的设置
            {
                radius: ['45%', '50%'],
                center: ['50%', '50%'],
                type: 'pie',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                animation: false,
                tooltip: {
                    show: false
                },
                data: borderData
            }
        ]
    };

    myChart.setOption(option);
    // myChart1.setOption(option);
}

chart1()



