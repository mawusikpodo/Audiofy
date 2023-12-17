import nodemailer from "nodemailer";
import path from "path";

import EmailVerification from "../models/emailVerification";
import { generateTemplate } from "../mail/template";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { name, email, userId } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Audiofy! Please use the given OTP to verify your email`;

  transport.sendMail({
    to: email,
    from: process.env.VERIFICATION_EMAIL,
    subject: "Audiofy Welcome Message",
    html: generateTemplate({
      title: "Welcome to Audiofy",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/images/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.svg",
        path: path.join(__dirname, "../mail/images/welcome.svg"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  name: string;
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const { name, email, link } = options;

  const message = `Hi ${name},
  You've asked to reset your Audiofy password. Use the link below and create a new password`;

  transport.sendMail({
    to: email,
    from: process.env.VERIFICATION_EMAIL,
    subject: "Audiofy Reset Password Link",
    html: generateTemplate({
      title: "Foget Password",
      message: message,
      logo: "cid:logo",
      banner: "cid:password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/images/logo.png"),
        cid: "logo",
      },
      {
        filename: "password.svg",
        path: path.join(__dirname, "../mail/images/password.svg"),
        cid: "password",
      },
    ],
  });
};

export const sendPassResetSuccessEmail = async (name: string, email: string) => {
  const transport = generateMailTransporter();


  const message = `Hi ${name},
  we just updated your new password. You can now sign in with your new password`;

  transport.sendMail({
    to: email,
    from: process.env.VERIFICATION_EMAIL,
    subject: "Password Resets Successfully",
    html: generateTemplate({
      title: "Password Resets Successfully",
      message: message,
      logo: "cid:logo",
      banner: "cid:success",
      link: process.env.SIGN_IN_URL || "",
      btnTitle: "Sign In",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/images/logo.png"),
        cid: "logo",
      },
      {
        filename: "success.svg",
        path: path.join(__dirname, "../mail/images/success.svg"),
        cid: "success",
      },
    ],
  });
};
