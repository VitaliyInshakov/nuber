import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { SubscribeToMoreOptions } from "apollo-client";

import { USER_PROFILE } from "../../sharedQueries";
import {
    GET_NEARBY_DRIVERS,
    GET_NEARBY_RIDE,
    REPORT_LOCATION,
    REQUEST_RIDE,
    ACCEPT_RIDE,
    SUBSCRIBE_NEARBY_RIDES,
} from "./Queries";
import {
    acceptRide,
    acceptRideVariables,
    getDrivers,
    getRides,
    reportMovement,
    reportMovementVariables,
    requestRide,
    requestRideVariables,
    userProfile
} from "../../types/api";
import { geoCode, reverseGeoCode } from "../../mapHelpers";
import Presenter from "./Presenter";

interface IState {
    isMenuOpen: boolean;
    lat: number;
    lng: number;
    toAddress: string;
    toLat: number;
    toLng: number;
    distance: string;
    duration?: string;
    price?: string;
    fromAddress: string;
    isDriving: boolean;
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
        duration: undefined,
        distance: "",
        price: undefined,
        fromAddress: "",
        isDriving: false,
    });
    const mapRef = useRef(null);

    let map: google.maps.Map;
    let userMarker: google.maps.Marker;
    let toMarker: google.maps.Marker;
    let directions: google.maps.DirectionsRenderer;
    let drivers: google.maps.Marker[] = [];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            handleGeoSuccess,
            handleGeoError,
        );
    }, []);

    const handleProfileQuery = (data: userProfile): void => {
        const { GetMyProfile } = data;
        if (GetMyProfile.user) {
            const { user: { isDriving } } = GetMyProfile;
            setState(prevState => ({
                ...prevState,
                isDriving,
            }));
        }
    };

    const { loading, data } = useQuery<userProfile>(USER_PROFILE, {
        onCompleted: handleProfileQuery,
    });

    const handleNearbyDrivers = (data: {} | getDrivers) => {
        if ("GetNearbyDrivers" in data) {
            const { GetNearbyDrivers: { drivers: nearDrivers, ok } } = data;

            if (ok && nearDrivers) {
                for (const driver of nearDrivers) {
                    if (driver && driver.lastLat && driver.lastLng) {
                        const existingDriver: google.maps.Marker | undefined = drivers.find(
                        (driverMarker: google.maps.Marker) => {
                            const markerID = driverMarker.get("ID");
                            return markerID === driver.id;
                        });

                        if (existingDriver) {
                            existingDriver.setPosition({
                                lat: driver.lastLat,
                                lng: driver.lastLng
                            });
                            existingDriver.setMap(map);
                        } else {
                            const markerOptions: google.maps.MarkerOptions = {
                                icon: {
                                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                                    scale: 5
                                },
                                position: {
                                    lat: driver.lastLat,
                                    lng: driver.lastLng
                                }
                            };
                            const newMarker: google.maps.Marker = new google.maps.Marker(
                                markerOptions
                            );
                            drivers.push(newMarker);
                            newMarker.set("ID", driver.id);
                            newMarker.setMap(map);
                        }
                    }
                }
            }
        }
    };

    useQuery<getDrivers>(GET_NEARBY_DRIVERS, {
        pollInterval: 1000,
        skip: state.isDriving,
        onCompleted: handleNearbyDrivers,
    });

    const { data: nearbyRide, subscribeToMore } = useQuery<getRides>(GET_NEARBY_RIDE, {
        skip: !state.isDriving,
    });

    const handleSubscriptionUpdate = (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
            return prev;
        }
        const newObject = Object.assign({}, prev, {
            GetNearbyRide: {
                ...prev.GetNearbyRide,
                ride: subscriptionData.data.NearbyRideSubscription
            }
        });
        return newObject;
    };

    const rideSubscriptionOptions: SubscribeToMoreOptions = {
        document: SUBSCRIBE_NEARBY_RIDES,
        updateQuery: handleSubscriptionUpdate
    };

    state.isDriving && subscribeToMore(rideSubscriptionOptions);

    const [reportLocation] = useMutation<reportMovement, reportMovementVariables>(REPORT_LOCATION);

    const handleRideRequest = (data: requestRide): void => {
        const { RequestRide } = data;
        if (RequestRide.ok) {
            toast.success("Drive requested, finding a driver");
            props.history.push(`/ride/${RequestRide.ride!.id}`);
        } else {
            toast.error(RequestRide.error);
        }
    };

    const [requestRideFn] = useMutation<requestRide, requestRideVariables>(REQUEST_RIDE, {
        variables: {
            distance: state.distance,
            dropOffAddress: state.toAddress,
            dropOffLat: state.toLat,
            dropOffLng: state.toLng,
            duration: state.duration || "",
            pickUpAddress: state.fromAddress,
            pickUpLat: state.lat,
            pickUpLng: state.lng,
            price: +state.price! || 0,
        },
        onCompleted: handleRideRequest,
    });

    const handleRideAcceptance = (data: acceptRide) => {
        const { UpdateRideStatus } = data;
        if (UpdateRideStatus.ok) {
            props.history.push(`/ride/${UpdateRideStatus.rideId}`);
        }
    };

    const [acceptRideFn] = useMutation<acceptRide, acceptRideVariables>(ACCEPT_RIDE, {
        onCompleted: handleRideAcceptance,
    });

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
        getFromAddress(latitude, longitude);
        loadMap(latitude, longitude);
    };

    const handleGeoError: PositionErrorCallback = (): void => {
        console.log("No location");
    };

    const loadMap = (lat, lng): void => {
        const maps = props.google.maps;
        const mapNode = ReactDOM.findDOMNode(mapRef.current);
        if (!mapNode) {
            loadMap(lat, lng);
            return;
        }
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
        reportLocation({
            variables: {
                lat: parseFloat(latitude.toFixed(10)),
                lng: parseFloat(longitude.toFixed(10)),
            },
        });
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

        directionService.route(directionsOptions, handleRouteRequest);
    };

    const handleRouteRequest = (
        result: google.maps.DirectionsResult,
        status: google.maps.DirectionsStatus,
    ): void => {
        if (status === google.maps.DirectionsStatus.OK) {
            const { routes } = result;
            const {
                distance: { text: distance },
                duration: { text: duration }
            } = routes[0].legs[0];
            directions.setDirections(result);
            directions.setMap(map);

            setState(prevState => ({
                ...prevState,
                distance,
                duration
            }));
            setPrice();
        } else {
            toast.error("There is no route there, you have to swim");
        }
    };

    const setPrice = (): void => {
        const { distance } = state;
        if (distance) {
            setState(prevState => ({
                ...prevState,
                price: Number(parseFloat(distance.replace(",", ".")) * 3).toFixed(2),
            }));
        }
    };

    const getFromAddress = async (lat: number, lng: number) => {
        const address = await reverseGeoCode(lat, lng);
        if (address) {
            setState(prevState => ({
                ...prevState,
                fromAddress: address,
            }));
        }
    };

    return <Presenter
        isMenuOpen={state.isMenuOpen}
        toggleMenu={toggleMenu}
        loading={loading}
        mapRef={mapRef}
        toAddress={state.toAddress}
        onInputChange={onInputChange}
        onAddressSubmit={onAddressSubmit}
        price={state.price}
        data={data}
        requestRideFn={requestRideFn}
        nearbyRide={nearbyRide}
        acceptRideFn={acceptRideFn}
    />;
};

export default Container;