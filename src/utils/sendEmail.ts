import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "",
  domain: "sandboxe6133e672eda4ebabc40c37ae1e640e1.mailgun.org",
});

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: "michael8913@gmail.com",
    to: "michael8913@gmail.com",
    subject,
    html,
  };

  return mailGunClient.messages().send(emailData);
}

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email!`;
  const emailBody = `Verify your email`;
  return sendEmail(emailSubject, emailBody);
}