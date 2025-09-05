import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { env } from "../config/config";

interface IOptions {
  mailGen: Mailgen.Content;
  fromSender: string;
  toReceiver: string;
  subject: string;
}

export const customeEmailSender = async (options: IOptions) => {

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Inkwell",
      link: "http://localhost:5173",
    },
  });

  const htmlEmail = mailGenerator.generate(options.mailGen);
  const plainEmailText = mailGenerator.generatePlaintext(options.mailGen);

  const transporter = nodemailer.createTransport({
    host: env.MAIL_TRAP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: env.MAIL_TRAP_USERNAME,
      pass: env.MAIL_TRAP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: options.fromSender,
    to: options.toReceiver,
    subject: options.subject,
    text: plainEmailText,
    html: htmlEmail,
  });
};

export const customEmailVerificationSender = (
  username: string,
  url: string,
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to my website! We're very excited to have you on board.",
      action: {
        instructions: "To get started with website, please click here:",
        button: {
          color: "#22BC66",
          text: "Verify your account",
          link: url,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};


export const customForgetPasswordSender = (
  username: string,
  url: string,
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to my website! We're very excited to have you on board.",
      action: {
        instructions: "To get started with website, please click here:",
        button: {
          color: "#22BC66",
          text: "Reset your password",
          link: url,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
