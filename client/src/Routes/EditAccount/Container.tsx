import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks"

import Presenter from "./Presenter";
import { UPDATE_PROFILE } from "./Queries";
import { updateProfile, updateProfileVariables } from "../../types/api";

interface IState {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
}

const Container: React.FC<RouteComponentProps<any>> = () => {
    const [state, setState] = useState<IState>({
        email: "",
        firstName: "",
        lastName: "",
        profilePhoto: "",
    });

    const [updateProfileFn, { loading }] = useMutation<updateProfile, updateProfileVariables>(UPDATE_PROFILE, {
        variables: {
            email: state.email,
            firstName: state.firstName,
            lastName: state.lastName,
            profilePhoto: state.profilePhoto,
        }
    });

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { target: { name, value } } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const { email, firstName, lastName, profilePhoto } = state;

    return (
        <Presenter
            email={email}
            firstName={firstName}
            lastName={lastName}
            profilePhoto={profilePhoto}
            onInputChange={onInputChange}
            loading={loading}
            onSubmit={updateProfileFn}
        />
    );
};

export default Container;