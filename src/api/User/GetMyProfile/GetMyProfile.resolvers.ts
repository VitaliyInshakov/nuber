import { Resolvers } from "src/types/resolvers";
import authResolver from "src/utils/authResolver";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: authResolver(async (_, args, { req }) => {
      const { user } = req;
      return {
        ok: true,
        error: null,
        user,
      };
    })
  }
}

export default resolvers;