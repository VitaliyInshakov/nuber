import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";
import Presenter from "./Presenter";

const MenuContainer: React.FC = () => {
    const { loading, data } = useQuery<userProfile>(USER_PROFILE);
    return <Presenter loading={loading} data={data} />;
};

export default MenuContainer;