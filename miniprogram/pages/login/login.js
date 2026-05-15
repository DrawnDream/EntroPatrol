const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onUsernameInput: function (e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput: function (e) {
    this.setData({ password: e.detail.value });
  },

  login: function () {
    const { username, password } = this.data;
    
    if (!username.trim()) {
      wx.showToast({ title: '请输入账号', icon: 'none' });
      return;
    }
    
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    console.log('准备登录:', { username, password, apiUrl: app.globalData.apiUrl });
    this.setData({ loading: true });

    wx.request({
      url: `${app.globalData.apiUrl}/auth/login`,
      method: 'POST',
      data: { username, password },
      timeout: 30000,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('登录响应状态:', res.statusCode);
        console.log('登录响应数据:', JSON.stringify(res.data));
        
        if (res.data && res.data.success === true) {
          app.globalData.userInfo = res.data.data;
          wx.setStorageSync('userInfo', res.data.data);
          wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 });
          
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' });
          }, 1500);
        } else {
          const msg = res.data?.message || '登录失败，账号或密码错误';
          console.log('登录失败原因:', msg);
          wx.showToast({ title: msg, icon: 'none' });
        }
      },
      fail: (error) => {
        console.error('登录失败详情:', JSON.stringify(error));
        wx.showToast({ title: '网络错误，请检查服务器', icon: 'none' });
      },
      complete: () => {
        console.log('登录请求完成');
        this.setData({ loading: false });
      }
    });
  }
});