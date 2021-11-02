<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="layout" content="main" />
<script src="${request.getContextPath()}/static/js/echarts.min.js"></script>
%{--<script src="/static/js/china.js"></script>--}%
%{--<script src="/static/js/hashmap.js"></script>--}%
<script src="${request.getContextPath()}/static/js/realtime.js"></script>
<link rel="stylesheet" href="${request.getContextPath()}/static/css/_common.css">
<link rel="stylesheet" href="${request.getContextPath()}/static/css/realtime.css">
<link rel="stylesheet" href="${request.getContextPath()}/static/css/tsareal.css">
<link rel="stylesheet" href="${request.getContextPath()}/static/css/index.css">
</head>
<body>
%{--系统设置--}%
<ul class="nav">
    <li class="drop-down">
        <a href="#"></a>
        <ul class="drop-down-content">
            <li>
                <a href="#" id="alarm_bat">设置报警</a>
            </li>
            <li>
                <a href="./mapview">地图监测</a>
            </li>
            <li>
                <a href="./realtime">实时监控</a>
            </li>
        </ul>
    </li>
</ul>


<input class="staCode" hidden value="${params?.staCode}"/>
<input class="manCode" hidden value="${params?.manCode}"/>
<div class="loading">
    <div class="loadbox"> <img src="/static/images/loading.gif"> 页面加载中... </div>
