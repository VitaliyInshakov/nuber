import axios from "axios";
import { toast } from "react-toastify";
import { MAPS_KEY } from "./keys";

export const geoCode = () => null;

export const reverseGeoCode = async(lat: number, lng: number) => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`;
    const { data } = await axios(URL);
    if (!data.error_message) {
        const { results } = data;
        const firstPlace = results[0];
        return firstPlace.formatted_address;
    } else {
        toast.error(data.error_message);
    }
};