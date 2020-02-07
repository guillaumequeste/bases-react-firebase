import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./authentification/Login";
import SignUp from "./SignUp";
import Admin from "./admin/Admin";
import Create from './admin/Create';
import Show from './admin/Show';
import Edit from './admin/Edit';
import { AuthProvider } from "./authentification/Auth";
import PrivateRoute from "./authentification/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <PrivateRoute exact path="/admin" component={Admin} />
          <PrivateRoute path='/create' component={Create} />
          <PrivateRoute path='/show/:id' component={Show} />
          <PrivateRoute path='/edit/:id' component={Edit} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;