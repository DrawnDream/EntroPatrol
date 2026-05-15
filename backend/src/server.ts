import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import soilDataRoutes from './routes/soilData';
import cropDataRoutes from './routes/cropData';
import weatherDataRoutes from './routes/weatherData';
import locationDataRoutes from './routes/locationData';
import analysisRoutes from './routes/analysis';
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/soil', soilDataRoutes);
app.use('/api/crop', cropDataRoutes);
app.use('/api/weather', weatherDataRoutes);
app.use('/api/location', locationDataRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: '智墒巡田 - 四足机器人田间智能感知系统 API' });
});

// 关键修改：导出 app 而不是监听端口
export default app;
