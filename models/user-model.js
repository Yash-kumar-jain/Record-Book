const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long."],
    maxlength: [50, "Username cannot be more than 50 characters long."],
  },
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
    minlength: [1, "Name must be at least 1 character long."],
    maxlength: [100, "Name cannot be more than 100 characters long."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [1, "Password must be at least 8 characters long."],
    select: false,
  },
  hisaabs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hisaab"
    },
  ],
  profilePicture:Buffer,
});

module.exports = mongoose.model("user", userSchema);
