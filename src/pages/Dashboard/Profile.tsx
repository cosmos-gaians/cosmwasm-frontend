import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { SGrid } from "../../components/common";
import { fonts } from "../../styles";

const SColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SProfileLabel = styled.div`
  margin: 0;
  font-weight: ${fonts.weight.medium};
  font-size: ${fonts.size.h4};
`;

const SProfileField = styled.div`
  margin: 0;
  margin-top: 8px;
  font-weight: ${fonts.weight.semibold};
  font-size: ${fonts.size.h2};
`;

const Profile = (props: any) => {
  const { loading, address, groups, proposals, contracts } = props;
  return (
    <React.Fragment>
      {!loading && address ? (
        <SGrid itemMaxWidth={210} itemMaxHeight={160} gap={10}>
          <Link to="/groups">
            <Card shadow>
              <SColumn>
                <SProfileLabel>{`Groups`}</SProfileLabel>
                <SProfileField>{groups.length}</SProfileField>
              </SColumn>
            </Card>
          </Link>
          <Link to="/proposals">
            <Card shadow>
              <SColumn>
                <SProfileLabel>{`Proposals`}</SProfileLabel>
                <SProfileField>{proposals.length}</SProfileField>
              </SColumn>
            </Card>
          </Link>
          <Link to="/contracts">
            <Card shadow>
              <SColumn>
                <SProfileLabel>{`Contracts`}</SProfileLabel>
                <SProfileField>{contracts.length}</SProfileField>
              </SColumn>
            </Card>
          </Link>
        </SGrid>
      ) : (
        <EmptyState loading={loading} message={`No Profile Data`} />
      )}
    </React.Fragment>
  );
};

const reduxProps = (store: any) => ({
  loading: store.dashboard.loading,
  address: store.dashboard.address,
  groups: store.dashboard.groups,
  contracts: store.dashboard.contracts,
  proposals: store.dashboard.proposals
});

export default connect(
  reduxProps,
  null
)(Profile);
