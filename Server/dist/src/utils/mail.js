"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPassResetSuccessEmail = exports.sendForgetPasswordLink = exports.sendVerificationMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const template_1 = require("../mail/template");
const generateMailTransporter = () => {
    const transport = nodemailer_1.default.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });
    return transport;
};
const sendVerificationMail = (token, profile) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = generateMailTransporter();
    const { name, email, userId } = profile;
    const welcomeMessage = `Hi ${name}, welcome to Audiofy! Please use the given OTP to verify your email`;
    transport.sendMail({
        to: email,
        from: process.env.VERIFICATION_EMAIL,
        subject: "Audiofy Welcome Message",
        html: (0, template_1.generateTemplate)({
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
                path: path_1.default.join(__dirname, "../mail/logo.png"),
                cid: "logo",
            },
            {
                filename: "welcome.svg",
                path: path_1.default.join(__dirname, "../mail/welcome.svg"),
                cid: "welcome",
            },
        ],
    });
});
exports.sendVerificationMail = sendVerificationMail;
const sendForgetPasswordLink = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = generateMailTransporter();
    const { name, email, link } = options;
    const message = `Hi ${name},
  You've asked to reset your Audiofy password. Use the link below and create a new password`;
    transport.sendMail({
        to: email,
        from: process.env.VERIFICATION_EMAIL,
        subject: "Audiofy Reset Password Link",
        html: (0, template_1.generateTemplate)({
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
                path: path_1.default.join(__dirname, "../mail/logo.png"),
                cid: "logo",
            },
            {
                filename: "password.svg",
                path: path_1.default.join(__dirname, "../mail/password.svg"),
                cid: "password",
            },
        ],
    });
});
exports.sendForgetPasswordLink = sendForgetPasswordLink;
const sendPassResetSuccessEmail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = generateMailTransporter();
    const message = `Hi ${name},
  we just updated your new password. You can now sign in with your new password`;
    transport.sendMail({
        to: email,
        from: process.env.VERIFICATION_EMAIL,
        subject: "Password Resets Successfully",
        html: (0, template_1.generateTemplate)({
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
                path: path_1.default.join(__dirname, "../mail/logo.png"),
                cid: "logo",
            },
            {
                filename: "success.svg",
                path: path_1.default.join(__dirname, "../mail/success.svg"),
                cid: "success",
            },
        ],
    });
});
exports.sendPassResetSuccessEmail = sendPassResetSuccessEmail;
