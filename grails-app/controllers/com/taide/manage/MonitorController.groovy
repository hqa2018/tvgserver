package com.taide.manage

import com.taide.entity.StationDev
import com.taide.system.AlarmConifg
import com.taide.system.SystemConfig
import com.taide.util.DateUtils
import com.taide.util.FileUtil
import com.taide.util.NumberUtils
import grails.converters.JSON
import org.apache.commons.lang3.StringUtils

import java.lang.reflect.Array
import java.util.regex.Pattern

class MonitorController {

    def dataManagerService

    //======================页面视图=======================//

    def index() { }

    def details() {
//        [devcode:params.devcode]
    }
    /**
     * 页面action
     * */
    def realtime () {

    }

    def _realtime () {

    }

    def mapview () {

    }

    def popup(){

    }

    def devdata(){

    }

    def eventdata(){

    }

    def list(){

    }

    def runrate(){

    }

    //======================后台操作=======================//

    /**
     * 更新基础参数
     * */
    def updateBaseInfoData = {
        if(dataManagerService.updateParData()){
            render(1)
        }else{
            render(0)
        }
    }

    /**
     * 更新实时监控数据
     * */
    def updateMoStatusData = {
        if(dataManagerService.updateMonDataStatus()){
            render(1)
        }else {
            render(0)
        }
    }

    /**
     * 重启设备
     * 文件名：台网.台站代码.reoot
     * */
    def restart = {
        FileUtil.writeTxtFile(DataManager.ROOT_PATH+"/setpar/"+params["pointid"]+".reoot","",false);
        render("ok")
    }

    /**
     * 设备控制
     * pointid:指定设备ID
     * cmd:控制指令
     * type:控制参数
     */
    def control = {
        def path = DataManager.ROOT_PATH+"/setpar/"+params["pointid"]+"."+params["cmd"]
//        println("path="+path)
        def content = params["type"] ? params["type"] : "";
        FileUtil.writeTxtFile(path,content,false);
        render("ok")
    }

    /**
     * 保存参数
     * 文件名：台网.台站代码.par
     * */
    def savepar = {
        String content = ""
//        params.each { key,value->
//            content += key+"="+value+"\r\n"
//            println(key+"="+value)
//        }
        content += "NetCode="+params["NetCode"]+"\r\n"
        content += "StaCode="+params["StaCode"]+"\r\n"
        content += "LocID="+params["LocID"]+"\r\n"
        content += "ChCode="+params["ChCode"]+"\r\n"
        content += "Gain="+params["Gain"]+"\r\n"
        content += "SensorMode="+params["SensorMode"]+"\r\n"
        content += "SensorSen="+params["SensorSen"]+"\r\n"
        content += "SensorLow="+params["SensorLow"]+"\r\n"
        content += "SensorHigh="+params["SensorHigh"]+"\r\n"
        content += "DataHP="+params["DataHP"]+"\r\n"
        content += "DataRate="+params["DataRate"]+"\r\n"
        content += "SecMode="+params["SecMode"]+"\r\n"
        content += "DataLP="+params["DataLP"]+"\r\n"
        content += "CommRate="+params["CommRate"]+"\r\n"
        content += "TimeZero="+params["TimeZero"]+"\r\n"
        content += "GPSTm="+params["GPSTm"]+"\r\n"
        content += "AdSen="+params["AdSen"]+"\r\n"
        content += "nTmCorr="+params["nTmCorr"]+"\r\n"
        content += "GPSLocLock="+params["GPSLocLock"]+"\r\n"
        content += "G4SlpSec="+params["G4SlpSec"]+"\r\n"
        content += "AutoZero="+params["AutoZero"]+"\r\n"
        content += "SaveData="+params["SaveData"]+"\r\n"
        content += "MonRate="+params["MonRate"]+"\r\n"
        content += "SaveMon="+params["SaveMon"]+"\r\n"
        content += "DeleteMode="+params["DeleteMode"]+"\r\n"
        content += "SendMon="+params["SendMon"]+"\r\n"
        content += "WorkMode="+params["WorkMode"]+"\r\n"
        content += "TCXO="+params["TCXO"]+"\r\n"
        content += "ServerIP1="+params["ServerIP1"]+"\r\n"
        content += "ServerIP2="+params["ServerIP2"]+"\r\n"
        content += "ServerPort1="+params["ServerPort1"]+"\r\n"
        content += "ServerPort2="+params["ServerPort2"]+"\r\n"
        def result = FileUtil.writeTxtFile(DataManager.ROOT_PATH+"/setpar/"+params["NetCode"]+"."+params["StaCode"]+".par",content,false);
        //保存成功后更新基础数据缓存
        if(result){
            dataManagerService.updateBaseInfoData()
            render(1)
        }else{
            render(0)
        }
    }

