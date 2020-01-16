const resolvers = {
    Subscription: {
        DriversSubscription: {
            subscribe: (_, __, { pubsub }) => {
                return pubsub.asyncIterator("driverUpdate")
            }
        }
    }
};

export default resolvers;