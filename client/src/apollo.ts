import ApolloClient, { Operation } from "apollo-boost";

const client = new ApolloClient({
    clientState: {
        defaults: {
            auth: {
                __typename: "Auth",
                isLoggedIn: Boolean(localStorage.getItem("jwt")),
            },
        },
        resolvers: {
            Mutation: {
                logUserIn: (parent, { token }, { cache }) => {
                    localStorage.setItem("jwt", token);
                    cache.writeData({
                        data: {
                            auth: {
                                __typename: "Auth",
                                isLoggedIn: true,
                            },
                        },
                    });
                    return null;
                },
                logUserOut: (parent, context, { cache }) => {
                    localStorage.removeItem("jwt");
                    cache.writeData({
                        data: {
                            auth: {
                                __typename: "Auth",
                                isLoggedIn: false,
                            },
                        },
                    });
                    return null;
                }
            }
        },
    },
    request: async(operation: Operation) => {
       operation.setContext({
           headers: {
               "X-JWT": localStorage.getItem("jwt") ||  "",
           },
       });
    },
    uri: "http://localhost:4000/graphql",
});

export default client;