    /**
     * 保存报警参数
     * */
    def saveAlertConfig = {
        if(params.pointid == "all"){
            Map devData = DataManager.getInstance().getCacheItems()
            for(String key : devData.keySet()){
                StationDev stadev = devData.get(key);
                String codekey = stadev.NetCode + "." + stadev.StaCode;
                def saveparam = [:]
                saveparam = params
                saveparam.pointid = codekey
                saveAlarmParam(saveparam);
            }
        }else{
            def alarmConifgInstane = AlarmConifg.findWhere(pointid:params.pointid);
            def sparams = [:]
            println "params.ch3Range:"+params.ch3Range
            sparams.pointid = params.pointid
            sparams.guardEnable = params.guardEnable
            sparams.ch1Range = ""
            sparams.ch2Range = params.ch2Range
            sparams.ch3Range = params.ch3Range
            sparams.ch4Range = params.ch4Range
            sparams.ch5Range = params.ch5Range
            sparams.ch6Range = params.ch6Range
            sparams.ch7Range = params.ch7Range
            sparams.ch8Range = params.ch8Range
            if(alarmConifgInstane){
                println "edit "+params.pointid
                println "ch2Range: "+sparams.ch2Range
                println "ch3Range: "+sparams.ch3Range
                alarmConifgInstane.properties = sparams
                if(alarmConifgInstane.save(flush:true)){
                    render("success")
                }else {
                    alarmConifgInstane.errors.each {
                        println it
                    }
                }
            }else{
                println "create "+params.pointid
                alarmConifgInstane = new AlarmConifg()
                alarmConifgInstane.properties = sparams
                if(alarmConifgInstane.save(flush:true)){
                    render("success")
                }else {
                    alarmConifgInstane.errors.each {
                        println it
                    }
                    render("error")
                }
            }
        }
    }

    def saveAlarmParam(params){
        def alarmConifgInstane = AlarmConifg.findWhere(pointid:params.pointid);
        def sparams = [:]
        sparams.pointid = params.pointid
        sparams.guardEnable = params.guardEnable
        sparams.ch1Range = ""
        sparams.ch2Range = params.ch2Range
        sparams.ch3Range = params.ch3Range
        sparams.ch4Range = params.ch4Range
        sparams.ch5Range = params.ch5Range
        sparams.ch6Range = params.ch6Range
        sparams.ch7Range = params.ch7Range
        sparams.ch8Range = params.ch8Range
        if(alarmConifgInstane){
            println "edit "+params.pointid
            alarmConifgInstane.properties = sparams
            if(alarmConifgInstane.save(flush:true)){
                render("success")
            }else {
                render("error")
            }
        }else{
            println "create "+params.pointid
            alarmConifgInstane = new AlarmConifg()
            alarmConifgInstane.properties = sparams
            if(alarmConifgInstane.save(flush:true)){
                render("success")
            }else {
                alarmConifgInstane.errors.each {
                    println it
                }
                render("error")
            }
        }
    }

    /**
     * 设置系统参数
     * */
    def setSystemConfig = {
        def systemParamInstance
        def systemParamInstanceList =  SystemConfig.list();
        if(systemParamInstanceList && systemParamInstanceList.size() > 0)
            systemParamInstance = systemParamInstanceList.get(0)
        else
            systemParamInstance = new SystemConfig(params)
        systemParamInstance.properties = params

        if (systemParamInstance.save(flush: true)) {
//            flash.message = "successed update params!"
//            redirect(action: "systemparam")
            render("success")
        }
        else {
            render(view: "create", model: [systemParamInstance: systemParamInstance])
        }
    }

    //======================数据接口=======================//

    //获取状态数据接口
    def fetchMonStatusData = {
        render DataManager.curMonDataList as JSON
    }

