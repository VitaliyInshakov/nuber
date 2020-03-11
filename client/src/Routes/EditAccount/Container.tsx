import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/react-hooks";
import axios from "axios";

import { USER_PROFILE } from "../../sharedQueries";
import Presenter from "./Presenter";
import { UPDATE_PROFILE } from "./Queries";
import { updateProfile, updateProfileVariables, userProfile } from "../../types/api";

interface IState {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
    uploading: boolean;
}

const Container: React.FC<RouteComponentProps<any>> = () => {
    const [state, setState] = useState<IState>({
        email: "",
        firstName: "",
        lastName: "",
        profilePhoto: "",
        uploading: false,
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
        },
        fetchPolicy: "cache-and-network",
    });

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        const { target: { name, value, files } } = event;

        if (files) {
            setState(prevState => ({
                ...prevState,
                uploading: true,
            }));

            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("api_key", "286472851459921");
            formData.append("upload_preset", "n1pxeq2h");
            formData.append("timestamp", String(Date.now() / 1000));

            const { data: { secure_url } } = await axios.post(
                "https://api.cloudinary.com/v1_1/duzixnnqd/image/upload",
                formData
            );

            if (secure_url) {
                setState(prevState => ({
                    ...prevState,
                    uploading: false,
                    profilePhoto: secure_url,
                }));
            }
        }

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

    const { email, firstName, lastName, profilePhoto, uploading } = state;
    return (
        <Presenter
            email={email}
            firstName={firstName}
            lastName={lastName}
            profilePhoto={profilePhoto}
            onInputChange={onInputChange}
            loading={loading}
            onSubmit={updateProfileFn}
            uploading={uploading}
        />
    );
};

export default Container;