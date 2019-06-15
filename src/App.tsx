import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Notification from "./components/Notification";
import ModalController from "./modals";

const SLayout = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const SContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

class App extends React.Component<any, any> {
  public static contextTypes = {
    router: PropTypes.object.isRequired
  };
  public componentDidMount() {
    window.browserHistory = this.context.router.history;
  }
  public render() {
    return (
      <SLayout>
        <SContent>
          <Switch>
            <Route component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </SContent>
        <Notification />
        <ModalController />
      </SLayout>
    );
  }
}

const reduxProps = (store: any) => ({
  address: store.dashboard.address
});

export default withRouter(connect(
  reduxProps,
  null
)(App) as any);
