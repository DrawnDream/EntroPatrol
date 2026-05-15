import express, { Request, Response } from 'express';
import axios from 'axios';
import SoilData from '../models/SoilData';
import CropData from '../models/CropData';

const router = express.Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { prompt, includeData } = req.body;
    
    let context = '';
    if (includeData) {
      const recentSoilData = await SoilData.find().sort({ timestamp: -1 }).limit(10);
      const recentCropData = await CropData.find().sort({ timestamp: -1 }).limit(10);
      
      context = `土壤数据（最近10条）：\n${JSON.stringify(recentSoilData.map(d => ({
        时间: d.timestamp,
        位置: `${d.location.latitude}, ${d.location.longitude}`,
        深度: `${d.depth}cm`,
        湿度: `${d.moisture}%`,
        温度: `${d.temperature}°C`,
        电导率: `${d.conductivity} mS/cm`
      })), null, 2)}\n\n作物数据（最近10条）：\n${JSON.stringify(recentCropData.map(d => ({
        时间: d.timestamp,
        位置: `${d.location.latitude}, ${d.location.longitude}`,
        作物类型: d.cropType,
        株高: `${d.height}cm`,
        NDVI: d.ndvi,
        叶绿素: d.chlorophyllContent,
        冠层温度: `${d.canopyTemperature}°C`
      })), null, 2)}`;
    }

    const deepseekResponse = await axios.post(
      process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个农业专家助手，专门分析田间环境数据和作物生长情况。请基于提供的数据给出专业的农业建议和分析报告。'
          },
          {
            role: 'user',
            content: `${context}\n\n基于以上数据，请分析：${prompt}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      response: deepseekResponse.data.choices[0].message.content
    });
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'AI分析服务暂时不可用',
      error: error.response?.data || error.message
    });
  }
});

router.post('/drought-analysis', async (req: Request, res: Response) => {
  try {
    const recentSoilData = await SoilData.find().sort({ timestamp: -1 }).limit(20);
    
    const dataSummary = recentSoilData.map(d => ({
      时间: d.timestamp.toISOString(),
      位置: { lat: d.location.latitude, lng: d.location.longitude },
      土壤湿度: d.moisture,
      土壤温度: d.temperature,
      深度: d.depth,
      电导率: d.conductivity
    }));

    const prompt = `请基于以下土壤数据进行旱情分析：\n${JSON.stringify(dataSummary, null, 2)}\n\n请分析：
1. 当前土壤墒情状况评估
2. 潜在旱情风险等级
3. 灌溉建议（包括灌溉时机、灌溉量、灌溉方式）
4. 后续监测建议`;

    const deepseekResponse = await axios.post(
      process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位资深的农业水利专家，擅长土壤墒情分析和旱情预警。请根据提供的土壤数据给出专业的分析报告和建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      analysis: deepseekResponse.data.choices[0].message.content,
      dataSummary
    });
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'AI旱情分析服务暂时不可用',
      error: error.response?.data || error.message
    });
  }
});

router.post('/crop-prediction', async (req: Request, res: Response) => {
  try {
    const { cropType } = req.body;
    const recentCropData = await CropData.find({ cropType }).sort({ timestamp: -1 }).limit(15);
    
    const dataSummary = recentCropData.map(d => ({
      时间: d.timestamp.toISOString(),
      株高: d.height,
      NDVI: d.ndvi,
      叶绿素含量: d.chlorophyllContent,
      冠层温度: d.canopyTemperature,
      空气湿度: d.humidity
    }));

    const prompt = `请基于以下${cropType}作物生长数据进行分析预测：\n${JSON.stringify(dataSummary, null, 2)}\n\n请分析：
1. 当前作物生长阶段评估
2. 作物健康状况评分
3. 未来生长趋势预测
4. 针对性管理建议（施肥、灌溉、病虫害防治等）`;

    const deepseekResponse = await axios.post(
      process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的作物栽培专家，擅长基于监测数据进行作物生长分析和预测。请给出详细的分析报告和管理建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      prediction: deepseekResponse.data.choices[0].message.content,
      cropType,
      dataSummary
    });
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'AI作物预测服务暂时不可用',
      error: error.response?.data || error.message
    });
  }
});

export default router;