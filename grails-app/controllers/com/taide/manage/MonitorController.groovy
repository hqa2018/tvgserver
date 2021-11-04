package com.taide.manage

import com.taide.entity.StationDev
import com.taide.system.AlarmConifg
import com.taide.util.FileUtil
import com.taide.util.NumberUtils
import grails.converters.JSON

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

    def mapview1 () {

    }

    def popup(){

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
        FileUtil.writeTxtFile(DataManager.ROOT_PATH+"SetPar/"+params["pointid"]+".reoot","",false);
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
        def result = FileUtil.writeTxtFile(DataManager.ROOT_PATH+"SetPar/"+params["NetCode"]+"."+params["StaCode"]+".par",content,false);
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

    //======================数据接口=======================//

    //获取状态数据
    def queryrecord = {
        response.addHeader("Access-Control-Allow-Origin", "*");
        List<Map<String,Object>> returnList = new LinkedList<Map<String,Object>>();
        String path = DataManager.ROOT_PATH + "MonStatus.txt";
//        println("path:"+path)
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

    /*查询历史数据*/
    def fetchMonitorData = {
        if(params.stationid.split(".").size() > 1){
            def netcode = params.stationid.split(".")[0];
            def stacode = params.stationid.split(".")[1];
            def stapath = DataManager.ROOT_PATH+netcode+"/"+stacode+"/monitor";
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
        /*[[1635177600000,"-100.000000"],[1635177660000,"-100.000000"]]*/
        String path = DataManager.ROOT_PATH+"/"+netcode+"/"+stacode+"/monitor/20210829.txt"
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
            for(int j=1;j<data.size();j++){
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

    def getTrigerData = {
//        /tvgserver/monitor/getTrigerData?pointid=SH.49811&date=2021-11-02
//        \SH\49811\2021\8-17
        def netcode = params.pointid.split("\\.")[0]
        def stacode = params.pointid.split("\\.")[1]
        def year = "2021"
        def month = "8"
        def day = "17"
        /*if(params.date){
            year = params.date.split("-")[0]
            month = params.date.split("-")[1]
            day = params.date.split("-")[2]
        }*/
        String path = DataManager.ROOT_PATH+"/"+netcode+"/"+stacode+"/"+year+"/"+month+"-"+day+"/Triger.txt"
        ArrayList list = FileUtil.readFileContent(path,"utf-8");
        ArrayList result = new ArrayList();
        for(int i=0;i<list.size();i++){
            String line = list.get(i)
            String dateTime = line.split(",")[3]
            def obj = [:]
            obj["dataTime"] = dateTime
            obj["params"] = line.split(",")[4]+","+line.split(",")[5]+","+line.split(",")[6]+","+line.split(",")[7]
            obj["describe"] = line.split(",")[line.split(",").length-1];
            result.add(obj)
        }
        render(result as JSON)
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
            String path = DataManager.ROOT_PATH+"/"+netcode+"/"+stacode+"/"+year+"/"+month+"-"+d+"/Triger.txt"
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


    def test = {
        List<File> fileList = FileUtil.listFilesInDir("D:/Download/data/");
        for(File f:fileList){
            //匹配两个字符的台网代码
            boolean isMatch = Pattern.matches("^[A-Z][A-Z]\$", f.getName());
            if(isMatch){
                println("FileName:"+f.getAbsolutePath()+"/monitor");
            }
        }
//        dataManagerService.gethistorydata();
        render("success")
    }


    /**
     * 文件下载
     */
    def fileDownload = {
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
    }

    /**
     * 字符编码
     */
    final def encode(String value,String charSet){
        URLEncoder.encode(value, charSet)
    }

}
