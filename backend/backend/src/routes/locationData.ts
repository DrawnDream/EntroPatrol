import express, { Request, Response } from 'express';
import LocationData from '../models/LocationData';

const router = express.Router();

// 获取所有位置数据
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await LocationData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '获取位置数据失败', error });
  }
});

// 添加位置数据
router.post('/', async (req: Request, res: Response) => {
  try {
    const locationData = new LocationData(req.body);
    await locationData.save();
    res.status(201).json(locationData);
  } catch (error) {
    res.status(400).json({ message: '添加位置数据失败', error });
  }
});

// 获取最新位置
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const data = await LocationData.findOne().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '获取最新位置失败', error });
  }
});

// 获取特定机器人的位置历史
router.get('/robot/:robotId', async (req: Request, res: Response) => {
  try {
    const data = await LocationData.find({ robotId: req.params.robotId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '获取机器人位置失败', error });
  }
});

// 获取路径规划数据
router.get('/route/:robotId', async (req: Request, res: Response) => {
  try {
    const data = await LocationData.find({ robotId: req.params.robotId })
      .sort({ timestamp: -1 })
      .limit(20);
    
    const route = data.map(item => ({
      lat: item.location.latitude,
      lng: item.location.longitude,
      timestamp: item.timestamp
    }));
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: '获取路径数据失败', error });
  }
});

export default router;
