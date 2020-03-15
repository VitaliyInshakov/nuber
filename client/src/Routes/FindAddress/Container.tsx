import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Presenter from "./Presenter";

interface IState {
    lat: number;
    lng: number;
}


const Container: React.FC<any> = (props) => {
    // @ts-ignore
    const [state, setState] = useState<IState>({
        lat: 0,
        lng: 0,
    });
    const mapRef = useRef(null);

    let map: google.maps.Map;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            handleGeoSuccess,
            handleGeoError,
        );
    }, []);

    const handleGeoSuccess = (position: Position): void => {
        const { coords: { latitude, longitude } } = position;

        setState({
            lat: latitude,
            lng: longitude,
        });
        loadMap(latitude, longitude);
    };

    const handleGeoError = (): void => {
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
            zoom: 11,
        };

        map = new maps.Map(mapNode, mapConfig);
        map.addListener("dragend", handleDragEnd);
    };

    const handleDragEnd = () => {
        const newCenter = map.getCenter();
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setState({
            lat,
            lng
        });
    };

    return (
        <Presenter mapRef={mapRef}/>
    );
};

export default Container;