package tvgserver

class UrlMappings {

    static mappings = {
        //调试配置
//        "/tvgserver/$controller/$action?/$id?(.$format)?"{
        //打包配置
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
