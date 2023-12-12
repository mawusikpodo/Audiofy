import { mustAuth } from "../middleware/auth";
import { validate } from "../middleware/validator";
import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "../utils/validationSchema";
import { Router } from "express";
import { createPlaylist, getAudios, getPlaylistByProfle, removePlaylist, updatePlaylist } from "../controllers/playlist";

const router = Router();

router.post(
  "/create",
  mustAuth,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);
router.patch(
  "/",
  mustAuth,
  validate(OldPlaylistValidationSchema),
  updatePlaylist
);
router.delete('/', mustAuth, removePlaylist)
router.get('/by-profile', mustAuth, getPlaylistByProfle)
router.get('/:playlistId', mustAuth, getAudios)

export default router;
