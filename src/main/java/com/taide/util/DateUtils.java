package com.taide.util;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class DateUtils {
    private static transient int gregorianCutoverYear = 1582;

    /**
     * 闰年中每月天数
     */
    private static final int[] DAYS_P_MONTH_LY = {31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

    /**
     * 非闰年中每月天数
     */
    private static final int[] DAYS_P_MONTH_CY = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

    /**
     * 代表数组里的年、月、日
     */
    private static final int Y = 0, M = 1, D = 2;

    /**
     * 日期格式,列举常见的日期格式
     *
     * @author t
     *
     */
    public static enum FormatType {
        /** 格式为：yyyyMM **/
        yyyyMM("yyyyMM"),

        /** 格式为：yyyy/MM **/
        yyyy__MM("yyyy/MM"),

        /** 格式为：yyyy-MM **/
        yyyy_MM("yyyy-MM"),

        /** 格式为: yyyy-MM-dd */
        yyyy_MM_dd("yyyy-MM-dd"),

        /** 格式为: yyyyMMdd */
        yyyyMMdd("yyyyMMdd"),

        /** 格式为: yyyy/MM/dd */
        yyyy__MM__dd("yyyy/MM/dd"),

        /** 格式为: HHmm */
        HHmm("HHmm"),

        /** 格式为: HHmmss */
        HHmmss("HHmmss"),

        /** 格式为: HHmmssS */
        HHmmssS("HHmmssS"),

        /** 格式为: HHmmssSSS */
        HHmmssSSS("HHmmssSSS"),

        /** 格式为: HH:mm */
        HH_mm("HH:mm"),

        /** 格式为: HH:mm:ss */
        HH_mm_ss("HH:mm:ss"),

        /** 格式为: HH:mm:ss.S */
        HH_mm_ss_S("HH:mm:ss.S"),

        /** 格式为: HH:mm:ss.SSS */
        HH_mm_ss_SSS("HH:mm:ss.SSS"),

        /** 格式为: yyyy-MM-dd HH */
        yyyy_MM_dd_HH("yyyy-MM-dd HH"),

        /** 格式为: yyyy-MM-dd HH:mm */
        yyyy_MM_dd_HH_mm("yyyy-MM-dd HH:mm"),

        /** 格式为: yyyy-MM-dd HH:mm:ss */
        yyyy_MM_dd_HH_mm_ss("yyyy-MM-dd HH:mm:ss"),

        /** 格式为: yyyy-MM-dd HH:mm:ss.S */
        yyyy_MM_dd_HH_mm_ss_S("yyyy-MM-dd HH:mm:ss.S"),

        /** 格式为: yyyy-MM-dd HH:mm:ss.SSS */
        yyyy_MM_dd_HH_mm_ss_SSS("yyyy-MM-dd HH:mm:ss.SSS"),

        /** 格式为: yyyy-MM-dd HHmm */
        yyyy_MM_dd_HHmm("yyyy-MM-dd HHmm"),

        /** 格式为: yyyy-MM-dd HHmmss */
        yyyy_MM_dd_HHmmss("yyyy-MM-dd HHmmss"),

        /** 格式为: yyyy-MM-dd HHmmss.S */
        yyyy_MM_dd_HHmmssS("yyyy-MM-dd HHmmss.S"),

        /** 格式为: yyyy-MM-dd HHmmssSSS */
        yyyy_MM_dd_HHmmssSSS("yyyy-MM-dd HHmmssSSS"),

        /** 格式为: yyyyMMddHHmm */
        yyyyMMddHHmm("yyyyMMddHHmm"),

        /** 格式为: yyyyMMddHHmmss */
        yyyyMMddHHmmss("yyyyMMddHHmmss"),

        /** 格式为: yyyyMMddHHmmssS */
        yyyyMMddHHmmssS("yyyyMMddHHmmssS"),

        /** 格式为: yyyyMMddHHmmssSSS */
        yyyyMMddHHmmssSSS("yyyyMMddHHmmssSSS"),

        /** 格式为: yyyy/MM/dd HH:mm */
        yyyy__MM__dd_HH_mm("yyyy/MM/dd HH:mm"),

        /** 格式为: yyyy/MM/dd HH:mm:ss */
        yyyy__MM__dd_HH_mm_ss("yyyy/MM/dd HH:mm:ss"),

        /** 格式为: yyyy/MM/dd HH:mm:ss.S */
        yyyy__MM__dd_HH_mm_ss_S("yyyy/MM/dd HH:mm:ss.S"),

        /** 格式为: yyyy/MM/dd HH:mm:ss.SSS */
        yyyy__MM__dd_HH_mm_ss_SSS("yyyy/MM/dd HH:mm:ss.SSS"),

        /** 格式为: yyyy/MM/dd HHmm */
        yyyy__MM__dd_HHmm("yyyy/MM/dd HHmm"),

        /** 格式为: yyyy/MM/dd HHmmss */
        yyyy__MM__dd_HHmmss("yyyy/MM/dd HHmmss"),

        /** 格式为: yyyy/MM/dd HHmmss.S */
        yyyy__MM__dd_HHmmssS("yyyy/MM/dd HHmmss.S"),

        /** 格式为: yyyy/MM/dd HHmmssSSS */
        yyyy__MM__dd_HHmmssSSS("yyyy/MM/dd HHmmssSSS"),

        /** 格式为: MMddHHmmyyyy.ss */
        MMddHHmmyyyy_ss("MMddHHmmyyyy.ss");

        private String format;

        FormatType(String format) {
            this.format = format;
        }

        public String getFormat() {
            return this.format;
        }

    }

    /** SimpleDateFormat 解析时是否严格,true--不严格，false--严格 **/
    public static boolean IS_LENIENT = true;

    private static SimpleDateFormat getFormat(FormatType format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format.getFormat());
        sdf.setLenient(IS_LENIENT);
        return sdf;
    }

    /**
     * 根据格式化格式格式化日期
     *
     * @param date
     *            java.util.Date-日期
     * @param format
     *            FormatType--日期格式
     * @return String--格式化后的日期
     */
    public static String date2String(Date date, FormatType format) {
        if(date != null)
            return getFormat(format).format(date);
        else
            return null;
    }

    /**
     * 根据日期格式将字符串形式的日期解析为日期
     *
     * @param dateStr
     *            String--日期字符串
     * @param parseFormat
     *            FormatType--日期格式
     * @throws IllegalArgumentException
     *             输入的日期与格式不匹配
     * @return Date--解析后的日期,如果解析日期格式不匹配则返回null
     */
    public static Date string2Date(String dateStr, FormatType parseFormat) {
        SimpleDateFormat sdf = getFormat(parseFormat);
        try {
            return sdf.parse(dateStr);
        } catch (ParseException e) {
        }
        throw new IllegalArgumentException("您输入的日期与格式不匹配!(日期:" + dateStr
                + ",格式:" + parseFormat.getFormat() + ")");
    }

    /**
     * 将代表日期的字符串分割为代表年月日的整形数组
     *
     * @param date
     * @return
     */
    public static int[] splitYMD(String date) {
        date = date.replace("-", "");
        int[] ymd = {0, 0, 0};
        ymd[Y] = Integer.parseInt(date.substring(0, 4));
        ymd[M] = Integer.parseInt(date.substring(4, 6));
        ymd[D] = Integer.parseInt(date.substring(6, 8));
        return ymd;
    }

    /**
     * 检查传入的参数代表的年份是否为闰年
     *
     * @param year
     * @return
     */
    public static boolean isLeapYear(int year) {
        return year >= gregorianCutoverYear ?
                ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) : (year % 4 == 0);
    }

    /**
     * 日期加1天
     *
     * @param year
     * @param month
     * @param day
     * @return
     */
    private static int[] addOneDay(int year, int month, int day) {
        if (isLeapYear(year)) {
            day++;
            if (day > DAYS_P_MONTH_LY[month - 1]) {
                month++;
                if (month > 12) {
                    year++;
                    month = 1;
                }
                day = 1;
            }
        } else {
            day++;
            if (day > DAYS_P_MONTH_CY[month - 1]) {
                month++;
                if (month > 12) {
                    year++;
                    month = 1;
                }
                day = 1;
            }
        }
        int[] ymd = {year, month, day};
        return ymd;
    }

    /**
     * 将不足两位的月份或日期补足为两位
     *
     * @param decimal
     * @return
     */
    public static String formatMonthDay(int decimal) {
        DecimalFormat df = new DecimalFormat("00");
        return df.format(decimal);
    }

    /**
     * 将不足四位的年份补足为四位
     *
     * @param decimal
     * @return
     */
    public static String formatYear(int decimal) {
        DecimalFormat df = new DecimalFormat("0000");
        return df.format(decimal);
    }

    /**
     * 计算两个日期之间相隔的天数
     *
     * @param begin
     * @param end
     * @return
     * @throws ParseException
     */
    public static long countDay(String begin, String end) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date beginDate, endDate;
        long day = 0;
        try {
            beginDate = format.parse(begin);
            endDate = format.parse(end);
            day = (endDate.getTime() - beginDate.getTime()) / (24 * 60 * 60 * 1000);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return day;
    }

    /**
     * 以循环的方式计算日期
     *
     * @param beginDate endDate
     * @param endDate endDate
     * @return
     */
    public static List<String> getEveryday(String beginDate, String endDate) {
        long days = countDay(beginDate, endDate);
        int[] ymd = splitYMD(beginDate);
        List<String> everyDays = new ArrayList<String>();
        everyDays.add(beginDate);
        for (int i = 0; i < days; i++) {
            ymd = addOneDay(ymd[Y], ymd[M], ymd[D]);
            everyDays.add(formatYear(ymd[Y]) + "-" + formatMonthDay(ymd[M]) + "-" + formatMonthDay(ymd[D]));
        }
        return everyDays;
    }

    /**
     * 以循环的方式计算日期
     *
     * @param monDate
     * @return
     */
    public static List<String> getEverydayByMonth(String monDate) {
        String beginDate = monDate+"-01";
        String endDate = date2String(getEndOfMonth(beginDate),FormatType.yyyy_MM_dd);
        long days = countDay(beginDate, endDate);
        int[] ymd = splitYMD(beginDate);
        List<String> everyDays = new ArrayList<String>();
        everyDays.add(beginDate);
        for (int i = 0; i < days; i++) {
            ymd = addOneDay(ymd[Y], ymd[M], ymd[D]);
            everyDays.add(formatYear(ymd[Y]) + "-" + formatMonthDay(ymd[M]) + "-" + formatMonthDay(ymd[D]));
        }
        return everyDays;
    }

    /**
     * 获取传入日期的当月的开始日期 例如：2010-02-01 00:00:00
     *
     * @param date
     *            Date--要获取开始日期的月份的所编一个日期
     * @return Date--该月的开始日期
     */
    public static Date getBeginOfMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.DAY_OF_MONTH, 1);
        return clearHourMinuteSecond(c.getTime());
    }

    /**
     * 获取传入日期的当月的结束日期 例如：2010-03-31 23:59:59
     *
     * @param date
     *            Date--要获取结束日期的月份的所编一个日期
     * @return Date--该月的结束日期
     */
    public static Date getEndOfMonth(Date date) {
        Date beginOfMonth = getBeginOfMonth(date);
        Calendar c = Calendar.getInstance();
        c.clear();
        c.setTime(beginOfMonth);
        c.add(Calendar.MONTH, 1);
        c.add(Calendar.SECOND, -1);
        return c.getTime();
    }

    /**
     * 获取传入日期的当月的结束日期 例如：2010-03-31 23:59:59
     *
     * @param date
     *            Date--要获取结束日期的月份的所编一个日期
     * @return Date--该月的结束日期
     */
    public static Date getEndOfMonth(String date) {
        Date beginOfMonth = getBeginOfMonth(string2Date(date,FormatType.yyyy_MM_dd));
        Calendar c = Calendar.getInstance();
        c.clear();
        c.setTime(beginOfMonth);
        c.add(Calendar.MONTH, 1);
        c.add(Calendar.SECOND, -1);
        return c.getTime();
    }

    /**
     * 将一个日期的小时，分钟，秒，毫秒全部清零
     *
     * @param date
     *            Date--源日期
     * @return Date--清零后的日期
     */
    public static Date clearHourMinuteSecond(Date date) {
        Date zoroDate = clearMinuteSecond(date);
        Calendar c = Calendar.getInstance();
        c.setTime(zoroDate);
        c.set(Calendar.HOUR_OF_DAY, 0);
        return c.getTime();
    }

    /**
     * 将一个日期的分钟，秒，毫秒全部清零
     *
     * @param date
     *            Date--源日期
     * @return Date--清零后的日期
     */
    public static Date clearMinuteSecond(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }

    /**
     * 返回下一个月日期
     * @param date
     * @return
     */
    public static Date getNextMonth(Date date){
        Calendar c = Calendar.getInstance();
        c.clear();
        c.setTime(date);
        c.add(Calendar.MONTH, 1);
        return c.getTime();
    }

    /**
     * 返回下一个月日期
     * @param date
     * @return
     */
    public static Date getNextMinute(Date date){
        Calendar c = Calendar.getInstance();
        c.clear();
        c.setTime(date);
        c.add(Calendar.MINUTE, 1);
        return c.getTime();
    }

    public static Date getNextMinute(Date date,int i){
        Calendar c = Calendar.getInstance();
        c.clear();
        c.setTime(date);
        c.add(Calendar.MINUTE, i);
        return c.getTime();
    }

    /**
     * 获取一天的开始日期 例如：2010-02-15 00:00:00
     *
     * @param date
     *            Date--源日期
     * @return Date--该天的开始日期
     */
    public static Date getBeginOfDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, 0);
        return clearHourMinuteSecond(c.getTime());
    }

    /*public static void main(String[] args) {
        for(int i=0;i<1440;i++){
            Date begin = DateUtils.string2Date("2021-11-21",FormatType.yyyy_MM_dd);
            DateUtils.date2String(getNextMinute(begin,i),FormatType.yyyy_MM_dd_HH_mm_ss);
//            System.out.println(getNextMinute(begin,i));
        }

    }*/

}
