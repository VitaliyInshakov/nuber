import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Header from "../../Components/Header";
import Place from "../../Components/Place";
import { getPlaces } from "../../types/api";

const Container = styled.div`
  padding: 0 40px;
`;

const SLink = styled(Link)`
  text-decoration: underline;
`;

interface IProps {
    data?: getPlaces;
    loading: boolean;
}

const Presenter: React.FC<IProps> = ({
    data: { GetMyPlaces: { places = null } = {} } = {},
    loading,
}) => (
    <>
        <Helmet>
            <title>Places | Nuber</title>
        </Helmet>
        <Header title={"Places"} backTo={"/"} />
        <Container>
            {!loading && places && !places.length && "You have no places"}
            {!loading && places &&
                places.map(place => (
                    <Place
                        key={place!.id}
                        fav={place!.isFavorite}
                        name={place!.name}
                        address={place!.address}
                    />
                ))
            }
            <SLink to={"/add-place"}>Add some places!</SLink>
        </Container>
    </>
);

export default Presenter;