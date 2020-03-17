import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router-dom";

import { geoCode, reverseGeoCode } from "../../mapHelpers";
import Presenter from "./Presenter";

interface IState {
    lat: number;
    lng: number;
    address: string;
}

interface IProps extends RouteComponentProps<any> {
    google: any;
}

const Container: React.FC<IProps> = (props) => {
    const [state, setState] = useState<IState>({
        lat: 0,
        lng: 0,
        address: "",
    });
    const mapRef = useRef(null);

    let map: google.maps.Map;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            handleGeoSuccess,
            handleGeoError,
        );
    }, []);

    const handleGeoSuccess: PositionCallback = (position: Position): void => {
        const { coords: { latitude, longitude } } = position;

        setState(prevState => ({
            ...prevState,
            lat: latitude,
            lng: longitude,
        }));
        loadMap(latitude, longitude);
        reverseGeoCodeAddress(latitude, longitude);
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
            minZoom: 8,
            zoom: 11,
        };

        map = new maps.Map(mapNode, mapConfig);
        map.addListener("dragend", handleDragEnd);
    };

    const handleDragEnd = () => {
        const newCenter = map.getCenter();
        const lat = newCenter.lat();
        const lng = newCenter.lng();

        setState(prevState => ({
            ...prevState,
            lat,
            lng,
        }));

        reverseGeoCodeAddress(lat, lng);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { target: { name, value } } = event;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onInputBlur = async() => {
        const result = await geoCode(state.address);
        if (result) {
            const { lat, lng, formatted_address: formattedAddress } = result;

            setState({
                address: formattedAddress,
                lat,
                lng,
            });

            map.panTo({ lat, lng });
        }
    };

    const reverseGeoCodeAddress = async(lat: number, lng: number) => {
        const reversedAddress = await reverseGeoCode(lat, lng);

        if(reversedAddress) {
            setState(prevState => ({
                ...prevState,
                address: reversedAddress,
            }));
        }
    };

    const onPickPlace = () => {
        const { address, lat, lng } = state;
        const { history } = props;
        history.push({
            pathname: "/add-place",
            state: {
                address,
                lat,
                lng
            }
        });
    };

    return (
        <Presenter
            mapRef={mapRef}
            address={state.address}
            onInputChange={onInputChange}
            onInputBlur={onInputBlur}
            onPickPlace={onPickPlace}
        />
    );
};

export default Container;