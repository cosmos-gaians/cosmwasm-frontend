import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  dashboardShowGroupsModal,
  dashboardGetGroups
} from "../../redux/_dashboard";

import EmptyState from "../../components/EmptyState";
import { SListColumn, SListItem, SListItemRow } from "../../components/common";
import Button from "../../components/Button";
import { CONTENT_PADDING } from "../../constants/dashboard";
import { IGroup } from "../../helpers/types";
// import { ellipseWord } from "../../helpers/utilities";

const SButtonWrapper = styled.div`
  position: fixed;
  bottom: ${CONTENT_PADDING * 2}px;
  right: ${CONTENT_PADDING * 2}px;
`;

interface IGroupsProps {
  groups: IGroup[];
  dashboardShowGroupsModal: (group?: IGroup) => void;
  dashboardGetGroups: () => void;
}

class Groups extends React.Component<IGroupsProps, any> {
  public componentDidMount() {
    this.props.dashboardGetGroups();
  }
  public render() {
    const { groups } = this.props;
    return (
      <React.Fragment>
        {groups && groups.length ? (
          <SListColumn>
            <SListItem noShadow>
              <SListItemRow bold width={60}>
                {"Address"}
              </SListItemRow>
              <SListItemRow bold width={20}>
                {"Members"}
              </SListItemRow>
              <SListItemRow bold alignRight width={20}>
                {"Threshold"}
              </SListItemRow>
            </SListItem>
            {groups.map((item: IGroup) => (
              <SListItem
                key={`group-${item.ID}`}
                onClick={() => this.props.dashboardShowGroupsModal(item)}
              >
                <SListItemRow width={60}>{item.ID}</SListItemRow>
                <SListItemRow width={20}>{item.members.length}</SListItemRow>
                <SListItemRow alignRight width={20}>
                  {item.decision_threshold}
                </SListItemRow>
              </SListItem>
            ))}
          </SListColumn>
        ) : (
          <EmptyState message={`No Groups`} />
        )}
        <SButtonWrapper>
          <Button
            onClick={() => this.props.dashboardShowGroupsModal()}
          >{`Create Group`}</Button>
        </SButtonWrapper>
      </React.Fragment>
    );
  }
}

const reduxProps = (store: any) => ({
  groups: store.dashboard.groups
});

export default connect(
  reduxProps,
  { dashboardShowGroupsModal, dashboardGetGroups }
)(Groups);
