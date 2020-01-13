import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {GetMyPlacesResponse} from "../../../types/graph";
import User from "../../../entities/User";

const resolvers: Resolvers = {
    Query: {
        GetMyPlaces: privateResolver(async (
            parent,
            args,
            { req },
        ): Promise<GetMyPlacesResponse> => {
            try {
                const user = await User.findOne({ id: req.user.id }, { relations: ["places"]});

                if (user) {
                    return {
                        ok: true,
                        error: null,
                        places: user.places,
                    };
                } else {
                    return {
                        ok: false,
                        error: "User not found",
                        places: null,
                    };
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    places: null,
                };
            }
        })
    }
};

export default resolvers;