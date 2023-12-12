import { isVerified, mustAuth } from "../middleware/auth";
import fileParser from "../middleware/fileParser";
import { validate } from "../middleware/validator";
import { AudioValidationSchema } from "../utils/validationSchema";
import { Router } from "express";
import { createAudio, getLatestUpLoads, updateAudio } from "../controllers/audio";

const router = Router();

/**
 * @openapi
 * /audio/create:
 *   post:
 *     tags:
 *       - Audio
 *     summary: Add audio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AudioInput'  // Adjust this based on your schema definition
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audio'  // Adjust this based on your response schema definition
 */
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
