import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { SubscribeToMoreOptions } from "apollo-client";

import { USER_PROFILE } from "../../sharedQueries";
import { getRide, getRideVariables, updateRide, updateRideVariables, userProfile } from "../../types/api";

import Presenter from "./Presenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./Queries";

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    if (!props.match.params.rideId) {
        props.history.push("/");
    }

    const { data, loading, subscribeToMore } = useQuery<getRide, getRideVariables>(GET_RIDE, {
        variables: {
            rideId: props.match.params.rideId,
        },
    });

    const subscribeOptions: SubscribeToMoreOptions = {
        document: RIDE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
                return prev;
            }
            console.log(prev, subscriptionData);
        }
    };

    subscribeToMore(subscribeOptions);

    const { data: userData } = useQuery<userProfile>(USER_PROFILE);

    const [updateRideFn] = useMutation<updateRide, updateRideVariables>(UPDATE_RIDE_STATUS, {
        refetchQueries: [{ query: GET_RIDE }],
    });

    return <Presenter
        userData={userData}
        loading={loading}
        data={data}
        updateRideFn={updateRideFn}
    />;
};

export default Container;