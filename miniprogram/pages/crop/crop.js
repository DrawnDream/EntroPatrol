const { cropApi } = require('../../utils/api.js');

Page({
  data: {
    cropData: [],
    showModal: false,
    cropIndex: 0,
    cropTypes: ['玉米', '小麦', '水稻', '大豆', '棉花'],
    newData: {
      cropType: '玉米',
      location: { latitude: 35.0, longitude: 105.0 },
      height: 150,
      leafAreaIndex: 3.5,
      ndvi: 0.75,
      chlorophyllContent: 45,
      canopyTemperature: 28,
      humidity: 60,
      robotId: 'robot-001'
    }
  },

  onLoad: function () {
    this.fetchCropData();
  },

  onShow: function () {
    this.fetchCropData();
  },

  fetchCropData: async function () {
    try {
      const res = await cropApi.getCropData();
      const processedData = res.map(item => ({
        ...item,
        displayTime: this.formatDate(item.timestamp),
        displayLocation: `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`,
        displayNdvi: item.ndvi.toFixed(2)
      }));
      this.setData({ cropData: processedData });
    } catch (error) {
      console.error('获取作物数据失败:', error);
    }
  },

  showAddModal: function () {
    this.setData({ showModal: true });
  },

  hideModal: function () {
    this.setData({ showModal: false });
  },

  stopPropagation: function () {},

  onCropChange: function (e) {
    const index = e.detail.value;
    this.setData({
      cropIndex: index,
      'newData.cropType': this.data.cropTypes[index]
    });
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    if (field === 'latitude' || field === 'longitude') {
      this.setData({
        [`newData.location.${field}`]: parseFloat(value) || 0
      });
    } else if (field === 'height' || field === 'chlorophyllContent' || field === 'humidity') {
      this.setData({
        [`newData.${field}`]: parseInt(value) || 0
      });
    } else {
      this.setData({
        [`newData.${field}`]: parseFloat(value) || 0
      });
    }
  },

  submitData: async function () {
    try {
      await cropApi.addCropData(this.data.newData);
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
      this.hideModal();
      this.fetchCropData();
    } catch (error) {
      console.error('添加失败:', error);
      wx.showToast({
        title: '添加失败',
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