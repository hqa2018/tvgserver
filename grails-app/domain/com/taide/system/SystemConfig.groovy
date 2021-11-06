package com.taide.system

class SystemConfig {
    String rootPath = ""

    static constraints = {
        rootPath(nullable:true)
    }
    static mapping = {
        version false
    }
}
