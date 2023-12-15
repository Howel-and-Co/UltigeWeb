import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import Router from "next/router";
import Cookies from "js-cookie";

import { makeStyles } from 'tss-react/mui';
import { Container } from "@mui/material";
import { checkToken } from "../utils/config";

const useStyles = makeStyles()((theme) => {
  return {
    mainWrap: {
      position: "relative",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      paddingTop: 90
    }
  };
});

const LoginLayout = props => {
  const { classes } = useStyles();

  useEffect(() => {
    if (checkToken()) {
      if (Cookies.get("role") != "SUPER"
        && Cookies.get("role") != "MERCHANDISE"
        && Cookies.get("role") != "ADM MERCHANDISE"
        && Cookies.get("role") != "GA MKT") {
        Router.push("/sop");
      }
      else {
        Router.push("/analytic");
      }
    }
  }, []);

  if (!checkToken()) {
    return (
      <>
        <NavBar />
        <main className={classes.mainWrap} style={{ minHeight: "100vh" }}>
          <Container maxWidth="lg" disableGutters>{props.children}</Container>
        </main>
      </>
    );
  }
  else {
    return <React.Fragment/>
  }
};

export default LoginLayout;
