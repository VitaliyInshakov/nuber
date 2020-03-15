import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { getPlaces } from "../../types/api";
import { GET_PLACES } from "../../sharedQueries";
import Presenter from "./Presenter";

const Container: React.FC = () => {
    const { loading, data } = useQuery<getPlaces>(GET_PLACES);

    return (
        <Presenter
            data={data}
            loading={loading}
        />
    );
};

export default Container;