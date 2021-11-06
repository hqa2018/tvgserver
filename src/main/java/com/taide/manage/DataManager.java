package com.taide.manage;

import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class DataManager {
//    public static String ROOT_PATH = "D:/TVG/data/";
    public static String ROOT_PATH = "D:/Download";
    public static LinkedList curMonDataList = new LinkedList();
    public static Map<Object, Object> curMonCountData;
    public static Map<Object, Object> cacheMonStatusData;
    private static DataManager cachePool;
    private Map<Object, Object> cacheItems;
    private DataManager() {
        cacheItems = new ConcurrentHashMap<Object, Object>();
    }
    /**
     * 获取唯一实例
     * @return instance
     */
    public static DataManager getInstance() {
        if (cachePool ==null) {
            synchronized (DataManager.class) {
                if (cachePool ==null) {
                    cachePool = new DataManager();
                }
            }
        }
        return cachePool;
    }

    /**
     * 获取所有cache信息
     * @return cacheItems
     */
    public Map<Object, Object> getCacheItems() {
        return this.cacheItems;
    }

    /**
     * 清空cache
     */
    public void clearAllItems() {
        cacheItems.clear();
    }

    /**
     * 获取指定cache信息
     * @return cacheItem
     */
    public Object getCacheItem(Object key) {
        if (cacheItems.containsKey(key)) {
            return cacheItems.get(key);
        }
        return null;
    }

    /**
     * 存放cache信息
     */
    public void putCacheItem(Object key, Object value) {
        if (!cacheItems.containsKey(key)) {
            cacheItems.put(key, value);
        }
    }

    /**
     * 删除一个cache
     */
    public void removeCacheItem(Object key) {
        if (cacheItems.containsKey(key)) {
            cacheItems.remove(key);
        }
    }

    /**
     * 获取cache长度
     * @return size
     */
    public int getSize() {
        return cacheItems.size();
    }
}
