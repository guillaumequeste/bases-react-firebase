import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Accueil from "./Accueil";
import Admin from "./admin/Admin";
import Login from "./authentification/Login";
import SignUp from "./SignUp";
import { AuthProvider } from "./authentification/Auth";
import PrivateRoute from "./authentification/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/" component={Accueil} />
          <PrivateRoute exact path="/admin" component={Admin} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;