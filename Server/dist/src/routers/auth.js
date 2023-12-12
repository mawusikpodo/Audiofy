"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const auth_2 = require("../controllers/auth");
const validator_1 = require("../middleware/validator");
const validationSchema_1 = require("../utils/validationSchema");
const express_1 = require("express");
const fileParser_1 = __importDefault(require("../middleware/fileParser"));
const router = (0, express_1.Router)();
router.post("/create", (0, validator_1.validate)(validationSchema_1.CreateUserSchema), auth_2.create);
router.post("/verify-email", (0, validator_1.validate)(validationSchema_1.TokenAndIDValidation), auth_2.verifyEmail);
router.post("/re-verify-email", auth_2.sendReVerificationToken);
router.post("/forget-password", auth_2.generateForgetPasswordLink);
router.post("/verify-pass-reset-token", (0, validator_1.validate)(validationSchema_1.TokenAndIDValidation), auth_1.isValidPassResetToken, auth_2.grantValid);
router.post("/update-password", (0, validator_1.validate)(validationSchema_1.UpdatePasswordSchema), auth_1.isValidPassResetToken, auth_2.updatePassword);
router.post("/sign-in", (0, validator_1.validate)(validationSchema_1.SignInValidationSchema), auth_2.signIn);
router.get("/is-auth", auth_1.mustAuth, auth_2.sendProfile);
router.get("/public", (req, res) => {
    res.json({
        message: "You are in public route",
    });
});
router.get("/private", auth_1.mustAuth, (req, res) => {
    res.json({
        message: "You are in private route",
    });
});
router.post('/update-profile', auth_1.mustAuth, fileParser_1.default, auth_2.updateProfile);
router.post("/log-out", auth_1.mustAuth, auth_2.logOut);
exports.default = router;
