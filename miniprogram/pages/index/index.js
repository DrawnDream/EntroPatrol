const app = getApp();
const { analysisApi, soilApi } = require('../../utils/api.js');

Page({
  data: {
    stats: {},
    displayStats: {},
    recentSoilData: []
  },

  onLoad: function () {
    this.checkLogin();
  },

  checkLogin: function () {
    if (!app.globalData.userInfo) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    this.fetchData();
  },

  onShow: function () {
    this.fetchData();
  },

  fetchData: async function () {
    try {
      const [statsRes, soilRes] = await Promise.all([
        analysisApi.getStatistics(),
        soilApi.getSoilData()
      ]);

      const recentData = soilRes.slice(0, 8).map(item => ({
        ...item,
        displayTime: this.formatDate(item.timestamp),
        displayLocation: `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`
      }));

      const displayStats = {
        totalSoilSamples: statsRes.totalSoilSamples || 0,
        totalCropSamples: statsRes.totalCropSamples || 0,
        avgSoilMoisture: (statsRes.avgSoilMoisture || 0).toFixed(1),
        avgSoilTemperature: (statsRes.avgSoilTemperature || 0).toFixed(1),
        avgCropHeight: (statsRes.avgCropHeight || 0).toFixed(1),
        avgNDVI: (statsRes.avgNDVI || 0).toFixed(2),
        samplingLocations: statsRes.samplingLocations || 0,
        moistureRange: `${statsRes.minMoisture || 0}-${statsRes.maxMoisture || 0}%`
      };

      this.setData({
        stats: statsRes,
        displayStats: displayStats,
        recentSoilData: recentData
      });
    } catch (error) {
      console.error('获取数据失败:', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  },

  formatDate: function (dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});