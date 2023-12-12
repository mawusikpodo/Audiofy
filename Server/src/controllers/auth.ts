import { RequestHandler } from "express";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";

import { CreateUser, VerifyEmailRequest } from "../@types/user";
import User from "../models/user";
import { formatProfile, generateToken } from "../utils/helper";
import {
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVerificationMail,
} from "../utils/mail";
import EmailVerification from "../models/emailVerification";
import { isValidObjectId } from "mongoose";
import PasswordResetToken from "../models/passwordResetToken";
import { RequestWithFiles } from "../middleware/fileParser";
import cloudinary from "../cloud";
import formidable from "formidable";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ name, email, password });

  //send verification email
  const token = generateToken();
  await EmailVerification.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerification.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const mathed = await verificationToken.compareToken(token);
  if (!mathed) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await EmailVerification.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request!" });

  await EmailVerification.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerification.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your email." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${process.env.PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({
    email: user.email,
    link: resetLink,
    name: user.name,
  });

  res.json({ message: "Check your registered email." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ validToken: "true" });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access" });

  const matched = await user.comparePassword(password);

  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  sendPassResetSuccessEmail(user.name, user.email);
  res.json({ message: "Password resets succesfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user) return res.status(403).json({ error: "Email/Password mismatch!" });

  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email/Password mismatch!" });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as Secret
  );
  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (req:RequestWithFiles, res) => {
  const { name } = req.body
  const avatar = req.files?.avatar as formidable.File

  const user = await User.findById(req.user.id)
  if(!user) throw new Error("something went wrong, user not found!")

  if(typeof name !=="string") return res.status(422).json({error: "Invalid name!"})

  if(name.trim().length < 3) return res.status(422).json({error: "Invalid name!"})

  user.name = name

  if(avatar) {
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId)
    }

   const {secure_url, public_id} = await cloudinary.uploader.upload(avatar.filepath, {
      width: 300,
      heigth: 300,
      crop: "thumb",
      gravity: "face"
    })

    user.avatar = { url: secure_url, publicId: public_id}
  }

  await user.save()
  res.json({profile: formatProfile(user)})
}

export const sendProfile: RequestHandler = async (req, res) => {
   res.json({
    profile: req.user,
  })
}

export const logOut: RequestHandler = async (req, res) => {
   const {fromAll} = req.query

   const token = req.token
   const user = await User.findById(req.user.id)
   if(!user) throw new Error("something went wrong, user not found!")

   if(fromAll === "yes") user.tokens = []
   else user.tokens = user.tokens.filter((t) => t !== token)
  
   await user.save()
   res.json({success: true})
}