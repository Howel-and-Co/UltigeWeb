import React, { useState, useEffect } from 'react';
import Router from "next/router";
import { checkToken } from "../src/utils/config";

const Index = () => {
  useEffect(() => {
    if (checkToken()) {
      Router.push("/analytic");
    }
    else {
      Router.push("/login");
    }
  }, []);

  return <React.Fragment/>
};

export default Index;
