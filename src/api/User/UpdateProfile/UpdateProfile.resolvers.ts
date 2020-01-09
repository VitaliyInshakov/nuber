import { Resolvers } from "src/types/resolvers";
import privateResolver from "src/utils/privateResolver";
import { UpdateProfileMutationArgs, UpdateProfileResponse } from "src/types/graph";
import User from "src/entities/User";

const resolvers: Resolvers = {
  Mutation: {
    UpdateProfile: privateResolver(async (
      parent, 
      args: UpdateProfileMutationArgs, 
      { req },
    ): Promise<UpdateProfileResponse> => {
      const user: User = req.user;
      const notNull = {};
      Object.keys(args).forEach(key => {
        if (args[key] !== null) {
          notNull[key] = args[key];
        }
      });
      
      try {
        if (args.password !== null) {
          user.password = args.password;
          user.save();
        }
        await User.update({ id: user.id }, { ...notNull });
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
    })
  }
}

export default resolvers;