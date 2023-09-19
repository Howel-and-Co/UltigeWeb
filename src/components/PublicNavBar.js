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
    label: "Home",
    path: "/"
  },
  {
    label: "About Us"
  },
  {
    label: "FAQ"
  },
  {
    label: "News"
  },
  {
    label: "Gallery"
  }
];

const navButtons2 = [];

const PublicNavBar = () => {
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
              <img
                style={{ paddingTop: 14, paddingBottom: 14, width: 55 }}
                src="/howel-logo-v2-bow.svg"
                alt=""
              />
            </Grid>

            <Grid>
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

export default PublicNavBar
