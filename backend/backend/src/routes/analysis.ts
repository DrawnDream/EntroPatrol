import express, { Request, Response } from 'express';
import SoilData from '../models/SoilData';
import CropData from '../models/CropData';
import WeatherData from '../models/WeatherData';

const router = express.Router();

router.get('/drought-warning', async (req: Request, res: Response) => {
  try {
    const { location } = req.query;
    const recentSoilData = await SoilData.find()
      .sort({ timestamp: -1 })
      .limit(50);

    const warningResults: any[] = [];
    
    recentSoilData.forEach(data => {
      let level = 'normal';
      let message = '墒情正常';
      
      if (data.moisture < 15) {
        level = 'severe';
        message = '严重干旱预警：土壤含水量极低，需立即灌溉';
      } else if (data.moisture < 25) {
        level = 'warning';
        message = '干旱预警：土壤含水量偏低，建议近期灌溉';
      } else if (data.moisture < 35) {
        level = 'caution';
        message = '注意：土壤含水量适中偏下，关注天气变化';
      }

      warningResults.push({
        ...data.toObject(),
        droughtLevel: level,
        message
      });
    });

    res.json(warningResults);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/crop-health', async (req: Request, res: Response) => {
  try {
    const recentCropData = await CropData.find()
      .sort({ timestamp: -1 })
      .limit(50);

    const healthResults = recentCropData.map(data => {
      const healthScore = calculateHealthScore(data);
      let status = 'healthy';
      let advice = '';

      if (healthScore >= 80) {
        status = 'healthy';
        advice = '作物生长状况良好，继续保持当前管理措施';
      } else if (healthScore >= 60) {
        status = 'moderate';
        advice = '作物生长状况一般，建议适当调整水肥管理';
      } else {
        status = 'poor';
        advice = '作物生长状况较差，建议立即检查并采取补救措施';
      }

      return {
        ...data.toObject(),
        healthScore,
        status,
        advice
      };
    });

    res.json(healthResults);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    let query: any = {};
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const soilData = await SoilData.find(query);
    const cropData = await CropData.find(query);

    const stats = {
      totalSoilSamples: soilData.length,
      totalCropSamples: cropData.length,
      avgSoilMoisture: soilData.length ? 
        soilData.reduce((sum, d) => sum + d.moisture, 0) / soilData.length : 0,
      avgSoilTemperature: soilData.length ?
        soilData.reduce((sum, d) => sum + d.temperature, 0) / soilData.length : 0,
      avgCropHeight: cropData.length ?
        cropData.reduce((sum, d) => sum + d.height, 0) / cropData.length : 0,
      avgNDVI: cropData.length ?
        cropData.reduce((sum, d) => sum + d.ndvi, 0) / cropData.length : 0,
      minMoisture: soilData.length ? Math.min(...soilData.map(d => d.moisture)) : 0,
      maxMoisture: soilData.length ? Math.max(...soilData.map(d => d.moisture)) : 0,
      samplingLocations: [...new Set(soilData.map(d => `${d.location.latitude},${d.location.longitude}`))].length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

function calculateHealthScore(data: any): number {
  const ndviScore = Math.min(data.ndvi * 100, 100);
  const heightScore = data.height > 50 ? 90 : data.height * 1.8;
  const chlorophyllScore = Math.min(data.chlorophyllContent * 2, 100);
  const tempScore = data.canopyTemperature > 35 ? 50 : 
                    data.canopyTemperature > 30 ? 75 : 90;
  
  return Math.round((ndviScore * 0.3 + heightScore * 0.2 + chlorophyllScore * 0.3 + tempScore * 0.2));
}

export default router;