const { aiApi } = require('../../utils/api.js');

Page({
  data: {
    activeTab: 'drought',
    cropTypes: ['小麦', '玉米', '水稻', '大豆', '棉花'],
    cropIndex: 0,
    customPrompt: '',
    response: '',
    loading: false
  },

  setTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ 
      activeTab: tab,
      response: ''
    });
  },

  onCropChange: function (e) {
    this.setData({
      cropIndex: e.detail.value
    });
  },

  onPromptInput: function (e) {
    this.setData({
      customPrompt: e.detail.value
    });
  },

  startDroughtAnalysis: async function () {
    this.setData({ loading: true, response: '' });
    
    try {
      const res = await aiApi.droughtAnalysis();
      if (res.success) {
        this.setData({ response: res.analysis });
      } else {
        this.setData({ response: res.message });
      }
    } catch (error) {
      console.error('AI分析失败:', error);
      this.setData({ response: '分析失败，请检查API配置或稍后重试' });
    } finally {
      this.setData({ loading: false });
    }
  },

  startCropPrediction: async function () {
    const cropType = this.data.cropTypes[this.data.cropIndex];
    this.setData({ loading: true, response: '' });
    
    try {
      const res = await aiApi.cropPrediction(cropType);
      if (res.success) {
        this.setData({ response: res.prediction });
      } else {
        this.setData({ response: res.message });
      }
    } catch (error) {
      console.error('AI分析失败:', error);
      this.setData({ response: '分析失败，请检查API配置或稍后重试' });
    } finally {
      this.setData({ loading: false });
    }
  },

  startCustomAnalysis: async function () {
    if (!this.data.customPrompt.trim()) return;
    
    this.setData({ loading: true, response: '' });
    
    try {
      const res = await aiApi.analyze(this.data.customPrompt, true);
      if (res.success) {
        this.setData({ response: res.response });
      } else {
        this.setData({ response: res.message });
      }
    } catch (error) {
      console.error('AI分析失败:', error);
      this.setData({ response: '分析失败，请检查API配置或稍后重试' });
    } finally {
      this.setData({ loading: false });
    }
  }
});