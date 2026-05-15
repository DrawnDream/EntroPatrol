import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeatherDataItem {
  _id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  airTemperature: number;
  airHumidity: number;
  co2Level: number;
  windSpeed: number;
  windDirection: string;
  lightIntensity: number;
  rainfall: number;
  robotId: string;
}

function WeatherData() {
  const [data, setData] = useState<WeatherDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newData, setNewData] = useState({
    location: { latitude: 35.0, longitude: 105.0 },
    airTemperature: 25,
    airHumidity: 60,
    co2Level: 400,
    windSpeed: 2.5,
    windDirection: '东南',
    lightIntensity: 800,
    rainfall: 0,
    robotId: 'robot-001'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/weather');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/weather', newData);
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add weather data:', error);
    }
  };

  const getLatestData = () => {
    return data[0] || null;
  };

  const getChartData = () => {
    return data.slice(0, 10).reverse().map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      温度: item.airTemperature,
      湿度: item.airHumidity,
      CO2: item.co2Level
    }));
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

  const latest = getLatestData();

  return (
    <div className="weather-data-page">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">田间微气象监测</div>
            <div className="card-subtitle">实时环境数据采集与分析</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            添加数据
          </button>
        </div>

        {/* 实时数据卡片 */}
        {latest && (
          <div className="weather-cards">
            <div className="weather-card">
              <div className="weather-icon">🌡️</div>
              <div className="weather-value">{latest.airTemperature}°C</div>
              <div className="weather-label">空气温度</div>
            </div>
            <div className="weather-card">
              <div className="weather-icon">💧</div>
              <div className="weather-value">{latest.airHumidity}%</div>
              <div className="weather-label">空气湿度</div>
            </div>
            <div className="weather-card">
              <div className="weather-icon">🌬️</div>
              <div className="weather-value">{latest.co2Level} ppm</div>
              <div className="weather-label">CO₂含量</div>
            </div>
            <div className="weather-card">
              <div className="weather-icon">💨</div>
              <div className="weather-value">{latest.windSpeed} m/s</div>
              <div className="weather-label">风速</div>
            </div>
            <div className="weather-card">
              <div className="weather-icon">🧭</div>
              <div className="weather-value">{latest.windDirection}</div>
              <div className="weather-label">风向</div>
            </div>
            <div className="weather-card">
              <div className="weather-icon">☀️</div>
              <div className="weather-value">{latest.lightIntensity} lux</div>
              <div className="weather-label">光照强度</div>
            </div>
          </div>
        )}

        {/* 趋势图表 */}
        <div className="chart-section">
          <h3 className="chart-title">环境参数趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="温度" stroke="#ff6b6b" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="湿度" stroke="#4ecdc4" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="CO2" stroke="#45b7d1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 数据表格 */}
        <table className="data-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>位置</th>
              <th>温度(°C)</th>
              <th>湿度(%)</th>
              <th>CO₂(ppm)</th>
              <th>风速(m/s)</th>
              <th>风向</th>
              <th>光照(lux)</th>
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
                <td>{item.airTemperature}</td>
                <td>{item.airHumidity}</td>
                <td>{item.co2Level}</td>
                <td>{item.windSpeed}</td>
                <td>{item.windDirection}</td>
                <td>{item.lightIntensity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 添加数据弹窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowAddModal(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">添加微气象数据</div>
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
              <div className="form-row">
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
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">空气温度 (°C)</label>
                  <input 
                    className="form-control"
                    type="number" 
                    step="0.1"
                    value={newData.airTemperature}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewData({...newData, airTemperature: parseFloat(e.target.value)});
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">空气湿度 (%)</label>
                  <input 
                    className="form-control"
                    type="number" 
                    value={newData.airHumidity}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewData({...newData, airHumidity: parseInt(e.target.value)});
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CO₂含量 (ppm)</label>
                  <input 
                    className="form-control"
                    type="number" 
                    value={newData.co2Level}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewData({...newData, co2Level: parseInt(e.target.value)});
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">风速 (m/s)</label>
                  <input 
                    className="form-control"
                    type="number" 
                    step="0.1"
                    value={newData.windSpeed}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewData({...newData, windSpeed: parseFloat(e.target.value)});
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">风向</label>
                  <select 
                    className="form-control"
                    value={newData.windDirection}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewData({...newData, windDirection: e.target.value});
                    }}
                  >
                    <option value="北">北</option>
                    <option value="东北">东北</option>
                    <option value="东">东</option>
                    <option value="东南">东南</option>
                    <option value="南">南</option>
                    <option value="西南">西南</option>
                    <option value="西">西</option>
                    <option value="西北">西北</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">光照强度 (lux)</label>
                  <input 
                    className="form-control"
                    type="number" 
                    value={newData.lightIntensity}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewData({...newData, lightIntensity: parseInt(e.target.value)});
                    }}
                  />
                </div>
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

export default WeatherData;
