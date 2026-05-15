import { useState } from 'react';
import axios from 'axios';

function AIAnalysis() {
  const [activeTab, setActiveTab] = useState<'drought' | 'crop' | 'custom'>('drought');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [cropType, setCropType] = useState('小麦');

  const handleDroughtAnalysis = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/ai/drought-analysis');
      setResponse(res.data.analysis);
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      setResponse('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCropPrediction = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/ai/crop-prediction', { cropType });
      setResponse(res.data.prediction);
    } catch (error) {
      console.error('Failed to get crop prediction:', error);
      setResponse('预测失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAnalysis = async () => {
    if (!customPrompt.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post('/api/ai/analyze', { 
        prompt: customPrompt, 
        includeData: true 
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Failed to get custom analysis:', error);
      setResponse('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">🤖 AI智能分析</div>
          <div className="card-subtitle">基于DeepSeek大模型的农业数据分析</div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            className={`btn ${activeTab === 'drought' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('drought'); setResponse(''); }}
          >
            旱情分析
          </button>
          <button
            className={`btn ${activeTab === 'crop' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('crop'); setResponse(''); }}
          >
            作物预测
          </button>
          <button
            className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('custom'); setResponse(''); }}
          >
            自定义分析
          </button>
        </div>

        {activeTab === 'drought' && (
          <div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              基于最近土壤监测数据，AI将分析当前墒情状况、潜在旱情风险等级，并提供灌溉建议。
            </p>
            <button className="btn btn-primary" onClick={handleDroughtAnalysis}>
              开始旱情分析
            </button>
          </div>
        )}

        {activeTab === 'crop' && (
          <div>
            <div className="form-group">
              <label className="form-label">选择作物类型</label>
              <select 
                className="form-control"
                value={cropType}
                onChange={e => setCropType(e.target.value)}
              >
                <option value="小麦">小麦</option>
                <option value="玉米">玉米</option>
                <option value="水稻">水稻</option>
                <option value="大豆">大豆</option>
                <option value="棉花">棉花</option>
              </select>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              基于最近作物生长数据，AI将评估作物生长阶段、健康状况，并提供管理建议。
            </p>
            <button className="btn btn-primary" onClick={handleCropPrediction}>
              开始作物预测
            </button>
          </div>
        )}

        {activeTab === 'custom' && (
          <div>
            <div className="form-group">
              <label className="form-label">输入分析问题</label>
              <textarea 
                className="form-control"
                rows={4}
                placeholder="请输入您想要分析的问题，例如：最近一周的土壤湿度变化趋势如何？"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCustomAnalysis}>
              提交分析
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      {response && !loading && (
        <div>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div className="card-title" style={{ fontSize: '1rem' }}>📝 AI分析结果</div>
          </div>
          <div className="ai-response">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;