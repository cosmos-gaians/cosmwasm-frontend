import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  dashboardShowContractsModal,
  dashboardGetContracts
} from "../../redux/_dashboard";

import EmptyState from "../../components/EmptyState";
import { SListColumn, SListItem, SListItemRow } from "../../components/common";
import Button from "../../components/Button";
import { CONTENT_PADDING } from "../../constants/dashboard";
import { IContract } from "../../helpers/types";
import { ellipseWord } from "../../helpers/utilities";

const SButtonWrapper = styled.div`
  position: fixed;
  bottom: ${CONTENT_PADDING * 2}px;
  right: ${CONTENT_PADDING * 2}px;
`;

interface IContractsProps {
  contracts: IContract[];
  dashboardShowContractsModal: (contractx?: IContract) => void;
  dashboardGetContracts: () => void;
}

class Contracts extends React.Component<IContractsProps, any> {
  public componentDidMount() {
    this.props.dashboardGetContracts();
  }
  public render() {
    const { contracts } = this.props;
    return (
      <React.Fragment>
        {contracts && contracts.length ? (
          <SListColumn>
            <SListItem noShadow>
              <SListItemRow bold width={40}>
                {"Verifier"}
              </SListItemRow>
              <SListItemRow bold width={40}>
                {"Beneficiary"}
              </SListItemRow>
              <SListItemRow bold alignRight width={20}>
                {"Payout"}
              </SListItemRow>
            </SListItem>
            {contracts.map((item: IContract) => (
              <SListItem
                key={`contract-${item.verifier}-${item.beneficiary}-${item.funder}-${item.payout}`}
                onClick={() => this.props.dashboardShowContractsModal(item)}
              >
                <SListItemRow width={40}>
                  {ellipseWord(item.verifier, 20)}
                </SListItemRow>
                <SListItemRow width={40}>
                  {ellipseWord(item.beneficiary, 20)}
                </SListItemRow>
                <SListItemRow alignRight width={20}>
                  {item.payout}
                </SListItemRow>
              </SListItem>
            ))}
          </SListColumn>
        ) : (
          <EmptyState message={`No Contracts`} />
        )}
        <SButtonWrapper>
          <Button
            onClick={() => this.props.dashboardShowContractsModal()}
          >{`Create Contract`}</Button>
        </SButtonWrapper>
      </React.Fragment>
    );
  }
}

const reduxProps = (store: any) => ({
  contracts: store.dashboard.contracts
});

export default connect(
  reduxProps,
  { dashboardShowContractsModal, dashboardGetContracts }
)(Contracts);
