import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Presenter from "./Presenter";

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    if (!props.match.params.chatId) {
        props.history.push("/");
    }

    return <Presenter />;
};

export default Container;