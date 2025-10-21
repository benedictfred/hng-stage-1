import mongoose, { Document } from "mongoose";

export interface String extends Document {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
  };
  created_at: Date;
  getPublicFields(): Omit<String, "_id" | "__v">;
}

const stringSchema = new mongoose.Schema<String>({
  id: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
  properties: {
    length: { type: Number, required: true },
    is_palindrome: { type: Boolean, required: true },
    unique_characters: { type: Number, required: true },
    word_count: { type: Number, required: true },
    sha256_hash: { type: String, required: true },
    character_frequency_map: { type: Map, of: Number, required: true },
  },
  created_at: { type: Date, default: new Date() },
});

stringSchema.methods.getPublicFields = function () {
  const { _id, __v, ...publicFields } = this.toObject();
  return publicFields;
};

export const StringModel = mongoose.model<String>("String", stringSchema);
