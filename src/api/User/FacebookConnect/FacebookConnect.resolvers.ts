import { Resolvers } from "src/types/resolvers";
import User from "src/entities/User";
import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graph";

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (_, args: FacebookConnectMutationArgs): Promise<FacebookConnectResponse> => {
      const { fbId } = args;
      try {
        const existingUser = await User.findOne({ fbId });

        if(existingUser) {
          return {
            ok: true,
            error: null,
            token: "",
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      // if user is not exist, try create a new user
      try {
        await User.create({
          ...args, 
          profilePhoto: `https://graph.facebook.com/${fbId}/picture?type=square`
        }).save();

        return {
          ok: true,
          error: null,
          token: "",
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    }
  }
}

export default resolvers;