import Head from "next/head";
import PublicLayout from "../../src/components/PublicLayout";
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
  IconButton,
  TextField,
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
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

const Folding = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter()
  const { pid } = router.query;

  const [liningImages, setLiningImages] = React.useState(null);
  const [liningImagesLoading, setLiningImagesLoading] = React.useState(false);
  const [liningURL, setLiningURL] = React.useState(null);
  const [liningTitle, setLiningTitle] = React.useState(null);

  const [buyer, setBuyer] = React.useState(null);
  const [receiver, setReceiver] = React.useState(null);
  const [deliverDate, setDeliverDate] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (url, productName, embroideryName) => {
    setLiningURL(url);
    if (productName != null && embroideryName != null)
      setLiningTitle(productName + " / " + embroideryName);
    else
      setLiningTitle("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLiningURL(null);
    setLiningTitle(null);
  };

  useEffect(() => {
    const fetchLiningImagesData = async (liningProcessID) => {
      setLiningImagesLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/folding/getfoldingimages?id=${liningProcessID}`);

      let processedData;
      processedData = result.data;

      //console.log(processedData.Data.FoldingPhotos);

      const moment = require('moment-timezone');

      setBuyer(processedData.Data.Buyer);
      setReceiver(processedData.Data.Receiver);
      setDeliverDate(moment(processedData.Data.DeliverDate).format("DD/MM/YYYY"));
      setLiningImages(processedData.Data.FoldingPhotos);
      
      setLiningImagesLoading(false);
    };

    if (pid != undefined) {
      fetchLiningImagesData(encodeURIComponent(pid));
    }
  }, [pid]);

  return (
    <div className={classes.root}>
      <PublicLayout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 15}}>
          <Grid item xs={12} style={{marginBottom: 10}}>
            <Box className={classes.inline} style={{marginBottom: 7}}>
                <Typography 
                    style={{
                        color: "#000", 
                        fontSize: 18,
                        marginTop: 6,
                        width: 100
                    }}
                >
                    Pembeli:
                </Typography>
                <TextField
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                        readOnly: true,
                    }}
                    style={{
                        width: 200,
                        marginTop: 0,
                        marginBottom: 0,
                        padding: 0
                    }}
                    value={buyer} 
                />
            </Box>
            <Box className={classes.inline} style={{marginBottom: 7}}>
                <Typography 
                    style={{
                        color: "#000", 
                        fontSize: 18,
                        marginTop: 6,
                        width: 100
                    }}
                >
                    Penerima:
                </Typography>
                <TextField
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                        readOnly: true,
                    }}
                    style={{
                        width: 200,
                        marginTop: 0,
                        marginBottom: 0,
                        padding: 0
                    }}
                    value={receiver} 
                />
            </Box>
            <Box className={classes.inline} style={{marginBottom: 7}}>
                <Typography 
                    style={{
                        color: "#000", 
                        fontSize: 18,
                        marginTop: 6,
                        width: 100
                    }}
                >
                    Tgl. Kirim:
                </Typography>
                <TextField
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                        readOnly: true,
                    }}
                    style={{
                        width: 200,
                        marginTop: 0,
                        marginBottom: 0,
                        padding: 0
                    }}
                    value={deliverDate} 
                />
            </Box>
          </Grid>
          { liningImages && liningImages.map(value => (
            <Grid item xs={12} sm={6} md={4} style={{marginBottom: 15}}>
              <Card style={{ 
                width: "97%"
              }}>
                <ButtonBase
                  className={classes.cardAction}
                  onClick={() => handleClickOpen(value.PhotoURL, value.ProductName, value.EmbroideryName)}
                  disableRipple
                >
                  <CardMedia
                    component='img'
                    src={value.PhotoURL}
                  />
                </ButtonBase>
                { value.ProductName != null && value.EmbroideryName != null &&
                  <Typography align="center" style={{margin: 10}}>
                    {value.ProductName} / {value.EmbroideryName}
                  </Typography>
                }
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
      </PublicLayout>

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
              {liningTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        { liningURL && !isMobile && 
          <Box
            component="img"
            style={{
              paddingTop: 65,
            }}
            src={liningURL}
          />
        }
        { liningURL && isMobile && 
          <Box style={{
            paddingTop: 65,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <Box
              component="img"
              style={{
                width: "100%",
              }}
              src={liningURL}
            />
          </Box>
        }
      </Dialog>
    </div>
  );
}

export default Folding;
