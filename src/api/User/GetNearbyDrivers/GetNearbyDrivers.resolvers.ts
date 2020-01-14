import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { GetNearbyDriversResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { Between } from "typeorm";

const resolvers: Resolvers = {
    Query: {
        GetNearbyDrivers: privateResolver(async (
            parent,
            args,
            { req },
        ): GetNearbyDriversResponse => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;
            try {
                const drivers: User[] = await User.find({
                    isDriving: true,
                    lastLat: Between(lastLat - 0.05, lastLat + 0.05),
                    lastLng: Between(lastLng - 0.05, lastLng + 0.05),
                });
                return {
                    ok: true,
                    error: null,
                    drivers,
                };
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    drivers: null,
                };
            }
        })
    }
};

export default resolvers;