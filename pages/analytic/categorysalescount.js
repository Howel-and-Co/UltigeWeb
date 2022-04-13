import Head from "next/head";
import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Divider,
  Box,
  CircularProgress,
  Link
} from "@material-ui/core";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import React, { useState, useEffect } from 'react';
import axios from '../../src/utils/axios';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@material-ui/lab/Pagination';

import { checkToken } from "../../src/utils/config";

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

const CategorySalesCount = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchActive, setFetchActive] = React.useState(true);
  const [newFetchActive, setNewFetchActive] = React.useState(false);
  const [dateOption, setDateOption] = React.useState('realtime');
  const [dataRange, setDataRange] = React.useState('realtime');
  const [dataLoading, setDataLoading] = React.useState(false);

  const [categorySalesCountData, setCategorySalesCountData] = React.useState();

  const [customDayRange, setCustomDayRange] = React.useState('');
  const [customWeekRange, setCustomWeekRange] = React.useState('');
  const [customMonthRange, setCustomMonthRange] = React.useState('');
  const [customYearRange, setCustomYearRange] = React.useState('');
  
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = React.useState(1);

  const [cachePaginationIndex, setCachePaginationIndex] = React.useState();
  const [cachePaginationData, setCachePaginationData] = React.useState();

  const [monthlyStartDate, setMonthlyStartDate] = useState();
  const [monthlyEndDate, setMonthlyEndDate] = useState();

  const handlePageChange = (event, value) => {
    setPage(value);
    setNewFetchActive(true);
  };

  const moment = require('moment-timezone');
  moment.locale('id');

  const handleChange = (event) => {
    setDateOption(event.target.value);

    if (event.target.value != 'custom-daily' 
      && event.target.value != 'custom-weekly' 
      && event.target.value != 'custom-monthly' 
      && event.target.value != 'custom-yearly') {
      setDataRange(event.target.value);
      setFetchActive(true);
    }
  };

  const [selectedStartDate, setSelectedStartDate] = React.useState(moment());
  const [newStartDate, setNewStartDate] = React.useState(moment());
  const [newEndDate, setNewEndDate] = React.useState(moment());

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const applyCustomDate = () => {
    if (dateOption == 'custom-daily') {
      setNewStartDate(moment(selectedStartDate).format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).format("YYYY-MM-DD"));
      setDataRange('realtime');
    }
    else if (dateOption == 'custom-weekly') {
      setNewStartDate(moment(selectedStartDate).startOf('isoWeek').format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).endOf('isoWeek').format("YYYY-MM-DD"));
      setDataRange('weekly');
    }
    else if (dateOption == 'custom-monthly') {
      setNewStartDate(moment(selectedStartDate).startOf('month').format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).endOf('month').format("YYYY-MM-DD"));
      setDataRange('monthly');
    }
    else if (dateOption == 'custom-yearly') {
      setNewStartDate(moment(selectedStartDate).startOf('year').format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).endOf('year').format("YYYY-MM-DD"));
      setDataRange('yearly');
    }

    setFetchActive(true);
  };

  useEffect(() => {
    const fetchCategorySalesCountData = async (startDate, endDate, dataRange) => {
        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);
  
        let processedData;
        processedData = result.data;
  
        setCategorySalesCountData(processedData);
        setCachePaginationData(processedData);
        setDataLoading(false);
      };

    const fetchCategorySalesTotalRowsData = async (startDate, endDate, dataRange) => {
      setDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    if (fetchActive == true && checkToken()) {
      setCustomDayRange('');
      setCustomWeekRange('');
      setCustomMonthRange('');
      setCustomYearRange('');

      const moment = require('moment-timezone');
      
      let momentStartDate;
      let momentEndDate;

      momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

      while (momentStartDate.month() == momentEndDate.month()) {
        momentStartDate = momentStartDate.subtract(1, "days");
      }

      while (momentStartDate.date() > momentEndDate.date()) {
        momentStartDate = momentStartDate.subtract(1, "days");
      }

      setMonthlyStartDate(momentStartDate.format('DD-MM-YYYY'));
      setMonthlyEndDate(momentEndDate.format('DD-MM-YYYY'));
      
      if (dataRange == 'realtime') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'monthly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(30, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }

      let startDate;
      let endDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-daily') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomDayRange(`${moment(newStartDate).format('DD-MM-YYYY')}`);
      }
      else if (dateOption == 'custom-weekly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomWeekRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);
      }
      else if (dateOption == 'custom-monthly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomMonthRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);
      }
      else if (dateOption == 'custom-yearly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomYearRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);
      }

      setPage(1);

      let indexArray = new Array();
      indexArray.push(1);
      let object = new Object();
      object.Data = indexArray;

      setCachePaginationIndex(object);
      setCachePaginationData(null);

      fetchCategorySalesTotalRowsData(startDate, endDate, dataRange);
      fetchCategorySalesCountData(startDate, endDate, dataRange);

      setFetchActive(false);
    }
  }, [fetchActive]);

  useEffect(() => {
    const fetchCategorySalesCountData = async (startDate, endDate, dataRange) => {
      setDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=${page}`);

      let processedData;
      processedData = result.data;

      let object = new Object();
      let newData = new Array();

      for (const data of categorySalesCountData.Data) {
          newData.push(data);
      }

      for (const data of processedData.Data) {
          newData.push(data);
      }

      object.Data = newData;
      
      setCategorySalesCountData(object);
      setCachePaginationData(processedData);
      setDataLoading(false);
    };

    if (newFetchActive == true && checkToken()) {
        if (cachePaginationIndex.Data.includes(page) == false) {  
            const moment = require('moment-timezone');
        
            let momentStartDate;
            let momentEndDate;
            
            if (dataRange == 'realtime') {
                momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
                momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");
            }
            else if (dataRange == 'yesterday') {
                momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
                momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
            }
            else if (dataRange == 'weekly') {
                momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
                momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
            }
            else if (dataRange == 'monthly') {
                momentStartDate = moment().tz("Asia/Jakarta").subtract(30, "days");
                momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
            }

            let startDate;
            let endDate;

            if (dateOption != 'custom-daily' 
                && dateOption != 'custom-weekly' 
                && dateOption != 'custom-monthly' 
                && dateOption != 'custom-yearly') {
                startDate = momentStartDate.format("YYYY-MM-DD");
                endDate = momentEndDate.format("YYYY-MM-DD");
            }
            else {
                startDate = newStartDate;
                endDate = newEndDate;
            }

            let indexArray = new Array();
            for (const data of cachePaginationIndex.Data) {
                indexArray.push(data);
            }
            indexArray.push(page);
            let object = new Object();
            object.Data = indexArray;
            setCachePaginationIndex(object);

            fetchCategorySalesCountData(startDate, endDate, dataRange);
        }
        else {
            let object = new Object();
            let newData = new Array();
    
            for (const data of categorySalesCountData.Data) {
                if (data.Rank > ((page - 1) * 10) && data.Rank <= page * 10)
                    newData.push(data);
            }
    
            object.Data = newData;
            setCachePaginationData(object);
        }
    }

    
    setNewFetchActive(false);
  }, [newFetchActive]);

  return (
    <div className={classes.root}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                <FormControl variant="outlined" className={classes.formControl}>
                  { isMobile
                    ? <InputLabel>Periode Data</InputLabel>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 9,
                          marginBottom: 9,
                          marginRight: 15
                        }}
                      >
                        Periode Data
                      </Typography>
                  }
                  { isMobile
                    ? <Select
                        value={dateOption}
                        onChange={handleChange}
                        style={{height: 60, width: 375}}
                        label="Periode Data"
                        classes={{ root: classes.selectRoot }}
                      >
                        <MenuItem disableRipple value='realtime'>Real-time: <br/>Hari ini - Pk {moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00</MenuItem>
                        <MenuItem disableRipple value='yesterday'>Kemarin: <br/>{moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                        <MenuItem disableRipple value='weekly'>Minggu sebelumnya: <br/>{moment().tz("Asia/Jakarta").subtract(7, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                        <MenuItem disableRipple value='monthly'>Bulan sebelumnya: <br/>{monthlyStartDate} - {monthlyEndDate}</MenuItem>
                        <Divider style={{margin: 12}}/>
                        <MenuItem disableRipple value='custom-daily'>Per Hari: <br/>{customDayRange}</MenuItem>
                        <MenuItem disableRipple value='custom-weekly'>Per Minggu: <br/>{customWeekRange}</MenuItem>
                        <MenuItem disableRipple value='custom-monthly'>Per Bulan: <br/>{customMonthRange}</MenuItem>
                        <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun: <br/>{customYearRange}</MenuItem>
                      </Select>
                    : <Select
                        value={dateOption}
                        onChange={handleChange}
                        style={{height: 45, width: 450}}
                        classes={{ root: classes.selectRoot }}
                      >
                        <MenuItem disableRipple value='realtime'>Real-time: Hari ini - Pk {moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00</MenuItem>
                        <MenuItem disableRipple value='yesterday'>Kemarin: {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                        <MenuItem disableRipple value='weekly'>Minggu sebelumnya: {moment().tz("Asia/Jakarta").subtract(7, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                        <MenuItem disableRipple value='monthly'>Bulan sebelumnya: {monthlyStartDate} - {monthlyEndDate}</MenuItem>
                        <Divider style={{margin: 12}}/>
                        <MenuItem disableRipple value='custom-daily'>Per Hari: {customDayRange}</MenuItem>
                        <MenuItem disableRipple value='custom-weekly'>Per Minggu: {customWeekRange}</MenuItem>
                        <MenuItem disableRipple value='custom-monthly'>Per Bulan: {customMonthRange}</MenuItem>
                        <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun: {customYearRange}</MenuItem>
                      </Select>
                  }
                </FormControl>
                { (dateOption == "custom-daily" 
                  || dateOption == "custom-weekly"
                  ||dateOption == "custom-monthly"
                  ||dateOption == "custom-yearly") && !isMobile &&
                  <Grid style={{margin: 10}}>  
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      { (dateOption == "custom-daily" || dateOption == "custom-weekly") &&
                        <KeyboardDatePicker
                          orientation="landscape"
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={selectedStartDate}
                          style={{marginRight: 15, width: 150}}
                          onChange={handleStartDateChange}
                        />
                      }
                      { dateOption == "custom-monthly" &&
                        <KeyboardDatePicker
                          orientation="landscape"
                          views={["month"]}
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={selectedStartDate}
                          style={{marginRight: 15, width: 150}}
                          onChange={handleStartDateChange}
                        />
                      }
                      { dateOption == "custom-yearly" &&
                        <KeyboardDatePicker
                          orientation="landscape"
                          views={["year"]}
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={selectedStartDate}
                          style={{marginRight: 15, width: 150}}
                          onChange={handleStartDateChange}
                        />
                      }
                    </MuiPickersUtilsProvider>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      style={{marginTop: 8}}
                      onClick={applyCustomDate}
                    >
                      Apply
                    </Button>
                  </Grid>
                }
              </Box>
              { (dateOption == "custom-daily" 
                || dateOption == "custom-weekly"
                ||dateOption == "custom-monthly"
                ||dateOption == "custom-yearly") && isMobile &&
                <Grid style={{margin: 10}}>  
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    { (dateOption == "custom-daily" || dateOption == "custom-weekly") &&
                      <KeyboardDatePicker
                        variant="inline"
                        format="YYYY-MM-DD"
                        label="Start Date"
                        value={selectedStartDate}
                        style={{marginRight: 15, width: 150}}
                        onChange={handleStartDateChange}
                      />
                    }
                    { dateOption == "custom-monthly" &&
                      <KeyboardDatePicker
                        views={["month"]}
                        variant="inline"
                        format="YYYY-MM-DD"
                        label="Start Date"
                        value={selectedStartDate}
                        style={{marginRight: 15, width: 150}}
                        onChange={handleStartDateChange}
                      />
                    }
                    { dateOption == "custom-yearly" &&
                      <KeyboardDatePicker
                        views={["year"]}
                        variant="inline"
                        format="YYYY-MM-DD"
                        label="Start Date"
                        value={selectedStartDate}
                        style={{marginRight: 15, width: 150}}
                        onChange={handleStartDateChange}
                      />
                    }
                  </MuiPickersUtilsProvider>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    style={{marginTop: 8}}
                    onClick={applyCustomDate}
                  >
                    Apply
                  </Button>
                </Grid>
              }
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Peringkat Produk (teratas)
                  </Typography>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                  <Link
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      textDecoration: "none"
                    }}
                    href={"/analytic"}
                  >
                    <KeyboardArrowLeftIcon
                      style={{ color: '#4084e1', fontSize: 20}}
                    />
                    <Typography
                      gutterBottom
                      variant="body2"
                      style={{
                        color: "#4084e1",
                        fontWeight: "normal",
                        marginTop: 7,
                        marginRight: 3
                      }}
                    >
                      Kembali
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={12} style={{padding: 15}}>
                  <TableContainer component={Paper} variant="outlined">
                      <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                          <TableRow>
                          <TableCell>Peringkat</TableCell>
                          <TableCell align="left">Informasi Produk</TableCell>
                          <TableCell align="right">Total Produk Dipesan</TableCell>
                          <TableCell align="right">Proporsi</TableCell>
                          <TableCell align="right">Tingkat Perubahan</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {cachePaginationData && cachePaginationData.Data.map((row) => (
                          <TableRow
                              key={row.Rank}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                              <Typography>
                                  {row.Rank}
                              </Typography>
                              </TableCell>
                              <TableCell align="left">
                              <Grid container style={{marginTop: 10}}>
                                  <img 
                                  src={row.ProductImage != "" ? row.ProductImage : "/icons/no-image.jpg"} 
                                  width={75} 
                                  height={75} 
                                  style={{borderRadius: 5}} 
                                  alt="Product Image"
                                  />
                                  <Typography 
                                  style={{
                                      color: "#000", 
                                      fontSize: 16,
                                      fontWeight: 500,
                                      marginTop: 5,
                                      marginLeft: 10
                                  }}
                                  >
                                  {row.ProductCategoryName}
                                  <br/>
                                  <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
                                  </Typography>
                              </Grid>
                              </TableCell>
                              <TableCell align="right" style={{width: 225}}>
                              <Typography>
                                  {Intl.NumberFormat('id').format(row.Value)}
                              </Typography>
                              </TableCell>
                              <TableCell align="right" style={{width: 150}}>
                              <Typography>
                                  {Intl.NumberFormat('id').format(row.Proportion)}%
                              </Typography>
                              </TableCell>
                              <TableCell align="right" style={{width: 175}}>
                              <Grid container justifyContent="flex-end">
                                  <Typography>
                                  {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
                                  </Typography>
                                  { row.Growth >= 0
                                  ? <TrendingUpIcon
                                      style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                      />
                                  : <TrendingDownIcon
                                      style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                      />
                                  }
                              </Grid>
                              </TableCell>
                          </TableRow>
                          ))}
                      </TableBody>
                      </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={4}>
                  { dataLoading &&
                    <Box className={classes.inline} style={{marginTop: 20, marginLeft: 30}}>
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
                  <Box style={{margin: 15}}>
                    <Pagination
                      count={pageCount}
                      page={page}
                      onChange={handlePageChange}
                      color='primary'
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
}

export default CategorySalesCount;