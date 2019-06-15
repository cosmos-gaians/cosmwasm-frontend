import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { dashboardAuthenticate } from "../redux/_dashboard";
import { notificationShow } from "../redux/_notification";
import { modalHide } from "../redux/_modal";
import { addNewKey, getKey } from "../helpers/keystore";
import { IKeyStore, IWallet } from "../helpers/types";

const SSubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 24px;
  & > button:last-child {
    margin-left: 16px;
  }
  & > button:first-child {
    margin-left: 0;
  }
`;

interface IAuthenticateModalProps {
  keys: IKeyStore[];
  dashboardAuthenticate: (name: string, wallet: IWallet) => void;
  notificationShow: (message: string, error?: boolean) => void;
  modalHide: () => void;
}

interface IAuthenticateModalState {
  createNew: boolean;
  selectedKey: IKeyStore;
  name: string;
  password: string;
  confirmPassword: string;
}

const CREATE_NEW_KEY = "CREATE_NEW_KEY";

const plainKey = {
  name: "",
  address: "",
  wallet: ""
};

function isEmpty(array: any[]) {
  return !(array && array.length);
}

class AuthenticateModal extends React.Component<
  IAuthenticateModalProps,
  IAuthenticateModalState
> {
  public state = {
    createNew: isEmpty(this.props.keys),
    selectedKey: !isEmpty(this.props.keys) ? this.props.keys[0] : plainKey,
    name: "",
    password: "",
    confirmPassword: ""
  };

  public notify = (message: string) =>
    this.props.notificationShow(message, true);

  public onSubmit = () => {
    let { name } = this.state;
    const { createNew, selectedKey, password, confirmPassword } = this.state;
    let wallet = null;
    if (createNew) {
      if (!name) {
        return this.notify(`Name is missing`);
      }
      if (!password) {
        return this.notify(`Password is missing`);
      }
      if (password.length < 8) {
        return this.notify(`Password is smaller than 8 characters`);
      }
      if (!confirmPassword) {
        return this.notify(`Confirm Password is missing`);
      }
      if (password !== confirmPassword) {
        return this.notify(`Passwords don't match`);
      }
      wallet = addNewKey(name, password);
    } else {
      if (!password) {
        return this.notify(`Password is missing`);
      }
      if (password.length < 8) {
        return this.notify(`Password is smaller than 8 characters`);
      }
      try {
        name = selectedKey.name;
        wallet = getKey(name, password);
      } catch (error) {
        return this.notify(`Password is incorrect`);
      }
    }
    this.props.dashboardAuthenticate(name, wallet);
    this.props.modalHide();
  };

  public render() {
    const {
      createNew,
      selectedKey,
      name,
      password,
      confirmPassword
    } = this.state;
    const { keys } = this.props;
    const options = [
      ...keys,
      { name: "Create new key", address: CREATE_NEW_KEY }
    ];
    return (
      <Form onSubmit={this.onSubmit}>
        <h6>{`Authenticate`}</h6>

        {!createNew && !isEmpty(keys) ? (
          <React.Fragment>
            <Dropdown
              label="Keys"
              selected={selectedKey.address}
              options={options}
              displayKey={"name"}
              targetKey={"address"}
              onChange={(address: string) => {
                if (address === CREATE_NEW_KEY) {
                  this.setState({ createNew: true });
                  return;
                }
                let selectedKey = null;
                const matches = keys.filter(
                  (key: IKeyStore) => key.address === address
                );
                if (!isEmpty(this.props.keys)) {
                  selectedKey = matches[0];
                  this.setState({ selectedKey });
                } else {
                  this.props.notificationShow(
                    `Couldn't find key with address: ${address}`
                  );
                }
              }}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e: any) => this.setState({ password: e.target.value })}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Input
              type="text"
              label="Name"
              placeholder="John Doe"
              value={name}
              onChange={(e: any) => this.setState({ name: e.target.value })}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e: any) => this.setState({ password: e.target.value })}
            />

            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e: any) =>
                this.setState({ confirmPassword: e.target.value })
              }
            />
          </React.Fragment>
        )}

        <SSubmitWrapper>
          <Button type="submit">{`Submit`}</Button>
        </SSubmitWrapper>
      </Form>
    );
  }
}

export default connect(
  null,
  { dashboardAuthenticate, notificationShow, modalHide }
)(AuthenticateModal);