    //获取状态数据
    def queryrecord = {
        response.addHeader("Access-Control-Allow-Origin", "*");
        List<Map<String,Object>> returnList = new LinkedList<Map<String,Object>>();
        String path = DataManager.ROOT_PATH + "/data/MonStatus.txt";
        println("path:"+path)
        String respone = FileUtil.ReadFileContent(path, "utf-8");
//        println("respone="+respone)
        Map devData = DataManager.getInstance().getCacheItems()
        for(String key : devData.keySet()){
            StationDev stadev = devData.get(key);
            String codekey = stadev.NetCode + "." + stadev.StaCode
            if(params.pointid){
                if(codekey!=params.pointid) continue;
            }
            if (respone != null) {
                /*获取设备基本信息*/
                Map<String,String> tempMap = new HashMap<String, String>();
                tempMap.put("devcode",key);
                tempMap.put("staCode",stadev.StaCode);
                tempMap.put("pointid",codekey);
                tempMap.put("datatime","NULL");
                tempMap.put("status","0");
                returnList.add(tempMap);
                String[] lineArray = respone.split("\\r\\n");
                /*获取设备实时状态*/
                if (lineArray.length != 0){
                    for (int i = 0; i < lineArray.length; i++) {
                        String lineStr = "";
                        if(lineArray[i].contains("=")){
                            lineStr = lineArray[i].split("=")[1];
                        }else{
                            lineStr = lineArray[i];
                        }
                        String[] columnArray2 = lineStr.trim().split(",");
                        String deviceName = columnArray2[1];
//                        println("columnArray2="+columnArray2[0])
                        if(columnArray2[0] == codekey){
                            def alarmConfig = [:]
                            alarmConfig = AlarmConifg.findWhere(pointid: codekey)
                            def gps_stat = columnArray2[5]   //GPS状态
                            def gps_acc = columnArray2[6]    //GPS精度
                            tempMap.put("status","1");
                            tempMap.put('datatime',columnArray2[1]);
                            tempMap.put('lon',columnArray2[2]);
                            tempMap.put('lat',columnArray2[3]);
                            tempMap.put('alt',columnArray2[4]);
                            tempMap.put("guard_status","0");
                            //防盗状态
                            if(alarmConfig?.guardEnable){
                                tempMap.put("guard_status","1");
                                if(gps_stat == "0"){
                                    if(Double.parseDouble(gps_acc) > Double.parseDouble(alarmConfig["ch2Range"])){
                                        tempMap.put("guard_status","2");
                                        tempMap.put("status","2");
                                    }
                                }
                            }
                            for(int n=1;n<=8;n++){
                                def name = "GPS状态";
                                def chval = columnArray2[4+n];
                                def range = alarmConfig ? alarmConfig["ch"+n+"Range"]:"";
                                switch (n) {
                                    case 1:
                                        name = "GPS状态";
                                        break;
                                    case 2:
                                        name = "GPS精度";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    case 3:
                                        name = "GPS位置栅栏";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    case 4:
                                        name = "垂直向零位";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    case 5:
                                        name = "东西向零位";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    case 6:
                                        name = "北南向零位";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    case 7:
                                        name = "电池电压";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    case 8:
                                        name = "PCB温度";
                                        chval = NumberUtils.keepPrecision(columnArray2[4+n],3);
                                        break;
                                    default:
                                        name = "GPS状态";
                                        break;
                                }
                                tempMap.put('ch'+n+'_status',"1");

                                //阈值状态
                                if(range!="#"&range!=""&&range!=null && n > 2){
                                    def min = range.split("#")[0];
                                    def max = range.split("#")[1];
                                    if(Double.parseDouble(chval) > Double.parseDouble(max) || Double.parseDouble(chval) < Double.parseDouble(min)){
//                                        println(min+"#"+chval+"#"+max);
                                        tempMap.put('ch'+n+'_status',"0");
                                        tempMap.put("status","2");
                                    }
                                }
                                tempMap.put('ch'+n+'_name',name);
                                tempMap.put('ch'+n,chval);
                            }
                            break;
                        }
                    }
                }
            }
        }
        render returnList as JSON;
    }

    /*获取设备列表信息*/
    def getdevlist = {
        def result = new ArrayList();
        Map devData = DataManager.getInstance().getCacheItems()
        for(String key : devData.keySet()){
            StationDev stadev = devData.get(key);
            def obj = [:]
            obj["devcode"] = key
            obj["pointid"] = stadev.NetCode+"."+stadev.StaCode
            obj["NetCode"] = stadev.NetCode
            obj["StaCode"] = stadev.StaCode
            obj["LocID"] = stadev.LocID
            obj["ChCode"] = stadev.ChCode
            result.add(obj)
        }
        render result as JSON
    }

