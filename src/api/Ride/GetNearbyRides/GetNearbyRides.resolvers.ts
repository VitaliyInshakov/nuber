import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { GetNearbyRidesResponse } from "../../../types/graph";
import {Between, getRepository} from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetNearbyRides: privateResolver(async(parent, args, { req }): Promise<GetNearbyRidesResponse> => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;
            try {
                const rides = await getRepository(Ride).find({
                    status: "REQUESTING",
                    pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                    pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
                });
                return {
                    ok: true,
                    error: null,
                    rides,
                };
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    rides: null,
                };
            }
        })
    }
};

export default resolvers;