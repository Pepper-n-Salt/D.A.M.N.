import type { Request, Response } from "express";

import { sendContactMail } from "../services/mailService";

export async function sendContactForm(
  req: Request,

  res: Response
) {
  try {
    const { name, email, message } = req.body;

    await sendContactMail({
      name,

      email,

      message,
    });

    return res.status(200).json({
      success: true,

      message: "Message has been sent.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Error occurred while sending the message.",
    });
  }
}
