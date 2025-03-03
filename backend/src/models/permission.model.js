import mongoose, { Schema, model } from "mongoose";

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Permission = model("Permission", PermissionSchema);
export default Permission;