import { useState, useEffect } from 'react';
import axios from 'axios';

interface SoilData {
  _id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  depth: number;
  moisture: number;
  temperature: number;
  conductivity: number;
  ph?: number;
  organicMatter?: number;
  robotId: string;
  probeStatus: string;
  quality: string;
}

function SoilDataComponent() {
  const [data, setData] = useState<SoilData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newData, setNewData] = useState({
    location: { latitude: 35.0, longitude: 105.0 },
    depth: 10,
    moisture: 25,
    temperature: 25,
    conductivity: 1.5,
    robotId: 'robot-001',
    probeStatus: 'normal'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/soil');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch soil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/soil', newData);
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add soil data:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条数据吗？')) {
      try {
        await axios.delete(`/api/soil/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete soil data:', error);
      }
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
          <div className="card-title">土壤数据管理</div>
          <div className="card-subtitle">定点定深测量数据</div>
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
            <th>深度</th>
            <th>湿度</th>
            <th>温度</th>
            <th>电导率</th>
            <th>pH</th>
            <th>状态</th>
            <th>操作</th>
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
              <td>{item.depth}cm</td>
              <td>{item.moisture}%</td>
              <td>{item.temperature}°C</td>
              <td>{item.conductivity} mS/cm</td>
              <td>{item.ph || '-'}</td>
              <td>
                <span className={`warning-badge ${item.quality}`}>
                  {item.quality === 'high' ? '优质' : item.quality === 'medium' ? '中等' : '较差'}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleDelete(item._id)}
                >
                  删除
                </button>
              </td>
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
              <div className="modal-title">添加土壤数据</div>
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
                <label className="form-label">测量深度 (cm)</label>
                <input 
                  className="form-control"
                  type="number" 
                  value={newData.depth}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, depth: parseInt(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">土壤湿度 (%)</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.1"
                  value={newData.moisture}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, moisture: parseFloat(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">土壤温度 (°C)</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.1"
                  value={newData.temperature}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, temperature: parseFloat(e.target.value)});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">电导率 (mS/cm)</label>
                <input 
                  className="form-control"
                  type="number" 
                  step="0.1"
                  value={newData.conductivity}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNewData({...newData, conductivity: parseFloat(e.target.value)});
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

export default SoilDataComponent;