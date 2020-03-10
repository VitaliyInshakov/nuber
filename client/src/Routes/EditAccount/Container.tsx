import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/react-hooks"

import { USER_PROFILE } from "../../sharedQueries";
import Presenter from "./Presenter";
import { UPDATE_PROFILE } from "./Queries";
import { updateProfile, updateProfileVariables, userProfile } from "../../types/api";

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

    useQuery<userProfile>(USER_PROFILE, {
        onCompleted: data => updateFields(data),
    });
    const [updateProfileFn, { loading }] = useMutation<updateProfile, updateProfileVariables>(UPDATE_PROFILE, {
        variables: {
            email: state.email,
            firstName: state.firstName,
            lastName: state.lastName,
            profilePhoto: state.profilePhoto,
        },
        refetchQueries: [{ query: USER_PROFILE }],
        onCompleted: data => {
            const { UpdateProfile } = data;
            if (UpdateProfile!.ok) {
                toast.success("Profile updated!");
            } else if (UpdateProfile!.error) {
                toast.error(UpdateProfile!.error);
            }
        }
    });

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const { target: { name, value } } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const updateFields = (data: {} | userProfile) => {
        if ("GetMyProfile" in data) {
            const { GetMyProfile: { user } } = data;

            if (user !== null) {
                const { firstName, lastName, email, profilePhoto } = user;
                setState(prevState => ({
                    ...prevState,
                    email,
                    firstName,
                    lastName,
                    profilePhoto,
                } as any));
            }
        }
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