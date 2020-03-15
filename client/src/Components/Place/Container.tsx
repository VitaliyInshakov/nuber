import React from "react";
import { useMutation } from "@apollo/react-hooks";

import { GET_PLACES } from "../../sharedQueries";
import Presenter from "./Presenter";
import { EDIT_PLACE } from "./Queries";
import {editPlace, editPlaceVariables} from "../../types/api";

interface IProps {
    fav: boolean;
    name: string;
    address: string;
    id: number;
}

const Container: React.FC<IProps> = ({
    id,
    fav,
    name,
    address,
}) => {
    const [editPlaceFn] = useMutation<editPlace, editPlaceVariables>(EDIT_PLACE, {
        variables: {
            isFavorite: !fav,
            placeId: id,
        },
        refetchQueries: [{ query: GET_PLACES }],
    });

    return (
        <Presenter
            fav={fav}
            name={name}
            address={address}
            onStartPress={editPlaceFn}
        />
    );
};

export default Container;