</div>
<div class="data">
    <div class="data-title">
        <div class="title-center"><g:pageTitle/></div>
    </div>
    <button type="button" style="display:none" id="alarm_play" onclick="playSound()">报警声音</button>
    <button type="button" style="display:none" id="alarm_pause" onclick="playPause()">解除声音</button>
	<div id="menu">
		<ul>
			<li class="li_scssz">参数设置</li>
            <li class="alert_scssz">报警设置</li>
			<li class="rebootBtn">设备重启</li>
		</ul>
	</div>
    %{--报警参数修改--}%
    <div id="div_setQJ" class="popup-alert" style="width:360px;height:245px">
        <div class="span_title alparam_title" style="width:100%;">报警参数设置<div class="popup_close alarmpar_close" style="float:right;" >x</div></div>
        <div class="div_set_main" >
            <table class="form-table">
                <tbody>
                %{--<tr>
                    <td>报警响铃时间(s)</td><td colspan="2"><input id="ALERTMRING" style="width:120px" value="0"/></td>
                    <td>清除报警时间(s)</td><td colspan="2"><input id="ALERTMCLR" style="width:120px"value="0"/></td>
                </tr>--}%
                <tr>
                    <td>启用防盗</td><td colspan="2"><input id="guardEnable" type="checkbox" style="" value="0"/></td>
                </tr>
                <tr>
                    <td>GPS精准度</td><td colspan="2"><input id="range2" style="width:120px"value="0"/></td>
                </tr>
                <tr>
                    <td>阀值</td><td>最小</td><td>最大</td>
                </tr>
                %{--GPS状态, GPS精度, GPS 位置栅栏,垂直向零位,东西向零位, 北南向零位,电池电压,PCB温度--}%
                <tr>
                    <td class="labal-param7"><g:fetchnname chn="7"/></td><td><input id="range7" style="width:60px"/></td><td><input id="_range7" style="width:60px" value="0"/></td>
                </tr>
                <tr>
                    <td class="labal-param8"><g:fetchnname chn="8"/></td><td><input id="range8" style="width:60px"/></td><td><input id="_range8" style="width:60px"/></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="div-bottom" style="text-align:center">
            <button type="button" class="button_update save_alarm"  >
                保存
            </button>
            &nbsp;&nbsp;&nbsp;
            <button type="button" class="button_return alarmpar_close"  >
                返回
            </button>
        </div>
    </div>

    %{--台站参数修改--}%
	<div id="div_setLF" style="width:1000px;height:600px">
		<div class="span_title param_title" style="height:30px;width:100%;">参数设置<div class="popup_close divset_close" style="float:right;" >x</div></div>
        <div class="div_set_main" >
            <form id="par_form">
                <table class="form-table info-table" style="display: inline-block;width: auto">
                    <tbody>
                    <tr>
                        <td colspan="4">基础参数</td>
                    </tr>
                    <tr class="hide">
                        <td>台网代码</td><td><input id="NetCode" name="NetCode" style="width:120px" value="0"/></td>
                        <td>台站代码</td><td><input id="StaCode" name="StaCode" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>实时采样率</td><td><input id="DataRate" name="DataRate" style="width:120px" value="0"/></td>
                        <td>0-miniseed</td><td><input id="SecMode" name="SecMode" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>低通滤波器</td><td><input id="DataLP" name="DataLP" style="width:120px" value="0"/></td>
                        <td>串口波特率</td><td><input id="CommRate" name="CommRate" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>时区</td><td><input id="TimeZero" name="TimeZero" style="width:120px" value="0"/></td>
                        <td>GPS</td><td><input id="GPSTm" name="GPSTm" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>采集器灵敏度</td><td><input id="AdSen" name="AdSen" style="width:120px" value="0"/></td>
                        <td>数据时间修正</td><td><input id="nTmCorr" name="nTmCorr" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>GPS位置栅栏信息</td><td><input id="GPSLocLock" name="GPSLocLock" style="width:120px" value="0"/></td>
                        <td>休眠时间</td><td><input id="G4SlpSec" name="G4SlpSec" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>自动调零</td><td><input id="AutoZero" name="AutoZero" style="width:120px" value="0"/></td>
                        <td>实时数据存盘模式</td><td><input id="SaveData" name="SaveData" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>监测数据采样率</td><td><input id="MonRate" name="MonRate" style="width:120px" value="0"/></td>
                        <td>监测数据存盘模式</td><td><input id="SaveMon" name="SaveMon" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>数据回溯模式</td><td><input id="DeleteMode" name="DeleteMode" style="width:120px" value="0"/></td>
                        <td>监测数据上传间隔</td><td><input id="SendMon" name="SendMon" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>工作模式</td><td><input id="WorkMode" name="WorkMode" style="width:120px" value="0"/></td>
                        <td>压控晶振拟合参数</td><td><input id="TCXO" name="TCXO" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>服务器1的IP</td><td><input id="ServerIP1" name="ServerIP1" style="width:120px" value="0"/></td>
                        <td>服务器1的端口</td><td><input id="ServerPort1" name="ServerPort1" style="width:120px" value="0"/></td>
                    </tr>
                    <tr>
                        <td>服务器2的IP</td><td><input id="ServerIP2" name="ServerIP2" style="width:120px" value="0"/></td>
                        <td>服务器2的端口</td><td><input id="ServerPort2" name="ServerPort2" style="width:120px" value="0"/></td>
                    </tr>
                    </tbody>
                </table>
                <table class="form-table info-table" style="display: inline-block;vertical-align:top;;width: auto">
                    <tbody>
                    <tr>
                        <td colspan="4">通道参数</td>
                    </tr>
                    <tr>
                        <td></td><td>通道1</td><td>通道2</td><td>通道3</td>
                    </tr>
                    <tr>
                        <td>通道代码<input id="ChCode" name="ChCode" class="hide"/></td>
                        <td><input id="ChCode0" style="width:100px"/></td>
                        <td><input id="ChCode1" style="width:100px"/></td>
                        <td><input id="ChCode2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>位置标识符<input id="LocID" name="LocID" class="hide"/></td>
                        <td><input id="LocID0" style="width:100px"/></td>
                        <td><input id="LocID1" style="width:100px"/></td>
                        <td><input id="LocID2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>通道增益<input id="Gain" name="Gain" class="hide"/></td>
                        <td><input id="Gain0" style="width:100px"/></td>
                        <td><input id="Gain1" style="width:100px"/></td>
                        <td><input id="Gain2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>传感器类型<input id="SensorMode" name="SensorMode" class="hide"/></td>
                        <td><input id="SensorMode0" style="width:100px"/></td>
                        <td><input id="SensorMode1" style="width:100px"/></td>
                        <td><input id="SensorMode2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>灵敏度<input id="SensorSen" name="SensorSen" class="hide"/></td>
                        <td><input id="SensorSen0" style="width:100px"/></td>
                        <td><input id="SensorSen1" style="width:100px"/></td>
                        <td><input id="SensorSen2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>低频截至频带<input id="SensorLow" name="SensorLow" class="hide"/></td>
                        <td><input id="SensorLow0" style="width:100px"/></td>
                        <td><input id="SensorLow1" style="width:100px"/></td>
                        <td><input id="SensorLow2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>传感器高频截至频带<input id="SensorHigh" name="SensorHigh" class="hide"/></td>
                        <td><input id="SensorHigh0" style="width:100px"/></td>
                        <td><input id="SensorHigh1" style="width:100px"/></td>
                        <td><input id="SensorHigh2" style="width:100px"/></td>
                    </tr>
                    <tr>
                        <td>高通滤波器<input id="DataHP" name="DataHP" class="hide"/></td>
                        <td><input id="DataHP0" style="width:100px"/></td>
                        <td><input id="DataHP1" style="width:100px"/></td>
                        <td><input id="DataHP2" style="width:100px"/></td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
		<div class="div-bottom" style="text-align:center">
			<button type="button" class="button_update save_params"  >
				保存
			</button>
            &nbsp;&nbsp;&nbsp;
			<button type="button" class="button_return divset_close"  >
				返回
			</button>
		</div>
	</div>

	<div id="div_alert" style="height:400px;width:740px">
		<div class="span_title" style="width:100%">触发报警</div>
		<div class="alarm_body div_set_main" >
            <div class="boxstyle">
                <div class="title"><img src="/static/images/info-img-3.png" width="36"></div>
                <div class="info-main-6 info_lf">
                </div>
            </div>
            <!-- <span style="font-size:36px; text-align:center;padding:20px;">报警异常！</span> -->
		</div>
		<div class="div-bottom" style="text-align:center">
			<button type="button" class="button_close"  >
				关闭窗口
			</button>
		</div>
	</div>
    <div class="data-content">
        <div class="con-left fl">
            <div class="info_list left-top">
                <g:each in="${[1,2,3]}" var="num">
                    <div class="info boxstyle">
                        <div class="title"><img src="/static/images/info-img-3.png" width="36">TVG-63[SH.REDS3]</div>
                        <div class="info-main-6 info_lf">
                            <ul>
                                <li><span>GPS状态    </span><p id="ch1" class="text-success ">21</p><span>15</span></li>
                                <li><span>GPS精度    </span><p id="ch2" class="text-danger  ">100</p><span>2000</span></li>
                                <li><span>GPS位置栅栏 </span><p id="ch3" class="text-success ">65</p><span>300</span></li>
                                <li><span>垂直向零位  </span><p id="ch4" class="text-success ">32</p><span>300</span></li>
                                <li><span>东西向零位  </span><p id="ch5" class="text-success ">23</p><span>65</span></li>
                                <li><span>北南向零位  </span><p id="ch6" class="text-success ">68</p><span>-</span></li>
                                <li><span>电池电压    </span><p id="ch7" class="text-success ">68</p><span>-</span></li>
                                <li><span>PCB温度    </span><p id="ch8" class="text-success ">68</p><span>-</span></li>
                            </ul>
                        </div>
                    </div>
                </g:each>
            </div>
        </div>
        <div class="con-right fr">
            <div class="right-top boxstyle">
                <div class="title">设备状态</div>
                <div id="echarts_4" class="charts"></div>
            </div>
            %{--<div class="right-bottom boxstyle">
                <div class="title">电池电量</div>
                <div id="echarts_5" class="charts"></div>
            </div>--}%
        </div>
    </div>
</div>
</body>
</html>