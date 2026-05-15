import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface Statistics {
  totalSoilSamples: number;
  totalCropSamples: number;
  avgSoilMoisture: number;
  avgSoilTemperature: number;
  avgCropHeight: number;
  avgNDVI: number;
  minMoisture: number;
  maxMoisture: number;
  samplingLocations: number;
}

interface SoilDataPoint {
  timestamp: string;
  moisture: number;
  temperature: number;
}

function Dashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [soilTrend, setSoilTrend] = useState<SoilDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, soilRes] = await Promise.all([
        axios.get('/api/analysis/statistics'),
        axios.get('/api/soil')
      ]);
      
      setStats(statsRes.data);
      
      const trendData = soilRes.data.slice(0, 20).reverse().map((item: any) => ({
        timestamp: new Date(item.timestamp).toLocaleDateString('zh-CN', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        moisture: item.moisture,
        temperature: item.temperature
      }));
      setSoilTrend(trendData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalSoilSamples || 0}</div>
          <div className="stat-label">土壤样本数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalCropSamples || 0}</div>
          <div className="stat-label">作物样本数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(stats?.avgSoilMoisture || 0).toFixed(1)}%</div>
          <div className="stat-label">平均土壤湿度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(stats?.avgSoilTemperature || 0).toFixed(1)}°C</div>
          <div className="stat-label">平均土壤温度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(stats?.avgCropHeight || 0).toFixed(1)}cm</div>
          <div className="stat-label">平均株高</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(stats?.avgNDVI || 0).toFixed(2)}</div>
          <div className="stat-label">平均NDVI</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.samplingLocations || 0}</div>
          <div className="stat-label">采样位置数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.minMoisture || 0}-{stats?.maxMoisture || 0}%</div>
          <div className="stat-label">湿度范围</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">土壤湿度趋势</div>
            <div className="card-subtitle">最近20条记录</div>
          </div>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={soilTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="moisture" 
                name="湿度(%)"
                stroke="#2E7D32" 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="temperature" 
                name="温度(°C)"
                stroke="#F57C00" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;