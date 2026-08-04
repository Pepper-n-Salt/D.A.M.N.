import nodemailer from "nodemailer";

/*
    Hier erstellen wir den sogenannten "Transporter".

    Der Transporter ist die Verbindung
    zwischen unserer Anwendung
    und dem Mailserver.
*/

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/*
    Wir exportieren den Transporter,
    damit ihn andere Dateien benutzen können.
*/

export default transporter;
