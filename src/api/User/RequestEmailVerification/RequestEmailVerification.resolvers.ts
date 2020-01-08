import { Resolvers } from "src/types/resolvers";
import Verification from "src/entities/Verification";
import User from "src/entities/User";
import { sendVerificationEmail } from "src/utils/sendEmail";
import privateResolver from "src/utils/privateResolver";
import { RequestEmailVerificationResponse } from "src/types/graph";

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(async (parent, args, { req }): Promise<RequestEmailVerificationResponse> => {
      const user: User = req.user;
      if (user.email) {
        try {
          const oldVerification = await Verification.findOne({payload: user.email});
          if (oldVerification) {
            oldVerification.remove();
          }

          const newVerification = await Verification.create({
            payload: user.email,
            target: "EMAIL",
          }).save();

          await sendVerificationEmail(user.fullName, newVerification.key);
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
      } else {
        return {
          ok: false,
          error: "Your user has no email",
        };
      }
    })
  }
}

export default resolvers;