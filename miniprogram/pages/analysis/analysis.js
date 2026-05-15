const { analysisApi } = require('../../utils/api.js');

Page({
  data: {
    activeTab: 'drought',
    droughtWarnings: [],
    cropHealth: [],
    severeCount: 0,
    warningCount: 0
  },

  onLoad: function () {
    this.fetchData();
  },

  onShow: function () {
    this.fetchData();
  },

  fetchData: async function () {
    try {
      const [droughtRes, healthRes] = await Promise.all([
        analysisApi.getDroughtWarning(),
        analysisApi.getCropHealth()
      ]);

      const severeCount = droughtRes.filter(w => w.droughtLevel === 'severe').length;
      const warningCount = droughtRes.filter(w => w.droughtLevel === 'warning').length;

      const processedDroughtWarnings = droughtRes.map(item => ({
        ...item,
        displayTime: this.formatDate(item.timestamp),
        displayLocation: `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`,
        droughtLevelText: this.getDroughtLevelText(item.droughtLevel)
      }));

      const processedCropHealth = healthRes.map(item => ({
        ...item,
        displayTime: this.formatDate(item.timestamp),
        statusText: this.getHealthStatusText(item.status),
        displayNdvi: item.ndvi.toFixed(2)
      }));

      this.setData({
        droughtWarnings: processedDroughtWarnings,
        cropHealth: processedCropHealth,
        severeCount,
        warningCount
      });
    } catch (error) {
      console.error('获取分析数据失败:', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  },

  setTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  formatDate: function (dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  getDroughtLevelText: function (level) {
    const levelMap = {
      severe: '严重',
      warning: '警告',
      caution: '注意',
      normal: '正常'
    };
    return levelMap[level] || level;
  },

  getHealthStatusText: function (status) {
    const statusMap = {
      healthy: '健康',
      moderate: '一般',
      poor: '较差'
    };
    return statusMap[status] || status;
  }
});