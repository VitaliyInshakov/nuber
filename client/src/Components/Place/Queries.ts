import { gql } from "apollo-boost";

export const EDIT_PLACE = gql`
    mutation editPlace(
        $placeId: Int!
        $isFavorite: Boolean
    ) {
        EditPlace(
            placeId: $placeId
            isFavorite: $isFavorite
        ) {
            ok
            error
        }
    }
`;