    def getdevinfo = {
        Map devData = DataManager.getInstance().getCacheItems()
        def result = [:]
        StationDev param = devData.get(params.code)
        result["NetCode"] = param.NetCode
        result["StaCode"] = param.StaCode
        result["LocID"] = param.LocID
        result["ChCode"] = param.ChCode
        result["Gain"] = param.Gain
        result["SensorMode"] = param.SensorMode
        result["SensorSen"] = param.SensorSen
        result["SensorLow"] = param.SensorLow
        result["SensorHigh"] = param.SensorHigh
        result["DataHP"] = param.DataHP
        result["DataRate"] = param.DataRate
        result["SecMode"] = param.SecMode
        result["DataLP"] = param.DataLP
        result["CommRate"] = param.CommRate
        result["TimeZero"] = param.TimeZero
        result["GPSTm"] = param.GPSTm
        result["AdSen"] = param.AdSen
        result["nTmCorr"] = param.nTmCorr
        result["GPSLocLock"] = param.GPSLocLock
        result["G4SlpSec"] = param.G4SlpSec
        result["AutoZero"] = param.AutoZero
        result["SaveData"] = param.SaveData
        result["MonRate"] = param.MonRate
        result["SaveMon"] = param.SaveMon
        result["DeleteMode"] = param.DeleteMode
        result["SendMon"] = param.SendMon
        result["WorkMode"] = param.WorkMode
        result["TCXO"] = param.TCXO
        result["ServerIP1"] = param.ServerIP1
        result["ServerIP2"] = param.ServerIP2
        result["ServerPort1"] = param.ServerPort1
        result["ServerPort2"] = param.ServerPort2
        render result as JSON;
    }

    def getAlertConfig = {
        def alarmConifgInstane = AlarmConifg.findWhere(pointid:params.pointid);
//        def a = [:]
//        a = alarmConifgInstane
//        println(a.ch1Range)
        if(alarmConifgInstane){
            render alarmConifgInstane as JSON
        }else{
            def result = [:]
            result["pointid"] = params.pointid
            result["guardEnable"] = false
            for(int i=1;i<=8;i++){
                result["ch"+i+"Range"] = "";
            }
//            "ch1Range":"1#3","ch2Range":"#","ch3Range":"#","ch4Range":"#","ch5Range":"#","ch6Range":"#","ch7Range":"12#15","ch8Range":"10#40","pointid":"SH.49811"}
            render result as JSON
        }
    }

    //获取每月台站运行率
    def fetchMonitorRunrate = {
        def result = new ArrayList();
        DataManager.curMonDataList.each { mondata ->
            println("mondata.pointid:"+mondata.pointid)
            def itemobj = [:]
            itemobj["devcode"] = mondata.devcode
            itemobj["pointid"] = mondata.pointid
            def netcode = mondata.pointid.split("\\.")[0]
            def stacode = mondata.pointid.split("\\.")[1]
//        if(params.pointid){
//            def netcode = params.pointid.split("\\.")[0]
//            def stacode = params.pointid.split("\\.")[1]
//        }
            String path = DataManager.ROOT_PATH+"/trace/"+netcode+"/"+stacode+"/";
            List<String> datelist = DateUtils.getEverydayByMonth(params.month);

            def ratecount = 0;
            def data = []
//            itemobj["data"] = data
            for (String datestr : datelist) {
                def datename = datestr.replaceAll("-","")
//                println("datestr="+datestr)
                List<File> fileList = FileUtil.listFilesInDirWithFilter(path,new FileFilter() {
                    @Override
                    boolean accept(File pathname) {
//                    println("name="+pathname.getName().substring(0,8))
                        return datename.equals(pathname.getName().substring(0,8))
                    }
                },false);
                double rate = fileList == null ? 0.0 : (double) fileList.size()/24
                def runrate = Math.round(rate*100)
                ratecount += runrate
                itemobj[datestr] = runrate
                def obj = [:]
                obj["date"] = datestr
                obj["runrate"] = runrate
                data.add(obj)
            }
            def avgrate = ratecount/datelist.size()
            itemobj["sumrate"] = avgrate
            result.add(itemobj)
        }

        render(result as JSON)
    }

