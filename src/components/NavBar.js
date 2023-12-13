import {
  Button,
  Grid,
  Container,
  SwipeableDrawer,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { withStyles, useTheme } from "@mui/material/styles";
import { makeStyles } from 'tss-react/mui';
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import NavButton from "./NavButton";
import { Fragment } from "react";
import { checkToken, removeToken } from "../utils/config";
import Router from "next/router";
import Cookies from "js-cookie";
import { useRouter, withRouter } from "next/router";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from '@mui/icons-material/Menu';
import clsx from "clsx";

import navButtons from "../../config/buttons";

const useStyles = makeStyles()((theme) => {
  return {
    "@keyframes slideRight": {
      from: {
        opacity: 0,
        transform: "translateX(-100px)"
      },
      to: {
        opacity: 1,
        transform: "none"
      }
    },
    fixed: {},
    openDrawer: {},
    menu: {},
    paperNav: {
      width: "100%",
      [theme.breakpoints.up(680)]: {
        width: 300
      }
    },
    mobileMenu: {
      marginRight: theme.spacing(),
      marginTop: 13,
      "&:bar": {
        backgroundColor: theme.palette.text.secondary,
        "&:after, &:before": {
          backgroundColor: theme.palette.text.secondary
        }
      }
    },
    mobileNav: {
      background: theme.palette.background.paper,
      "& $menu": {
        padding: theme.spacing(0, 2),
        overflow: "auto",
        top: 70,
        width: "100%",
        position: "absolute",
        height: "calc(100% - 80px)",
        "& a": {
          animationName: "$slideRight",
          animationTimingFunction: "ease",
        }
      }
    },
    menuListCurrent: {
      textTransform: "capitalize",
      "& span": {
        fontSize: 24
      },
      color: "#8854D0"
    },
    menuList: {
      textTransform: "capitalize",
      "& span": {
        fontSize: 24
      }
    },
    iconWrap: {
      display: "flex",
      justifyContent: "flex-end"
    }
  };
});

const NavBar = ({isPrivate = true}) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = true;
  const router = useRouter();
  
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleSignOut = () => {
    const logout = removeToken();
    if (logout) {
      Router.push("/login");
    }
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <div className="container">
      <Grid container justifyContent="center">
        <Container maxWidth="lg" disableGutters>
          <Grid
            container
            style={{ paddingLeft: isMobile ? 0 : 32, paddingRight: isMobile ? 0 : 32 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            { checkToken() && isMobile &&
              <IconButton
                onClick={handleOpenDrawer}
                style={{ backgroundColor: 'transparent' }}
                disableRipple
                size="large">
                <MenuIcon style={{color: "#000"}} fontSize="large" />
              </IconButton>
            }

            { isPrivate ?
              <Grid item style={{ flexDirection: "column", marginLeft: checkToken() ? 0 : 15 }}>
                <Link href= {checkToken() ? "/login" : "/analytic"}>
                  <Image
                    style={{ paddingTop: 14, paddingBottom: 14, width: 55, height: 'auto' }}
                    width={0}
                    height={0}
                    sizes="100vw"
                    src="/howel-logo-v2-bow.svg"   
                    alt=""
                  />
                </Link>
              </Grid> :
              <Grid item style={{ flexDirection: "column", marginLeft: 15 }}>
                <Image
                  style={{ paddingTop: 14, paddingBottom: 14, width: 55, height: 'auto' }}
                  width={0}
                  height={0}
                  sizes="100vw"
                  src="/howel-logo-v2-bow.svg"
                  alt=""
                />
              </Grid>
            }

            { !isMobile && 
              <Grid item justifyContent="flex-end" container spacing={0} xs>
                { checkToken() && navButtons.map((button, i) => (
                  <Fragment key={i}>
                    { ((button.excludeRole.length == 0 && button.includeRole.includes(Cookies.get("role")) == true) || (button.includeRole.length == 0 && button.excludeRole.includes(Cookies.get("role")) == false)) &&
                      <Grid item key={i} style={{marginLeft: 15}}>
                        <NavButton
                          key={button.path}
                          path={button.path || ""}
                          label={button.label}
                        />
                      </Grid>
                    }
                  </Fragment>
                ))}
              </Grid>
            }

            <Grid>
              { checkToken() &&
                <Button
                  variant="outlined"
                  style={{
                    borderRadius: 4,
                    textTransform: "none",
                    marginLeft: 15,
                    marginRight: isMobile ? 15 : 0
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

      <SwipeableDrawer
        open={openDrawer}
        onClose={handleOpenDrawer}
        onOpen={handleOpenDrawer}
        classes={{
          paper: classes.paperNav
        }}
      >
        <div
          className={classes.mobileNav}
          role="presentation"
          onClick={handleOpenDrawer}
          onKeyDown={handleOpenDrawer}
        >
          <div className={classes.iconWrap}>
            <IconButton
              onClick={handleOpenDrawer}
              className={clsx(
                "hamburger hamburger--spin",
                classes.mobileMenu,
                openDrawer && "is-active"
              )}
              style={{ backgroundColor: 'transparent' }}
              disableRipple
              size="large">
              <CloseIcon style={{color: "#000"}} fontSize="large"/>
            </IconButton>
          </div>
          <div className={clsx(classes.menu, openDrawer && classes.menuOpen)}>
            <List>
              {navButtons.map((item, index) => (
                <Fragment key={index}>
                  { ((item.excludeRole.length == 0 && item.includeRole.includes(Cookies.get("role")) == true) || (item.includeRole.length == 0 && item.excludeRole.includes(Cookies.get("role")) == false)) && 
                    <Link href={`${item.path}`} style={{
                      textDecoration: "none",
                      color: "#000"
                    }}>
                      <ListItem
                        button
                        component="a"
                        key={item.label}
                        index={index.toString()}
                        style={{ animationDuration: (index + 3) * 0.15 + "s" }}
                      >
                        { router.pathname.includes(item.path) ?
                          <ListItemText
                            primary={item.label}
                            className={classes.menuListCurrent}
                          /> :
                          <ListItemText
                            primary={item.label}
                            className={classes.menuList}
                          /> 
                        }
                      </ListItem>
                    </Link>
                  }
                </Fragment>
              ))}
            </List>
          </div>
        </div>
      </SwipeableDrawer>

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
  );
}

export default NavBar
