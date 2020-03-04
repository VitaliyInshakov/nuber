import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";

import Presenter from "./Presenter";

interface IState {
    isMenuOpen: boolean;
}

const Container: React.FC<RouteComponentProps<any>> = () => {
    const [state, setState] = useState<IState>({ isMenuOpen: false });

    const toggleMenu = (): void => {
        setState({
            isMenuOpen: !state.isMenuOpen,
        });
    };

    return <Presenter isMenuOpen={state.isMenuOpen} toggleMenu={toggleMenu}/>;
};

export default Container;