import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";

const Container = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 30px;
`;

interface IProps {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    onSubmit: any;
}

const Presenter: React.FC<IProps> = ({
    firstName,
    lastName,
    email,
    profilePhoto,
    onInputChange,
    loading,
    onSubmit,
}) => {
    return (
        <Container>
            <Helmet>
                <title>Edit Account | Nuber</title>
            </Helmet>
            <Header title={"Edit Account"} backTo={"/"} />
            <ExtendedForm submitFn={onSubmit}>
                <ExtendedInput
                    onChange={onInputChange}
                    type={"text"}
                    value={firstName}
                    placeholder={"First name"}
                    name="firstName"
                />
                <ExtendedInput
                    onChange={onInputChange}
                    type={"text"}
                    value={lastName}
                    placeholder={"Last name"}
                    name="lastName"
                />
                <ExtendedInput
                    onChange={onInputChange}
                    type={"email"}
                    value={email}
                    placeholder={"Email"}
                    name="email"
                />
                <Button onClick={null} value={loading ? "Loading" : "Update"} />
            </ExtendedForm>
        </Container>
    );
};

export default Presenter;