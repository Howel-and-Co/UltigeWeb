import Head from "next/head";
import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import React, { useState, useEffect } from 'react';
import axios from '../../src/utils/axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
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

const Report = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [transactionDataFetchActive, setTransactionDataFetchActive] = React.useState(false);
  const [transactionDataLoading, setTransactionDataLoading] = React.useState(false);

  const [transactionData, setTransactionData] = React.useState();

  const moment = require('moment-timezone');
  moment.locale('id');

  const [transactionStartDate, setTransactionStartDate] = React.useState(moment());
  const [transactionEndDate, setTransactionEndDate] = React.useState(moment());

  const handleTransactionStartDateChange = (date) => {
    setTransactionStartDate(date);
  };

  const handleTransactionEndDateChange = (date) => {
    setTransactionEndDate(date);
  };

  useEffect(() => {
    const fetchTransactionData = async (startDate, endDate) => {
        setTransactionDataLoading(true);
        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/report/transaction?startDate=${startDate}&endDate=${endDate}`);

        let processedData;
        processedData = result.data;

        setTransactionData(processedData);
        window.open(processedData.ReportFileUrl, '_blank');
        setTransactionDataLoading(false);
    };

    if (transactionDataFetchActive == true) {
        const moment = require('moment-timezone');

        let startDate;
        startDate = moment(transactionStartDate).format("YYYY-MM-DD");

        let endDate;
        endDate = moment(transactionEndDate).format("YYYY-MM-DD");

        fetchTransactionData(startDate, endDate);
        setTransactionDataFetchActive(false);
    }
  }, [transactionDataFetchActive]);

  return (
    <div className={classes.root}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper} elevation={3}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 26,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Report Transaksi
                  </Typography>
                </Grid>
                <Grid container>
                  <Grid item xs={12} md={8}>
                    <Box className={classes.inline}>
                      { isMobile
                        ? <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 16,
                              fontWeight: 'bold',
                              marginTop: 9,
                              marginBottom: 16,
                              marginRight: 25,
                              marginLeft: 9
                            }}
                          >
                            Tanggal<br/>Awal
                          </Typography>
                        : <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginTop: 22,
                              marginBottom: 30,
                              marginRight: 40,
                              marginLeft: 9
                            }}
                          >
                            Tanggal
                          </Typography>
                      }
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={transactionStartDate}
                          style={{marginTop: 10, marginRight: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handleTransactionStartDateChange}
                        />
                        { !isMobile && 
                          <KeyboardDatePicker
                            variant="inline"
                            format="YYYY-MM-DD"
                            label="End Date"
                            value={transactionEndDate}
                            style={{marginTop: 10, minWidth: 150, maxWidth: 150}}
                            onChange={handleTransactionEndDateChange}
                          />
                        }
                      </MuiPickersUtilsProvider>
                    </Box>
                  </Grid>
                  { isMobile && 
                    <Grid item xs={12}>
                      <Box className={classes.inline}>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginTop: 9,
                            marginBottom: 16,
                            marginRight: 25,
                            marginLeft: 9
                          }}
                        >
                          Tanggal<br/>Akhir
                        </Typography>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="YYYY-MM-DD"
                            label="End Date"
                            value={transactionEndDate}
                            style={{marginTop: 10, minWidth: 150, maxWidth: 150}}
                            onChange={handleTransactionEndDateChange}
                          />
                        </MuiPickersUtilsProvider>
                      </Box>
                    </Grid>
                  }
                </Grid>
                <Grid item xs={4}>
                    { transactionDataLoading &&
                        <Box className={classes.inline} style={{marginTop: 20, marginLeft: 15, marginBottom: 15}}>
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
                <Grid item xs={8} container justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        style={{
                            borderRadius: 4,
                            textTransform: "none",
                            marginTop: 20, 
                            marginRight: 15, 
                            marginBottom: 15
                        }}
                        disabled={transactionDataLoading}
                        onClick={() => setTransactionDataFetchActive(true)}
                        disableRipple
                    >
                        Proses
                    </Button>
                </Grid>
                { transactionDataLoading &&
                    <Grid item xs={12}>
                        <Typography 
                            style={{
                            color: "#000", 
                            fontSize: 14,
                            marginLeft: 9,
                            marginBottom: 9
                            }}
                        >
                            Please wait, your file will be downloaded automatically.
                        </Typography>
                    </Grid>
                }
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
}

export default Report;