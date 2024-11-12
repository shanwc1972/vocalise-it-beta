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
    <nav className="navbar flex flex-col sm:flex-row items-center justify-between p-4 text-white">
      {loggedIn ? (
        <>
          <div className="mx-4 mb-2 hidden sm:mb-0 md:flex">
            {isSubscribed ? (
              <p className="bg-yellow-500 rounded p-2 text-black">Thanks for subscribing!</p>
            ) : (
              <div className="bg-yellow-500 rounded p-2">
                <Link to="/subscribe" className="text-white">Please Subscribe!</Link>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row md:flex-row items-center">
            <Link to="/saved" className="mx-4 p-2 mb-2 sm:mb-0">&nbsp;Saved Clips</Link>
            <Link to="#" className="mx-4 p-2" onClick={Auth.logout}>&nbsp;Logout</Link>
          </div>
        </>
      ) : (
        <Link to="/login" className="p-2">Login</Link>
      )}
    </nav>
  );
};

export default NavBar;
