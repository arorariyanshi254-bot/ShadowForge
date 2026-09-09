import express from "express";
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    saveFaultConfig,
    getProjectStats,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getProjects).post(createProject);
router.get("/stats", getProjectStats);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);
router.put("/:id/faults", saveFaultConfig);

export default router;
