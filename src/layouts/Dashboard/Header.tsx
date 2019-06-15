import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { dashboardShowAuthenticateModal } from "../../redux/_dashboard";
import Button from "../../components/Button";
import ProfileCard from "../../components/ProfileCard";
import { colors, shadows } from "../../styles";

import {
  SIDEBAR_SIZE,
  HEADER_SIZE,
  CONTENT_PADDING
} from "../../constants/dashboard";
import { STitle } from "src/components/common";
import { formatDisplayAmount } from "src/helpers/utilities";

const SHeader = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;

  justify-content: center;
  width: 100%;
  z-index: 2;
  width: calc(100% - ${SIDEBAR_SIZE}px);
  padding: ${CONTENT_PADDING}px ${CONTENT_PADDING * 2}px;
  margin-left: ${SIDEBAR_SIZE}px;
  height: ${HEADER_SIZE}px;
  background: rgb(${colors.white});
  color: rgb(${colors.dark});
  box-shadow: ${shadows.soft};
`;

const SHeaderSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const SHeaderLeft = styled(SHeaderSection)`
  align-items: flex-start;
`;

const SHeaderRight = styled(SHeaderSection)`
  align-items: flex-end;
`;

const SLoginButton = styled(Button)`
  max-width: 145px;
  font-size: 16px;
`;

const Header = (props: any) => {
  const { name, address, wallet, balance } = props;
  return (
    <SHeader>
      <SHeaderLeft>
        {wallet && <ProfileCard name={name} address={address} />}
      </SHeaderLeft>
      <SHeaderRight>
        {!wallet ? (
          <SLoginButton onClick={props.dashboardShowAuthenticateModal}>
            {"Login"}
          </SLoginButton>
        ) : (
          <React.Fragment>
            {balance && <STitle>{formatDisplayAmount(balance, "MINT")}</STitle>}
          </React.Fragment>
        )}
      </SHeaderRight>
    </SHeader>
  );
};

const reduxProps = (store: any) => ({
  name: store.dashboard.name,
  address: store.dashboard.address,
  wallet: store.dashboard.wallet,
  balance: store.dashboard.balance
});

export default connect(
  reduxProps,
  { dashboardShowAuthenticateModal }
)(Header);
