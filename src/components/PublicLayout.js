import React, { useState, useEffect } from 'react';
import PublicNavBar from "./PublicNavBar";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Router from "next/router";
import Cookies from "js-cookie";

import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { checkToken, removeToken } from "../utils/config";
import { useRouter, withRouter } from "next/router";

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

const PublicLayout = props => {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (checkToken()) {
      navButtons.forEach(function (dataItem) {
        if (router.pathname == dataItem.path) {
          if ((dataItem.includeRole.length != 0 || dataItem.excludeRole.length != 0) && ((dataItem.excludeRole.length == 0 && dataItem.includeRole.includes(Cookies.get("role")) == false) || (dataItem.includeRole.length == 0 && dataItem.excludeRole.includes(Cookies.get("role")) == true))) {
            if (Cookies.get("role") == "SALES CS") {
              Router.push("/product");
            }
            else {
              Router.push("/analytic");
            }
          }
        }
      }); 
    }
  }, []);
  
  return (
    <div>
      <NavBar isPrivate={checkToken() ? true : false}/>
      <main className={classes.mainWrap} style={{ minHeight: "100vh" }}>
        <Container maxWidth="lg" disableGutters>{props.children}</Container>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default PublicLayout;
