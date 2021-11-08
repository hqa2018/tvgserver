var DEV_CODE = "";
var POINT_ID = "";
var mdate;  //监控数据日期选择
var tdate;  //触发数据日期选择
//时间选择器
//获取pointid
function fetchPointId() {
    console.log("DEV_CODE:"+DEV_CODE)
    $.getJSON("../monitor/getdevinfo",{code:DEV_CODE},function (result) {
        POINT_ID = result["NetCode"]+"."+result["StaCode"];
    });
}

/*获取台站选项*/
function fetchDevList() {
    $.getJSON("../monitor/getdevlist",{pointid:POINT_ID,date:mdate},function (result) {
        $("#stadev_list").empty()
        $("#stadev_list").append(`<option value="">请选择台站代码</option>`)
        for(var i=0;i<result.length;i++){
            $("#stadev_list").append(`<option value="${result[i]["pointid"]}">${result[i]["pointid"]}</option>`)
        }
        if(POINT_ID !==""){
            $("#stadev_list").val(POINT_ID)
        }
    });
}

/*初始化参数*/
function initParams() {
    DEV_CODE = $("#devcode").val();
    $("#startTime").val(TimeFrameUtil.format(new Date(),"yyyy-MM-dd"))
    $("#startTime").val("2021-08-29")
    mdate = $("#startTime").val();
}

function fetchMonthOption() {
    console.log("POINT_ID:"+POINT_ID)
    $.getJSON("../monitor/getEventMonths",{pointid:POINT_ID},function (result) {
        $("#month_list").empty()
        for(var i=0;i<result.length;i++){
            $("#month_list").append(`<option value="${result[i]}">${result[i]}</option>`)
        }
        if($("#month_list").val()){
            fetchFileOption($("#month_list").val())
        }
    });
}

/*获取事件日志文件选项*/
function fetchFileOption(month) {
    console.log("fetchFileOption")
    $.getJSON("../monitor/getEventsByMonth",{pointid:POINT_ID,month:month},function (result) {
        $("#file_list").empty()
        for(var i=0;i<result.length;i++){
            $("#file_list").append(`<option value="${result[i]}">${result[i]}</option>`)
        }
    });
}

function fetchEventLog() {
    var filename = $("#file_list").val().replace(".txt","")
    $.getJSON("../monitor/fetchEventLog",{pointid:POINT_ID,filename:filename},function (result) {
        $(".event_list").empty()
        console.log(result.length)
        for(var i=0;i<result.length;i++){
            //${result[i]["describe"]}
            var params = result[i]["params"].split(",")
            // "/monitor/downloadEventData?pointid=CN.23540&file=20211103085739"
            var file = result[i]["dataTime"].replaceAll("-","").replaceAll(":","").replaceAll(" ","")
            $(".event_list").append(
                `<div class="info boxstyle">
                    <div class="title">${result[i]["dataTime"]} 
                    <a class="download-button" href="../monitor/downloadEventData?pointid=${POINT_ID}&file=${file}" 
                        type="button" >下载</a></div>
                    <div class="info-main-8 info_lf">
                        <ul>
                            <li><span> </span><p class="text-info ">${params[0]}</p></li>
                            <li><span> </span><p class="text-info ">${params[1]}</p></li>
                            <li><span> </span><p class="text-info ">${params[2]}</p></li>
                            <li><span> </span><p class="text-info ">${params[3]}</p></li>
                            <li><span> </span><p class="text-info ">${params[4]}</p></li>
                            <li><span> </span><p class="text-info ">${params[5]}</p></li>
                            <li><span> </span><p class="text-info ">${params[6]}</p></li>
                            <li><span> </span><p class="text-info ">${result[i]["describe"]}</p></li>
                        </ul>
                    </div>
                </div>`
            )
        }
    });
}

$(function () {
    //日期控件
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem: '#startTime',
            done: function(value, date){
                // alert("选中："+value)
                mdate = value;
                // layer.alert('你选择的日期是：' + value + '<br>获得的对象是' + JSON.stringify(date));
            }
        });
    });

    initParams()
    $.ajaxSettings.async = false;
    fetchPointId();
    fetchDevList();
    $.ajaxSettings.async = true;
    fetchMonthOption();
    fetchFileOption();

    $("#stadev_list").on("change",function () {
        POINT_ID = $(this).val()
        fetchMonthOption();
    });

    $("#month_list").on("change",function () {
        fetchFileOption($(this).val())
    });

    $("#devSearch").on("click",function () {
        fetchEventLog();
    })

    setTimeout(function () {
        fetchEventLog();
    },500)
})



		
		
		


		









