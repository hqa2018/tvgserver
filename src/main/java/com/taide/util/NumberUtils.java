package com.taide.util;

import java.math.BigDecimal;

public class NumberUtils {
    /**
     * 格式化为指定位小数的数字,返回未使用科学计数法表示的具有指定位数的字符串。
     * <p>
     * 该方法舍入模式：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。
     * <p>
     * <p>
     * <p>
     * "3.1415926", 1--> 3.1
     * <p>
     * "3.1415926", 3--> 3.142
     * <p>
     * "3.1415926", 4--> 3.1416
     * <p>
     * "3.1415926", 6--> 3.141593
     * <p>
     * "1234567891234567.1415926", 3--> 1234567891234567.142
     *
     * @param number        String类型的数字对象
     * @param precision     小数精确度总位数,如2表示两位小数
     * @return 返回数字格式化后的字符串表示形式(注意返回的字符串未使用科学计数法)
     */

    public static String keepPrecision(String number, int precision) {
        BigDecimal bg = new BigDecimal(number);

        return bg.setScale(precision, BigDecimal.ROUND_HALF_UP).toPlainString();

    }

    /**
     * 格式化为指定位小数的数字,返回未使用科学计数法表示的具有指定位数的字符串。
     * <p>
     * 该方法舍入模式：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。
     * <p>
     * 如果给定的数字没有小数，则转换之后将以0填充；例如：int 123 1 --> 123.0
     * <p>
     * 注意：如果精度要求比较精确请使用 keepPrecision(String number, int precision)方法
     *
     * @param number         String类型的数字对象
     * @param precision     小数精确度总位数,如2表示两位小数
     * @return 返回数字格式化后的字符串表示形式(注意返回的字符串未使用科学计数法)
     */

    public static String keepPrecision(Number number, int precision) {
        return keepPrecision(String.valueOf(number), precision);

    }

    /**
     * 对double类型的数值保留指定位数的小数。
     * <p>
     * 该方法舍入模式：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。
     * <p>
     * 注意：如果精度要求比较精确请使用 keepPrecision(String number, int precision)方法
     *
     * @param number    要保留小数的数字
     * @param precision 小数位数
     * @return double 如果数值较大，则使用科学计数法表示
     */

    public static double keepPrecision(double number, int precision) {
        BigDecimal bg = new BigDecimal(number);

        return bg.setScale(precision, BigDecimal.ROUND_HALF_UP).doubleValue();

    }

    /**
     * 对float类型的数值保留指定位数的小数。
     * <p>
     * 该方法舍入模式：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。
     * <p>
     * 注意：如果精度要求比较精确请使用 keepPrecision(String number, int precision)方法
     *
     * @param number    要保留小数的数字
     * @param precision 小数位数
     * @return float 如果数值较大，则使用科学计数法表示
     */

    public static float keepPrecision(float number, int precision) {
        BigDecimal bg = new BigDecimal(number);

        return bg.setScale(precision, BigDecimal.ROUND_HALF_UP).floatValue();

    }



}
