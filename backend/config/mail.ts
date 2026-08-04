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
  //secure false, weil wir den Port 587 benutzen, der STARTTLS verwendet. Das bedeutet, dass die Verbindung zunächst unverschlüsselt ist und dann auf TLS umgestellt wird. Wenn wir den Port 465 verwenden würden, wäre secure true, da dieser Port für SMTPS (SMTP über SSL/TLS) reserviert ist. Aber STARTTLS ist heutzutage der empfohlene Weg, um E-Mails sicher zu versenden, da es flexibler ist und besser mit verschiedenen Mailservern funktioniert.
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
