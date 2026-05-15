import { useState, useEffect } from 'react';
import axios from 'axios';

interface CropData {
  _id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  cropType: string;
  height: number;
  leafAreaIndex: number;
  ndvi: number;
  chlorophyllContent: number;
  canopyTemperature: number;
  humidity: number;
  robotId: string;
}

function CropDataComponent() {
  const [data, setData] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newData, setNewData] = useState({
    location: { latitude: 35.0, longitude: 105.0 },
    cropType: '小麦',
    height: 50,
    leafAreaIndex: 3.5,
    ndvi: 0.7,
    chlorophyllContent: 45,
    canopyTemperature: 28,
    humidity: 60,
    robotId: 'robot-001'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/crop');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch crop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/crop', newData);
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add crop data:', error);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">作物数据管理</div>
          <div className="card-subtitle">作物生长监测数据</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          添加数据
        </button>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>时间</th>
            <th>位置</th>
            <th>作物类型</th>
            <th>株高</th>
            <th>LAI</th>
            <th>NDVI</th>
            <th>叶绿素</th>
            <th>冠层温度</th>
            <th>湿度</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              <td>{new Date(item.timestamp).toLocaleString('zh-CN')}</td>
              <td>
                {item.location.latitude.toFixed(4)},<br />
                {item.location.longitude.toFixed(4)}
              </td>
              <td>{item.cropType}</td>
              <td>{item.height}cm</td>
              <td>{item.leafAreaIndex}</td>
              <td>{item.ndvi.toFixed(2)}</td>
              <td>{item.chlorophyllContent}</td>
              <td>{item.canopyTemperature}°C</td>
              <td>{item.humidity}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowAddModal(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">添加作物数据</div>
              <button 
                className="modal-close" 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAddModal(false);
                }}
              >×</button>
            </div>
            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
              <div className="form-group">
                <label className="form-label">作物类型</label>
                <select 
                  className="form-control"
                  value={newData.cropType}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, cropType: e.target.value});
                  }}
                >
                  <option value="小麦">小麦</option>
                  <option value="玉米">玉米</option>
                  <option value="水稻">水稻</option>
                  <option value="大豆">大豆</option>
                  <option value="棉花">棉花</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">纬度</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.0001"
                  value={newData.location.latitude}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, location: {...newData.location, latitude: parseFloat(e.target.value)}});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">经度</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.0001"
                  value={newData.location.longitude}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, location: {...newData.location, longitude: parseFloat(e.target.value)}});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">株高 (cm)</label>
                <input 
                  className="form-control"
                  type="number" 
                  value={newData.height}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, height: parseInt(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">叶面积指数 (LAI)</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.1"
                  value={newData.leafAreaIndex}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, leafAreaIndex: parseFloat(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">NDVI</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.01"
                  value={newData.ndvi}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, ndvi: parseFloat(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">叶绿素含量</label>
                <input 
                  className="form-control"
                  type="number" 
                  value={newData.chlorophyllContent}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, chlorophyllContent: parseInt(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">冠层温度 (°C)</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.1"
                  value={newData.canopyTemperature}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, canopyTemperature: parseFloat(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">空气湿度 (%)</label>
                <input 
                  className="form-control"
                  type="number" 
                  value={newData.humidity}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, humidity: parseInt(e.target.value)});
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                提交
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropDataComponent;