import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  TextField
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MomentUtils from '@date-io/moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import moment from '../../src/utils/moment';
import { getCurrentTime } from '../../src/utils/momentSystem';
import { checkToken } from "../../src/utils/config";

import React, { useEffect } from 'react';
import axios from '../../src/utils/axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const useStyles = makeStyles()((theme) => {
  return {
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
  };
});

const ReportDeliver = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportDeliverStartDate, setReportDeliverStartDate] = React.useState(getCurrentTime());
  const [reportDeliverEndDate, setReportDeliverEndDate] = React.useState(getCurrentTime());

  const [reportDeliverData, setReportDeliverData] = React.useState();
  const [reportDeliverDataLoading, setReportDeliverDataLoading] = React.useState(false);
  const [reportDeliverFetchActive, setReportDeliverFetchActive] = React.useState(false);

  const handleReportDeliverStartDateChange = (date) => {
    setReportDeliverStartDate(date);
  };

  const handleReportDeliverEndDateChange = (date) => {
    setReportDeliverEndDate(date);
  };

  const handleReportDeliverFetchActive = () => {
    setReportDeliverFetchActive(true);
  };

  useEffect(() => {
    const fetchReportDeliverData = async (startDate, endDate) => {
      setReportDeliverDataLoading(true);
  
      const result = await axios.get(`http://localhost:5000/ultigeapi/web/analytic/getreportvaluebydeliver?startDate=${startDate}&endDate=${endDate}`);
  
      let processedData;
      processedData = result.data;
  
      setReportDeliverData(processedData);
      setReportDeliverDataLoading(false);
    };

    if (reportDeliverFetchActive == true && checkToken()) {
      let startDate;
      startDate = moment(reportDeliverStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(reportDeliverEndDate).format("YYYY-MM-DD");

      fetchReportDeliverData(startDate, endDate);

      setReportDeliverFetchActive(false);
    }
  }, [reportDeliverFetchActive]);

  return (
    <Layout>
      <Grid container style={{padding: 5}}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={3}>
            <Grid container>
              <Grid item xs={12}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 20,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Laporan Deliver
                </Typography>
              </Grid>
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
                          marginRight: 97,
                          marginLeft: 9
                        }}
                      >
                        Tanggal
                      </Typography>
                  }
                  <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                    <DatePicker
                      inputFormat="yyyy-MM-dd"
                      label="Start Date"
                      value={reportDeliverStartDate}
                      onChange={handleReportDeliverStartDateChange}
                      renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, marginRight: 10, width: 150}} {...props} />}
                      minDate={moment('01-01-2016').toDate()}
                      maxDate={getCurrentTime().toDate()}
                    />
                    { !isMobile && 
                      <DatePicker
                        inputFormat="yyyy-MM-dd"
                        label="End Date"
                        value={reportDeliverEndDate}
                        onChange={handleReportDeliverEndDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                        minDate={moment('01-01-2016').toDate()}
                        maxDate={getCurrentTime().toDate()}
                      />
                    }
                  </LocalizationProvider>
                  { !isMobile && 
                    <Button 
                      variant="outlined"
                      style={{
                        borderRadius: 4,
                        textTransform: "none",
                        marginLeft: 10,
                        marginTop: 10,
                        width: 100,
                        height: 50
                      }}
                      disableRipple
                      onClick={handleReportDeliverFetchActive}
                    >
                      Apply
                    </Button>
                  }
                </Box>
              </Grid>
              { isMobile && 
                <Grid item xs={12} md={8}>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                      <DatePicker
                        inputFormat="yyyy-MM-dd"
                        label="End Date"
                        value={reportDeliverEndDate}
                        onChange={handleReportDeliverEndDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                        minDate={moment('01-01-2016').toDate()}
                        maxDate={getCurrentTime().toDate()}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Button 
                    variant="outlined"
                    style={{
                      borderRadius: 4,
                      textTransform: "none",
                      marginLeft: 10,
                      marginBottom: 16,
                      width: 80,
                      height: 40
                    }}
                    disableRipple
                    onClick={handleReportDeliverFetchActive}
                  >
                    Apply
                  </Button>
                </Grid>
              }
              {reportDeliverData &&
                <Grid item xs={12} style={{ margin: 10 }}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table sx={{ minWidth: 350 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Lining Row</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportDeliverData && reportDeliverData.Data.map((row) => (
                          <TableRow
                            key={row.LiningRow}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="left" style={{minWidth: 100}}>
                              <Typography>
                                {row.LiningRow}
                              </Typography>
                            </TableCell>
                            <TableCell align="left" style={{minWidth: 100}}>
                              <Typography>
                                {row.Priority}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>
                                Rp {Intl.NumberFormat('id').format(row.Total)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              }
              <Grid item xs={12}>
                { (reportDeliverDataLoading) &&
                  <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default ReportDeliver;