    /*查询历史数据*/
    def fetchMonitorData = {
        if(params.stationid.split(".").size() > 1){
            def netcode = params.stationid.split(".")[0];
            def stacode = params.stationid.split(".")[1];
            def stapath = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/monitor";
            List<File> fileList = FileUtil.listFilesInDir(stapath);
        }else{
            render("stationid:参数错误")
        }
//        dataManagerService.gethistorydata();
        render("success")
    }
    //获取设备基础数据信息

    //获取设备历史数据信息
    def getMonStoreData = {
        println "params.pointid="+params.pointid
        def datestr = params.date.replaceAll("-","")
        println "datestr="+datestr
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
//        datestr = "20210829"
        String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/monitor/"+datestr+".txt"
//        println(path)
        ArrayList list = FileUtil.readFileContent(path,"utf-8");
        def datamap = [:]
        def timearr = []
        datamap.time = timearr
        for(int i=0;i<list.size();i++){
            String line = list.get(i)
            String datetime = line.split(",")[0]
            timearr.add(datetime.split(" ")[1])
            def data = line.split(",")
            println("data.size():"+data.size())
            for(int j=1;j<17;j++){
                if(i==0){
                    datamap["ch"+j] = new ArrayList()
                }
                datamap["ch"+j].add(data[j])
            }
//            ch1.add([DateUtil.parseDateNewFormat(datetime).getTime(),data[1]])
//            println("datetime:"+datetime)
//            Date date = DateUtil.parseDefault(datatime)
//            println("datetime:"+date.getTime())
        }
        render(datamap as JSON)
    }

    //下载实时数据
    def downloadTraceData = {
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        def datestr = params.date.replaceAll("-","")
        String path = DataManager.ROOT_PATH+"/trace/"+netcode+"/"+stacode+"/"
        //过滤获取目录
        ArrayList<File> traceList = FileUtil.listFilesInDirWithFilter(path,new FileFilter() {
            @Override
            boolean accept(File pathname) {
//                println(pathname.getName().substring(0,8))
                return datestr.equals(pathname.getName().substring(0,8))
            }
        },false);
        println("traceList="+traceList.size())
        for(File file:traceList){
            println(file.getAbsolutePath())
            fileDownload(file.getAbsolutePath())
        }
    }

    //下载实时日志
    def downloadTraceLog = {
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        def datestr = params.date.replaceAll("-","")
        //CN\22435\monitor
        String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/monitor/"+datestr+".txt"
        fileDownload(path)
    }


    def getEventMonths = {
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
//        def year = "2021"
//        def month = "8"
//        def day = "17"
        /*if(params.date){
            year = params.date.split("-")[0]
            month = params.date.split("-")[1]
            day = params.date.split("-")[2]
        }*/
//        String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/"+year+"/"+month+"-"+day+"/Triger.txt"
        String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode

        ArrayList result = new ArrayList()
        //过滤获取目录
        ArrayList<File> yearList = FileUtil.listFilesInDirWithFilter(path,new FileFilter() {
            @Override
            boolean accept(File pathname) {
                return StringUtils.isNumeric(pathname.getName())
            }
        },true);
        for(File y : yearList){
            ArrayList<File> fileList = FileUtil.listFilesInDir(y)
            for(File f:fileList){
                println(f.getName())
                String month = f.getName().substring(0,6);
                if(!result.contains(month)){
                    result.add(month)
                }
            }
//            println(f.getName().substring(0,5))
        }
        render(result as JSON)
    }

    def getEventsByMonth = {
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/"
        ArrayList result = new ArrayList()
        //过滤获取目录
        ArrayList<File> fileList = FileUtil.listFilesInDir(path,true)
        for(File f : fileList){
            if(f.getName().length() > 7 && !f.getAbsolutePath().contains("monitor")){
                if(f.getName().substring(0,6).equals(params.month)){
                    result.add(f.getName())
                }
            }
        }
        render(result as JSON)
    }

