import { Router } from "express";
import { verifyJWT } from "../middlewires/auth.middlewire.js";
import {
  createMarker,
  deleteMarker,
  getAllMarkers,
  getMarkerById,
  searchMarkers,
  updateMarker
} from "../controllers/marker.controller.js";

const router = Router();

// Base routes: /api/markers
router.route("/")
  .post(verifyJWT, createMarker)
  .get(verifyJWT, getAllMarkers);

// Single marker actions
router.route("/:id")
  .get(verifyJWT, getMarkerById)
  .put(verifyJWT, updateMarker)
  .delete(verifyJWT, deleteMarker);

// Search
router.get("/search", verifyJWT, searchMarkers);

export default router;