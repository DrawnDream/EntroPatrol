App({
  onLaunch: function () {
    console.log('智墒巡田小程序启动');
    this.checkLogin();
  },

  onShow: function () {
    console.log('小程序显示');
  },

  onHide: function () {
    console.log('小程序隐藏');
  },

  checkLogin: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  globalData: {
    apiUrl: 'http://localhost:3001/api',
    userInfo: null
  }
});