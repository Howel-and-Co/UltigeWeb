import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import Footer from "./Footer";
import Router from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { checkToken, removeToken } from "../utils/config";
import { useRouter, withRouter } from "next/router";
import Cookies from "js-cookie";

import navButtons from "../../config/buttons";

const useStyles = makeStyles(theme => ({
  mainWrap: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    paddingTop: 90
  }
}));

const Layout = props => {
  const classes = useStyles();
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(true);

  useEffect(() => {
    if (!checkToken()) {
      removeToken();
      Router.push("/login");
    }
    else {
      navButtons.forEach(function (dataItem) {
        if (router.pathname == dataItem.path) {
          if ((dataItem.includeRole.length != 0 || dataItem.excludeRole.length != 0) && ((dataItem.excludeRole.length == 0 && dataItem.includeRole.includes(Cookies.get("role")) == false) || (dataItem.includeRole.length == 0 && dataItem.excludeRole.includes(Cookies.get("role")) == true))) {
            setAuthorized(false);
            if (Cookies.get("role") == "SALES CS") {
              window.location.href = "/product";
            }
            else {
              window.location.href = "/analytic";
            }
          }
        }
      }); 
    }
  }, []);

  if (checkToken() && authorized == true) {
    return (
      <div>
        <NavBar />
        <main className={classes.mainWrap} style={{ minHeight: "100vh" }}>
          <Container maxWidth="lg" disableGutters>{props.children}</Container>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }
  else {
    return <React.Fragment/>
  }
};

export default Layout;
