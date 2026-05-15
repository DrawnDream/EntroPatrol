const app = getApp();

Page({
  data: {
    userInfo: null,
    userName: '管理员',
    userRole: '管理员'
  },

  onLoad: function () {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const userName = userInfo && userInfo.name ? userInfo.name : '管理员';
    const userRole = userInfo && userInfo.role === 'admin' ? '管理员' : '普通用户';
    this.setData({
      userInfo: userInfo,
      userName: userName,
      userRole: userRole
    });
  },

  navigateTo: function () {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  logout: function () {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userInfo = null;
          wx.removeStorageSync('userInfo');
          wx.redirectTo({ url: '/pages/login/login' });
        }
      }
    });
  }
});