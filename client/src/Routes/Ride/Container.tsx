import React from "react";
import { RouteComponentProps } from "react-router-dom";

import Presenter from "./Presenter";

const Container: React.FC<RouteComponentProps<any>> = () => {
    return <Presenter />;
};

export default Container;