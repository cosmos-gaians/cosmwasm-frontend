import * as React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import Button from "../components/Button";
import { IContract } from "../helpers/types";

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
  address: string;
  contract: IContract;
  onAddItem: (contract: IContract, isNew: boolean) => void;
}

interface IContractModalState extends IContract {
  isNew: boolean;
  isVerifier: boolean;
}

class ContractModal extends React.Component<
  IContractModalProps,
  IContractModalState
> {
  public state = {
    isNew: !this.props.contract,
    isVerifier: this.props.contract
      ? this.props.contract.verifier === this.props.address
      : false,
    verifier: this.props.contract ? this.props.contract.verifier : "",
    beneficiary: this.props.contract ? this.props.contract.beneficiary : "",
    funder: this.props.contract
      ? this.props.contract.funder
      : this.props.address,
    payout: this.props.contract ? this.props.contract.payout : ""
  };

  public onSubmit = () => {
    const { isNew, verifier, beneficiary, funder, payout } = this.state;
    this.props.onAddItem({ verifier, beneficiary, funder, payout }, isNew);
  };

  public render() {
    const { isNew, isVerifier, verifier, beneficiary, payout } = this.state;
    const action = isNew
      ? "Create Contract"
      : isVerifier
      ? "Verify Claim"
      : "Contract";
    return (
      <React.Fragment>
        <h6>{action}</h6>
        <Input
          type="text"
          label="Verifier"
          placeholder="Verifier"
          value={verifier}
          onChange={(e: any) => this.setState({ verifier: e.target.value })}
        />

        <Input
          type="text"
          label="Beneficiary"
          placeholder="Beneficiary"
          value={beneficiary}
          onChange={(e: any) => this.setState({ beneficiary: e.target.value })}
        />

        <Input
          type="text"
          label="Payout"
          placeholder="Payout"
          value={payout}
          onChange={(e: any) => this.setState({ payout: e.target.value })}
        />

        {(isNew || isVerifier) && (
          <SSubmitWrapper>
            <Button onClick={this.onSubmit}>{action}</Button>
          </SSubmitWrapper>
        )}
      </React.Fragment>
    );
  }
}

export default ContractModal;
