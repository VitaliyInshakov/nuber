import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const SendVerificationSMS = (to: string, key: string) => {
  SendSMS(to, `Your verification key is: ${key}`);
}

export const SendSMS = (to: string, body: string): Promise<any> => {
  return twilioClient.messages.create({
    body, 
    to,
    from: process.env.TWILIO_PHONE,
  });
}
