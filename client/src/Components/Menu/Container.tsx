import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import { USER_PROFILE } from "../../sharedQueries";

import { userProfile, toggleDriving } from "../../types/api";
import Presenter from "./Presenter";
import { TOGGLE_DRIVING } from "./Queries";

const MenuContainer: React.FC = () => {
    const { loading, data } = useQuery<userProfile>(USER_PROFILE);
    const [toggleDrivingFn] = useMutation<toggleDriving>(TOGGLE_DRIVING, {
        update: (cache, { data }) => {
            if (data) {
                const { ToggleDrivingMode } = data;
                if(!ToggleDrivingMode.ok) {
                    toast.error(ToggleDrivingMode.error);
                    return;
                }

                const query: userProfile | null = cache.readQuery({
                    query: USER_PROFILE
                });

                if (query) {
                    const { GetMyProfile: { user }} = query;
                    if(user) {
                        user.isDriving = !user.isDriving;
                    }
                }

                cache.writeQuery({ query: USER_PROFILE, data: query });
            }
        },
    });

    return <Presenter loading={loading} data={data} toggleDrivingFn={toggleDrivingFn} />;
};

export default MenuContainer;