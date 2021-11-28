


/**
 * 弹出窗居中
 * @param obj
 */
function popupCenter(obj) {
    leftTop(obj);
    //浏览器窗口大小改变时
    $(window).resize(function() {
        leftTop(obj);
    });
    //浏览器有滚动条时的操作、
    $(window).scroll(function() {
        leftTop(obj);
    });
}
function leftTop(obj){
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var scrollleft = $(document).scrollLeft();
    var objLeft = (screenWidth - obj.width())/2 + scrollleft  ;
    var objTop = (screenHeight - obj.height())/2 + scrolltop;
    obj.css({left: objLeft + 'px', top: objTop + 'px'});
}


function parseGSPStatus(value) {
    var content = ""
    switch (value){
        case "0":
            // content = "A状态";
            content = "正常";
            break;
        case "1":
            // content = V状态
            content = "GPS搜索";
            break;
        case "2":
            content = "无时间参数";
            break;
        case "3":
            // content = "B状态";
            // content = "北斗对时";
            content = "正常";
            break;
        case "4":
            // content = "D状态";
            // content = "GPS北斗对时";
            content = "正常";
            break;
        case "5":
            content = "关闭或未工作";
            break;
        case "8":
            content = "NTP授时";
            break;
        default:
            content = ""
            break;
    }

    return content;
}

/**
 * 获取通道对应的通道名称
 * @param chn
 * @returns {string}
 */
function parseChName(chn) {
    var name = "";
    switch (chn) {
        case 1:
            name = "经度";
            break;
        case 2:
            name = "纬度";
            break;
        case 3:
            name = "高程(km)";
            break;
        case 4:
            name = "GPS状态";
            break;
        case 5:
            name = "GPS精度(m)";
            break;
        case 6:
            name = "GPS位置栅栏";
            break;
        case 7:
            name = "垂直向零位";
            break;
        case 8:
            name = "东西向零位";
            break;
        case 9:
            name = "北南向零位";
            break;
        case 10:
            name = "电池电压";
            break;
        case 11:
            name = "PCB温度";
            break;
        default:
            name = "GPS状态";
            break;
    }
    return name;
}

/**
 * 获取通道对应的通道名称
 * @param chn
 * @returns {string}
 */
function parseChUnit(chn) {
    var name = "";
    switch (chn) {
        case 1:
            name = "-";
            break;
        case 2:
            name = "-";
            break;
        case 3:
            name = "-";
            break;
        case 4:
            name = "V";
            break;
        case 5:
            name = "V";
            break;
        case 6:
            name = "V";
            break;
        case 7:
            name = "V";
            break;
        case 8:
            name = "℃";
            break;
        default:
            name = "-";
            break;
    }
    return name;
}

/*
 * 播放声音
 * 	1、是否自动播放：
 *		autostart=true、false
 *	2、循环播放次数：
 *		loop=正整数、true、false
 *	3、面板是否显示：
 *		hidden=ture、no
 */
function playSound()
{
    //非IE内核浏览器
    var strAudio = "<audio id='audioPlay' src='../images/alarm.m4a?t=" + new Date().getTime() + "' hidden='true' >";
    if ( $( "body" ).find( "audio" ).length <= 0 )
        $( "body" ).append( strAudio );
    var audio = document.getElementById( "audioPlay" );
    //浏览器支持 audio
    audio.play();
    audioPlay = true;
    // $("body").find('audio').get(0).play();
    // $("body").find("audio").bind('ended',function () {
    // $(this).get(0).play();
    // });
}

function playPause()
{
    //非IE内核浏览器
    var strAudio = "<audio id='audioPlay' src='../images/alarm.m4a?t=" + new Date().getTime() + "' hidden='true' >";
    if ( $( "body" ).find( "audio" ).length <= 0 )
        $( "body" ).append( strAudio );
    var audio = document.getElementById( "audioPlay" );
    //浏览器支持 audio
    audio.pause();
    audioPlay = false

}

/**
 * 时间操作工具类
 */
