const BASE_URL = 'http://localhost:3001/api';

const request = (url, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const soilApi = {
  getSoilData: () => request('/soil'),
  addSoilData: (data) => request('/soil', 'POST', data),
  deleteSoilData: (id) => request(`/soil/${id}`, 'DELETE')
};

const cropApi = {
  getCropData: () => request('/crop'),
  addCropData: (data) => request('/crop', 'POST', data),
  deleteCropData: (id) => request(`/crop/${id}`, 'DELETE')
};

const analysisApi = {
  getStatistics: () => request('/analysis/statistics'),
  getDroughtWarning: () => request('/analysis/drought-warning'),
  getCropHealth: () => request('/analysis/crop-health')
};

const aiApi = {
  droughtAnalysis: (data) => request('/ai/drought-analysis', 'POST', data),
  cropPrediction: (data) => request('/ai/crop-prediction', 'POST', data),
  customAnalysis: (prompt) => request('/ai/custom', 'POST', { prompt })
};

module.exports = {
  soilApi,
  cropApi,
  analysisApi,
  aiApi
};