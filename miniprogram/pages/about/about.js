// pages/about/about.js
Page({
  data: {
    verify0:1,
    verify1:0,
    verify2:0
  },

  onLoad() {
    wx.cloud.database().collection('Verify').where({
        VerifyContent: 1,
      }, {}).get()
      .then(res => {
        if (res.data[0].VerifyContent) {
          this.setData({
            verify1: 0,
            verify2: 1,
            verify0: 0,
          });
        }
      })
      .catch(res => {
        if (this.data.verify0) {
          this.setData({
            verify1: 1,
            verify2: 0,
          });
        }
      });
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
      }
})