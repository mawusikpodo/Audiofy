"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const validator_1 = require("../middleware/validator");
const validationSchema_1 = require("../utils/validationSchema");
const express_1 = require("express");
const playlist_1 = require("../controllers/playlist");
const router = (0, express_1.Router)();
router.post("/create", auth_1.mustAuth, (0, validator_1.validate)(validationSchema_1.NewPlaylistValidationSchema), playlist_1.createPlaylist);
router.patch("/", auth_1.mustAuth, (0, validator_1.validate)(validationSchema_1.OldPlaylistValidationSchema), playlist_1.updatePlaylist);
router.delete('/', auth_1.mustAuth, playlist_1.removePlaylist);
router.get('/by-profile', auth_1.mustAuth, playlist_1.getPlaylistByProfle);
router.get('/:playlistId', auth_1.mustAuth, playlist_1.getAudios);
exports.default = router;