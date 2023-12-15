import React, { useState, useEffect } from 'react';
import PublicNavBar from "./PublicNavBar";
import Router from "next/router";
import Cookies from "js-cookie";

import { makeStyles } from 'tss-react/mui';
import { Container } from "@mui/material";
import { checkToken } from "../utils/config";
import { useRouter } from "next/router";

import navButtons from "../../config/buttons";

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

const PublicLayout = props => {
  const { classes } = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (checkToken()) {
      navButtons.forEach(function (dataItem) {
        if (router.pathname == dataItem.path) {
          if ((dataItem.includeRole.length != 0 || dataItem.excludeRole.length != 0) && ((dataItem.excludeRole.length == 0 && dataItem.includeRole.includes(Cookies.get("role")) == false) || (dataItem.includeRole.length == 0 && dataItem.excludeRole.includes(Cookies.get("role")) == true))) {
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
        }
      }); 
    }
  }, []);
  
  return (
    <div>
      <PublicNavBar/>
      <main className={classes.mainWrap} style={{ minHeight: "100vh" }}>
        <Container maxWidth="lg" disableGutters>{props.children}</Container>
      </main>
    </div>
  );
};

export default PublicLayout;