    //
    def fetchEventLog = {
//        /tvgserver/monitor/getTrigerData?pointid=SH.49811&date=2021-11-02
//        \SH\49811\2021\8-17
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        def filename = params.filename
        def year = "2021"
        String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/"+year+"/"+filename+".txt"
        println "path="+path
        ArrayList list = FileUtil.readFileContent(path,"gbk");
        ArrayList result = new ArrayList();
        for(int i=0;i<list.size();i++){
            String line = list.get(i)
            String dateTime = line.split(",")[3]
            def obj = [:]
            obj["dataTime"] = dateTime
            obj["params"] = line.split(",")[1]+","+line.split(",")[2]+","+line.split(",")[4]+","+line.split(",")[5]+","+line.split(",")[6]+","+line.split(",")[7]+","+line.split(",")[8]
            obj["describe"] = line.split(",")[line.split(",").length-1];
            result.add(obj)
        }
        render(result as JSON)
    }

    def downloadEventData = {
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        //D:\Download\event\CN\23540\20211103085739.dat
        String path = DataManager.ROOT_PATH+"/event/"+netcode+"/"+stacode+"/"+params.file+".dat"
        fileDownload(path)
    }

    //统计事件触发数量
    def eventCount = {
        def result = [];
        Map devData = DataManager.getInstance().getCacheItems()
        for(String key : devData.keySet()){
            StationDev stadev = devData.get(key);
            ArrayList list = FileUtil.listFilesInDir(DataManager.ROOT_PATH+"/event/"+stadev.NetCode+"/"+stadev.StaCode)
            def obj = [:]
            obj["pointid"] = stadev.NetCode+"."+stadev.StaCode;
            obj["count"] = list==null ? 0 : list.size();
            result.add(obj)
        }

        def result1 = result.sort{a,b->
            return a.count-b.count
        }
        render(result1 as JSON)
    }


    /**
     * 按月统计每天的触发数量
     */
    def getTrigerCount = {
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        def year = "2021"
        def month = "8"
        /*if(params.date){
            year = params.date.split("-")[0]
            month = params.date.split("-")[1]
            day = params.date.split("-")[2]
        }*/
        ArrayList result = new ArrayList();
        for(int d=1;d<31;d++){
            String path = DataManager.ROOT_PATH+"/data/"+netcode+"/"+stacode+"/"+year+"/"+month+"-"+d+"/Triger.txt"
            if(FileUtil.isFileExists()){
                ArrayList list = FileUtil.readFileContent(path,"utf-8");
                def obj = [:]
                obj["dataTime"] = year+"-"+month+"-"+d
                obj["count"] = list.size();
                result.add(obj)
            }
        }
        render(result as JSON)
    }

    //======================测试调试=======================//


    def test = {
        /*List<File> fileList = FileUtil.listFilesInDir("D:/Download/data/");
        for(File f:fileList){
            //匹配两个字符的台网代码
            boolean isMatch = Pattern.matches("^[A-Z][A-Z]\$", f.getName());
            if(isMatch){
                println("FileName:"+f.getAbsolutePath()+"/monitor");
            }
        }
//        dataManagerService.gethistorydata();
        render("success")*/
    }

    def getRootPath = {
        render DataManager.ROOT_PATH
    }


    /**
     * 文件下载
     */
    /*def fileDownload = {
//        def filePath = params.filePath  //文件路径
        def filePath = "D:/tia.ini"
//        def fileName = encode(params.fileName)  //文件名
        def fileName = "tia.ini"
        response.setHeader("Content-disposition", "attachment; filename=" + fileName)
        response.contentType = "application/x-rarx-rar-compressed"
        def out = response.outputStream
        def inputStream = new FileInputStream(filePath)
        byte[] buffer = new byte[1024]
        int i = -1
        while ((i = inputStream.read(buffer)) != -1) {
            out.write(buffer, 0, i)
        }
        out.flush()
        out.close()
        inputStream.close()
    }*/

    /**
     * 文件下载
     */
    def fileDownload(filePath){
//        def filePath = params.filePath  //文件路径
//        def fileName = encode(params.fileName)  //文件名
        def file = FileUtil.getFileByPath(filePath)
        def fileName = file.getName()
        response.setHeader("Content-disposition", "attachment; filename=" + fileName)
        response.contentType = "application/x-rarx-rar-compressed"
        def out = response.outputStream
        def inputStream = new FileInputStream(filePath)
        byte[] buffer = new byte[1024]
        int i = -1
        while ((i = inputStream.read(buffer)) != -1) {
            out.write(buffer, 0, i)
        }
        out.flush()
        out.close()
        inputStream.close()
    }


    /**
     * 字符编码
     */
    final def encode(String value,String charSet){
        URLEncoder.encode(value, charSet)
    }

}
