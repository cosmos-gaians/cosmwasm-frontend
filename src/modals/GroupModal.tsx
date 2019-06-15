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

interface IGroupModalProps {
  groupJson: any;
  onAddItem: (groupJson: any) => void;
  onRemoveItem: (groupJson: any) => void;
}

class GroupModal extends React.Component<IGroupModalProps, any> {
  public state = {
    id: this.props.groupJson ? this.props.groupJson.id : "",
    name: this.props.groupJson ? this.props.groupJson.name : "",
    description: this.props.groupJson ? this.props.groupJson.description : "",
    price: this.props.groupJson ? this.props.groupJson.price : 0,
    image: this.props.groupJson ? this.props.groupJson.image : ""
  };

  public updateState = (updatedGroupJson: any) =>
    this.setState({ ...this.state, ...updatedGroupJson });

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
        <h6>{`Create Group`}</h6>
        <Input
          type="text"
          label="Name"
          placeholder="Group name"
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
          placeholder="Group description"
          value={this.state.description}
          onChange={(e: any) =>
            this.updateState({
              description: e.target.value
            })
          }
        />

        <SSubmitWrapper>
          {this.props.groupJson ? (
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

export default GroupModal;
