import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";
import Presenter from "./Presenter";

interface IState {
    isMenuOpen: boolean;
}

const Container: React.FC<RouteComponentProps<any>> = () => {
    const [state, setState] = useState<IState>({ isMenuOpen: false });

    const { loading } = useQuery<userProfile>(USER_PROFILE);

    const toggleMenu = (): void => {
        setState({
            isMenuOpen: !state.isMenuOpen,
        });
    };

    return <Presenter
        isMenuOpen={state.isMenuOpen}
        toggleMenu={toggleMenu}
        loading={loading}
    />;
};

export default Container;