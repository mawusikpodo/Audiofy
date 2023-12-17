import { isVerified, mustAuth } from "../middleware/auth";
import fileParser from "../middleware/fileParser";
import { validate } from "../middleware/validator";
import { AudioValidationSchema } from "../utils/validationSchema";
import { Router } from "express";
import { createAudio, getLatestUpLoads, updateAudio } from "../controllers/audio";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
);
router.patch(
  "/:audioId",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  updateAudio
);
router.get("/latest", getLatestUpLoads)

export default router;
