import express, { Request, Response } from 'express';
import WeatherData from '../models/WeatherData';

const router = express.Router();

// 获取所有微气象数据
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await WeatherData.find().sort({ timestamp: -1 }).limit(50);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '获取微气象数据失败', error });
  }
});

// 添加微气象数据
router.post('/', async (req: Request, res: Response) => {
  try {
    const weatherData = new WeatherData(req.body);
    await weatherData.save();
    res.status(201).json(weatherData);
  } catch (error) {
    res.status(400).json({ message: '添加微气象数据失败', error });
  }
});

// 获取最新的微气象数据
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const data = await WeatherData.findOne().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '获取最新数据失败', error });
  }
});

// 获取统计数据
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await WeatherData.aggregate([
      {
        $group: {
          _id: null,
          avgTemp: { $avg: '$airTemperature' },
          avgHumidity: { $avg: '$airHumidity' },
          avgCO2: { $avg: '$co2Level' },
          maxTemp: { $max: '$airTemperature' },
          minTemp: { $min: '$airTemperature' }
        }
      }
    ]);
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: '获取统计数据失败', error });
  }
});

export default router;
