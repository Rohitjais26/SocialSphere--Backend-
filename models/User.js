const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    socialAccounts: {
      // NEW MOCK PLATFORM: INSTACLONE
      instaclone: {
        accessToken: String,
        userId: String, // This will be a mock user ID
        username: String, // For display purposes
        isConnected: {
            type: Boolean,
            default: false,
        }
      },
      facebook: {
        accessToken: String,
        userId: String,
      },
      twitter: {
        accessToken: String,
        userId: String,
      },
      linkedin: {
        accessToken: String,
        userId: String,
      },
    },
  },
  { timestamps: true }
);

// Encrypt password before saving (REMOVED HOOK - HASHING IS NOW HANDLED BY THE CONTROLLER)
/*
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try { 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Bcrypt pre-save middleware failed:", error);
    next(error); 
  }
});
*/

// Match entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);