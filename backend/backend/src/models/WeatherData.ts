import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherData extends Document {
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  airTemperature: number;
  airHumidity: number;
  co2Level: number;
  windSpeed: number;
  windDirection: string;
  lightIntensity: number;
  rainfall: number;
  robotId: string;
}

const WeatherDataSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  airTemperature: { type: Number, required: true },
  airHumidity: { type: Number, required: true },
  co2Level: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  windDirection: { type: String, required: true },
  lightIntensity: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  robotId: { type: String, required: true }
});

export default mongoose.model<IWeatherData>('WeatherData', WeatherDataSchema);
