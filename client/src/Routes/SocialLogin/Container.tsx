import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/react-hooks";

import { LOG_USER_IN } from "../../sharedQueries.local";
import Presenter from "./Presenter";
import { FACEBOOK_CONNECT } from "./Queries";
import { facebookConnect, facebookConnectVariables } from "../../types/api";

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    const [facebookMutation] = useMutation<facebookConnect, facebookConnectVariables>(FACEBOOK_CONNECT, {
        onCompleted: data => {
            const { FacebookConnect } = data;

            if (FacebookConnect.ok) {
                logUserIn({
                    variables: {
                        token: FacebookConnect.token,
                    },
                });
            } else {
                toast.error(FacebookConnect.error);
            }
        },
    });
    const [logUserIn] = useMutation(LOG_USER_IN);

    const loginCallback = (response) => {
        const { name, first_name, last_name, email, id, accessToken } = response;
        if(accessToken) {
            toast.success(`Welcome ${name}!`);

            facebookMutation({
                variables: {
                    email,
                    fbId: id,
                    firstName: first_name,
                    lastName: last_name,
                },
            });
        } else {
            toast.error("Could not log you in 😔");
        }
    };

    return <Presenter loginCallback={loginCallback}/>;
};

export default Container;