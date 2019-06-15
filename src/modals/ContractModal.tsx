import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";

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

interface IContractModalProps {
  contract: any;
  onAddItem: (contract: any) => void;
  onRemoveItem: (contract: any) => void;
}

class ContractModal extends React.Component<IContractModalProps, any> {
  public state = {
    id: this.props.contract ? this.props.contract.id : "",
    name: this.props.contract ? this.props.contract.name : "",
    description: this.props.contract ? this.props.contract.description : "",
    price: this.props.contract ? this.props.contract.price : 0,
    image: this.props.contract ? this.props.contract.image : ""
  };

  public updateState = (updatedContractJson: any) =>
    this.setState({ ...this.state, ...updatedContractJson });

  public onSubmit = () => {
    const { id, name, description, price, image } = this.state;
    this.props.onAddItem({ id, name, description, price, image });
  };

  public onRemove = () => {
    const { id, name, description, price, image } = this.state;
    this.props.onRemoveItem({ id, name, description, price, image });
  };

  public render() {
    return (
      <React.Fragment>
        <h6>{`Create Contract`}</h6>
        <Input
          type="text"
          label="Name"
          placeholder="Contract name"
          value={this.state.name}
          onChange={(e: any) => {
            const name = e.target.value;
            const id = name;
            this.updateState({ name, id });
          }}
        />

        <Input
          type="text"
          label="Description"
          placeholder="Contract description"
          value={this.state.description}
          onChange={(e: any) =>
            this.updateState({
              description: e.target.value
            })
          }
        />

        <SSubmitWrapper>
          {this.props.contract ? (
            <React.Fragment>
              <Button color={`red`} onClick={this.onRemove}>{`Delete`}</Button>
              <Button onClick={this.onSubmit}>{`Update`}</Button>
            </React.Fragment>
          ) : (
            <Button onClick={this.onSubmit}>{`Submit`}</Button>
          )}
        </SSubmitWrapper>
      </React.Fragment>
    );
  }
}

export default ContractModal;
