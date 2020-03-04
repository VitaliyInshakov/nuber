import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import Presenter from "./Presenter";
import { VERIFY_PHONE } from "./Queries";
import { LOG_USER_IN} from "../../sharedQueries.local";
import { verifyPhone, verifyPhoneVariables } from "../../types/api";

interface IState {
    verificationKey: string;
    phoneNumber: string;
}

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    if (!props.location.state) {
        props.history.push("/");
    }

    const [state, setState] = useState<IState>({
        verificationKey: "",
        phoneNumber: (props.location.state! as any).phone,
    });

    const [mutation, { loading }] = useMutation<verifyPhone, verifyPhoneVariables>(VERIFY_PHONE, {
        variables: {
            key: state.verificationKey,
            phoneNumber: state.phoneNumber,
        },
        onCompleted: data => {
            const { CompletePhoneVerification } = data;

            if (CompletePhoneVerification.ok) {
                if (CompletePhoneVerification.token) {
                    logUserIn({
                        variables: {
                            token: CompletePhoneVerification.token,
                        },
                    });
                }
                toast.success("You're verified, loggin in now");
            } else {
                toast.error(CompletePhoneVerification.error);
            }
        },
    });

    const [logUserIn] = useMutation(LOG_USER_IN);

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        const {
            target: { name, value }
        } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return <Presenter
        verificationKey={state.verificationKey}
        onChange={onInputChange}
        onSubmit={mutation}
        loading={loading}
    />;
};

export default Container;