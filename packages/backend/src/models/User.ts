import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  role: "Admin" | "Teacher" | "Student";
  dob: Date;
  isActive: boolean;
  userId: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Teacher", "Student"],
    },
    dob: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    userId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
