import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true, // Role is now required
      enum: [
        "HOD-CSE",
        "HOD-CSE-AIML",
        "HOD-ECE",
        "HOD-IT",
        "HOD-EEE",
        "HOD-CIVIL",
        "HOD-MECH",
        "HOD-FRESHERMAN",
        "Faculty",
        "Principal",
        "Admin",
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
