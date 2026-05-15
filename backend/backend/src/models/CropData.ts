import mongoose, { Document, Schema } from 'mongoose';

export interface ICropData extends Document {
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  cropType: string;
  height: number;
  leafAreaIndex: number;
  ndvi: number;
  chlorophyllContent: number;
  canopyTemperature: number;
  humidity: number;
  robotId: string;
  imageUrl?: string;
}

const CropDataSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  cropType: { type: String, required: true },
  height: { type: Number, required: true },
  leafAreaIndex: { type: Number, required: true },
  ndvi: { type: Number, required: true },
  chlorophyllContent: { type: Number, required: true },
  canopyTemperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  robotId: { type: String, required: true },
  imageUrl: { type: String }
});

export default mongoose.model<ICropData>('CropData', CropDataSchema);