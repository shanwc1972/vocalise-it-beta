import { useState, useEffect, useContext } from "react";
import AppContext from "../AppContext";
import { Link } from "react-router-dom";

import Auth from '../utils/auth';

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Update loggedIn state based on Auth status whenever NavBar is mounted
    setLoggedIn(Auth.loggedIn());
  }, []);

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
        <>
        <Link to="/saved">&nbsp;Saved Clips</Link>
        <Link onClick={Auth.logout}>&nbsp;Logout</Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
