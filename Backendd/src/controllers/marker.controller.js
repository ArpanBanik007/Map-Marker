import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ALLOWED_CATEGORIES, Marker } from "../models/marker.model.js";
import  asyncHandler  from "../utiles/asyncHandler.js";
import ApiError from "../utiles/ApiError.js"
import ApiResponse from "../utiles/ApiResponse.js";


// ✅ Create Marker
const createMarker = asyncHandler(async (req, res) => {
  const { title, description, latitude, longitude, category, tags } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "Authentication failed");

  // Input validation
  if (!title || typeof title !== "string") throw new ApiError(400, "Title is required");

  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) throw new ApiError(400, "Latitude must be a number between -90 and 90");

  if (
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) throw new ApiError(400, "Longitude must be a number between -180 and 180");

  if (tags && (!Array.isArray(tags) || !tags.every(t => typeof t === "string"))) {
    throw new ApiError(400, "Tags must be an array of strings");
  }

  const marker = await Marker.create({
    title,
    description,
    category,
    tags,
    latitude,           
    longitude,          
    location: {
      type: "Point",
      coordinates: [longitude, latitude]
    },
    user: req.user._id
  });
  

  return res
    .status(201)
    .json(new ApiResponse(201, marker, "Marker created successfully"));
});


// ✅ Get All Markers (own only)
const getAllMarkers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const markers = await Marker.find({ user: userId })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, markers, "All markers fetched"));
});


// ✅ Get Marker by ID
const getMarkerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid marker ID");
  }

  const marker = await Marker.findOne({ _id: id, user: userId }).select("-__v").lean();

  if (!marker) {
    throw new ApiError(404, "Marker not found or access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, marker, "Marker fetched successfully"));
});


// ✅ Update Marker
const updateMarker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { title, description, latitude, longitude, category, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid marker ID");
  }

  const updateData = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      throw new ApiError(400, "Title must be a non‑empty string");
    }
    updateData.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string" || description.trim() === "") {
      throw new ApiError(400, "Description must be a non‑empty string");
    }
    updateData.description = description.trim();
  }

  if (latitude !== undefined) {
    if (
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new ApiError(400, "Latitude must be a number between -90 and 90");
    }
    updateData.latitude = latitude;
  }

  if (longitude !== undefined) {
    if (
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new ApiError(400, "Longitude must be a number between -180 and 180");
    }
    updateData.longitude = longitude;
  }

  if (category !== undefined) {
    if (typeof category !== "string" || category.trim() === "") {
      throw new ApiError(400, "Category must be a non‑empty string");
    }
    updateData.category = category.trim();
  }

  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      !tags.every((t) => typeof t === "string" && t.length <= 30)
    ) {
      throw new ApiError(
        400,
        "Tags must be an array of strings (≤ 30 chars each)"
      );
    }
    updateData.tags = tags;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No updatable field was provided");
  }

  const updated = await Marker.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, "Marker not found or you don't own it");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Marker updated successfully"));
});


// ✅ Delete Marker
const deleteMarker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid marker ID");
  }

  const deleted = await Marker.findOneAndDelete({ _id: id, user: userId });

  if (!deleted) {
    throw new ApiError(404, "Marker not found or you don't own it");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Marker deleted successfully"));
});




const searchMarkers= asyncHandler(async (req, res) => {
  
  const { category, keyword, latitude, longitude, radius, page = "1", limit = "10" } = req.query;

  if (category) {                       
    const cat = category.toLowerCase().trim();          
    if (!ALLOWED_CATEGORIES.includes(cat)) {  
      throw new ApiError(400, "Invalid category value"); 
    }
  }
  

  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) throw new ApiError(400, "Latitude must be a number between -90 and 90");

  if (
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) throw new ApiError(400, "Longitude must be a number between -180 and 180");

  if (
    keyword !== undefined &&
    (typeof keyword !== "string" || keyword.trim() === "")
  ) {
    throw new ApiError(400, "Keyword must be a non-empty string");
  }

  /* 3️⃣ Parse geo params to Numbers ----------------------------------- */
  const hasLatLngRadius =
    latitude !== undefined ||
    longitude !== undefined ||
    radius !== undefined;

  if (hasLatLngRadius) {
    // convert
    latitude  = Number(latitude);
    longitude = Number(longitude);
    radius    = radius !== undefined ? Number(radius) : NaN;

    // validate
    if (
      Number.isNaN(latitude)  || latitude  < -90  || latitude  > 90  ||
      Number.isNaN(longitude) || longitude < -180 || longitude > 180 ||
      Number.isNaN(radius)    || radius <= 0
    ) {
      throw new ApiError(400, "lat, lng must be valid numbers; radius > 0");
    }
  }



  /* 5️⃣ Pagination validation ------------------------------------------ */
  page  = Number(page);
  limit = Number(limit);

  if (
    Number.isNaN(page)  || Number.isNaN(limit) ||
    page <= 0          || limit <= 0          || limit > 10
  ) {
    throw new ApiError(400, "page must be ≥1 and limit 1-1s0");
  }

 /* 6️⃣ Build Mongo query object --------------------------------------- */
 const query = { user: req.user._id };           // always scope to owner

 if (category) query.category = category;

 if (keyword) {
  const kw = keyword.trim();
  query.$or = [
    { title:       { $regex: kw, $options: "i" } },
    { description: { $regex: kw, $options: "i" } },
  ];
}

if (hasLatLngRadius) {
  query.location = {
    $near: {
      $geometry    : { type: "Point", coordinates: [longitude, latitude] },
      $maxDistance : radius,
    },
  };
}

const skip = (page - 1) * limit;



const [markers, total] = await Promise.all([
  Marker.find(query)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
  Marker.countDocuments(query),
]);




/* 8️⃣ Send uniform success response --------------------------------- */
return res
  .status(200)
  .json(
    new ApiResponse(200, markers, "Markers fetched successfully", {
      page,
      limit,
      total,
    }),
  );


})






export {
  createMarker,
  getAllMarkers,
  getMarkerById,
  updateMarker,
  deleteMarker,
  searchMarkers
};
