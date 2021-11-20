<asset:stylesheet href="popup.css"/>
%{--台站配置参数--}%
<div class="table_info">
    <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
        <div class="span_title ">
            <span class="stapar_title">台站参数配置</span>
            <div class="stapar_close btn-close"
                 style="float:right;margin-right: 5px;width: 26px;margin-top: 7px;line-height: 23px;float: right;background-color: #34444c;height: 26px;">x</div>
        </div>
    </div>
    <div id="staInfoTable">
        <form id="par_form">
            <table class="info-table" style="display: inline-block;">
                <tbody>
                <tr hidden>
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
                    <td>工作模式</td>
                    <td><select id="WorkMode" name="WorkMode" style="width:120px">
                        <option value="0">4G不工作模式</option>
                        <option value="1">4G实时数据模式</option>
                        <option value="2">4G 非实时监测模式</option>
                    </select>
                        %{--<input id="WorkMode" name="WorkMode" style="width:120px" value="0"/>--}%
                    </td>
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
            <table class="info-table" style="display: inline-block;vertical-align:top;">
                <tbody>
                <tr>
                    <td colspan="4">通道参数</td>
                </tr>
                <tr>
                    <td></td><td>通道1</td><td>通道2</td><td>通道3</td>
                </tr>
                <tr>
                    <td>通道代码<input id="ChCode" name="ChCode" hidden/></td>
                    <td><input id="ChCode0" style="width:100px"/></td>
                    <td><input id="ChCode1" style="width:100px"/></td>
                    <td><input id="ChCode2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>位置标识符<input id="LocID" name="LocID" hidden/></td>
                    <td><input id="LocID0" style="width:100px"/></td>
                    <td><input id="LocID1" style="width:100px"/></td>
                    <td><input id="LocID2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>通道增益<input id="Gain" name="Gain" hidden/></td>
                    <td><input id="Gain0" style="width:100px"/></td>
                    <td><input id="Gain1" style="width:100px"/></td>
                    <td><input id="Gain2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>传感器类型<input id="SensorMode" name="SensorMode" hidden/></td>
                    <td><input id="SensorMode0" style="width:100px"/></td>
                    <td><input id="SensorMode1" style="width:100px"/></td>
                    <td><input id="SensorMode2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>灵敏度<input id="SensorSen" name="SensorSen" hidden/></td>
                    <td><input id="SensorSen0" style="width:100px"/></td>
                    <td><input id="SensorSen1" style="width:100px"/></td>
                    <td><input id="SensorSen2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>低频截至频带<input id="SensorLow" name="SensorLow" hidden/></td>
                    <td><input id="SensorLow0" style="width:100px"/></td>
                    <td><input id="SensorLow1" style="width:100px"/></td>
                    <td><input id="SensorLow2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>传感器高频截至频带<input id="SensorHigh" name="SensorHigh" hidden/></td>
                    <td><input id="SensorHigh0" style="width:100px"/></td>
                    <td><input id="SensorHigh1" style="width:100px"/></td>
                    <td><input id="SensorHigh2" style="width:100px"/></td>
                </tr>
                <tr>
                    <td>高通滤波器<input id="DataHP" name="DataHP" hidden/></td>
                    <td><input id="DataHP0" style="width:100px"/></td>
                    <td><input id="DataHP1" style="width:100px"/></td>
                    <td><input id="DataHP2" style="width:100px"/></td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
    <button id="saveParam" class="btn-sm btn-default bat_button" value="">保存</button>
</div>
%{--报警配置参数--}%
<div class="table_info">
    <div style="text-align: center;background-color: #061537;height: 40px;font-weight: 600;line-height: 36px;">
        <div class="span_title ">
            <span class="alarm_title">报警参数配置</span>
            <div class="alarm_close btn-close"
                 style="float:right;margin-right: 5px;width: 26px;margin-top: 7px;line-height: 23px;float: right;background-color: #34444c;height: 26px;">x</div>
        </div>
    </div>
    <div id="staAlarmTable">
        <form id="alarm_form">
            <table class="info-table">
                <tbody>
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
                    <td class="labal-param7"><g:fetchnname chn="7"/></td>
                    <td><input id="range7" type="number" style="width:70px"/></td><td><input id="_range7" type="number" style="width:70px"/></td>
                </tr>
                <tr>
                    <td class="labal-param8"><g:fetchnname chn="8"/></td>
                    <td><input id="range8" type="number" style="width:70px"/></td><td><input id="_range8" type="number" style="width:70px"/></td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
    <button id="saveAlarm" class="btn-sm btn-default bat_button" value="">保存</button>
</div>
