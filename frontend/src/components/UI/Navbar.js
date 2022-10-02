import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/authContext";
import classes from "./navbar.module.css";

const Navbar = () => {
  const [loggedInUserName, setLoggedInUserName] = useState();
  const auth = useContext(AuthContext);
  const isLoggedIn = auth.isLoggedIn;

  const logoutHandler = () => {
    auth.logout();
  };

  // Get the logged-in user
  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${process.env.REACT_APP_BACKEND}/api/v1/users/me`, {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        })
        .then((data) => {
          // loggedInUserName = data.data.data.user.name;
          setLoggedInUserName(data.data.data.user.name);
        })
        .catch((err) => {});
    }
  }, [isLoggedIn]);

  return (
    <nav className={classes.navbar}>
      <h1>
        <Link to="/" className={classes.brand}>
          Bidverse
        </Link>
      </h1>
      <ul className={classes.navbar__items}>
        <li className={classes.navbar_link}>
          <Link to="/about">About</Link>
        </li>
        <li className={classes.navbar_link}>
          <Link to="/products">Products on bid</Link>
        </li>
        {isLoggedIn && (
          <li className={classes.navbar_link}>
            <Link to="/users/admin"> {loggedInUserName} (Profile)</Link>
          </li>
        )}

        <li className={classes.navbar_link}>
          <Link to="/rules">Rules</Link>
        </li>
        {!isLoggedIn && (
          <>
            <li className={classes.navbar_link}>
              <Link to="/signup">Signup</Link>
            </li>
            <li className={classes.navbar_link}>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <li>
            <button className={classes.navbar_link_btn} onClick={logoutHandler}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
