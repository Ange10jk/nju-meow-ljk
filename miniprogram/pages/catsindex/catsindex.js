const Cache=require('../../utils/cache.js');
const getCache=Cache.getCache;
const setCache=Cache.setCache;
const app=getApp();
Page({
  data: {
    userId: undefined,
    navbar: ['橘猫', '狸花', '奶牛', '三花', '纯色', '玳瑁'],
    currentTab: 0,//当前序号
    catslist:[],
    isLoading:false,
    verify0: 1,
  },

async fetchCatsList(c) {
    const catslist=this.data.catslist;
    this.setData({ isLoading: true });

    for(var i=0;i<catslist.length;i++){
        if(catslist[i]?.color===c){
            this.setData({isLoading:false});
            return ;
        }
    }

    try {
      const res=await app.mpServerless.db.collection('catsinfo')
      .find({
          color:c
      });
      const list = res.result || [];
      const newdata=catslist.concat(list);
      this.setData({
        isLoading: false,
        catslist:newdata
      });
      setCache('catslist',newdata);
    } catch (e) {
    }
  },

async  onLoad(){
    const cachedData=getCache('catslist');
    if(cachedData){
        this.setData({
            catslist:cachedData
        })
    }
    this.fetchCatsList('橘猫');
    //检验是否是管理员
    const {result}= await app.mpServerless.user.getInfo();
    this.setData({
        userId:result.user.userId
    });
    app.mpServerless.db.collection('admin').find({
        userId:result.user.userId
    }).then(res=>{
        if(res.result.length>0){
            app.globalData.isadmin=true;
            app.globalData.admin=res.result[0].name;
        }
    }).catch(console.error);
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
      });
  },
  refreshData:async function(){
        try{
            wx.removeStorageSync('catslist');
            this.setData({
                catslist: []
              });
            const navbar=this.data.navbar;
            const currentTab=this.data.currentTab;
            await this.fetchCatsList(navbar[currentTab]);
            
        }
        catch(e){
            throw e;
        }
    
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
    const navbar=this.data.navbar;
    const currentTab=this.data.currentTab;
    this.fetchCatsList(navbar[currentTab]);
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
    longpress(e){//长按跳转修改页
        if(app.globalData.isadmin){
            wx.navigateTo({
                url: `/pages/editcat/editcat?name=${e.currentTarget.dataset.name}`,
              })
        }

    },
    imageTap(e){//跳转添加信息页
        if(app.globalData.isadmin){
            wx.navigateTo({
                url:'/pages/addcat/addcat',
            })
        }
    },
    showUserid(e){
        wx.setClipboardData({
          data: this.data.userId,
          success:()=>{
              wx.showToast({
                title: 'userId已复制',
                duration:1500
              })
          },
          fail:()=>{
              wx.showToast({
                title: 'userId复制失败',
                icon:'none',
                duration:1500
              })
          }
        })

    }
})