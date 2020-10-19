import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Spinner from "./components/Spinner";
import * as serviceWorker from "./serviceWorker";
import firebase from './firebase';
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import { Provider, connect } from "react-redux";
import store from "./store";
import { setUser, clearUser } from "./actions/authActions";

class Root extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      }
      else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    })
  }

  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading
});

const RootWithHistory = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithHistory />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