var TimeFrameUtil = {
    /**
     * 格式化日期
     * @param date {Date} 日期
     * @param pattern {string} 格式，例："yyyy-MM-dd HH:mm:ss"
     * @returns {String} 返回格式化后的日期，如："2018-01-22 18:04:30"
     */
    format : function (date, pattern) {
        var time = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S+": date.getMilliseconds()
        };
        if (/(y+)/i.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in time) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? time[k] : ("00" + time[k]).substr(("" + time[k]).length));
            }
        }
        return pattern;
    },
    /**
     * 将指定时间偏移几小时
     * @param time {String} 指定时间，例："2018-01-24 17:00"
     * @param offset {Number} 偏移量，正数代表加几小时，负数代表减几小时，例：1
     * @param pattern {String} 返回时间的格式，例："yyyy-MM-dd HH:mm"
     * @returns {String} 返回计算后的时间，如："2018-01-24 18:00"
     */
    offsetHours : function (time, offset, pattern) {
        var date = new Date(Date.parse(time));
        var yyyy = date.getFullYear();
        var MM = date.getMonth();
        var dd = date.getDate();
        var HH = date.getHours() + offset;
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        return this.format(new Date(yyyy, MM, dd, HH, mm, ss), pattern);
    },
    /**
     * 将指定月份偏移几个月
     * @param month {String} 指定月份，例："2018-01"
     * @param offset {Number} 偏移量，负数代表上几个月，正数代表下几个月，例：1
     * @param pattern {String} 返回时间的格式，例："yyyy-MM-dd HH:mm"
     * @returns {String} 返回计算后的月份，如："2018-02"
     */
    offsetMonths : function (month, offset, pattern) {
        console.log("month="+month)
        var date = new Date(Date.parse(month));
        var yyyy = date.getFullYear();
        var MM = date.getMonth() + offset;
        var dd = date.getDate();
        var HH = date.getHours() ;
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        console.log("pattern="+pattern)
        return this.format(new Date(yyyy, MM, dd, HH, mm, ss), pattern);
    },
    /**
     * 将指定月份偏移几个月
     * @param month {String} 指定月份，例："2018-01"
     * @param offset {Number} 偏移量，负数代表上几个月，正数代表下几个月，例：1
     * @returns {String} 返回计算后的月份，如："2018-02"
     */
    /*offsetMonths : function (month, offset) {
        var date = new Date(Date.parse(month));
        var year = date.getFullYear();
        var month = date.getMonth();
        var preOrNextMonth = month + offset;
        return this.format(new Date(year, preOrNextMonth), "yyyy-MM");
    },*/
    /**
     * 获取指定日期是星期几
     * @param date {String} 指定日期,例："2018-01-23"
     * @returns {Number} 返回星期几(1-7)，如：2
     */
    dayOfWeek : function (date) {
        var time = new Date(Date.parse(date));
        var weekday=new Array(7);
        weekday[0]= 7;
        weekday[1]= 1;
        weekday[2]= 2;
        weekday[3]= 3;
        weekday[4]= 4;
        weekday[5]= 5;
        weekday[6]= 6;
        return weekday[time.getDay()];
    },
    /**
     * 获取指定月份有多少天
     * @param month {String} 指定月份：例"2018-01"
     * @returns {number} 返回指定月份有多少天，如：31
     */
    daysInMonth : function (month) {
        var date = new Date(Date.parse(month));
        var year = date.getFullYear();
        var month = date.getMonth();
        if (month == 1) {
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
                return 29;
            else
                return 28;
        } else if ((month <= 6 && month % 2 == 0) || (month > 6 && month % 2 == 1))
            return 31;
        else
            return 30;
    },
    /**
     * 将指定月份偏移几个月
     * @param month {String} 指定月份，例："2018-01"
     * @param offset {Number} 偏移量，负数代表上几个月，正数代表下几个月，例：1
     * @param pattern {String} 返回时间的格式，例："yyyy-MM-dd HH:mm"
     * @returns {String} 返回计算后的月份，如："2018-02"
     */
    offsetMonthDay : function (date, offset, pattern) {
        var yyyy = date.getFullYear();
        var MM = date.getMonth() + offset;
        var dd = date.getDate();
        var HH = date.getHours() ;
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        console.log("pattern="+pattern)
        return this.format(new Date(yyyy, MM, dd, HH, mm, ss), pattern);
    },
    inRangeDateTime : function (datetime,offset) {
        var oDate1 = new Date(datetime);    //地震时间
        var date = new Date();
        var yyyy = date.getFullYear();
        var MM = date.getMonth();
        var dd = date.getDate();
        var HH = date.getHours() + offset;
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        var oDate2 = new Date(yyyy, MM, dd, HH, mm, ss);    //开始日期

        if(oDate1.getTime() > oDate2.getTime()){
            return true;
        } else {
            return false;
        }
    }
};