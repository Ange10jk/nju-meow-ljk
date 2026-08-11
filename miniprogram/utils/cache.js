//缓存工具

const setCache=function(key,data,expireTime=7200000){
    try{
        wx.setStorage({
            key,
            data:JSON.stringify({
                value:data,
                expireTime:Date.now()+expireTime
            })
        })
    }
    catch(error){
    }
}

const getCache=function(key){
    const cachedData=wx.getStorageSync(key);
    if(!cachedData){
        return null;
    }
    const Cache=JSON.parse(cachedData);
    if(Date.now()>Cache.expireTime){
        wx.removeStorageSync(key);
        return null;
    }
    return Cache.value;
}

module.exports={setCache,getCache};