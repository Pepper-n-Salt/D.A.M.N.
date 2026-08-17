import transporter from "../config/mail";

/*
    Wir definieren zunächst,
    welche Daten unser Service erwartet.
*/

export interface ContactMailData {
  name: string;
  email: string;
  message: string;
}

/*
    Diese Funktion kümmert sich
    ausschließlich um das Versenden
    einer Kontaktanfrage.

    Sie weiß nichts über Express,
    Requests oder Responses.
*/

export async function sendContactMail(data: ContactMailData) {
  const { name, email, message } = data;

  await transporter.sendMail({
    /*
            Die Mail wird von unserem
            Mailkonto verschickt.
        */

    from: process.env.SMTP_USER,

    /*
            Empfänger der Nachricht.
            Kann später einfach in der .env
            geändert werden.
        */

    to: process.env.CONTACT_EMAIL,

    /*
            Antwortet Melanie später
            auf die Mail,

            geht die Antwort direkt
            an den Besucher.
        */

    replyTo: email,

    subject: `Neue Kontaktanfrage von ${name}`,

    text: `
Name:
${name}

E-Mail:
${email}

Nachricht:
${message}
`,
  });
}
