package com.taide

class TvgDataJob {
    /**
     * 实际文件1分钟更新一次，程序设置30秒轮询读取
     * */
    static triggers = {
        simple repeatInterval: 30000l // execute job once in 30 seconds
    }

    def dataManagerService
    def execute() {
        // execute job
//        println("job:"+new Date().getTime());
        dataManagerService.updateParData();     //更新基础参数
        dataManagerService.checkTvgRootPath();  //更新目录状态

    }
}
