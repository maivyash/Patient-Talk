const mongoose = require("mongoose");

const HOSPITAL_DETAILS_Schema = new mongoose.Schema(
  {
    hospital_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    hospital_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    hospital_phno: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },

    hospital_password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    User_role: {
      type: boolean,
      required: true,
      select: true,
    },

    hospital_logo: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String, // image/png, image/jpeg, image/webp, etc.
        required: true,
      },
    },
  },
  { timestamps: true, collection: "HOSPITAL_DETAILS" }
);

module.exports = mongoose.model("HOSPITAL_DETAILS", HOSPITAL_DETAILS_Schema);