package tvgserver

class FormatFieldTagLib {
    static defaultEncodeAs = [taglib:'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]
    def pageTitle = { attrs, body ->
        out << "节点地震仪监测系统"
    }


    /**
     * 获取通道对应的中文名
     */
    def fetchnname = { attrs, body ->
        def content = ""
        switch (attrs.chn){
            case "1":
                content = "GPS状态";
                break;
            case "2":
                content = "GPS精度";
                break;
            case "3":
                content = "GPS位置栅栏";
                break;
            case "4":
                content = "垂直向零位";
                break;
            case "5":
                content = "东西向零位";
                break;
            case "6":
                content = "北南向零位";
                break;
            case "7":
                content = "电池电压";
                break;
            case "8":
                content = "PCB温度";
                break;
            default:
                ""
                break;
        }

        out << content
    }

    /**
     * 获取通道对应的单位
     */
    def fetchnunit = { attrs, body ->
        def content = ""
        switch (attrs.chn){
            case "1":
                content = "-";
                break;
            case "2":
                content = "-";
                break;
            case "3":
                content = "-";
                break;
            case "4":
                content = "V";
                break;
            case "5":
                content = "V";
                break;
            case "6":
                content = "V";
                break;
            case "7":
                content = "V";
                break;
            case "8":
                content = "°C";
                break;
            default:
                ""
                break;
        }

        out << content
    }

    def fetchGPSStatus = { attrs, body ->
        def content = ""
        switch (attrs.value){
            case "0":
                content = "A状态";
                break;
            case "1":
                content = "B状态";
                break;
            case "2":
                content = "无时间参数";
                break;
            case "3":
                content = "B状态";
                break;
            case "4":
                content = "D状态";
                break;
            case "5":
                content = "关闭或未工作";
                break;
            case "8":
                content = "NTP授时";
                break;
            default:
                ""
                break;
        }

        out << content
        attrs

    }
}
