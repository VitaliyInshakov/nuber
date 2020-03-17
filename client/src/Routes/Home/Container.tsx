import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import { USER_PROFILE } from "../../sharedQueries";
import { userProfile } from "../../types/api";
import { geoCode } from "../../mapHelpers";
import Presenter from "./Presenter";

interface IState {
    isMenuOpen: boolean;
    lat: number;
    lng: number;
    toAddress: string;
    toLat: number;
    toLng: number;
    distance?: string;
    duration?: string;
    price?: string;
}

interface IProps extends RouteComponentProps<any> {
    google: any;
}

const Container: React.FC<IProps> = (props) => {
    const [state, setState] = useState<IState>({
        lat: 0,
        lng: 0,
        isMenuOpen: false,
        toAddress: "",
        toLat: 0,
        toLng: 0,
    });
    const mapRef = useRef(null);

    let map: google.maps.Map;
    let userMarker: google.maps.Marker;
    let toMarker: google.maps.Marker;
    let directions: google.maps.DirectionsRenderer;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            handleGeoSuccess,
            handleGeoError,
        );
    }, []);

    const { loading } = useQuery<userProfile>(USER_PROFILE);

    const toggleMenu = (): void => {
        setState(prevState => ({
            ...prevState,
            isMenuOpen: !state.isMenuOpen,
        }));
    };

    const handleGeoSuccess: PositionCallback = (position: Position): void => {
        const { coords: { latitude, longitude } } = position;

        setState(prevState => ({
            ...prevState,
            lat: latitude,
            lng: longitude,
        }));
        loadMap(latitude, longitude);
    };

    const handleGeoError: PositionErrorCallback = (): void => {
        console.log("No location");
    };

    const loadMap = (lat, lng): void => {
        const maps = props.google.maps;
        const mapNode = ReactDOM.findDOMNode(mapRef.current);
        const mapConfig: google.maps.MapOptions = {
            center: {
                lat,
                lng,
            },
            disableDefaultUI: true,
            zoom: 13,
        };

        map = new maps.Map(mapNode, mapConfig);

        const userMarkerOptions: google.maps.MarkerOptions = {
            position: {
                lat,
                lng,
            },
            icon: {
                path: maps.SymbolPath.CIRCLE,
                scale: 7,
            },
        };
        userMarker = new maps.Marker(userMarkerOptions);
        userMarker.setMap(map);

        const watchOptions: PositionOptions = {
            enableHighAccuracy: true,
        };

        navigator.geolocation.watchPosition(
            handleGeoWatchSuccess,
            handleGeoWatchError,
            watchOptions,
        );
    };

    const handleGeoWatchSuccess = (position: Position): void => {
        const { coords: { latitude, longitude } } = position;

        userMarker.setPosition({ lat: latitude, lng: longitude });
        map.panTo({ lat: latitude, lng: longitude });
    };

    const handleGeoWatchError = (): void => {
        console.log("Error watching you");
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { target: { name, value } } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onAddressSubmit = async() => {
        const { toAddress } = state;
        const maps = props.google.maps;
        const result = await geoCode(toAddress);

        if (result) {
            const { lat, lng, formatted_address: formattedAddress } = result;

            if (toMarker) {
                toMarker.setMap(null);
            }

            const toMarkerOptions: google.maps.MarkerOptions = {
                position: {
                    lat,
                    lng
                }
            };
            toMarker = new maps.Marker(toMarkerOptions);
            toMarker.setMap(map);

            const bounds = new maps.LatLngBounds();
            bounds.extend({ lat, lng});
            bounds.extend({ lat: state.lat, lng: state.lng });
            map.fitBounds(bounds);
            setState(prevState => ({
                ...prevState,
                toAddress: formattedAddress,
                toLat: lat,
                toLng: lng,
            }));

            createPath();
        }
    };

    const createPath = () => {
        const { toLat, toLng, lat, lng } = state;

        if (directions) {
            directions.setMap(null);
        }

        const renderOptions: google.maps.DirectionsRendererOptions = {
            polylineOptions: {
                strokeColor: "#000",
            },
            suppressMarkers: true,
        };

        directions = new google.maps.DirectionsRenderer(renderOptions);
        const directionService: google.maps.DirectionsService = new google.maps.DirectionsService();
        const to = new google.maps.LatLng(toLat, toLng);
        const from = new google.maps.LatLng(lat, lng);
        const directionsOptions: google.maps.DirectionsRequest = {
            destination: to,
            origin: from,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionService.route(directionsOptions, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                const { routes } = result;
                const {
                    distance: { text: distance },
                    duration: { text: duration }
                } = routes[0].legs[0];
                setState(prevState => ({
                    ...prevState,
                    distance,
                    duration
                }));
                directions.setDirections(result);
                directions.setMap(map);
            } else {
                toast.error("There is no route there, you have to ");
            }
        });
    };

    return <Presenter
        isMenuOpen={state.isMenuOpen}
        toggleMenu={toggleMenu}
        loading={loading}
        mapRef={mapRef}
        toAddress={state.toAddress}
        onInputChange={onInputChange}
        onAddressSubmit={onAddressSubmit}
    />;
};

export default Container;