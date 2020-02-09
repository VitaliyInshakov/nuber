import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { GetNearbyRideResponse } from "../../../types/graph";
import {Between, getRepository} from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetNearbyRide: privateResolver(async(parent, args, { req }): Promise<GetNearbyRideResponse> => {
            const user: User = req.user;
            const { lastLat, lastLng } = user;
            try {
                const ride = await getRepository(Ride).findOne({
                    status: "REQUESTING",
                    pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                    pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
                });
                if (ride) {
                    return {
                        ok: true,
                        error: null,
                        ride,
                    };
                } else {
                    return {
                        ok: true,
                        error: null,
                        ride: null,
                    };
                }
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    ride: null,
                };
            }
        })
    }
};

export default resolvers;