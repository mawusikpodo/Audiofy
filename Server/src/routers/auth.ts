import { isValidPassResetToken, mustAuth } from "../middleware/auth";
import { create, generateForgetPasswordLink, grantValid, logOut, sendProfile, sendReVerificationToken, signIn, updatePassword, updateProfile, verifyEmail } from "../controllers/auth";
import { validate } from "../middleware/validator";
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, UpdatePasswordSchema } from "../utils/validationSchema";
import { Router } from "express";

import fileParser from "../middleware/fileParser";

const router = Router();

router.post(
  "/create",
  validate(CreateUserSchema),
  create
);

router.post(
  "/verify-email",
  validate(TokenAndIDValidation),
  verifyEmail
);

router.post(
  "/re-verify-email",
 sendReVerificationToken
);

router.post(
  "/forget-password",
 generateForgetPasswordLink
);

router.post(
  "/verify-pass-reset-token", 
  validate(TokenAndIDValidation),
 isValidPassResetToken,
 grantValid
);

router.post(
  "/update-password", 
  validate(UpdatePasswordSchema),
 isValidPassResetToken,
 updatePassword
);

router.post(
  "/sign-in", 
  validate(SignInValidationSchema),
 signIn
);

router.get("/is-auth", mustAuth, sendProfile)

router.get("/public", (req, res) => {

  res.json({
    message: "You are in public route",
  })
})

router.get("/private", mustAuth, (req, res) => {

  res.json({
    message: "You are in private route",
  })
})

router.post('/update-profile', mustAuth, fileParser, updateProfile)
  
router.post("/log-out", mustAuth, logOut)

export default router;
