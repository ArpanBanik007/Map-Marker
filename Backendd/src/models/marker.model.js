import mongoose, { Schema } from "mongoose";
 

export const ALLOWED_CATEGORIES = [
  "restaurant",
  "park",
  "event",
  "hospital",
  "shop",
  "other",
];




const markerSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },

  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
    validate: {
      validator: (value) => value >= -90 && value <= 90,
      message: "Latitude must be between -90 and 90 degrees",
    },
  },

  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
    validate: {
      validator: (value) => value >= -180 && value <= 180,
      message: "Longitude must be between -180 and 180 degrees",
    },
  },

  // ✅ Location for geo queries
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  category: {
    type: String,
    enum: ALLOWED_CATEGORIES,
    default: "other",
  },

  tags: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.every(tag => typeof tag === 'string' && tag.length <= 30);
      },
      message: "All tags must be strings and ≤30 characters",
    },
    default: [],
  },
}, {
  timestamps: true
});

// 🌍 Geo index
markerSchema.index({ location: "2dsphere" });


export const Marker= mongoose.model("Marker",markerSchema)