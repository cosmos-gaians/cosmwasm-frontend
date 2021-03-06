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

interface IProposalModalProps {
  proposal: any;
  onAddItem: (proposal: any) => void;
  onRemoveItem: (proposal: any) => void;
}

class ProposalModal extends React.Component<IProposalModalProps, any> {
  public state = {
    id: this.props.proposal ? this.props.proposal.id : "",
    name: this.props.proposal ? this.props.proposal.name : "",
    description: this.props.proposal ? this.props.proposal.description : "",
    price: this.props.proposal ? this.props.proposal.price : 0,
    image: this.props.proposal ? this.props.proposal.image : ""
  };

  public updateState = (updatedProposalJson: any) =>
    this.setState({ ...this.state, ...updatedProposalJson });

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
        <h6>{`Create Proposal`}</h6>
        <Input
          type="text"
          label="Name"
          placeholder="Proposal name"
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
          placeholder="Proposal description"
          value={this.state.description}
          onChange={(e: any) =>
            this.updateState({
              description: e.target.value
            })
          }
        />

        <SSubmitWrapper>
          {this.props.proposal ? (
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

export default ProposalModal;
