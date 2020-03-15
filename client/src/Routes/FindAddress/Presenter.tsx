import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Center = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 2;
  font-size: 30px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IProps {
    mapRef: any;
}


const Presenter: React.FC<IProps> = ({ mapRef }) => (
    <div>
        <Helmet>
            <title>Find Address | Nuber</title>
        </Helmet>
        <Center>📍</Center>
        <Map ref={mapRef}/>
    </div>
);

export default Presenter;