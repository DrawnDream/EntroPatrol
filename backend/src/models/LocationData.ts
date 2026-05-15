import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationData extends Document {
  timestamp: Date;
  robotId: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  status: string;
  batteryLevel: number;
  nextWaypoint?: {
    latitude: number;
    longitude: number;
  };
}

const LocationDataSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  robotId: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'idle', 'charging'], default: 'idle' },
  batteryLevel: { type: Number, min: 0, max: 100, default: 100 },
  nextWaypoint: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

export default mongoose.model<ILocationData>('LocationData', LocationDataSchema);
