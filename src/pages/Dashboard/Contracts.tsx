import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { dashboardShowContractsModal } from "../../redux/_dashboard";

import EmptyState from "../../components/EmptyState";
import { SColumnList } from "../../components/common";
import Button from "../../components/Button";
import { CONTENT_PADDING } from "../../constants/dashboard";

const SButtonWrapper = styled.div`
  position: fixed;
  bottom: ${CONTENT_PADDING * 2}px;
  right: ${CONTENT_PADDING * 2}px;
`;

const SContractsList = styled(SColumnList)`
  padding: 0;
`;

const SListItem = styled.div`
  margin: 20px;
  margin-bottom: 0;
  &:last-child {
    margin-bottom: 20px;
  }
`;

interface IContractsProps {
  contracts: any;
  settings: any;
  dashboardShowContractsModal: (proposal?: any) => void;
}

const Contracts = (props: IContractsProps) => {
  const { contracts } = props;
  return (
    <React.Fragment>
      {contracts && contracts.length ? (
        <SContractsList>
          {contracts.map((item: any) => (
            <SListItem
              key={`group-${item.name}`}
              onClick={() => props.dashboardShowContractsModal(item)}
            >
              {item}
            </SListItem>
          ))}
        </SContractsList>
      ) : (
        <EmptyState message={`No Contracts`} />
      )}
      <SButtonWrapper>
        <Button
          onClick={() => props.dashboardShowContractsModal()}
        >{`Create Contract`}</Button>
      </SButtonWrapper>
    </React.Fragment>
  );
};
const reduxProps = (store: any) => ({
  contracts: store.dashboard.contracts
});

export default connect(
  reduxProps,
  { dashboardShowContractsModal }
)(Contracts);
