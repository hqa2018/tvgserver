package tvgserver

import com.taide.entity.StationDev
import com.taide.manage.DataManager
import com.taide.system.AlarmConifg
import com.taide.util.FileUtil
import com.taide.util.NumberUtils
import grails.gorm.transactions.Transactional

@Transactional
class DataManagerService {

    def serviceMethod() {

    }

    /**
     * 定时读取参数文件并储存
     */
    def updateParData(){
        def result = false;
        File file = new File(DataManager.ROOT_PATH+"Par");
//        println("readTxtFromPar"+new Date().toString()+":"+DataManager.ROOT_PATH+"Par")
        if(file.exists() && file.isDirectory()){
            File[] childFileArray = file.listFiles();
            if (childFileArray.length != 0){
                result = true;
                for (int i = 0; i < childFileArray.length; i++) {
                    String fileName = childFileArray[i].getName();
                    if(fileName != "." && fileName != ".."){
                        String suffix = fileName.substring(fileName.lastIndexOf(".")+1);
                        if(suffix == "txt"){
                            String devcode = fileName.split("\\.")[0];
//                            String deviceNumber = prefix.substring(prefix.length()-5);
                            Map<String,String> param = FileUtil.ReadParamFile(childFileArray[i].getAbsolutePath(),"gbk");
                            StationDev stadev = new StationDev();
                            stadev.NetCode = param.get("NetCode");
                            stadev.StaCode = param.get("StaCode");
                            stadev.LocID = param.get("LocID");
                            stadev.ChCode = param.get("ChCode");
                            stadev.Gain = param.get("Gain");
                            stadev.SensorMode = param.get("SensorMode");
                            stadev.SensorSen = param.get("SensorSen");
                            stadev.SensorLow = param.get("SensorLow");
                            stadev.SensorHigh = param.get("SensorHigh");
                            stadev.DataHP = param.get("DataHP");
                            stadev.DataRate = param.get("DataRate");
                            stadev.SecMode = param.get("SecMode");
                            stadev.DataLP = param.get("DataLP");
                            stadev.CommRate = param.get("CommRate");
                            stadev.TimeZero = param.get("TimeZero");
                            stadev.GPSTm = param.get("GPSTm");
                            stadev.AdSen = param.get("AdSen");
                            stadev.nTmCorr = param.get("nTmCorr");
                            stadev.GPSLocLock = param.get("GPSLocLock");
                            stadev.G4SlpSec = param.get("G4SlpSec");
                            stadev.AutoZero = param.get("AutoZero");
                            stadev.SaveData = param.get("SaveData");
                            stadev.SaveMon = param.get("SaveMon");
                            stadev.DeleteMode = param.get("DeleteMode");
                            stadev.SendMon = param.get("SendMon");
                            stadev.WorkMode = param.get("WorkMode");
                            stadev.TCXO = param.get("TCXO");
                            stadev.ServerIP1 = param.get("ServerIP1");
                            stadev.ServerIP2 = param.get("ServerIP2");
                            stadev.ServerPort1 = param.get("ServerPort1");
                            stadev.ServerPort2 = param.get("ServerPort2");
                            DataManager.getInstance().putCacheItem(devcode,stadev);
//                            FileUtil.ReadParamFile("");
//                            String content = FileUtil.ReadFileContent(childFileArray[i].getAbsolutePath(),"gbk");
                        }
                    }
                }
            }
        }

        return result;
        /*Map devData = DataManager.getInstance().getCacheItems()
        for(String key : devData.keySet()){
            println("key:"+key)
            StationDev param = devData.get(key);
            println(param.StaCode)
        }*/
    }

    //更新实时监测状态数据
    def updateMonDataStatus(){
        DataManager.curMonDataList.clear();

        int normal = 0
        int alarm = 0
        int error = 0

        def result = [:]
//        result["data"] = new ArrayList<>();
        Map devData = DataManager.getInstance().getCacheItems();
        List<Map<String,Object>> returnList = new LinkedList<Map<String,Object>>();
        result["data"] = returnList
        String path = DataManager.ROOT_PATH + "MonStatus.txt";
        String respone = FileUtil.ReadFileContent(path, "utf-8");
        if (respone != null && respone != "") {
            for(String key : devData.keySet()){
                StationDev stadev = devData.get(key);
                String codekey = stadev.NetCode + "." + stadev.StaCode
                /*获取设备基本信息*/
                Map<String,String> tempMap = new HashMap<String, String>();
                tempMap.put("devcode",key);
                tempMap.put("staCode",stadev.StaCode);
                tempMap.put("pointid",codekey);
                tempMap.put("datatime","NULL");
                tempMap.put("status","0");
                DataManager.curMonDataList.add(tempMap)
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

        DataManager.curMonCountData.put("normal",normal)
        DataManager.curMonCountData.put("alarm",alarm)
        DataManager.curMonCountData.put("error",error)
        DataManager.curMonCountData.put("count",DataManager.getInstance().getSize())


        return result
    }


    /**
     * 更新设备触发状态
     */
    def updateDevTriggerStatus(){
        def result = [:]
        result["count"] = 0
        result["normal"] = 0
        result["alarm"] = 0
        result["error"] = 0
//        result["data"] = new ArrayList<>();
        List<Map<String,Object>> returnList = new LinkedList<Map<String,Object>>();
        result["data"] = returnList
        String path = DataManager.ROOT_PATH + "MonStatus.txt";
        println("path:"+path)
        String respone = FileUtil.ReadFileContent(path, "utf-8");
//        println("respone="+respone)
        Map devData = DataManager.getInstance().getCacheItems()
        for(String key : devData.keySet()){
            StationDev stadev = devData.get(key);
            String codekey = stadev.NetCode + "." + stadev.StaCode
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

        return result
    }

    /**
     * 定时监测TVG目录是否有数据
     * @return
     */
    def checkTvgRootPath(){
        boolean flag = false;
        if(FileUtil.isFileExists(DataManager.ROOT_PATH+"Par")){
            flag = true
        }
        println("RootPath:"+flag);
        return flag;
    }


    /*获取历史数据*/
    def gethistorydata(){
        List<File> fileList = FileUtil.listFilesInDir("D:/Download/data/");
        for(File f:fileList){
//            println("FileName:"+f.getName())
        }
    }


}