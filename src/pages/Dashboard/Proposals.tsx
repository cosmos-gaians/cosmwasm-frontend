import * as React from "react";
// import styled from "styled-components";
import { connect } from "react-redux";
import {
  dashboardShowProposalsModal,
  dashboardGetProposals
} from "../../redux/_dashboard";

import EmptyState from "../../components/EmptyState";
import { SListColumn, SListItem, SListItemRow } from "../../components/common";
// import Button from "../../components/Button";
// import { CONTENT_PADDING } from "../../constants/dashboard";
import { IProposal } from "../../helpers/types";
import { ellipseWord } from "../../helpers/utilities";

// const SButtonWrapper = styled.div`
//   position: fixed;
//   bottom: ${CONTENT_PADDING * 2}px;
//   right: ${CONTENT_PADDING * 2}px;
// `;

interface IProposalsProps {
  proposals: IProposal[];
  dashboardShowProposalsModal: (group?: IProposal) => void;
  dashboardGetProposals: () => void;
}

class Proposals extends React.Component<IProposalsProps, any> {
  public componentDidMount() {
    this.props.dashboardGetProposals();
  }
  public render() {
    const { proposals } = this.props;
    return (
      <React.Fragment>
        {proposals && proposals.length ? (
          <SListColumn>
            <SListItem noShadow>
              <SListItemRow bold width={40}>
                {"Group"}
              </SListItemRow>
              <SListItemRow bold width={40}>
                {"Proposer"}
              </SListItemRow>

              <SListItemRow bold alignRight width={20}>
                {"Approvers"}
              </SListItemRow>
            </SListItem>
            {proposals.map((item: IProposal) => (
              <SListItem
                key={`group-${item.group}-${item.proposer}-${item.approvers.length}`}
                // onClick={() => this.props.dashboardShowProposalsModal(item)}
              >
                <SListItemRow width={40}>
                  {ellipseWord(item.group, 20)}
                </SListItemRow>
                <SListItemRow width={40}>
                  {ellipseWord(item.proposer, 20)}
                </SListItemRow>
                <SListItemRow alignRight width={20}>
                  {item.approvers.length}
                </SListItemRow>
              </SListItem>
            ))}
          </SListColumn>
        ) : (
          <EmptyState message={`No Proposals`} />
        )}
        {/* <SButtonWrapper>
          <Button
            onClick={() => this.props.dashboardShowProposalsModal()}
          >{`Create Proposal`}</Button>
        </SButtonWrapper> */}
      </React.Fragment>
    );
  }
}

const reduxProps = (store: any) => ({
  proposals: store.dashboard.proposals
});

export default connect(
  reduxProps,
  { dashboardShowProposalsModal, dashboardGetProposals }
)(Proposals);
