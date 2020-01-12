import { Resolvers } from "src/types/resolvers";
import privateResolver from "src/utils/privateResolver";
import { ReportMovementMutationArgs, ReportMovementResponse } from "src/types/graph";
import User from "src/entities/User";
import cleanNullArgs from "src/utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(async (
      parent,
      args: ReportMovementMutationArgs,
      { req },
    ): Promise<ReportMovementResponse> => {
      const user: User = req.user;
      const notNull = cleanNullArgs(args);

      try {
        await User.update({id: user.id}, {...notNull});
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
};

export default resolvers;