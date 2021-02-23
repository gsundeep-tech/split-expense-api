import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import NavBar from "./components/shared/NavBar";
import BodyHeader from "./components/shared/BodyHeader";
import Home from "./components/Home";
import Users from "./components/Users";
import Products from "./components/Products";
import QuickExpense from "./components/QuickExpense";

class App extends Component {
  state = {};
  render() {
    return (
      <Router>
        <NavBar />
        <BodyHeader />
        <Switch>
          <Route path="/" exact={true}>
            <Home />
          </Route>
          <Route path="/users" exact={true}>
            <Users />
          </Route>
          <Route path="/products" exact={true}>
            <Products />
          </Route>
          <Route path="/quick" exact={true}>
            <QuickExpense />
          </Route>
          <Route path="/reports" exact={true}>
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
