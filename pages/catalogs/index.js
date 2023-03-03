import Head from "next/head";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";

import React, { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
    margin: 10
  },
  paper2: {
    margin: 10
  },
  inline: {
    display: "flex",
    flexDirection: "row"
  },
  formControl: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "row"
  },
  selectRoot: {
    '&:focus':{
      backgroundColor: 'transparent'
    }
  },
  tab: {
    minWidth: 230,
    width: 230,
    fontSize: 16
  }
}));

const Catalog = () => {
  const classes = useStyles();

  useEffect(() => {
    window.location.assign("https://catalogs.howelandco.com", '_blank');
  }, []);

  return (
    <div className={classes.root}>
      <Head>
          <title>Ultige Web</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}

export default Catalog;