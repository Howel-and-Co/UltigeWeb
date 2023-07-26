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
  Link,
  Tab
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

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

const CustomSalesRow = ({ row }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          { row.Variant && 
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
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
              {row.ProductName}
              <br/>
              <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
            </Typography>
          </Grid>
        </TableCell>
        <TableCell align="right" style={{width: 225}}>
          <Typography>
            Rp {Intl.NumberFormat('id').format(row.Value)}
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
      <TableRow style={{ backgroundColor: '#fcfcfc' }}>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Peringkat</TableCell>
                    <TableCell align="left">Informasi Varian</TableCell>
                    <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                    <TableCell align="right">Proporsi</TableCell>
                    <TableCell align="right">Tingkat Perubahan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Variant && row.Variant.map((row2) => (
                    <TableRow
                      key={row2.Rank}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                        <Typography>
                            {row2.Rank}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Grid container style={{marginTop: 10}}>
                          <Typography 
                          style={{
                              color: "#000", 
                              fontSize: 16,
                              fontWeight: 500,
                              marginTop: 5
                          }}
                          >
                          {row2.ProductName}
                          <br/>
                          <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell align="right" style={{width: 225}}>
                        <Typography>
                          Rp {Intl.NumberFormat('id').format(row2.Value)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" style={{width: 150}}>
                        <Typography>
                          {Intl.NumberFormat('id').format(row2.Proportion)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right" style={{width: 175}}>
                        <Grid container justifyContent="flex-end">
                          <Typography>
                          {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                          </Typography>
                          { row2.Growth >= 0
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomSalesCountRow = ({ row }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          { row.Variant && 
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
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
              {row.ProductName}
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
      <TableRow style={{ backgroundColor: '#fcfcfc' }}>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Peringkat</TableCell>
                    <TableCell align="left">Informasi Varian</TableCell>
                    <TableCell align="right">Total Produk Dipesan</TableCell>
                    <TableCell align="right">Proporsi</TableCell>
                    <TableCell align="right">Tingkat Perubahan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Variant && row.Variant.map((row2) => (
                    <TableRow
                      key={row2.Rank}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                        <Typography>
                            {row2.Rank}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Grid container style={{marginTop: 10}}>
                          <Typography 
                          style={{
                              color: "#000", 
                              fontSize: 16,
                              fontWeight: 500,
                              marginTop: 5
                          }}
                          >
                          {row2.ProductName}
                          <br/>
                          <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell align="right" style={{width: 225}}>
                        <Typography>
                          {Intl.NumberFormat('id').format(row2.Value)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" style={{width: 150}}>
                        <Typography>
                          {Intl.NumberFormat('id').format(row2.Proportion)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right" style={{width: 175}}>
                        <Grid container justifyContent="flex-end">
                          <Typography>
                          {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                          </Typography>
                          { row2.Growth >= 0
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomCategorySalesCountRow = ({ row }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          { row.Variant && 
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
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
      <TableRow style={{ backgroundColor: '#fcfcfc' }}>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Peringkat</TableCell>
                    <TableCell align="left">Informasi Varian</TableCell>
                    <TableCell align="right">Total Produk Dipesan</TableCell>
                    <TableCell align="right">Proporsi</TableCell>
                    <TableCell align="right">Tingkat Perubahan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Variant && row.Variant.map((row2) => (
                    <TableRow
                      key={row2.Rank}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                        <Typography>
                            {row2.Rank}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Grid container style={{marginTop: 10}}>
                          <Typography 
                          style={{
                              color: "#000", 
                              fontSize: 16,
                              fontWeight: 500,
                              marginTop: 5
                          }}
                          >
                          {row2.ProductName}
                          <br/>
                          <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell align="right" style={{width: 225}}>
                        <Typography>
                          {Intl.NumberFormat('id').format(row2.Value)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" style={{width: 150}}>
                        <Typography>
                          {Intl.NumberFormat('id').format(row2.Proportion)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right" style={{width: 175}}>
                        <Grid container justifyContent="flex-end">
                          <Typography>
                          {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                          </Typography>
                          { row2.Growth >= 0
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ProductRanking = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchActive, setFetchActive] = React.useState(true);
  const [newFetchActive, setNewFetchActive] = React.useState(false);
  const [dateOption, setDateOption] = React.useState('realtime');
  const [dataRange, setDataRange] = React.useState('realtime');
  const [currentStartDate, setCurrentStartDate] = React.useState();
  const [currentEndDate, setCurrentEndDate] = React.useState();

  const [modelSalesData, setModelSalesData] = React.useState();
  const [modelSalesCountData, setModelSalesCountData] = React.useState();
  const [categorySalesData, setCategorySalesData] = React.useState();
  const [categorySalesCountData, setCategorySalesCountData] = React.useState();
  const [productSalesData, setProductSalesData] = React.useState();
  const [productSalesCountData, setProductSalesCountData] = React.useState();
  
  const [modelSalesDataLoading, setModelSalesDataLoading] = React.useState(false);
  const [modelSalesCountDataLoading, setModelSalesCountDataLoading] = React.useState(false);
  const [categorySalesDataLoading, setCategorySalesDataLoading] = React.useState(false);
  const [categorySalesCountDataLoading, setCategorySalesCountDataLoading] = React.useState(false);
  const [productSalesDataLoading, setProductSalesDataLoading] = React.useState(false);
  const [productSalesCountDataLoading, setProductSalesCountDataLoading] = React.useState(false);

  const [customDayRange, setCustomDayRange] = React.useState('');
  const [customWeekRange, setCustomWeekRange] = React.useState('');
  const [customMonthRange, setCustomMonthRange] = React.useState('');
  const [customYearRange, setCustomYearRange] = React.useState('');
  const [customDateRange, setCustomDateRange] = React.useState('');
  
  const [modelSalesPageCount, setModelSalesPageCount] = useState(1);
  const [modelSalesCountPageCount, setModelSalesCountPageCount] = useState(1);
  const [categorySalesPageCount, setCategorySalesPageCount] = useState(1);
  const [categorySalesCountPageCount, setCategorySalesCountPageCount] = useState(1);
  const [productSalesPageCount, setProductSalesPageCount] = useState(1);
  const [productSalesCountPageCount, setProductSalesCountPageCount] = useState(1);
  
  const [modelSalesPage, setModelSalesPage] = useState(1);
  const [modelSalesCountPage, setModelSalesCountPage] = useState(1);
  const [categorySalesPage, setCategorySalesPage] = useState(1);
  const [categorySalesCountPage, setCategorySalesCountPage] = useState(1);
  const [productSalesPage, setProductSalesPage] = useState(1);
  const [productSalesCountPage, setProductSalesCountPage] = useState(1);

  const [modelSalesCachePaginationIndex, setModelSalesCachePaginationIndex] = React.useState();
  const [modelSalesCountCachePaginationIndex, setModelSalesCountCachePaginationIndex] = React.useState();
  const [categorySalesCachePaginationIndex, setCategorySalesCachePaginationIndex] = React.useState();
  const [categorySalesCountCachePaginationIndex, setCategorySalesCountCachePaginationIndex] = React.useState();
  const [productSalesCachePaginationIndex, setProductSalesCachePaginationIndex] = React.useState();
  const [productSalesCountCachePaginationIndex, setProductSalesCountCachePaginationIndex] = React.useState();

  const [modelSalesCachePaginationData, setModelSalesCachePaginationData] = React.useState();
  const [modelSalesCountCachePaginationData, setModelSalesCountCachePaginationData] = React.useState();
  const [categorySalesCachePaginationData, setCategorySalesCachePaginationData] = React.useState();
  const [categorySalesCountCachePaginationData, setCategorySalesCountCachePaginationData] = React.useState();
  const [productSalesCachePaginationData, setProductSalesCachePaginationData] = React.useState();
  const [productSalesCountCachePaginationData, setProductSalesCountCachePaginationData] = React.useState();

  const [monthlyStartDate, setMonthlyStartDate] = useState();
  const [monthlyEndDate, setMonthlyEndDate] = useState();

  const [productTab, setProductTab] = React.useState('1');

  const handleProductTabChange = (event, newValue) => {
    setProductTab(newValue);
    
    if (newValue == '1') {
      if (modelSalesCachePaginationIndex) {
        setNewFetchActive(true);
      }
      else {
        setFetchActive(true);
      }
    }
    else if (newValue == '2') {
      if (modelSalesCountCachePaginationIndex) {
        setNewFetchActive(true);
      }
      else {
        setFetchActive(true);
      }
    }
    else if (newValue == '3') {
      if (categorySalesCachePaginationIndex) {
        setNewFetchActive(true);
      }
      else {
        setFetchActive(true);
      }
    }
    else if (newValue == '4') {
      if (categorySalesCountCachePaginationIndex) {
        setNewFetchActive(true);
      }
      else {
        setFetchActive(true);
      }
    }
    else if (newValue == '5') {
      if (productSalesCachePaginationIndex) {
        setNewFetchActive(true);
      }
      else {
        setFetchActive(true);
      }
    }
    else if (newValue == '6') {
      if (productSalesCountCachePaginationIndex) {
        setNewFetchActive(true);
      }
      else {
        setFetchActive(true);
      }
    }
  };

  const resetData = () => {
    setModelSalesPageCount(1);
    setModelSalesCountPageCount(1);
    setCategorySalesPageCount(1);
    setCategorySalesCountPageCount(1);
    setProductSalesPageCount(1);
    setProductSalesCountPageCount(1);
    
    setModelSalesPage(1);
    setModelSalesCountPage(1);
    setCategorySalesPage(1);
    setCategorySalesCountPage(1);
    setProductSalesPage(1);
    setProductSalesCountPage(1);

    setModelSalesCachePaginationIndex(null);
    setModelSalesCountCachePaginationIndex(null);
    setCategorySalesCachePaginationIndex(null);
    setCategorySalesCountCachePaginationIndex(null);
    setProductSalesCachePaginationIndex(null);
    setProductSalesCountCachePaginationIndex(null);
  };

  const handlePageChange = (event, value) => {
    if (productTab == '1') {
      setModelSalesPage(value);
    }
    else if (productTab == '2') {
      setModelSalesCountPage(value);
    }
    else if (productTab == '3') {
      setCategorySalesPage(value);
    }
    else if (productTab == '4') {
      setCategorySalesCountPage(value);
    }
    else if (productTab == '5') {
      setProductSalesPage(value);
    }
    else if (productTab == '6') {
      setProductSalesCountPage(value);
    }
    
    setNewFetchActive(true);
  };

  const moment = require('moment-timezone');
  moment.locale('id');

  const handleChange = (event) => {
    setDateOption(event.target.value);

    if (event.target.value != 'custom-daily' 
      && event.target.value != 'custom-weekly' 
      && event.target.value != 'custom-monthly' 
      && event.target.value != 'custom-yearly'
      && event.target.value != 'custom-date') {
      setDataRange(event.target.value);

      resetData();
      setFetchActive(true);
    }
  };

  const [selectedStartDate, setSelectedStartDate] = React.useState(moment());
  const [selectedEndDate, setSelectedEndDate] = React.useState(moment());
  const [newStartDate, setNewStartDate] = React.useState(moment());
  const [newEndDate, setNewEndDate] = React.useState(moment());

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
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
    else if (dateOption == 'custom-date') {
      setNewStartDate(moment(selectedStartDate).format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedEndDate).format("YYYY-MM-DD"));

      let endDate = moment(selectedEndDate);
      let startDate = moment(selectedStartDate);
      let dateRange = Math.abs(endDate.diff(startDate, 'days'));

      if (dateRange == 0) {
        setDataRange('realtime');
      }
      else if (dateRange > 0 && dateRange <= 14) {
        setDataRange('weekly');
      }
      else if (dateRange > 14 && dateRange <= 31) {
        setDataRange('monthly');
      }
      else if (dateRange > 31) {
        setDataRange('yearly');
      }
    }

    resetData();
    setFetchActive(true);
  };

  useEffect(() => {
    const fetchModelSalesData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setModelSalesData(processedData);
      setModelSalesCachePaginationData(processedData);
      setModelSalesDataLoading(false);
    };

    const fetchModelSalesTotalRowsData = async (startDate, endDate, dataRange) => {
      setModelSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setModelSalesPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    const fetchModelSalesCountData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setModelSalesCountData(processedData);
      setModelSalesCountCachePaginationData(processedData);
      setModelSalesCountDataLoading(false);
    };

    const fetchModelSalesCountTotalRowsData = async (startDate, endDate, dataRange) => {
      setModelSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setModelSalesCountPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    const fetchCategorySalesData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`http://localhost:5000/ultigeapi/web/analytic/getcategorysales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setCategorySalesData(processedData);
      setCategorySalesCachePaginationData(processedData);
      setCategorySalesDataLoading(false);
    };

    const fetchCategorySalesTotalRowsData = async (startDate, endDate, dataRange) => {
      setCategorySalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setCategorySalesPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    const fetchCategorySalesCountData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setCategorySalesCountData(processedData);
      setCategorySalesCountCachePaginationData(processedData);
      setCategorySalesCountDataLoading(false);
    };

    const fetchCategorySalesCountTotalRowsData = async (startDate, endDate, dataRange) => {
      setCategorySalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setCategorySalesCountPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    const fetchProductSalesData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setProductSalesData(processedData);
      setProductSalesCachePaginationData(processedData);
      setProductSalesDataLoading(false);
    };

    const fetchProductSalesTotalRowsData = async (startDate, endDate, dataRange) => {
      setProductSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setProductSalesPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    const fetchProductSalesCountData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setProductSalesCountData(processedData);
      setProductSalesCountCachePaginationData(processedData);
      setProductSalesCountDataLoading(false);
    };

    const fetchProductSalesCountTotalRowsData = async (startDate, endDate, dataRange) => {
      setProductSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsalestotalrows?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setProductSalesCountPageCount(Math.floor(processedData.Value / 10) + 1);
    };

    if (fetchActive == true && checkToken()) {
      setCustomDayRange('');
      setCustomWeekRange('');
      setCustomMonthRange('');
      setCustomYearRange('');
      setCustomDateRange('');

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
        && dateOption != 'custom-yearly'
        && dateOption != 'custom-date') {
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
      else if (dateOption == 'custom-date') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomDateRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);
      }

      setCurrentStartDate(startDate);
      setCurrentEndDate(endDate);

      let indexArray = new Array();
      indexArray.push(1);
      let object = new Object();
      object.Data = indexArray;

      if (productTab == '1') {
        setModelSalesCachePaginationIndex(object);
        setModelSalesCachePaginationData(null);

        fetchModelSalesTotalRowsData(startDate, endDate, dataRange);
        fetchModelSalesData(startDate, endDate, dataRange);
      }
      else if (productTab == '2') {
        setModelSalesCountCachePaginationIndex(object);
        setModelSalesCountCachePaginationData(null);

        fetchModelSalesCountTotalRowsData(startDate, endDate, dataRange);
        fetchModelSalesCountData(startDate, endDate, dataRange);
      }
      else if (productTab == '3') {
        setCategorySalesCachePaginationIndex(object);
        setCategorySalesCachePaginationData(null);

        fetchCategorySalesTotalRowsData(startDate, endDate, dataRange);
        fetchCategorySalesData(startDate, endDate, dataRange);
      }
      else if (productTab == '4') {
        setCategorySalesCountCachePaginationIndex(object);
        setCategorySalesCountCachePaginationData(null);

        fetchCategorySalesCountTotalRowsData(startDate, endDate, dataRange);
        fetchCategorySalesCountData(startDate, endDate, dataRange);
      }
      else if (productTab == '5') {
        setProductSalesCachePaginationIndex(object);
        setProductSalesCachePaginationData(null);

        fetchProductSalesTotalRowsData(startDate, endDate, dataRange);
        fetchProductSalesData(startDate, endDate, dataRange);
      }
      else if (productTab == '6') {
        setProductSalesCountCachePaginationIndex(object);
        setProductSalesCountCachePaginationData(null);

        fetchProductSalesCountTotalRowsData(startDate, endDate, dataRange);
        fetchProductSalesCountData(startDate, endDate, dataRange);
      }

      setFetchActive(false);
    }
  }, [fetchActive]);

  useEffect(() => {
    const fetchModelSalesData = async (startDate, endDate, dataRange) => {
      setModelSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=${modelSalesPage}`);

      let processedData;
      processedData = result.data;

      let object = new Object();
      let newData = new Array();

      for (const data of modelSalesData.Data) {
        newData.push(data);
      }

      for (const data of processedData.Data) {
        newData.push(data);
      }

      object.Data = newData;
      
      setModelSalesData(object);
      setModelSalesCachePaginationData(processedData);
      setModelSalesDataLoading(false);
    };

    const fetchModelSalesCountData = async (startDate, endDate, dataRange) => {
      setModelSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=${modelSalesCountPage}`);

      let processedData;
      processedData = result.data;

      let object = new Object();
      let newData = new Array();

      for (const data of modelSalesCountData.Data) {
        newData.push(data);
      }

      for (const data of processedData.Data) {
        newData.push(data);
      }

      object.Data = newData;
      
      setModelSalesCountData(object);
      setModelSalesCountCachePaginationData(processedData);
      setModelSalesCountDataLoading(false);
    };

    const fetchCategorySalesData = async (startDate, endDate, dataRange) => {
      setCategorySalesDataLoading(true);
      const result = await axios.get(`http://localhost:5000/ultigeapi/web/analytic/getcategorysales?startDate=${startDate}&endDate=${endDate}&limit=10&page=${categorySalesPage}`);

      let processedData;
      processedData = result.data;

      let object = new Object();
      let newData = new Array();

      for (const data of categorySalesData.Data) {
        newData.push(data);
      }

      for (const data of processedData.Data) {
        newData.push(data);
      }

      object.Data = newData;
      
      setCategorySalesData(object);
      setCategorySalesCachePaginationData(processedData);
      setCategorySalesDataLoading(false);
    };

    const fetchCategorySalesCountData = async (startDate, endDate, dataRange) => {
      setCategorySalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=${categorySalesCountPage}`);

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
      setCategorySalesCountCachePaginationData(processedData);
      setCategorySalesCountDataLoading(false);
    };

    const fetchProductSalesData = async (startDate, endDate, dataRange) => {
      setProductSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=${productSalesPage}`);

      let processedData;
      processedData = result.data;

      let object = new Object();
      let newData = new Array();

      for (const data of productSalesData.Data) {
        newData.push(data);
      }

      for (const data of processedData.Data) {
        newData.push(data);
      }

      object.Data = newData;
      
      setProductSalesData(object);
      setProductSalesCachePaginationData(processedData);
      setProductSalesDataLoading(false);
    };

    const fetchProductSalesCountData = async (startDate, endDate, dataRange) => {
      setProductSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=${productSalesCountPage}`);

      let processedData;
      processedData = result.data;

      let object = new Object();
      let newData = new Array();

      for (const data of productSalesCountData.Data) {
        newData.push(data);
      }

      for (const data of processedData.Data) {
        newData.push(data);
      }

      object.Data = newData;
      
      setProductSalesCountData(object);
      setProductSalesCountCachePaginationData(processedData);
      setProductSalesCountDataLoading(false);
    };

    if (newFetchActive == true && checkToken()) {
      if (productTab == '1') {
        if (modelSalesCachePaginationIndex.Data.includes(modelSalesPage) == false) {  
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
            && dateOption != 'custom-yearly'
            && dateOption != 'custom-date') {
            startDate = momentStartDate.format("YYYY-MM-DD");
            endDate = momentEndDate.format("YYYY-MM-DD");
          }
          else {
            startDate = newStartDate;
            endDate = newEndDate;
          }
  
          let indexArray = new Array();
          for (const data of modelSalesCachePaginationIndex.Data) {
            indexArray.push(data);
          }
          indexArray.push(modelSalesPage);
          let object = new Object();
          object.Data = indexArray;
          setModelSalesCachePaginationIndex(object);
  
          fetchModelSalesData(startDate, endDate, dataRange);
        }
        else {
          let object = new Object();
          let newData = new Array();
  
          for (const data of modelSalesData.Data) {
            if (data.Rank > ((modelSalesPage - 1) * 10) && data.Rank <= modelSalesPage * 10)
              newData.push(data);
          }
  
          object.Data = newData;
          setModelSalesCachePaginationData(object);
        }
      }
      else if (productTab == '2') {
        if (modelSalesCountCachePaginationIndex.Data.includes(modelSalesCountPage) == false) {  
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
            && dateOption != 'custom-yearly'
            && dateOption != 'custom-date') {
            startDate = momentStartDate.format("YYYY-MM-DD");
            endDate = momentEndDate.format("YYYY-MM-DD");
          }
          else {
            startDate = newStartDate;
            endDate = newEndDate;
          }
  
          let indexArray = new Array();
          for (const data of modelSalesCountCachePaginationIndex.Data) {
            indexArray.push(data);
          }
          indexArray.push(modelSalesCountPage);
          let object = new Object();
          object.Data = indexArray;
          setModelSalesCountCachePaginationIndex(object);
  
          fetchModelSalesCountData(startDate, endDate, dataRange);
        }
        else {
          let object = new Object();
          let newData = new Array();
  
          for (const data of modelSalesCountData.Data) {
            if (data.Rank > ((modelSalesCountPage - 1) * 10) && data.Rank <= modelSalesCountPage * 10)
              newData.push(data);
          }
  
          object.Data = newData;
          setModelSalesCountCachePaginationData(object);
        }
      }
      else if (productTab == '3') {
        if (categorySalesCachePaginationIndex.Data.includes(categorySalesPage) == false) {  
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
            && dateOption != 'custom-yearly'
            && dateOption != 'custom-date') {
            startDate = momentStartDate.format("YYYY-MM-DD");
            endDate = momentEndDate.format("YYYY-MM-DD");
          }
          else {
            startDate = newStartDate;
            endDate = newEndDate;
          }
  
          let indexArray = new Array();
          for (const data of categorySalesCachePaginationIndex.Data) {
            indexArray.push(data);
          }
          indexArray.push(categorySalesPage);
          let object = new Object();
          object.Data = indexArray;
          setCategorySalesCachePaginationIndex(object);
  
          fetchCategorySalesData(startDate, endDate, dataRange);
        }
        else {
          let object = new Object();
          let newData = new Array();
  
          for (const data of categorySalesData.Data) {
            if (data.Rank > ((categorySalesPage - 1) * 10) && data.Rank <= categorySalesPage * 10)
              newData.push(data);
          }
  
          object.Data = newData;
          setCategorySalesCachePaginationData(object);
        }
      }
      else if (productTab == '4') {
        if (categorySalesCountCachePaginationIndex.Data.includes(categorySalesCountPage) == false) {  
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
            && dateOption != 'custom-yearly'
            && dateOption != 'custom-date') {
            startDate = momentStartDate.format("YYYY-MM-DD");
            endDate = momentEndDate.format("YYYY-MM-DD");
          }
          else {
            startDate = newStartDate;
            endDate = newEndDate;
          }
  
          let indexArray = new Array();
          for (const data of categorySalesCountCachePaginationIndex.Data) {
            indexArray.push(data);
          }
          indexArray.push(categorySalesCountPage);
          let object = new Object();
          object.Data = indexArray;
          setCategorySalesCountCachePaginationIndex(object);
  
          fetchCategorySalesCountData(startDate, endDate, dataRange);
        }
        else {
          let object = new Object();
          let newData = new Array();
  
          for (const data of categorySalesCountData.Data) {
            if (data.Rank > ((categorySalesCountPage - 1) * 10) && data.Rank <= categorySalesCountPage * 10)
              newData.push(data);
          }
  
          object.Data = newData;
          setCategorySalesCountCachePaginationData(object);
        }
      }
      else if (productTab == '5') {
        if (productSalesCachePaginationIndex.Data.includes(productSalesPage) == false) {  
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
            && dateOption != 'custom-yearly'
            && dateOption != 'custom-date') {
            startDate = momentStartDate.format("YYYY-MM-DD");
            endDate = momentEndDate.format("YYYY-MM-DD");
          }
          else {
            startDate = newStartDate;
            endDate = newEndDate;
          }
  
          let indexArray = new Array();
          for (const data of productSalesCachePaginationIndex.Data) {
            indexArray.push(data);
          }
          indexArray.push(productSalesPage);
          let object = new Object();
          object.Data = indexArray;
          setProductSalesCachePaginationIndex(object);
  
          fetchProductSalesData(startDate, endDate, dataRange);
        }
        else {
          let object = new Object();
          let newData = new Array();
  
          for (const data of productSalesData.Data) {
            if (data.Rank > ((productSalesPage - 1) * 10) && data.Rank <= productSalesPage * 10)
              newData.push(data);
          }
  
          object.Data = newData;
          setProductSalesCachePaginationData(object);
        }
      }
      else if (productTab == '6') {
        if (productSalesCountCachePaginationIndex.Data.includes(productSalesCountPage) == false) {  
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
            && dateOption != 'custom-yearly'
            && dateOption != 'custom-date') {
            startDate = momentStartDate.format("YYYY-MM-DD");
            endDate = momentEndDate.format("YYYY-MM-DD");
          }
          else {
            startDate = newStartDate;
            endDate = newEndDate;
          }
  
          let indexArray = new Array();
          for (const data of productSalesCountCachePaginationIndex.Data) {
            indexArray.push(data);
          }
          indexArray.push(productSalesCountPage);
          let object = new Object();
          object.Data = indexArray;
          setProductSalesCountCachePaginationIndex(object);
  
          fetchProductSalesCountData(startDate, endDate, dataRange);
        }
        else {
          let object = new Object();
          let newData = new Array();
  
          for (const data of productSalesCountData.Data) {
            if (data.Rank > ((productSalesCountPage - 1) * 10) && data.Rank <= productSalesCountPage * 10)
              newData.push(data);
          }
  
          object.Data = newData;
          setProductSalesCountCachePaginationData(object);
        }
      }
    }

    
    setNewFetchActive(false);
  }, [newFetchActive]);

  const CustomCategorySalesRow = ({ row }) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [empty, setEmpty] = React.useState(false);

    const fetchCategorySaleVariantsData = async (startDate, endDate, productCategoryName) => {
      setLoading(true);
      const result = await axios.get(`http://localhost:5000/ultigeapi/web/analytic/getcategorysalevariants?startDate=${startDate}&endDate=${endDate}&productCategoryName=${productCategoryName}`);
  
      let processedData;
      processedData = result.data;

      if (processedData.Data.length == 0) {
        setEmpty(true);
        setLoading(false);
        return;
      }

      let tempData = categorySalesData;
      let tempCacheData = categorySalesCachePaginationData;

      for (const data of tempData.Data) {
        if (data.ProductCategoryName == productCategoryName) {
          data.Variant = processedData.Data;
          break;
        }
      }

      for (const data of tempCacheData.Data) {
        if (data.ProductCategoryName == productCategoryName) {
          data.Variant = processedData.Data;
          break;
        }
      }

      setCategorySalesData(tempData);
      setCategorySalesCachePaginationData(tempCacheData);
      setOpen(true);
      setLoading(false);
    };
  
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            { !empty && 
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  if (loading == false) {
                    if (row.Variant.length == 0)
                      fetchCategorySaleVariantsData(currentStartDate, currentEndDate, row.ProductCategoryName);
                    else
                      setOpen(!open);
                  }
                }}
              >
                {loading ? <CircularProgress size={21} /> : open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          </TableCell>
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
              Rp {Intl.NumberFormat('id').format(row.Value)}
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
        <TableRow style={{ backgroundColor: '#fcfcfc' }}>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Peringkat</TableCell>
                      <TableCell align="left">Informasi Varian</TableCell>
                      <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                      <TableCell align="right">Proporsi</TableCell>
                      <TableCell align="right">Tingkat Perubahan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.Variant && row.Variant.map((row2) => (
                      <TableRow
                        key={row2.Rank}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                          <Typography>
                              {row2.Rank}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Grid container style={{marginTop: 10}}>
                            <Typography 
                            style={{
                                color: "#000", 
                                fontSize: 16,
                                fontWeight: 500,
                                marginTop: 5
                            }}
                            >
                            {row2.ProductName}
                            <br/>
                            <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell align="right" style={{width: 225}}>
                          <Typography>
                            Rp {Intl.NumberFormat('id').format(row2.Value)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 150}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Proportion)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 175}}>
                          <Grid container justifyContent="flex-end">
                            <Typography>
                            {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                            </Typography>
                            { row2.Growth >= 0
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
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

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
                        <MenuItem disableRipple value='custom-daily'>Per Hari{customDayRange != '' && ': '}{customDayRange != '' && <br/>}{customDayRange}</MenuItem>
                        <MenuItem disableRipple value='custom-weekly'>Per Minggu{customWeekRange != '' && ': '}{customWeekRange != '' && <br/>}{customWeekRange}</MenuItem>
                        <MenuItem disableRipple value='custom-monthly'>Per Bulan{customMonthRange != '' && ': '}{customMonthRange != '' && <br/>}{customMonthRange}</MenuItem>
                        <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun{customYearRange != '' && ': '}{customYearRange != '' && <br/>}{customYearRange}</MenuItem>
                        <MenuItem disableRipple value='custom-date'>Custom Tanggal{customDateRange != '' && ': '}{customDateRange != '' && <br/>}{customDateRange}</MenuItem>
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
                        <MenuItem disableRipple value='custom-daily'>Per Hari{customDayRange != '' && ': '}{customDayRange}</MenuItem>
                        <MenuItem disableRipple value='custom-weekly'>Per Minggu{customWeekRange != '' && ': '}{customWeekRange}</MenuItem>
                        <MenuItem disableRipple value='custom-monthly'>Per Bulan{customMonthRange != '' && ': '}{customMonthRange}</MenuItem>
                        <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun{customYearRange != '' && ': '}{customYearRange}</MenuItem>
                        <MenuItem disableRipple value='custom-date'>Custom Tanggal{customDateRange != '' && ': '}{customDateRange}</MenuItem>
                      </Select>
                  }
                </FormControl>
                { (dateOption == "custom-daily" 
                  || dateOption == "custom-weekly"
                  || dateOption == "custom-monthly"
                  || dateOption == "custom-yearly"
                  || dateOption == "custom-date") && !isMobile &&
                  <Grid style={{margin: 10}}>  
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      { (dateOption == "custom-daily" || dateOption == "custom-weekly" || dateOption == "custom-date") &&
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
                      { dateOption == "custom-date" &&
                        <KeyboardDatePicker
                          orientation="landscape"
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="End Date"
                          value={selectedEndDate}
                          style={{marginRight: 15, width: 150}}
                          onChange={handleEndDateChange}
                        />
                      }
                    </MuiPickersUtilsProvider>
                    <Button 
                      variant="outlined"
                      style={{
                        borderRadius: 4,
                        textTransform: "none",
                        marginTop: 8
                      }}
                      disableRipple
                      onClick={applyCustomDate}
                    >
                      Apply
                    </Button>
                  </Grid>
                }
              </Box>
              { (dateOption == "custom-daily" 
                || dateOption == "custom-weekly"
                || dateOption == "custom-monthly"
                || dateOption == "custom-yearly"
                || dateOption == "custom-date") && isMobile &&
                <Grid style={{margin: 10}}>  
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    { (dateOption == "custom-daily" || dateOption == "custom-weekly" || dateOption == "custom-date") &&
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
                    { dateOption == "custom-date" &&
                      <KeyboardDatePicker
                        variant="inline"
                        format="YYYY-MM-DD"
                        label="End Date"
                        value={selectedEndDate}
                        style={{marginRight: 15, width: 150}}
                        onChange={handleEndDateChange}
                      />
                    }
                  </MuiPickersUtilsProvider>
                  <Button 
                    variant="outlined"
                    style={{
                      borderRadius: 4,
                      textTransform: "none",
                      marginTop: 8
                    }}
                    disableRipples
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
                <Grid item xs={12}>
                  <TabContext value={productTab}>
                    <Box style={{marginLeft: 10, marginRight: 10}}>
                      <TabList onChange={handleProductTabChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Nominal Terjual (model)" value="1" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Jumlah Terjual (model)" value="2" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Nominal Terjual (kategori)" value="3" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Jumlah Terjual (kategori)" value="4" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Nominal Terjual" value="5" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Jumlah Terjual" value="6" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {modelSalesCachePaginationData && modelSalesCachePaginationData.Data.map((row) => (
                              <CustomSalesRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="2">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Total Produk Dipesan</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {modelSalesCountCachePaginationData && modelSalesCountCachePaginationData.Data.map((row) => (
                              <CustomSalesCountRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="3">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categorySalesCachePaginationData && categorySalesCachePaginationData.Data.map((row) => (
                              <CustomCategorySalesRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="4">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Total Produk Dipesan</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categorySalesCountCachePaginationData && categorySalesCountCachePaginationData.Data.map((row) => (
                              <CustomCategorySalesCountRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="5">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {productSalesCachePaginationData && productSalesCachePaginationData.Data.map((row) => (
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
                                      {row.ProductName}
                                      <br/>
                                      <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
                                    </Typography>
                                  </Grid>
                                </TableCell>
                                <TableCell align="right" style={{width: 225}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.Value)}
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
                    </TabPanel>
                    <TabPanel value="6">
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
                            {productSalesCountCachePaginationData && productSalesCountCachePaginationData.Data.map((row) => (
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
                                      {row.ProductName}
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
                    </TabPanel>
                  </TabContext>
                </Grid>
                <Grid item xs={4}>
                  { (productSalesDataLoading || productSalesCountDataLoading || modelSalesDataLoading || modelSalesCountDataLoading || categorySalesDataLoading || categorySalesCountDataLoading) &&
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
                      count={productTab == 1 ? modelSalesPageCount 
                        : productTab == 2 ? modelSalesCountPageCount
                        : productTab == 3 ? categorySalesPageCount
                        : productTab == 4 ? categorySalesCountPageCount
                        : productTab == 5 ? productSalesPageCount
                        : productSalesCountPageCount}
                      page={productTab == 1 ? modelSalesPage 
                        : productTab == 2 ? modelSalesCountPage
                        : productTab == 3 ? categorySalesPage
                        : productTab == 4 ? categorySalesCountPage
                        : productTab == 5 ? productSalesPage
                        : productSalesCountPage}
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

export default ProductRanking;