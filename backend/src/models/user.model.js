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
    casualLeaves: { type: Object, default: 7 }, // { "1": 1.5, "2": 1.5, "3": 0 } (month-wise)
    specialLeaves: { type: Number, default: 8 }, // Total 8 per year
    halfPayLeaves: { type: Number, default: 5 }, // Total 5 per year
    earnedLeaves: { type: Number, default: 15 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
