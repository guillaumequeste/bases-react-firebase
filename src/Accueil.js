import React from "react";
import { Link } from "react-router-dom"

const Accueil = () => {
  return (
    <>
      <h1>Accueil</h1>
      <Link to="/login">Login</Link>
    </>
  );
};

export default Accueil;