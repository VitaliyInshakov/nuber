import { Resolvers } from "src/types/resolvers";
import { PhoneVerificationMutationArgs, PhoneVerificationResponse } from "src/types/graph";
import Verification from "src/entities/Verification";
import { SendVerificationSMS } from "src/utils/sendSMS";

const resolvers:  Resolvers = {
  Mutation: {
    PhoneVerification: async (_, args: PhoneVerificationMutationArgs): Promise<PhoneVerificationResponse> => {
      const { phoneNumber } = args;
      try {
        const existVerification = await Verification.findOne({payload: phoneNumber});
        if (existVerification) {
          existVerification.remove();
        }

        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: "PHONE",
        }).save();
        await SendVerificationSMS(newVerification.payload, newVerification.key);
        return {
          ok: true,
          error: null,
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
        };
      }
    }
  }
}

export default resolvers;