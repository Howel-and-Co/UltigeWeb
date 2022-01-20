import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import Footer from "./Footer";
import Router from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { checkToken, removeToken } from "../utils/config";

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

  useEffect(() => {
    if (!checkToken()) {
      removeToken();
      Router.push("/login");
    }
  }, []);

  if (checkToken()) {
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
