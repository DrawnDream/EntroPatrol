const { soilApi } = require('../../utils/api.js');

Page({
  data: {
    soilData: [],
    showModal: false,
    newData: {
      location: { latitude: 35.0, longitude: 105.0 },
      depth: 10,
      moisture: 25,
      temperature: 25,
      conductivity: 1.5,
      robotId: 'robot-001',
      probeStatus: 'normal'
    }
  },

  onLoad: function () {
    this.fetchSoilData();
  },

  onShow: function () {
    this.fetchSoilData();
  },

  fetchSoilData: async function () {
    try {
      const res = await soilApi.getSoilData();
      const processedData = res.map(item => ({
        ...item,
        displayTime: this.formatDate(item.timestamp),
        displayLocation: `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`,
        qualityText: item.quality === 'high' ? '优质' : item.quality === 'medium' ? '中等' : '较差'
      }));
      this.setData({ soilData: processedData });
    } catch (error) {
      console.error('获取土壤数据失败:', error);
    }
  },

  showAddModal: function () {
    this.setData({ showModal: true });
  },

  hideModal: function () {
    this.setData({ showModal: false });
  },

  stopPropagation: function () {},

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    if (field === 'latitude' || field === 'longitude') {
      this.setData({
        [`newData.location.${field}`]: parseFloat(value) || 0
      });
    } else {
      this.setData({
        [`newData.${field}`]: field === 'depth' || field === 'moisture' ? parseInt(value) || 0 : parseFloat(value) || 0
      });
    }
  },

  submitData: async function () {
    try {
      await soilApi.addSoilData(this.data.newData);
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
      this.hideModal();
      this.fetchSoilData();
    } catch (error) {
      console.error('添加失败:', error);
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      });
    }
  },

  deleteData: async function (e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条数据吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await soilApi.deleteSoilData(id);
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.fetchSoilData();
          } catch (error) {
            console.error('删除失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
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