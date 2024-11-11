import { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { QUERY_ME  } from '../utils/queries';
import { Link } from "react-router-dom";
import Auth from '../utils/auth';

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { loading: loadingUser, data:userData } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(), // Only run if logged in
  });

  useEffect(() => {
    // Update loggedIn state based on Auth status whenever NavBar is mounted
    setLoggedIn(Auth.loggedIn());

    // Check the user's subscription status if logged in
    if (Auth.loggedIn() && userData) {
      setIsSubscribed(userData.me.isSubscribed);
    }
  }, [userData]);

  console.log("LoggedIn:", loggedIn, "IsSubscribed:", isSubscribed);

  return (
    <nav className="navbar">
      {loggedIn ? (
        <>
          <div className="mx-4">
            {isSubscribed ? (
              <p>Thanks for subscribing</p>
            ) : (
              <Link to="/subscribe">Please Subscribe!</Link>
            )}
          </div>
          <Link to="/saved">&nbsp;Saved Clips</Link>
          <Link to="#" onClick={Auth.logout}>&nbsp;Logout</Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
