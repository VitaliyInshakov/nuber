import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        DriversSubscription: {
            subscribe: withFilter(
                (_, __, { pubsub }) => pubsub.asyncIterator("driverUpdate"),
                (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        DriversSubscription: {
                            lastLat: driverLastLat,
                            lastLng: driverLastLng,
                        }
                    } = payload;

                    const { lastLng: userLastLng, lastLat: userLastLat } = user;
                    return (
                        driverLastLat >= userLastLat - 0.05
                        && driverLastLat <= userLastLat + 0.05
                        && driverLastLng >= userLastLng - 0.05
                        &&driverLastLng <= userLastLng + 0.05
                    )
                },
            ),
        }
    }
};

export default resolvers;