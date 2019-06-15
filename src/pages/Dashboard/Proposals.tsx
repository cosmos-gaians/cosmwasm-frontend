import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { dashboardShowProposalsModal } from "../../redux/_dashboard";

import EmptyState from "../../components/EmptyState";
import { SColumnList } from "../../components/common";
import Button from "../../components/Button";
import { CONTENT_PADDING } from "../../constants/dashboard";

const SButtonWrapper = styled.div`
  position: fixed;
  bottom: ${CONTENT_PADDING * 2}px;
  right: ${CONTENT_PADDING * 2}px;
`;

const SProposalsList = styled(SColumnList)`
  padding: 0;
`;

const SListItem = styled.div`
  margin: 20px;
  margin-bottom: 0;
  &:last-child {
    margin-bottom: 20px;
  }
`;

interface IProposalsProps {
  proposals: any;
  settings: any;
  dashboardShowProposalsModal: (proposal?: any) => void;
}

const Proposals = (props: IProposalsProps) => {
  const { proposals } = props;
  return (
    <React.Fragment>
      {proposals && proposals.length ? (
        <SProposalsList>
          {proposals.map((item: any) => (
            <SListItem
              key={`group-${item.name}`}
              onClick={() => props.dashboardShowProposalsModal(item)}
            >
              {item}
            </SListItem>
          ))}
        </SProposalsList>
      ) : (
        <EmptyState message={`No Proposals`} />
      )}
      <SButtonWrapper>
        <Button
          onClick={() => props.dashboardShowProposalsModal()}
        >{`Create Proposal`}</Button>
      </SButtonWrapper>
    </React.Fragment>
  );
};
const reduxProps = (store: any) => ({
  proposals: store.dashboard.proposals
});

export default connect(
  reduxProps,
  { dashboardShowProposalsModal }
)(Proposals);
