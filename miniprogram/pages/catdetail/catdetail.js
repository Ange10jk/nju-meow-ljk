const Cache=require('../../utils/cache.js');
const getCache=Cache.getCache;
const setCache=Cache.setCache;
const app=getApp();
// pages/catdetail/catdetail.js
Page({
  data: {
    cat:{},
    containerHeight:0,
    lastRefreshTime:0
  },
  findCat :async function(name) {
    const res = await app.mpServerless.db.collection('catsinfo').find(
        { name: name },//catinfo
        {
            projection: {
                activity_range: 1,
                appearance: 1,
                birth: 1,
                color: 1,
                gender: 1,
                image_id: 1,
                is_neutured: 1,
                more: 1,
                name: 1,
                nickname: 1,
                personality: 1,
                status: 1
            }
        }
    );
    return res.result.length > 0 ? res.result[0] : null;
    },
  async onLoad(options) {
    const cacheddata=getCache(`${options.name}`);
    if(cacheddata){
        this.setData({
            cat:cacheddata
        })
        return ;
    }
    try{
        const res= await this.findCat(`${options.name}`);//加一个await,res的性质就不是Promise了
        if(res!=null){
            this.setData({
                cat: res
            });
        }
    }catch(err){
        console.error('查询失败',err);
    }
    setCache(`${options.name}`,this.data.cat);
  },
  
  onPullDownRefresh:function(){//下拉刷新逻辑
    const now=Date.now();
    const throttleTime=10000;
        // 节流控制：10秒内只能触发一次
        if (now - this.data.lastRefreshTime < throttleTime) {
            wx.stopPullDownRefresh();
            return;
          }
        // 请求锁控制：如果正在刷新，直接返回
        if (this.data.isRefreshing) {
            wx.stopPullDownRefresh();
            return;
        }

        this.setData({ 
            isRefreshing: true, 
            lastRefreshTime: now 
        });

        this.refreshData().then(()=>{
            wx.showToast({
              title: '已刷新',
              icon:'none'
            })
        }).catch(err => {
            console.error('刷新失败', err);
          }).finally(() => {
            this.setData({isRefreshing:false});
            wx.stopPullDownRefresh();
          })
  },
  refreshData:async function(){
        try{
            const name=this.data.cat.name;
            wx.removeStorageSync(name);
            this.setData({
                cat: {}
              });
            const res= await this.findCat(name);
            if(res!=null){
                this.setData({
                    cat: res
                });
            }
        }
        catch(e){
            throw e;
        }
  },
  onShareAppMessage() {
      return {
        title: '南雍猫札',
        path: '/pages/catsindex/catsindex',
        imageUrl:'/images/icon.jpg'
      };
    },
    onShareTimeline() {
        return {
          title: '南雍猫札',  
          query: '/pages/catsindex/catsindex', 
          imageUrl: '/images/icon.jpg' 
        }
      },
    previewImg:function(e){
        const cat=this.data.cat;
        const currentUrl=`https://你的CDN域名/catimage(compressed)/${cat.name}.${cat.image_id}`;
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: [currentUrl]  // 需要预览的图片http链接列表
        })
    }
})