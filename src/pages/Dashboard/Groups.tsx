import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { dashboardShowGroupsModal } from "../../redux/_dashboard";

import EmptyState from "../../components/EmptyState";
import { SColumnList } from "../../components/common";
import Button from "../../components/Button";
import { CONTENT_PADDING } from "../../constants/dashboard";

const SButtonWrapper = styled.div`
  position: fixed;
  bottom: ${CONTENT_PADDING * 2}px;
  right: ${CONTENT_PADDING * 2}px;
`;

const SGroupsList = styled(SColumnList)`
  padding: 0;
`;

const SListItem = styled.div`
  margin: 20px;
  margin-bottom: 0;
  &:last-child {
    margin-bottom: 20px;
  }
`;

interface IGroupsProps {
  groups: any;
  settings: any;
  dashboardShowGroupsModal: (groupJson?: any) => void;
}

const Groups = (props: IGroupsProps) => {
  const { groups } = props;
  return (
    <React.Fragment>
      {groups && groups.length ? (
        <SGroupsList>
          {groups.map((item: any) => (
            <SListItem
              key={`group-${item.name}`}
              onClick={() => props.dashboardShowGroupsModal(item)}
            >
              {item}
            </SListItem>
          ))}
        </SGroupsList>
      ) : (
        <EmptyState message={`No Groups`} />
      )}
      <SButtonWrapper>
        <Button
          onClick={() => props.dashboardShowGroupsModal()}
        >{`Create Group`}</Button>
      </SButtonWrapper>
    </React.Fragment>
  );
};
const reduxProps = (store: any) => ({
  groups: store.dashboard.groups
});

export default connect(
  reduxProps,
  { dashboardShowGroupsModal }
)(Groups);
