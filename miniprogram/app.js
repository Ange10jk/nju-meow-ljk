// app.js
import MPServerless from '@alicloud/mpserverless-sdk';
const mpsConfig = require('./config.js');
const mpServerless = new MPServerless({
  uploadFile: wx.uploadFile,
  request: wx.request,
  getAuthCode: wx.login,
  getFileInfo: wx.getFileInfo,
  getImageInfo: wx.getImageInfo,
}, {
  appId: mpsConfig.appId,
  spaceId: mpsConfig.spaceId,
  clientSecret: mpsConfig.clientSecret,
  endpoint: mpsConfig.endpoint,
});
App({
  mpServerless:mpServerless,
  onLaunch: function () {
    this.mpServerless.init();
  },
  globalData:{
      isadmin:false,
      admin:undefined
  }
});
