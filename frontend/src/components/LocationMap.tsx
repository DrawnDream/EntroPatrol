import { useState, useEffect } from 'react';
import axios from 'axios';

interface LocationData {
  _id: string;
  timestamp: string;
  robotId: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  status: string;
  batteryLevel: number;
  nextWaypoint?: {
    latitude: number;
    longitude: number;
  };
}

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;
}

function LocationMap() {
  const [data, setData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRobot, setSelectedRobot] = useState<string>('all');
  const [mapType, setMapType] = useState<'satellite' | 'route'>('satellite');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 每5秒刷新一次
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/location');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch location data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟地图SVG
  const renderMap = () => {
    const width = 800;
    const height = 400;
    
    // 计算边界
    const lats = data.map(d => d.location.latitude);
    const lngs = data.map(d => d.location.longitude);
    const minLat = Math.min(...lats) - 0.01;
    const maxLat = Math.max(...lats) + 0.01;
    const minLng = Math.min(...lngs) - 0.01;
    const maxLng = Math.max(...lngs) + 0.01;

    const scaleX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * width;
    const scaleY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="map-svg">
        {/* 背景 */}
        <rect width={width} height={height} fill="#e8f5e9" />
        
        {/* 网格线 */}
        {[...Array(10)].map((_, i) => (
          <g key={i}>
            <line x1={0} y1={i * height / 10} x2={width} y2={i * height / 10} stroke="#c8e6c9" strokeWidth="1" />
            <line x1={i * width / 10} y1={0} x2={i * width / 10} y2={height} stroke="#c8e6c9" strokeWidth="1" />
          </g>
        ))}

        {/* 路径线 */}
        {mapType === 'route' && data.length > 1 && (
          <polyline
            points={data.map(d => `${scaleX(d.location.longitude)},${scaleY(d.location.latitude)}`).join(' ')}
            fill="none"
            stroke="#2E7D32"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        )}

        {/* 位置点 */}
        {data.map((item, index) => {
          const x = scaleX(item.location.longitude);
          const y = scaleY(item.location.latitude);
          const isLatest = index === 0;
          
          return (
            <g key={item._id}>
              {/* 脉冲效果 */}
              {isLatest && (
                <circle cx={x} cy={y} r="15" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0.5">
                  <animate attributeName="r" from="10" to="25" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {/* 位置点 */}
              <circle 
                cx={x} 
                cy={y} 
                r={isLatest ? 8 : 5} 
                fill={isLatest ? '#2E7D32' : '#81C784'}
                stroke="white"
                strokeWidth="2"
              />
              {/* 标签 */}
              <text x={x + 12} y={y - 5} fontSize="12" fill="#333">
                {item.robotId}
              </text>
              <text x={x + 12} y={y + 10} fontSize="10" fill="#666">
                {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
              </text>
            </g>
          );
        })}

        {/* 比例尺 */}
        <g transform={`translate(${width - 150}, ${height - 40})`}>
          <rect x="0" y="0" width="100" height="30" fill="white" rx="4" opacity="0.9" />
          <line x1="10" y1="20" x2="90" y2="20" stroke="#333" strokeWidth="2" />
          <line x1="10" y1="15" x2="10" y2="25" stroke="#333" strokeWidth="2" />
          <line x1="90" y1="15" x2="90" y2="25" stroke="#333" strokeWidth="2" />
          <text x="50" y="12" textAnchor="middle" fontSize="10" fill="#333">100m</text>
        </g>

        {/* 指南针 */}
        <g transform={`translate(30, 30)`}>
          <circle cx="0" cy="0" r="20" fill="white" stroke="#333" strokeWidth="2" />
          <polygon points="0,-15 -5,5 0,0 5,5" fill="#c62828" />
          <polygon points="0,15 -5,-5 0,0 5,-5" fill="#333" />
          <text x="0" y="-18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#333">N</text>
        </g>
      </svg>
    );
  };

  const getRobots = () => {
    const robots = [...new Set(data.map(d => d.robotId))];
    return robots;
  };

  const getFilteredData = () => {
    if (selectedRobot === 'all') return data;
    return data.filter(d => d.robotId === selectedRobot);
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

  const filteredData = getFilteredData();
  const latestData = filteredData[0];

  return (
    <div className="location-page">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">机器人位置追踪</div>
            <div className="card-subtitle">实时位置监控与路径规划</div>
          </div>
          <div className="map-controls">
            <select 
              className="form-control"
              value={selectedRobot}
              onChange={(e) => setSelectedRobot(e.target.value)}
            >
              <option value="all">全部机器人</option>
              {getRobots().map(robot => (
                <option key={robot} value={robot}>{robot}</option>
              ))}
            </select>
            <div className="map-type-toggle">
              <button 
                className={`toggle-btn ${mapType === 'satellite' ? 'active' : ''}`}
                onClick={() => setMapType('satellite')}
              >
                卫星图
              </button>
              <button 
                className={`toggle-btn ${mapType === 'route' ? 'active' : ''}`}
                onClick={() => setMapType('route')}
              >
                路线图
              </button>
            </div>
          </div>
        </div>

        {/* 状态卡片 */}
        {latestData && (
          <div className="location-stats">
            <div className="stat-item">
              <span className="stat-label">当前位置</span>
              <span className="stat-value">
                {latestData.location.latitude.toFixed(6)}, {latestData.location.longitude.toFixed(6)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">海拔高度</span>
              <span className="stat-value">{latestData.location.altitude}m</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">运行状态</span>
              <span className={`status-badge ${latestData.status}`}>
                {latestData.status === 'active' ? '运行中' : '待机中'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">电池电量</span>
              <span className="stat-value">
                <div className="battery-indicator">
                  <div className="battery-fill" style={{width: `${latestData.batteryLevel}%`}}></div>
                  <span>{latestData.batteryLevel}%</span>
                </div>
              </span>
            </div>
          </div>
        )}

        {/* 地图 */}
        <div className="map-container">
          {filteredData.length > 0 ? renderMap() : (
            <div className="no-data">暂无位置数据</div>
          )}
        </div>

        {/* 位置列表 */}
        <div className="location-list">
          <h3 className="list-title">历史轨迹</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>机器人ID</th>
                <th>纬度</th>
                <th>经度</th>
                <th>海拔</th>
                <th>状态</th>
                <th>电量</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 10).map(item => (
                <tr key={item._id}>
                  <td>{new Date(item.timestamp).toLocaleString('zh-CN')}</td>
                  <td>{item.robotId}</td>
                  <td>{item.location.latitude.toFixed(6)}</td>
                  <td>{item.location.longitude.toFixed(6)}</td>
                  <td>{item.location.altitude}m</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status === 'active' ? '运行中' : '待机中'}
                    </span>
                  </td>
                  <td>{item.batteryLevel}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LocationMap;
