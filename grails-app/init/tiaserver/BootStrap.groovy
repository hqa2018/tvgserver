package tvgserver

class BootStrap {

    def dataManagerService
    def init = { servletContext ->
//        println("系统初始化")
        dataManagerService.initSystem()
    }
    def destroy = {
        println("系统关闭")
    }
}
