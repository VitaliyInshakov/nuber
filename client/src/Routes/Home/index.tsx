import { GoogleApiWrapper } from "google-maps-react";

import { MAPS_KEY } from "../../keys";
import Container from "./Container";

export default GoogleApiWrapper({
    apiKey: MAPS_KEY,
})(Container);