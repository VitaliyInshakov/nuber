import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";

import Presenter from "./Presenter";

interface IState {
    countryCode: string;
    phoneNumber: string;
}

class PhoneLoginContainer extends React.Component<RouteComponentProps<any>, IState> {
    public state = {
        countryCode: "+82",
        phoneNumber: "",
    };

    public onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
        const { target: { name, value } } = event;

        this.setState({
            [name]: value,
        } as any);
    };

    public onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const { countryCode, phoneNumber } = this.state;

        const phone = `${countryCode}${phoneNumber}`;
        const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);

        if (isValid) {

        } else {
            toast.error("Please write a valid phone number");
        }
    };

    public render() {
        const { countryCode, phoneNumber } = this.state;
        return <Presenter
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
        />;
    }
}

export default PhoneLoginContainer;