import { useState, useEffect } from 'react';
import axios from 'axios';

interface DroughtWarning {
  _id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  depth: number;
  moisture: number;
  temperature: number;
  droughtLevel: string;
  message: string;
}

interface CropHealth {
  _id: string;
  timestamp: string;
  cropType: string;
  height: number;
  ndvi: number;
  healthScore: number;
  status: string;
  advice: string;
}

function Analysis() {
  const [droughtWarnings, setDroughtWarnings] = useState<DroughtWarning[]>([]);
  const [cropHealth, setCropHealth] = useState<CropHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [droughtRes, healthRes] = await Promise.all([
        axios.get('/api/analysis/drought-warning'),
        axios.get('/api/analysis/crop-health')
      ]);
      setDroughtWarnings(droughtRes.data);
      setCropHealth(healthRes.data);
    } catch (error) {
      console.error('Failed to fetch analysis data:', error);
    } finally {
      setLoading(false);
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

  const severeWarnings = droughtWarnings.filter(w => w.droughtLevel === 'severe');
  const warningWarnings = droughtWarnings.filter(w => w.droughtLevel === 'warning');

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">🌡️ 旱情预警分析</div>
            <div className="card-subtitle">土壤墒情监测预警</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
            <span>严重: {severeWarnings.length}</span>
            <span>警告: {warningWarnings.length}</span>
            <span>总计: {droughtWarnings.length}</span>
          </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>位置</th>
              <th>深度</th>
              <th>湿度</th>
              <th>温度</th>
              <th>预警等级</th>
              <th>预警信息</th>
            </tr>
          </thead>
          <tbody>
            {droughtWarnings.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.timestamp).toLocaleString('zh-CN')}</td>
                <td>
                  {item.location.latitude.toFixed(4)},<br />
                  {item.location.longitude.toFixed(4)}
                </td>
                <td>{item.depth}cm</td>
                <td>{item.moisture}%</td>
                <td>{item.temperature}°C</td>
                <td>
                  <span className={`warning-badge ${item.droughtLevel}`}>
                    {item.droughtLevel === 'severe' ? '严重' : 
                     item.droughtLevel === 'warning' ? '警告' :
                     item.droughtLevel === 'caution' ? '注意' : '正常'}
                  </span>
                </td>
                <td style={{ maxWidth: '200px' }}>{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">🌱 作物健康分析</div>
            <div className="card-subtitle">作物生长状况评估</div>
          </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>作物类型</th>
              <th>株高</th>
              <th>NDVI</th>
              <th>健康评分</th>
              <th>状态</th>
              <th>管理建议</th>
            </tr>
          </thead>
          <tbody>
            {cropHealth.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.timestamp).toLocaleString('zh-CN')}</td>
                <td>{item.cropType}</td>
                <td>{item.height}cm</td>
                <td>{item.ndvi.toFixed(2)}</td>
                <td>{item.healthScore}分</td>
                <td>
                  <span className={`health-badge ${item.status}`}>
                    {item.status === 'healthy' ? '健康' : 
                     item.status === 'moderate' ? '一般' : '较差'}
                  </span>
                </td>
                <td style={{ maxWidth: '250px' }}>{item.advice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analysis;