import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import CropData from '../models/CropData';

const router = express.Router();

router.post('/', [
  body('location.latitude').isNumeric(),
  body('location.longitude').isNumeric(),
  body('cropType').isString(),
  body('height').isNumeric(),
  body('leafAreaIndex').isNumeric(),
  body('ndvi').isNumeric(),
  body('chlorophyllContent').isNumeric(),
  body('canopyTemperature').isNumeric(),
  body('humidity').isNumeric(),
  body('robotId').isString()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const cropData = new CropData(req.body);
    await cropData.save();
    res.status(201).json(cropData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { robotId, cropType, startDate, endDate } = req.query;
    let query: any = {};
    
    if (robotId) query.robotId = robotId;
    if (cropType) query.cropType = cropType;
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const data = await CropData.find(query).sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await CropData.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;