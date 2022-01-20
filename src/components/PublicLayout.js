import React, { useState, useEffect } from 'react';
import PublicNavBar from "./PublicNavBar";
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

const PublicLayout = props => {
  const classes = useStyles();
  
  return (
    <div>
      <PublicNavBar />
      <main className={classes.mainWrap} style={{ minHeight: "100vh" }}>
        <Container maxWidth="lg" disableGutters>{props.children}</Container>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default PublicLayout;
