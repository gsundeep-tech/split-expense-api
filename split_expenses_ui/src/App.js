import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NavBar from './components/shared/NavBar';
import BodyHeader from './components/shared/BodyHeader';
import Home from './pages/Home';
import Users from './pages/Users';
import Products from './pages/Products';
import QuickExpense from './pages/QuickExpense';

function App() {
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

export default App;
