import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const WaitlistSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type WaitlistDoc = InferSchemaType<typeof WaitlistSchema>;

export const Waitlist: Model<WaitlistDoc> =
  (mongoose.models.Waitlist as Model<WaitlistDoc>) ||
  mongoose.model<WaitlistDoc>("Waitlist", WaitlistSchema);
