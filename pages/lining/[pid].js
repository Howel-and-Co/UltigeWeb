import Head from "next/head";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Slide,
  Card,
  CardMedia,
  ButtonBase,
  Dialog,
  AppBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { useRouter } from 'next/router';

import React, { useState, useEffect, useRef } from 'react';
import axios from '../../src/utils/axios';

import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

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
  },
  text: {
    height: 30
  },
  pdfDocument: {
    backgroundColor: '#fafafa',
    paddingTop: 66
  },
  pdfPage: {
    display: 'table',
    margin: '0 auto',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fafafa'
  },
  pdfPageMobile: {
    display: 'table',
    margin: '0 auto',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa'
  }
}));

const Lining = () => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter()
  const { pid } = router.query;

  const [liningImages, setLiningImages] = React.useState(null);
  const [liningImagesLoading, setLiningImagesLoading] = React.useState(false);
  const [liningURL, setLiningURL] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (url) => {
    setLiningURL(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLiningURL(null);
  };

  useEffect(() => {
    const fetchLiningImagesData = async (liningProcessID) => {
      setLiningImagesLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/lining/getliningimages?liningProcessID=${liningProcessID}`);

      let processedData;
      processedData = result.data;

      //console.log(processedData.Data.PhotoURLs);

      setLiningImages(processedData.Data.PhotoURLs);
      
      setLiningImagesLoading(false);
    };

    if (pid != undefined) {
      fetchLiningImagesData(pid);
    }
  }, [pid]);

  return (
    <div className={classes.root}>
      <Head>
          <title>Ultige Web</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container style={{padding: 15}}>
        { liningImages && liningImages.map((value, index) => (
          <Grid key={index} item xs={4} style={{marginBottom: 15}}>
            <Card style={{ 
              width: "97%"
            }}>
              <ButtonBase
                className={classes.cardAction}
                onClick={() => handleClickOpen(value)}
                disableRipple
              >
                <CardMedia
                  component='img'
                  src={value}
                />
              </ButtonBase>
              <Typography align="center" style={{marginTop: 5, marginBottom: 5}}>
                {value.split("/")[5].replace(".jpg", "")}
              </Typography>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          { liningImagesLoading &&
              <Box className={classes.inline}>
                  <CircularProgress size={25} />
                  <Typography 
                      style={{
                          color: "#000", 
                          fontSize: 18,
                          marginLeft: 12
                      }}
                  >
                      Loading
                  </Typography>
              </Box>
          }
        </Grid>
      </Grid>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: 'fixed', background: '#ffffff', color: '#000', borderBottom: '1.5px solid #e4e4e4' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              style={{ backgroundColor: 'transparent' }}
            >   
              <CloseIcon />
            </IconButton>
            <Typography style={{ marginLeft: 10, flex: 1 }} variant="h6" component="div">
              {liningURL && liningURL.split("/")[5].replace(".jpg", "")}
            </Typography>
          </Toolbar>
        </AppBar>

        { liningURL && 
          <Box
            component="img"
            style={{
              paddingTop: 65
            }}
            src={liningURL}
          />
        }
      </Dialog>
    </div>
  );
}

export default Lining;
