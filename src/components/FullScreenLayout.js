import React, { useEffect } from 'react';
import NavBar from "./NavBar";
import Router from "next/router";

import { makeStyles } from 'tss-react/mui';
import { Container } from "@mui/material";
import { checkToken, removeToken } from "../utils/config";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

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

const FullScreenLayout = props => {
  const { classes } = useStyles();
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

  if (checkToken() && authorized == true) {
    return (
      <>
        <NavBar />
        <main className={classes.mainWrap} style={{ minHeight: "100vh" }}>
          <Container maxWidth="xl" disableGutters>{props.children}</Container>
        </main>
      </>
    );
  }
  else {
    return <React.Fragment/>
  }
};

export default FullScreenLayout;
