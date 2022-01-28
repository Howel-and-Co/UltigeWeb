import {
  Button,
  Grid,
  Container,
} from "@material-ui/core";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import NavButton from "./NavButton";
import { Fragment } from "react";
import { checkToken, removeToken } from "../utils/config";
import Router from "next/router";

const navButtons = [
  {
    label: "Analytic",
    path: "/analytic"
  },
  {
    label: "Report",
    path: "/report"
  }
];

const navButtons2 = [];

const NavBar = () => {
  const handleSignOut = () => {
    const logout = removeToken();
    if (logout) {
      Router.push("/login");
    }
  };
  

  return (
    <div className="container">
      <Grid container justifyContent="center">
        <Container maxWidth="lg" disableGutters>
          <Grid
            container
            style={{ paddingLeft: 32, paddingRight: 32 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item style={{ flexDirection: "column" }} xs={4}>
              <Link href= {checkToken() ? "/login" : "/analytic"}>
                <a>
                  <img
                    style={{ paddingTop: 14, paddingBottom: 14, width: 100 }}
                    src="/howel-logo.svg"
                    alt=""
                  />
                </a>
              </Link>
            </Grid>

            <Grid item justifyContent="flex-end" container spacing={0} xs>
              { checkToken() && navButtons.map((button, i) => (
                <Fragment key={i}>
                    <Grid item key={i} style={{marginLeft: 15}}>
                      <NavButton
                        key={button.path}
                        path={button.path || ""}
                        label={button.label}
                      />
                    </Grid>
                </Fragment>
              ))}
            </Grid>

            <Grid>
              { checkToken() &&
                <Button
                  variant="outlined"
                  style={{
                    borderRadius: 4,
                    textTransform: "none",
                    marginLeft: 15
                  }}
                  disableRipple
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              }
            </Grid>
          </Grid>
        </Container>
      </Grid>

      <style jsx>{`
        .container {
          width: 100%;
          height: 88px;
          background-color: #ffffff;
          border-bottom: 1.5px solid #e4e4e4;
          position: fixed;
          display: flex;
          z-index: 99;
        }
      `}</style>
    </div>
  )
}

export default NavBar
