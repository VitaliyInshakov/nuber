import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";

import { addPlace, addPlaceVariables } from "../../types/api";
import { GET_PLACES } from "../../sharedQueries";
import { ADD_PLACE } from "./Queries";
import Presenter from "./Presenter";

interface IState {
    address: string;
    name: string;
    lat: number;
    lng: number;
}

const Container: React.FC<RouteComponentProps<any>> = (props) => {
    const { location: { state: locationState = {} } = {} } = props;
    const [state, setState] = useState<IState>({
        address: (locationState as any).address || "",
        name: "",
        lat: (locationState as any).lat || 0,
        lng: (locationState as any).lng || 0,
    });

    const [addPlaceFn, { loading }] = useMutation<addPlace, addPlaceVariables>(ADD_PLACE, {
        variables: {
            address: state.address,
            isFavorite: false,
            lat: state.lat,
            lng: state.lng,
            name: state.name,
        },
        refetchQueries: [{ query: GET_PLACES }],
        onCompleted: data => {
            const { AddPlace } = data;

            if (AddPlace.ok) {
                toast.success("Place added!");
                setTimeout(() => {
                    props.history.push("/places");
                }, 2000);
            } else {
                toast.error(AddPlace.error);
            }
        },
    });

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
        const { target: { name, value } } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Presenter
            onInputChange={onInputChange}
            address={state.address}
            name={state.name}
            loading={loading}
            onSubmit={addPlaceFn}
            pickedAddress={state.lat !== 0 && state.lng !== 0}
        />
    );
};

export default Container;