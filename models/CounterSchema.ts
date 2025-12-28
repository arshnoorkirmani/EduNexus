import { Schema, model, models } from "mongoose";
export interface ICounter {
  key: string;
  seq: number;
}
const CounterSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

export const CounterModel =
  models.Counter || model<ICounter>("Counter", CounterSchema);
