import React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  text-decoration: underline;
  margin-bottom: 20px;
  display: block;
`;

interface IProps {
    address: string;
    name: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    onSubmit: any;
}

const Presenter: React.FC<IProps> = ({
    onInputChange,
    address,
    name,
    loading,
    onSubmit,
}) => (
    <>
        <Helmet>
            <title>Add Place | Nuber</title>
        </Helmet>
        <Header title={"Add Place"} backTo={"/"} />
        <Container>
            <Form submitFn={onSubmit}>
                <ExtendedInput
                    placeholder={"Name"}
                    type={"text"}
                    onChange={onInputChange}
                    value={name}
                    name={"name"}
                />
                <ExtendedInput
                    placeholder={"Address"}
                    type={"text"}
                    onChange={onInputChange}
                    value={address}
                    name={"address"}
                />
                <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>
                <Button onClick={null} value={loading ? "Adding place" : "Add Place"} />
            </Form>
        </Container>
    </>
);

export default Presenter;