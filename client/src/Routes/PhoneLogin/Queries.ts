import { gql } from "apollo-boost";

export const PHONE_SIGN_IN = gql`
    mutation phoneVerification($phoneNumber: String!) {
        PhoneVerification(phoneNumber: $phoneNumber) {
            ok
            error
        }
    }
`;