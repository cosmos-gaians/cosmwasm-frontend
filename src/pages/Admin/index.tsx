import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "../../layouts/Dashboard";

import Profile from "./Profile";
import Groups from "./Groups";
import Proposals from "./Proposals";
import Contracts from "./Contracts";

class Admin extends React.Component<any, any> {
  public static propTypes = {
    match: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    address: PropTypes.string.isRequired
  };

  public render() {
    const { match, loading } = this.props;
    return (
      <Dashboard match={match} loading={loading}>
        <Switch>
          <Route exact path={match.url} component={Profile} />
          <Route exact path={`/groups`} component={Groups} />
          <Route exact path={`/proposals`} component={Proposals} />
          <Route exact path={`/contracts`} component={Contracts} />
          <Route render={() => <Redirect to={match.url} />} />
        </Switch>
      </Dashboard>
    );
  }
}

const reduxProps = (store: any) => ({
  loading: store.dashboard.loading,
  address: store.dashboard.address
});

export default connect(
  reduxProps,
  null
)(Admin);
