import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { LOG_USER_OUT } from "../../sharedQueries.local";
import { USER_PROFILE, GET_PLACES } from "../../sharedQueries";
import { getPlaces, userProfile } from "../../types/api";
import Presenter from "./Presenter";

const Container: React.FC = () => {
    const [logUserOut] = useMutation(LOG_USER_OUT);
    const { loading: userDataLoading, data: userData } = useQuery<userProfile>(USER_PROFILE);
    const { loading: placesLoading, data: placesData } = useQuery<getPlaces>(GET_PLACES);

    return (
        <Presenter
            logUserOut={logUserOut}
            userDataLoading={userDataLoading}
            placesLoading={placesLoading}
            userData={userData}
            placesData={placesData}
        />
    );
};

export default Container;