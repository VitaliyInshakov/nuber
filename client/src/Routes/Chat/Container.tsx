import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";

import { USER_PROFILE } from "../../sharedQueries";
import { getChat, getChatVariables, userProfile } from "../../types/api";

import Presenter from "./Presenter";
import {GET_CHAT} from "./Queries";

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    if (!props.match.params.chatId) {
        props.history.push("/");
    }

    const { data: userData } = useQuery<userProfile>(USER_PROFILE);
    const { data, loading } = useQuery<getChat, getChatVariables>(GET_CHAT);

    return <Presenter
        data={data}
        loading={loading}
        userData={userData}
    />;
};

export default Container;