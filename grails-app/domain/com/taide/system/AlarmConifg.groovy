package com.taide.system

class AlarmConifg {
    String pointid 			        //
    boolean guardEnable = false     //防盗判断
    String ch1Range = "0"		    //GPS状态
    String ch2Range = "0"	        //GPS精准
    String ch3Range = ""		    //
    String ch4Range = ""  		    //
    String ch5Range = ""  		    //
    String ch6Range = ""  		    //
    String ch7Range = ""  		    //电池电压
    String ch8Range = ""  		    //PCB温度

    static constraints = {
        pointid(nullable:false, blank:false, unique:true)
        guardEnable(nullable:false)
        ch1Range(nullable:true)
        ch2Range(nullable:true)
        ch3Range(nullable:true)
        ch4Range(nullable:true)
        ch5Range(nullable:true)
        ch6Range(nullable:true)
        ch7Range(nullable:true)
        ch8Range(nullable:true)
    }
}
