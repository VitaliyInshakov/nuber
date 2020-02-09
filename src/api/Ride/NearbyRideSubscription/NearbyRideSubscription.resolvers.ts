import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        NearbyRideSubscription: {
            subscribe: withFilter(
                (_, __, { pubsub }) => pubsub.asyncIterator("rideRequest"),
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        NearbyRideSubscription: {
                            pickUpLat,
                            pickUpLng,
                        }
                    } = payload;

                    const { lastLng: userLastLng, lastLat: userLastLat } = user;
                    return (
                        pickUpLat >= userLastLat - 0.05
                        && pickUpLat <= userLastLat + 0.05
                        && pickUpLng >= userLastLng - 0.05
                        && pickUpLng <= userLastLng + 0.05
                    )
                },
            )
        }
    }
};

export default resolvers;