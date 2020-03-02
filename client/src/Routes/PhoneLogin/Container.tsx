import React, { useState } from "react";
import { toast } from "react-toastify";
import { RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import Presenter from "./Presenter";
import { PHONE_SIGN_IN } from "./Queries";
import { phoneVerification, phoneVerificationVariables } from "../../types/api";

interface IState {
    countryCode: string;
    phoneNumber: string;
}

const PhoneLoginContainer: React.FC<RouteComponentProps<any>> = (props) => {
    const [state, setState] = useState<IState>({
        countryCode: "+82",
        phoneNumber: "",
    });

    const [mutation, { loading }] = useMutation<phoneVerification, phoneVerificationVariables>(
        PHONE_SIGN_IN,
        {onCompleted: data => {
            const { PhoneVerification } = data;

            if (PhoneVerification.ok) {
                toast.success("SMS sent!");
                return;
            } else {
                toast.error(PhoneVerification.error);
            }
        }}
    );

    const onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { target: { name, value } } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const { countryCode, phoneNumber } = state;

        const phone = `${countryCode}${phoneNumber}`;
        const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);

        if (isValid) {
            mutation({ variables: { phoneNumber: phone } });
            props.history.push({
                pathname: "/verify-phone",
                state: {
                    phone,
                },
            });
        } else {
            toast.error("Please write a valid phone number");
        }
    };

    const { countryCode, phoneNumber } = state;
    return <Presenter
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        loading={loading}
    />;
};

export default PhoneLoginContainer;