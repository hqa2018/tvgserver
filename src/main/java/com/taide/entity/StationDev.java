package com.taide.entity;

public class StationDev {
    String NetCode = "SH";			//台网代码
    String StaCode = "49811";		//台站代码
    String LocID = "00,00,00";			//位置标识符
    String ChCode = "HNZ,HNE,HNN";		//通道代码
    String Gain = "1,1,1";			//通道增益 1/2/4倍
    String SensorMode = "1,1,1";		//传感器类型 1-速度计 2-加速度计
    String SensorSen = "2000,2000,2000";	//传感器灵敏度 V/(m/s) 或 V/(m/s^2)
    String SensorLow = "1,1,1";			//传感器低频截至频带
    String SensorHigh = "200,200,200";		//传感器高频截至频带
    String DataHP = "0,0,0";			//三通道可以设置不同的高通滤波器 0-无 其它 滤波器的大于多少Hz以上通过
    String DataRate = "200";	 		//实时采样率 目前 50/100/200 即1秒采多少个点
    String SecMode = "0";			//0-miniseed 1-每秒 2-每0.5秒 3-每0.2秒
    String DataLP = "1";	 		//低通滤波器 0-线性性位 1-最小相位
    String CommRate = "115200";			//串口波特率
    String TimeZero = "8";			//时区
    String GPSTm = "0";				//0-GPS永远开启 大于1 多少小时开启一次
    String AdSen = "1000";			//采集器灵敏度 ct/V
    String nTmCorr = "0";			//当前数据时间修正  秒
    String GPSLocLock = "0";			//GPS位置栅栏信息 0-不启用 大于10（移动超过多少米报警）
    String G4SlpSec = "0";			//G/5G 休眠时间  //        <120 或 >86400 永不休眠v 120<= 且 <= 86400 休眠时间，单位
    String AutoZero = "0";			//0-禁止自动调零 1-允许自动调零
    String SaveData = "0";			//实时数据存盘模式 0-不存储 1-按天存 2-按小时存
    String MonRate = "0";	 		//监测数据采样率  多少秒采一个点
    String SaveMon = "0";			//监测数据存盘模式 0-不存储 1-按天存 2-按小时存
    String DeleteMode = "0";		//0-不自动删除 1-自动删除最旧的DATA,不删除MON文件 2-自动删除最旧MON,不删除DATA 3-自动删除最旧最旧的DATA与MON文件
    String SendMon = "0";			//每5min联网1次并上传监测数据 （只有5/10/30/60/120/180/360/720/1440可选）
    String WorkMode = "0";      		//工作模式 0-无网络模式(禁止设置) 1-实时数据模式 2-监测参数模式
    String TCXO = "0,0,0,0,0";			//压控晶振拟合参数
    String ServerIP1 = "47.104.83.209";		//服务器1的IP
    String ServerIP2 = "120.77.148.191";	//服务器2的IP
    String ServerPort1 = "1974";		//服务器1的端口
    String ServerPort2 = "9002";		//服务器2的端口
}
