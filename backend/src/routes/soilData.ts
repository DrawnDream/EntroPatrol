import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import SoilData from '../models/SoilData';

const router = express.Router();

router.post('/', [
  body('location.latitude').isNumeric(),
  body('location.longitude').isNumeric(),
  body('depth').isNumeric(),
  body('moisture').isNumeric(),
  body('temperature').isNumeric(),
  body('conductivity').isNumeric(),
  body('robotId').isString()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const soilData = new SoilData(req.body);
    await soilData.save();
    res.status(201).json(soilData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { robotId, startDate, endDate } = req.query;
    let query: any = {};
    
    if (robotId) query.robotId = robotId;
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const data = await SoilData.find(query).sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await SoilData.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const data = await SoilData.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data not found' });
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;