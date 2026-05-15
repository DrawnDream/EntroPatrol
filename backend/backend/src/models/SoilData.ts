import mongoose, { Document, Schema } from 'mongoose';

export interface ISoilData extends Document {
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  depth: number;
  moisture: number;
  temperature: number;
  conductivity: number;
  ph?: number;
  organicMatter?: number;
  robotId: string;
  probeStatus: string;
  quality: 'high' | 'medium' | 'low';
}

const SoilDataSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number }
  },
  depth: { type: Number, required: true },
  moisture: { type: Number, required: true },
  temperature: { type: Number, required: true },
  conductivity: { type: Number, required: true },
  ph: { type: Number },
  organicMatter: { type: Number },
  robotId: { type: String, required: true },
  probeStatus: { type: String, required: true },
  quality: { type: String, enum: ['high', 'medium', 'low'], default: 'high' }
});

export default mongoose.model<ISoilData>('SoilData', SoilDataSchema);