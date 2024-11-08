import { useState, useContext } from "react";
import AppContext from "../AppContext";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false); // placeholder until we implement auth
  const [isSubscribed, setIsSubscribed] = useState(false); // placeholder until we implement auth
  return (
    <nav className="navbar">
      <div className="mx-4">
      {isSubscribed ? (
          <p>Thanks for subscribing</p>
       ) :
       (
          <Link to="/subscribe">Please Subscribe!</Link>
       ) }
        </div>
      
      {loggedIn ? (
        <Link to="/saved">Saved Clips</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
