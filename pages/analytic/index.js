import Head from "next/head";
import Layout from "../../src/components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
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
  Card,
  CardActionArea,
  CardContent,
  Tab,
  Link,
  CircularProgress
} from "@material-ui/core";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useContainerDimensions from  "../../src/utils/screen.js";
import randomColorHSL from  "../../src/utils/randomColorHSL";

import React, { useState, useEffect, useRef } from 'react';
import axios from '../../src/utils/axios';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
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
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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

const LineColor = (column) => {
  let color;

  if (column == 'Penjualan')
    color = '#367fe3'
  else if (column == 'Pesanan')
    color = '#f6bd16'
  else if (column == 'Jumlah')
    color = '#f6bd16'
  else if (column == 'Penjualan/Pesanan')
    color = '#fd5151'
  else if (column == 'Konversi')
    color = '#23aaab'

  return color;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card variant="outlined" style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 3}}>
        <p>{`${payload[0].payload.dataLabel}`}</p>
        {payload.map((item, index) => (
          <p style={{color: `${item.stroke}`, marginTop: -8}}>{`${item.name} : ${item.name != 'Pesanan' && item.name != 'Jumlah' && item.name != 'Konversi' ? "Rp " : ""}${Intl.NumberFormat('id').format(item.payload[item.name])}${item.name == 'Konversi' ? "%" : ""}`}</p>
        ))}
      </Card>
    );
  }

  return null;
};

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

const MultiTypeChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <LineChart
      width={props.width - 40}
      height={320}
      data={props.chart}
      margin={{
        top: 15,
        right: 40,
        bottom: 5,
        left: isMobile ? 30 : 35
      }}
    >
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis interval="preserveStartEnd" dataKey="label" angle={0} dx={0}/>
      <YAxis yAxisId="Penjualan" hide={true}/>
      <YAxis yAxisId="Pesanan" hide={true}/>
      <YAxis yAxisId="Jumlah" hide={true}/>
      <YAxis yAxisId="Penjualan/Pesanan" hide={true}/>
      <YAxis yAxisId="Konversi" hide={true}/>
      <Tooltip 
        content={<CustomTooltip />}
      />
      {props.line.map((item, index) => (
        <Line
          yAxisId={item.column}
          type="linear"
          dataKey={item.column}
          stroke={LineColor(item.column)}
          strokeWidth={item.column != 'Jumlah' ? 2 : 0}
          dot={false}
          activeDot={{ r: item.column != 'Jumlah' ? 5 : 0 }}
        />  
      ))}
    </LineChart>
  );
}

const EmptyChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <>
      <Typography align='center' style={{position: "absolute", width: props.width - 40, height: 320, marginTop: 140, fontSize: 26}}>
        TIDAK ADA DATA
      </Typography>
      <LineChart
        width={props.width - 40}
        height={320}
        margin={{
          top: 15,
          right: 40,
          bottom: 25,
          left: isMobile ? 30 : 35
        }}
      >
        <CartesianGrid strokeDasharray="4 4" />
      </LineChart>
    </>
  );
}

const MultiChannelChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <LineChart
      width={props.width - 40}
      height={320}
      data={props.chart}
      margin={{
        top: 15,
        right: 40,
        bottom: 5,
        left: isMobile ? 30 : 35
      }}
    >
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis interval="preserveStartEnd" dataKey="label" angle={0} dx={0}/>
      <YAxis hide={true}/>
      <Tooltip 
        content={<CustomTooltip />}
      />
      {props.line && Object.entries(props.line).map(([key,value])=> (
        <>
          { value.toggle == true &&
            <Line
              type="linear"
              dataKey={value.toggle ? key : null}
              stroke={randomColorHSL(key)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          }
        </>
      ))}
    </LineChart>
  );
}

const Home = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [salesData, setSalesData] = useState();
  const [salesCountData, setSalesCountData] = useState();
  const [averageSalesData, setAverageSalesData] = useState();
  const [conversionRateData, setConversionRateData] = useState();
  const [previousSalesData, setPreviousSalesData] = useState();
  const [previousSalesCountData, setPreviousSalesCountData] = useState();
  const [previousAverageSalesData, setPreviousAverageSalesData] = useState();
  const [previousConversionRateData, setPreviousConversionRateData] = useState();
  const [salesDataLoading, setSalesDataLoading] = useState(false);
  const [salesCountDataLoading, setSalesCountDataLoading] = useState(false);
  const [averageSalesDataLoading, setAverageSalesDataLoading] = useState(false);
  const [conversionRateDataLoading, setConversionRateDataLoading] = useState(false);
  const [previousSalesDataLoading, setPreviousSalesDataLoading] = useState(false);
  const [previousSalesCountDataLoading, setPreviousSalesCountDataLoading] = useState(false);
  const [previousAverageSalesDataLoading, setPreviousAverageSalesDataLoading] = useState(false);
  const [previousConversionRateDataLoading, setPreviousConversionRateDataLoading] = useState(false);

  const [masterSalesData, setMasterSalesData] = useState();
  const [masterMultipleSalesData, setMasterMultipleSalesData] = useState();

  const [fetchActive, setFetchActive] = React.useState(true);
  const [dateOption, setDateOption] = React.useState('realtime');
  const [dataRange, setDataRange] = React.useState('realtime');
  const [channel, setChannel] = React.useState('');
  const [channelList, setChannelList] = React.useState();
  const [newDataLoad, setNewDataLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);

  const [toggleSales, setToggleSales] = React.useState(true);
  const [toggleSalesCount, setToggleSalesCount] = React.useState(true);
  const [toggleAverageSales, setToggleAverageSales] = React.useState(true);
  const [toggleConversionRate, setToggleConversionRate] = React.useState(true);
  const [toggleMultipleSales, setToggleMultipleSales] = React.useState();

  const [dataReload, setDataReload] = React.useState(true);

  const [totalSalesData, setTotalSalesData] = React.useState();
  const [totalSalesCountData, setTotalSalesCountData] = React.useState();
  const [totalAverageSalesData, setTotalAverageSalesData] = React.useState();
  const [totalConversionRateData, setTotalConversionRateData] = React.useState();

  const [productSalesData, setProductSalesData] = React.useState();
  const [productSalesCountData, setProductSalesCountData] = React.useState();
  const [modelSalesData, setModelSalesData] = React.useState();
  const [modelSalesCountData, setModelSalesCountData] = React.useState();
  const [categorySalesData, setCategorySalesData] = React.useState();
  const [categorySalesCountData, setCategorySalesCountData] = React.useState();
  const [productSalesDataLoading, setProductSalesDataLoading] = React.useState(false);
  const [productSalesCountDataLoading, setProductSalesCountDataLoading] = React.useState(false);
  const [modelSalesDataLoading, setModelSalesDataLoading] = React.useState(false);
  const [modelSalesCountDataLoading, setModelSalesCountDataLoading] = React.useState(false);
  const [categorySalesDataLoading, setCategorySalesDataLoading] = React.useState(false);
  const [categorySalesCountDataLoading, setCategorySalesCountDataLoading] = React.useState(false);

  const [segmentationSalesData, setSegmentationSalesData] = React.useState();
  const [segmentationTransactionCountData, setSegmentationTransactionCountData] = React.useState();
  const [segmentationCustomerTypeData, setSegmentationCustomerTypeData] = React.useState();
  const [segmentationSalesDataLoading, setSegmentationSalesDataLoading] = React.useState(false);
  const [segmentationTransactionCountDataLoading, setSegmentationTransactionCountDataLoading] = React.useState(false);
  const [segmentationCustomerTypeLoading, setSegmentationCustomerTypeDataLoading] = React.useState(false);

  const [customDayRange, setCustomDayRange] = React.useState('');
  const [customWeekRange, setCustomWeekRange] = React.useState('');
  const [customMonthRange, setCustomMonthRange] = React.useState('');
  const [customYearRange, setCustomYearRange] = React.useState('');

  const [model, setModel] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [productModelsData, setProductModelsData] = useState([""]);
  const [productCategoriesData, setProductCategoriesData] = useState([""]);
  const [productCategoriesCacheData, setProductCategoriesCacheData] = useState();
  const [modelCategoryData, setModelCategoryData] = useState();
  const [modelCategoryDataLoading, setModelCategoryDataLoading] = React.useState(false);
  const [totalModelCategoryData, setTotalModelCategoryData] = React.useState();
  
  const [modelFetchActive, setModelFetchActive] = React.useState(true);
  const [categoryFetchActive, setCategoryFetchActive] = React.useState(false);

  const [modelCustom, setModelCustom] = React.useState('');
  const [categoryCustom, setCategoryCustom] = React.useState('');
  const [productModelsCustomData, setProductModelsCustomData] = useState([""]);
  const [productCategoriesCustomData, setProductCategoriesCustomData] = useState([""]);
  const [productCategoriesCustomCacheData, setProductCategoriesCustomCacheData] = useState();
  const [modelCategoryCustomData, setModelCategoryCustomData] = useState();
  const [modelCategoryCustomDataLoading, setModelCategoryCustomDataLoading] = React.useState(false);
  const [totalModelCategoryCustomData, setTotalModelCategoryCustomData] = React.useState();
  
  const [modelCustomFetchActive, setModelCustomFetchActive] = React.useState(true);
  const [categoryCustomFetchActive, setCategoryCustomFetchActive] = React.useState(false);

  const [valueStockData, setValueStockData] = useState();
  const [valueStockDataLoading, setValueStockDataLoading] = useState(false);

  const [modelStock, setModelStock] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [modelStockData, setModelStockData] = useState([""]);
  const [stockData, setStockData] = useState([""]);
  const [stockCacheData, setStockCacheData] = useState();
  const [performanceData, setPerformanceData] = useState();
  const [performanceDataLoading, setPerformanceDataLoading] = React.useState(false);
  
  const [modelStockFetchActive, setModelStockFetchActive] = React.useState(true);
  const [stockFetchActive, setStockFetchActive] = React.useState(false);

  const [monthlyStartDate, setMonthlyStartDate] = useState();
  const [monthlyEndDate, setMonthlyEndDate] = useState();

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

  const handleChannelChange = (event) => {
    setChannel(event.target.value);
  };

  const handleModelChange = (event, newValue) => {
    if (newValue !== null) {
      setModel(newValue);
      setCategoryFetchActive(true);
    }
  };
  const handleCategoryChange = (event, newValue) => {
    if (newValue !== null) {
      setCategory(newValue);
    }
  };

  const handleModelCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setModelCustom(newValue);
      setCategoryCustomFetchActive(true);
    }
  };
  const handleCategoryCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setCategoryCustom(newValue);
    }
  };

  const handleModelStockChange = (event, newValue) => {
    if (newValue !== null) {
      setModelStock(newValue);
      setStockFetchActive(true);
    }
  };
  const handleStockChange = (event, newValue) => {
    if (newValue !== null) {
      setStock(newValue);
    }
  };

  const handleToggleSalesChange = () => {
    if (toggleSales && !(!toggleSalesCount && !toggleAverageSales && !toggleConversionRate))
      setToggleSales(false);
    else
      setToggleSales(true);
  };

  const handleToggleSalesCountChange = () => {
    if (toggleSalesCount && !(!toggleSales && !toggleAverageSales && !toggleConversionRate))
      setToggleSalesCount(false);
    else
      setToggleSalesCount(true);
  };

  const handleToggleAverageSalesChange = () => {
    if (toggleAverageSales && !(!toggleSalesCount && !toggleSales && !toggleConversionRate))
      setToggleAverageSales(false);
    else
      setToggleAverageSales(true);
  };

  const handleToggleConversionRateChange = () => {
    if (toggleConversionRate && !(!toggleSalesCount && !toggleSales && !toggleAverageSales))
      setToggleConversionRate(false);
    else
      setToggleConversionRate(true);
  };

  const handleToggleMultipleSalesChange = (key) => {
    var counter = 0;
    for (const [key, value] of Object.entries(toggleMultipleSales)) {
      if (value.toggle == true)
        counter++;
    }

    if (counter > 1 || toggleMultipleSales[key].toggle == false) {
      if (toggleMultipleSales[key].toggle == false) 
        toggleMultipleSales[key].toggle = true;
      else
        toggleMultipleSales[key].toggle = false;

      setDataReload(true);
    }
  };


  const [selectedStartDate, setSelectedStartDate] = React.useState(moment());
  const [newStartDate, setNewStartDate] = React.useState(moment());
  const [newEndDate, setNewEndDate] = React.useState(moment());

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const [valueStockBackDate, setValueStockBackDate] = React.useState(moment());
  const [modelCategoryEndDate, setModelCategoryEndDate] = React.useState(moment());
  const [modelCategoryCustomStartDate, setModelCategoryCustomStartDate] = React.useState(moment());
  const [modelCategoryCustomEndDate, setModelCategoryCustomEndDate] = React.useState(moment());

  const handleValueStockBackDate = (date) => {
    setValueStockBackDate(date);
  };

  const handleModelCategoryEndDateChange = (date) => {
    setModelCategoryEndDate(date);
  };

  const handleModelCategoryCustomStartDateChange = (date) => {
    setModelCategoryCustomStartDate(date);
  };

  const handleModelCategoryCustomEndDateChange = (date) => {
    setModelCategoryCustomEndDate(date);
  };

  const vsLabel = () => {
    if (dateOption == 'custom-daily') {
      return "vs. Hari Sebelumnya";
    }
    else if (dateOption == 'custom-weekly') {
      return "vs. Minggu Sebelumnya";
    }
    else if (dateOption == 'custom-monthly') {
      return "vs. Bulan Sebelumnya";
    }
    else if (dateOption == 'custom-yearly') {
      return "vs. Tahun Sebelumnya";
    }
    else if (dataRange == 'realtime') {
      return `vs. Kemarin pada 00:00-${moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00`;
    }
    else if (dataRange == 'yesterday') {
      return "vs. Hari Sebelumnya";
    }
    else if (dataRange == 'weekly') {
      return "vs. Minggu Sebelumnya";
    }
    else if (dataRange == 'monthly') {
      return "vs. Bulan Sebelumnya";
    }
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

  const [productTab, setProductTab] = React.useState('1');

  const handleProductTabChange = (event, newValue) => {
    setProductTab(newValue);
  };

  const [segmentationTab, setSegmentationTab] = React.useState('1');

  const handleSegmentationTabChange = (event, newValue) => {
    setSegmentationTab(newValue);
  };

  useEffect(() => {
    const fetchSalesData = async (startDate, endDate) => {
      setSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;
      let processedLegend;
      processedLegend = result.data.Legend;

      let resultObject = new Object();

      processedLegend.forEach(function (item) {
        let newObject = new Object();

        newObject.toggle = true;
        newObject.value = 0;
        newObject.range = vsLabel();
        newObject.growth = 0 / 0;
        newObject.growthTrend = 'down';

        resultObject[item] = newObject;
      });

      setSalesData(processedData);
      setSalesDataLoading(false);
      setToggleMultipleSales(resultObject);
      setNewDataLoad(true);
    };

    const fetchSalesCountData = async (startDate, endDate) => {
      setSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsalescount?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setSalesCountData(processedData);
      setSalesCountDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchAverageSalesData = async (startDate, endDate) => {
      setAverageSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getaveragesales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setAverageSalesData(processedData);
      setAverageSalesDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchConversionRateData = async (startDate, endDate) => {
      setConversionRateDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getconversionrate?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setConversionRateData(processedData);
      setConversionRateDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousSalesData = async (startDate, endDate) => {
      setPreviousSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousSalesData(processedData);
      setPreviousSalesDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousSalesCountData = async (startDate, endDate) => {
      setPreviousSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsalescount?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousSalesCountData(processedData);
      setPreviousSalesCountDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousAverageSalesData = async (startDate, endDate) => {
      setPreviousAverageSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getaveragesales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousAverageSalesData(processedData);
      setPreviousAverageSalesDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousConversionRateData = async (startDate, endDate) => {
      setPreviousConversionRateDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getconversionrate?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousConversionRateData(processedData);
      setPreviousConversionRateDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchProductSalesData = async (startDate, endDate) => {
      setProductSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setProductSalesData(processedData);
      setProductSalesDataLoading(false);
    };
    
    const fetchProductSalesCountData = async (startDate, endDate) => {
      setProductSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setProductSalesCountData(processedData);
      setProductSalesCountDataLoading(false);
    };

    const fetchModelSalesData = async (startDate, endDate) => {
      setModelSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setModelSalesData(processedData);
      setModelSalesDataLoading(false);
    };
    
    const fetchModelSalesCountData = async (startDate, endDate) => {
      setModelSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setModelSalesCountData(processedData);
      setModelSalesCountDataLoading(false);
    };

    const fetchCategorySalesData = async (startDate, endDate) => {
      setCategorySalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setCategorySalesData(processedData);
      setCategorySalesDataLoading(false);
    };
    
    const fetchCategorySalesCountData = async (startDate, endDate) => {
      setCategorySalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

      let processedData;
      processedData = result.data;

      setCategorySalesCountData(processedData);
      setCategorySalesCountDataLoading(false);
    };

    const fetchSegmentationSalesData = async (startDate, endDate) => {
      setSegmentationSalesDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcustomersegmentationbysales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setSegmentationSalesData(processedData);
      setSegmentationSalesDataLoading(false);
    };
    
    const fetchSegmentationTransactionCountData = async (startDate, endDate) => {
      setSegmentationTransactionCountDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcustomersegmentationbytransaction?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setSegmentationTransactionCountData(processedData);
      setSegmentationTransactionCountDataLoading(false);
    };

    const fetchSegmentationCustomerTypeData = async (startDate, endDate) => {
      setSegmentationCustomerTypeDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcustomersegmentationbytype?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setSegmentationCustomerTypeData(processedData);
      setSegmentationCustomerTypeDataLoading(false);
    };

    if (fetchActive == true && checkToken()) {
      setNewDataLoad(false);
      setChannel(null);
      setChannelList(null);

      setCustomDayRange('');
      setCustomWeekRange('');
      setCustomMonthRange('');
      setCustomYearRange('');

      const moment = require('moment-timezone');
      
      let momentStartDate;
      let momentEndDate;

      let momentPreviousStartDate;
      let momentPreviousEndDate;

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

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(2, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(2, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(14, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(8, "days");
      }
      else if (dataRange == 'monthly') {
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentStartDate.month() == momentEndDate.month()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        while (momentStartDate.date() > momentEndDate.date()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        momentPreviousEndDate = moment(momentStartDate).tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousStartDate = moment(momentPreviousEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentPreviousStartDate.month() == momentPreviousEndDate.month()) {
          momentPreviousStartDate = momentPreviousStartDate.subtract(1, "days");
        }

        while (momentPreviousStartDate.date() > momentPreviousEndDate.date()) {
          momentPreviousStartDate = momentPreviousStartDate.subtract(1, "days");
        }
      }

      let startDate;
      let endDate;

      let previousStartDate;
      let previousEndDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");

        previousStartDate = momentPreviousStartDate.format("YYYY-MM-DD");
        previousEndDate = momentPreviousEndDate.format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-daily') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomDayRange(`${moment(newStartDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "days").format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "days").format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-weekly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomWeekRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "weeks").startOf('isoWeek').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "weeks").endOf('isoWeek').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-monthly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomMonthRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "months").startOf('month').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "months").endOf('month').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-yearly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomYearRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "years").startOf('year').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "years").endOf('year').format("YYYY-MM-DD");
      }

      fetchSegmentationSalesData(startDate, endDate);
      fetchSegmentationTransactionCountData(startDate, endDate);
      fetchSegmentationCustomerTypeData(startDate, endDate);

      fetchProductSalesData(startDate, endDate);
      fetchProductSalesCountData(startDate, endDate);
      fetchModelSalesData(startDate, endDate);
      fetchModelSalesCountData(startDate, endDate);
      fetchCategorySalesData(startDate, endDate);
      fetchCategorySalesCountData(startDate, endDate);

      fetchSalesData(startDate, endDate);
      fetchSalesCountData(startDate, endDate);
      fetchAverageSalesData(startDate, endDate);
      fetchConversionRateData(startDate, endDate);

      fetchPreviousSalesData(previousStartDate, previousEndDate);
      fetchPreviousSalesCountData(previousStartDate, previousEndDate);
      fetchPreviousAverageSalesData(previousStartDate, previousEndDate);
      fetchPreviousConversionRateData(previousStartDate, previousEndDate);

      setFetchActive(false);
    }
  }, [fetchActive]);

  useEffect(() => {
    const processMonthSaleData = (startDate, endDate, previousStartDate, previousEndDate) => {
      let legend = new Array();
      if (salesData)
        legend = salesData.Legend;

      let totalSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalSalesObject[item] = newObject;
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      if (salesData)
        data = salesData.Data;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        let object = ``;

        object += `{"label": "${moment(currentDate).format('MMM')}"`;
        object += `, "dataLabel": "${moment(currentDate).format('MMM')}"`;

        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
                totalSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
              else {
                object += `, "${legendItem}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          legend.forEach(function (legendItem) {
            object += `, "${legendItem}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }


      if (previousSalesData)
        data = previousSalesData.Data;

      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalPreviousSalesObject[item] = newObject;
      });


      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                totalPreviousSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
            });
          }
        });

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.chart = chart;
      
      legend.forEach(function (item) {
        if (toggleMultipleSales && toggleMultipleSales[item] != null) {
          toggleMultipleSales[item].value = totalSalesObject[item].value;
          toggleMultipleSales[item].range = vsLabel();
          if (totalSalesObject[item].value >= totalPreviousSalesObject[item].value) {
            toggleMultipleSales[item].growth = ((totalSalesObject[item].value / totalPreviousSalesObject[item].value) - 1) * 100;
            toggleMultipleSales[item].growthTrend = 'up';
          }
          else {
            toggleMultipleSales[item].growth = (1 - (totalSalesObject[item].value / totalPreviousSalesObject[item].value)) * 100;
            toggleMultipleSales[item].growthTrend = 'down';
          }
        }
      });
    
      return result;
    };

    const processDaySaleData = (startDate, endDate, previousStartDate, previousEndDate, dataRange) => {
      let legend = new Array();
      if (salesData)
        legend = salesData.Legend;

      let totalSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalSalesObject[item] = newObject;
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      if (salesData)
        data = salesData.Data;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dataRange == "monthly" && dateCounter % 2 == 0) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
                totalSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
              else {
                object += `, "${legendItem}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          legend.forEach(function (legendItem) {
            object += `, "${legendItem}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }



      if (previousSalesData)
        data = previousSalesData.Data;
      
      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalPreviousSalesObject[item] = newObject;
      });

      while (currentDate <= momentEndDate) { 
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                totalPreviousSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
            });
          }
        });

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.chart = chart;
      
      legend.forEach(function (item) {
        if (toggleMultipleSales && toggleMultipleSales[item] != null) {
          toggleMultipleSales[item].value = totalSalesObject[item].value;
          toggleMultipleSales[item].range = vsLabel();
          if (totalSalesObject[item].value >= totalPreviousSalesObject[item].value) {
            toggleMultipleSales[item].growth = ((totalSalesObject[item].value / totalPreviousSalesObject[item].value) - 1) * 100;
            toggleMultipleSales[item].growthTrend = 'up';
          }
          else {
            toggleMultipleSales[item].growth = (1 - (totalSalesObject[item].value / totalPreviousSalesObject[item].value)) * 100;
            toggleMultipleSales[item].growthTrend = 'down';
          }
        }
      });
    
      return result;
    };

    const processHourSaleData = (dataRange) => {
      let legend = new Array();
      if (salesData)
        legend = salesData.Legend;

      let totalSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalSalesObject[item] = newObject;
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      if (salesData)
        data = salesData.Data;

      let hourCounter = 0;
      let lastHour;

      if (dataRange == 'realtime')
        lastHour = parseInt(moment().tz("Asia/Jakarta").format('LT').slice(0, -3));
      else
        lastHour = 23;

      while (hourCounter <= 23) { 
        let object = ``;

        if (hourCounter % 6 == 0) {
          if (parseInt(hourCounter / 10) > 0)
            object += `{"label": "${hourCounter}:00"`;
          else
            object += `{"label": "0${hourCounter}:00"`;
        }
        else {
          object += `{"label": ""`;
        }

        if (parseInt(hourCounter / 10) > 0)
          object += `, "dataLabel": "${hourCounter}:00"`;
        else
          object += `, "dataLabel": "0${hourCounter}:00"`;

        let hourExist = false;
      
        data.forEach(function (dataItem) {
          let hour = parseInt(dataItem.Date);

          if (hourCounter == hour) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
                totalSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
              else {
                object += `, "${legendItem}": 0`;
              }
            });

            hourExist = true;
          }
        });

        if (hourExist == false) {
          legend.forEach(function (legendItem) {
            object += `, "${legendItem}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        hourCounter++;
      }

      hourCounter = 0;

      if (previousSalesData)
        data = previousSalesData.Data;

      let totalPreviousSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalPreviousSalesObject[item] = newObject;
      });

      while (hourCounter <= lastHour) { 
        data.forEach(function (dataItem) {
          let hour = parseInt(dataItem.Date);

          if (hourCounter == hour) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {    
                totalPreviousSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
            });
          }
        });

        hourCounter++;
      }

      const result = new Object();
      result.chart = chart;
      
      legend.forEach(function (item) {
        if (toggleMultipleSales && toggleMultipleSales[item] != null) {
          toggleMultipleSales[item].value = totalSalesObject[item].value;
          toggleMultipleSales[item].range = vsLabel();
          if (totalSalesObject[item].value >= totalPreviousSalesObject[item].value) {
            toggleMultipleSales[item].growth = ((totalSalesObject[item].value / totalPreviousSalesObject[item].value) - 1) * 100;
            toggleMultipleSales[item].growthTrend = 'up';
          }
          else {
            toggleMultipleSales[item].growth = (1 - (totalSalesObject[item].value / totalPreviousSalesObject[item].value)) * 100;
            toggleMultipleSales[item].growthTrend = 'down';
          }
        }
      });
    
      return result;
    };

    const processMonthMasterSaleData = (startDate, endDate, previousStartDate, previousEndDate) => {
      const channelData = new Array();

      if (salesData) {
        channelData.push('ALL');
        salesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (salesCountData) {
        channelData.push('ALL');
        salesCountData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (averageSalesData) {
        channelData.push('ALL');
        averageSalesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      setChannelList(channelData);

      let currentChannel = 'NULL';

      if (channelData && channel == null) {
        currentChannel = channelData[0];
        setChannel(currentChannel);
      }
      else {
        currentChannel = channel;
      }

      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      if (toggleSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Pesanan';
      line.push(addLine);
      if (toggleSalesCount)
        chartLine.push(addLine);
      
      addLine = new Object();
      addLine.column = 'Penjualan/Pesanan';
      line.push(addLine);
      if (toggleAverageSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Konversi';
      line.push(addLine);
      if (toggleConversionRate)
        chartLine.push(addLine);

      const chart = new Array();
      let addChart = new Object();

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;

      let totalSalesValue = 0;
      let totalSalesCountValue = 0;
      let totalAverageSalesValue = 0;
      let totalConversionRateValue = 0;
      let totalConversionRateCounter = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        let object = ``;

        object += `{"label": "${moment(currentDate).format('MMM')}"`;
        object += `, "dataLabel": "${moment(currentDate).format('MMM')}"`;

        let tempSalesValue = 0;
        let tempSalesCountValue = 0;
        let tempAverageSalesValue = 0;

        line.forEach(function (lineItem) {
          let dateExist = false;
          let data = new Array();
          let legend = new Array();

          if (salesData && lineItem.column == 'Penjualan') {
            data = salesData.Data;
            legend = salesData.Legend;
          }
          else if (salesCountData && lineItem.column == 'Pesanan') {
            data = salesCountData.Data;
            legend = salesCountData.Legend;
          }
          else if (averageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = averageSalesData.Data;
            legend = averageSalesData.Legend;
          }
          else if (conversionRateData && lineItem.column == 'Konversi') {
            data = conversionRateData.Data;
            legend = conversionRateData.Legend;
          }

          let tempConversionRateValue = 0;
          let tempConversionRateCounter = 0;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (legendItem == currentChannel && dataItem[legendItem] != undefined) {
                  object += `, "${lineItem.column}": ${dataItem[legendItem]}`;
                  dateExist = true;
                }

                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalSalesValue += parseFloat(dataItem[legendItem]);
                    tempSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalSalesCountValue += parseInt(dataItem[legendItem]);
                    tempSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Konversi') {
                    totalConversionRateValue += parseFloat(dataItem[legendItem]);
                    totalConversionRateCounter++;
                    tempConversionRateValue += parseFloat(dataItem[legendItem]);
                    tempConversionRateCounter++;
                  }
                }
              });
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }

          tempAverageSalesValue = tempSalesCountValue == 0 ? 0 : (tempSalesValue / tempSalesCountValue);
          tempConversionRateValue /= tempConversionRateCounter;

          if (currentChannel == 'ALL') {
            if (lineItem.column == 'Penjualan') {
              object += `, "${lineItem.column}": ${tempSalesValue}`;
            }
            else if (lineItem.column == 'Pesanan') {
              object += `, "${lineItem.column}": ${tempSalesCountValue}`;
            }
            else if (lineItem.column == 'Penjualan/Pesanan') {
              if (isNaN(tempAverageSalesValue))
                object += `, "${lineItem.column}": 0`;
              else
                object += `, "${lineItem.column}": ${tempAverageSalesValue}`;
            } 
            else if (lineItem.column == 'Konversi') {
              if (isNaN(tempConversionRateValue))
                object += `, "${lineItem.column}": 0`;
              else
                object += `, "${lineItem.column}": ${tempConversionRateValue}`;
            } 
          }
        });

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      totalAverageSalesValue = totalSalesCountValue == 0 ? 0 : (totalSalesValue / totalSalesCountValue)
      totalConversionRateValue /= totalConversionRateCounter;
      


      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesValue = 0;
      let totalPreviousSalesCountValue = 0;
      let totalPreviousAverageSalesValue = 0;
      let totalPreviousConversionRateValue = 0;
      let totalPreviousConversionRateCounter = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        line.forEach(function (lineItem) {
          let data = new Array();
          let legend = new Array();

          if (previousSalesData && lineItem.column == 'Penjualan') {
            data = previousSalesData.Data;
            legend = previousSalesData.Legend;
          }
          else if (previousSalesCountData && lineItem.column == 'Pesanan') {
            data = previousSalesCountData.Data;
            legend = previousSalesCountData.Legend;
          }
          else if (previousAverageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = previousAverageSalesData.Data;
            legend = previousAverageSalesData.Legend;
          }
          else if (previousConversionRateData && lineItem.column == 'Konversi') {
            data = previousConversionRateData.Data;
            legend = previousConversionRateData.Legend;
          }

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalPreviousSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalPreviousSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Konversi') {
                    totalPreviousConversionRateValue += parseFloat(dataItem[legendItem]);
                    totalPreviousConversionRateCounter++;
                  }
                }
              });
            }
          });
        });

        currentDate.add(1, 'months');
      }

      totalPreviousAverageSalesValue = totalPreviousSalesValue / totalPreviousSalesCountValue;
      totalPreviousConversionRateValue /= totalPreviousConversionRateCounter;

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;
      
      const totalSales = new Object();
      totalSales.value = totalSalesValue;
      totalSales.range = vsLabel();
      if (totalSalesValue >= totalPreviousSalesValue) {
        totalSales.growth = ((totalSalesValue / totalPreviousSalesValue) - 1) * 100;
        totalSales.growthTrend = 'up';
      }
      else {
        totalSales.growth = (1 - (totalSalesValue / totalPreviousSalesValue)) * 100;
        totalSales.growthTrend = 'down';
      }
      setTotalSalesData(totalSales);

      const totalSalesCount = new Object();
      totalSalesCount.value = totalSalesCountValue;
      totalSalesCount.range = vsLabel();
      if (totalSalesCountValue >= totalPreviousSalesCountValue) {
        totalSalesCount.growth = ((totalSalesCountValue / totalPreviousSalesCountValue) - 1) * 100;
        totalSalesCount.growthTrend = 'up';
      }
      else {
        totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
        totalSalesCount.growthTrend = 'down';
      }
      setTotalSalesCountData(totalSalesCount);

      const totalAverageSales = new Object();
      totalAverageSales.value = totalAverageSalesValue;
      totalAverageSales.range = vsLabel();
      if (totalAverageSalesValue >= totalPreviousAverageSalesValue) {
        totalAverageSales.growth = ((totalAverageSalesValue / totalPreviousAverageSalesValue) - 1) * 100;
        totalAverageSales.growthTrend = 'up';
      }
      else {
        totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
        totalAverageSales.growthTrend = 'down';
      }
      setTotalAverageSalesData(totalAverageSales);

      const totalConversionRate = new Object();
      totalConversionRate.value = totalConversionRateValue;
      totalConversionRate.range = vsLabel();
      if (totalConversionRateValue >= totalPreviousConversionRateValue) {
        totalConversionRate.growth =totalConversionRateValue - totalPreviousConversionRateValue;
        totalConversionRate.growthTrend = 'up';
      }
      else {
        totalConversionRate.growth = totalPreviousConversionRateValue - totalConversionRateValue; totalPreviousConversionRateValue;
        totalConversionRate.growthTrend = 'down';
      }
      setTotalConversionRateData(totalConversionRate);

      /*
      console.log(totalSalesValue + " | " + totalPreviousSalesValue);
      console.log(totalSalesCountValue + " | " + totalPreviousSalesCountValue);
      console.log(totalAverageSalesValue + " | " + totalPreviousAverageSalesValue);
      */
    
      return result;
    };

    const processDayMasterSaleData = (startDate, endDate, previousStartDate, previousEndDate, dataRange) => {
      const channelData = new Array();

      if (salesData) {
        channelData.push('ALL');
        salesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (salesCountData) {
        channelData.push('ALL');
        salesCountData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (averageSalesData) {
        channelData.push('ALL');
        averageSalesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      setChannelList(channelData);

      let currentChannel = 'NULL';

      if (channelData && channel == null) {
        currentChannel = channelData[0];
        setChannel(currentChannel);
      }
      else {
        currentChannel = channel;
      }

      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      if (toggleSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Pesanan';
      line.push(addLine);
      if (toggleSalesCount)
        chartLine.push(addLine);
      
      addLine = new Object();
      addLine.column = 'Penjualan/Pesanan';
      line.push(addLine);
      if (toggleAverageSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Konversi';
      line.push(addLine);
      if (toggleConversionRate)
        chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalSalesValue = 0;
      let totalSalesCountValue = 0;
      let totalAverageSalesValue = 0;
      let totalConversionRateValue = 0;
      let totalConversionRateCounter = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dataRange == "monthly" && dateCounter % 2 == 0) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        let tempSalesValue = 0;
        let tempSalesCountValue = 0;
        let tempAverageSalesValue = 0;

        line.forEach(function (lineItem) {
          let dateExist = false;
          let data = new Array();
          let legend = new Array();

          if (salesData && lineItem.column == 'Penjualan') {
            data = salesData.Data;
            legend = salesData.Legend;
          }
          else if (salesCountData && lineItem.column == 'Pesanan') {
            data = salesCountData.Data;
            legend = salesCountData.Legend;
          }
          else if (averageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = averageSalesData.Data;
            legend = averageSalesData.Legend;
          }
          else if (conversionRateData && lineItem.column == 'Konversi') {
            data = conversionRateData.Data;
            legend = conversionRateData.Legend;
          }

          let tempConversionRateValue = 0;
          let tempConversionRateCounter = 0;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (legendItem == currentChannel && dataItem[legendItem] != undefined) {
                  object += `, "${lineItem.column}": ${dataItem[legendItem]}`;
                  dateExist = true;
                }

                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalSalesValue += parseFloat(dataItem[legendItem]);
                    tempSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalSalesCountValue += parseInt(dataItem[legendItem]);
                    tempSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Konversi') {
                    totalConversionRateValue += parseFloat(dataItem[legendItem]);
                    totalConversionRateCounter++;
                    tempConversionRateValue += parseFloat(dataItem[legendItem]);
                    tempConversionRateCounter++;
                  }
                }
              });
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }

          tempAverageSalesValue = tempSalesCountValue == 0 ? 0 : (tempSalesValue / tempSalesCountValue);
          tempConversionRateValue /= tempConversionRateCounter;

          if (currentChannel == 'ALL') {
            if (lineItem.column == 'Penjualan') {
              object += `, "${lineItem.column}": ${tempSalesValue}`;
            }
            else if (lineItem.column == 'Pesanan') {
              object += `, "${lineItem.column}": ${tempSalesCountValue}`;
            }
            else if (lineItem.column == 'Penjualan/Pesanan') {
              if (isNaN(tempAverageSalesValue))
                object += `, "${lineItem.column}": 0`;
              else
                object += `, "${lineItem.column}": ${tempAverageSalesValue}`;
            } 
            else if (lineItem.column == 'Konversi') {
              if (isNaN(tempConversionRateValue))
                object += `, "${lineItem.column}": 0`;
              else
                object += `, "${lineItem.column}": ${tempConversionRateValue}`;
            } 
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      totalAverageSalesValue = totalSalesCountValue == 0 ? 0 : (totalSalesValue / totalSalesCountValue)
      totalConversionRateValue /= totalConversionRateCounter;

      
      
      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesValue = 0;
      let totalPreviousSalesCountValue = 0;
      let totalPreviousAverageSalesValue = 0;
      let totalPreviousConversionRateValue = 0;
      let totalPreviousConversionRateCounter = 0;

      while (currentDate <= momentEndDate) { 
        line.forEach(function (lineItem) {
          let data = new Array();
          let legend = new Array();

          if (previousSalesData && lineItem.column == 'Penjualan') {
            data = previousSalesData.Data;
            legend = previousSalesData.Legend;
          }
          else if (previousSalesCountData && lineItem.column == 'Pesanan') {
            data = previousSalesCountData.Data;
            legend = previousSalesCountData.Legend;
          }
          else if (previousAverageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = previousAverageSalesData.Data;
            legend = previousAverageSalesData.Legend;
          }
          else if (previousConversionRateData && lineItem.column == 'Konversi') {
            data = previousConversionRateData.Data;
            legend = previousConversionRateData.Legend;
          }

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalPreviousSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalPreviousSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Konversi') {
                    totalPreviousConversionRateValue += parseInt(dataItem[legendItem]);
                    totalPreviousConversionRateCounter++;
                  }
                  else if (lineItem.column == 'Konversi') {
                    totalConversionRateValue += parseFloat(dataItem[legendItem]);
                    totalConversionRateCounter++;
                  }
                }
              });
            }
          });
        });

        currentDate.add(1, 'days');
      }

      totalPreviousAverageSalesValue = totalPreviousSalesValue / totalPreviousSalesCountValue;
      totalPreviousConversionRateValue /= totalPreviousConversionRateCounter;

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;
      
      const totalSales = new Object();
      totalSales.value = totalSalesValue;
      totalSales.range = vsLabel();
      if (totalSalesValue >= totalPreviousSalesValue) {
        totalSales.growth = ((totalSalesValue / totalPreviousSalesValue) - 1) * 100;
        totalSales.growthTrend = 'up';
      }
      else {
        totalSales.growth = (1 - (totalSalesValue / totalPreviousSalesValue)) * 100;
        totalSales.growthTrend = 'down';
      }
      setTotalSalesData(totalSales);

      const totalSalesCount = new Object();
      totalSalesCount.value = totalSalesCountValue;
      totalSalesCount.range = vsLabel();
      if (totalSalesCountValue >= totalPreviousSalesCountValue) {
        totalSalesCount.growth = ((totalSalesCountValue / totalPreviousSalesCountValue) - 1) * 100;
        totalSalesCount.growthTrend = 'up';
      }
      else {
        totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
        totalSalesCount.growthTrend = 'down';
      }
      setTotalSalesCountData(totalSalesCount);

      const totalAverageSales = new Object();
      totalAverageSales.value = totalAverageSalesValue;
      totalAverageSales.range = vsLabel();
      if (totalAverageSalesValue >= totalPreviousAverageSalesValue) {
        totalAverageSales.growth = ((totalAverageSalesValue / totalPreviousAverageSalesValue) - 1) * 100;
        totalAverageSales.growthTrend = 'up';
      }
      else {
        totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
        totalAverageSales.growthTrend = 'down';
      }
      setTotalAverageSalesData(totalAverageSales);

      const totalConversionRate = new Object();
      totalConversionRate.value = totalConversionRateValue;
      totalConversionRate.range = vsLabel();
      if (totalConversionRateValue >= totalPreviousConversionRateValue) {
        totalConversionRate.growth = totalConversionRateValue - totalPreviousConversionRateValue;
        totalConversionRate.growthTrend = 'up';
      }
      else {
        totalConversionRate.growth = totalPreviousConversionRateValue - totalConversionRateValue; totalPreviousConversionRateValue;
        totalConversionRate.growthTrend = 'down';
      }
      setTotalConversionRateData(totalConversionRate);

      /*
      console.log(totalSalesValue + " | " + totalPreviousSalesValue);
      console.log(totalSalesCountValue + " | " + totalPreviousSalesCountValue);
      console.log(totalAverageSalesValue + " | " + totalPreviousAverageSalesValue);
      */
    
      return result;
    };

    const processHourMasterSaleData = (dataRange) => {
      const channelData = new Array();

      if (salesData) {
        channelData.push('ALL');
        salesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (salesCountData) {
        channelData.push('ALL');
        salesCountData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (averageSalesData) {
        channelData.push('ALL');
        averageSalesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      setChannelList(channelData);

      let currentChannel = 'NULL';

      if (channelData && channel == null) {
        currentChannel = channelData[0];
        setChannel(currentChannel);
      }
      else {
        currentChannel = channel;
      }

      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      if (toggleSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Pesanan';
      line.push(addLine);
      if (toggleSalesCount)
        chartLine.push(addLine);
      
      addLine = new Object();
      addLine.column = 'Penjualan/Pesanan';
      line.push(addLine);
      if (toggleAverageSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Konversi';
      line.push(addLine);
      if (toggleConversionRate)
        chartLine.push(addLine);

      const chart = new Array();
      let addChart = new Object();

      let hourCounter = 0;

      let totalSalesValue = 0;
      let totalSalesCountValue = 0;
      let totalAverageSalesValue = 0;
      let totalConversionRateValue = 0;
      let totalConversionRateCounter = 0;

      let lastHour;

      if (dataRange == 'realtime' && dateOption != 'custom-daily')
        lastHour = parseInt(moment().tz("Asia/Jakarta").format('LT').slice(0, -3));
      else
        lastHour = 23;

      while (hourCounter <= 23) { 
        let object = ``;

        if (hourCounter % 6 == 0) {
          if (parseInt(hourCounter / 10) > 0)
            object += `{"label": "${hourCounter}:00"`;
          else
            object += `{"label": "0${hourCounter}:00"`;
        }
        else {
          object += `{"label": ""`;
        }

        if (parseInt(hourCounter / 10) > 0)
          object += `, "dataLabel": "${hourCounter}:00"`;
        else
          object += `, "dataLabel": "0${hourCounter}:00"`;

        let tempSalesValue = 0;
        let tempSalesCountValue = 0;
        let tempAverageSalesValue = 0;

        line.forEach(function (lineItem) {
          let hourExist = false;
          let data = new Array();
          let legend = new Array();

          if (salesData && lineItem.column == 'Penjualan') {
            data = salesData.Data;
            legend = salesData.Legend;
          }
          else if (salesCountData && lineItem.column == 'Pesanan') {
            data = salesCountData.Data;
            legend = salesCountData.Legend;
          }
          else if (averageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = averageSalesData.Data;
            legend = averageSalesData.Legend;
          }
          else if (conversionRateData && lineItem.column == 'Konversi') {
            data = conversionRateData.Data;
            legend = conversionRateData.Legend;
          }

          data.forEach(function (dataItem) {
            if (lineItem.column == 'Konversi') {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  totalConversionRateValue += parseFloat(dataItem[legendItem]);
                  totalConversionRateCounter++;
                }
              });
            }
            else {
              let hour = parseInt(dataItem.Date);

              if (hourCounter == hour) {
                legend.forEach(function (legendItem) {
                  if (legendItem == currentChannel && dataItem[legendItem] != undefined) {
                    object += `, "${lineItem.column}": ${dataItem[legendItem]}`;
                    hourExist = true;
                  }
                  
                  if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                    if (lineItem.column == 'Penjualan') {
                      totalSalesValue += parseFloat(dataItem[legendItem]);
                      tempSalesValue += parseFloat(dataItem[legendItem]);
                    }
                    else if (lineItem.column == 'Pesanan') {
                      totalSalesCountValue += parseInt(dataItem[legendItem]);
                      tempSalesCountValue += parseInt(dataItem[legendItem]);
                    }
                  }
                });
              } 
            }
          });

          if (hourExist == false) {
            object += `, "${lineItem.column}": 0`;
          }

          tempAverageSalesValue = tempSalesCountValue == 0 ? 0 : (tempSalesValue / tempSalesCountValue);
          
          if (currentChannel == 'ALL') {
            if (lineItem.column == 'Penjualan') {
              object += `, "${lineItem.column}": ${tempSalesValue}`;
            }
            else if (lineItem.column == 'Pesanan') {
              object += `, "${lineItem.column}": ${tempSalesCountValue}`;
            }
            else if (lineItem.column == 'Penjualan/Pesanan') {
              if (isNaN(tempAverageSalesValue))
                object += `, "${lineItem.column}": 0`;
              else
                object += `, "${lineItem.column}": ${tempAverageSalesValue}`;
            } 
          }
        });

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        hourCounter++;
      }

      totalAverageSalesValue = totalSalesCountValue == 0 ? 0 : (totalSalesValue / totalSalesCountValue)
      totalConversionRateValue /= totalConversionRateCounter;



      hourCounter = 0;

      let totalPreviousSalesValue = 0;
      let totalPreviousSalesCountValue = 0;
      let totalPreviousAverageSalesValue = 0;
      let totalPreviousConversionRateValue = 0;
      let totalPreviousConversionRateCounter = 0;

      while (hourCounter <= lastHour) { 
        line.forEach(function (lineItem) {
          let data = new Array();
          let legend = new Array();

          if (previousSalesData && lineItem.column == 'Penjualan') {
            data = previousSalesData.Data;
            legend = previousSalesData.Legend;
          }
          else if (previousSalesCountData && lineItem.column == 'Pesanan') {
            data = previousSalesCountData.Data;
            legend = previousSalesCountData.Legend;
          }
          else if (previousAverageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = previousAverageSalesData.Data;
            legend = previousAverageSalesData.Legend;
          }
          else if (previousConversionRateData && lineItem.column == 'Konversi') {
            data = previousConversionRateData.Data;
            legend = previousConversionRateData.Legend;
          }

          data.forEach(function (dataItem) {
            if (lineItem.column == 'Konversi') {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  totalPreviousConversionRateValue += parseFloat(dataItem[legendItem]);
                  totalPreviousConversionRateCounter++;
                }
              });
            }
            else {
              let hour = parseInt(dataItem.Date);

              if (hourCounter == hour) {
                legend.forEach(function (legendItem) {
                  if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                    if (lineItem.column == 'Penjualan') {
                      totalPreviousSalesValue += parseFloat(dataItem[legendItem]);
                    }
                    else if (lineItem.column == 'Pesanan') {
                      totalPreviousSalesCountValue += parseInt(dataItem[legendItem]);
                    }
                  }
                });
              }
            }
          });
        });

        hourCounter++;
      }

      totalPreviousAverageSalesValue = totalPreviousSalesValue / totalPreviousSalesCountValue;
      totalPreviousConversionRateValue /= totalPreviousConversionRateCounter;

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;
      
      const totalSales = new Object();
      totalSales.value = totalSalesValue;
      totalSales.range = vsLabel();
      if (totalSalesValue >= totalPreviousSalesValue) {
        totalSales.growth = ((totalSalesValue / totalPreviousSalesValue) - 1) * 100;
        totalSales.growthTrend = 'up';
      }
      else {
        totalSales.growth = (1 - (totalSalesValue / totalPreviousSalesValue)) * 100;
        totalSales.growthTrend = 'down';
      }
      setTotalSalesData(totalSales);

      const totalSalesCount = new Object();
      totalSalesCount.value = totalSalesCountValue;
      totalSalesCount.range = vsLabel();
      totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
      if (totalSalesCountValue >= totalPreviousSalesCountValue) {
        totalSalesCount.growth = ((totalSalesCountValue / totalPreviousSalesCountValue) - 1) * 100;
        totalSalesCount.growthTrend = 'up';
      }
      else {
        totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
        totalSalesCount.growthTrend = 'down';
      }
      setTotalSalesCountData(totalSalesCount);

      const totalAverageSales = new Object();
      totalAverageSales.value = totalAverageSalesValue;
      totalAverageSales.range = vsLabel();
      totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
      if (totalAverageSalesValue >= totalPreviousAverageSalesValue) {
        totalAverageSales.growth = ((totalAverageSalesValue / totalPreviousAverageSalesValue) - 1) * 100;
        totalAverageSales.growthTrend = 'up';
      }
      else {
        totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
        totalAverageSales.growthTrend = 'down';
      }
      setTotalAverageSalesData(totalAverageSales);
      
      const totalConversionRate = new Object();
      totalConversionRate.value = totalConversionRateValue;
      totalConversionRate.range = vsLabel();
      if (totalConversionRateValue >= totalPreviousConversionRateValue) {
        totalConversionRate.growth = totalConversionRateValue - totalPreviousConversionRateValue;
        totalConversionRate.growthTrend = 'up';
      }
      else {
        totalConversionRate.growth = totalPreviousConversionRateValue - totalConversionRateValue; totalPreviousConversionRateValue;
        totalConversionRate.growthTrend = 'down';
      }
      setTotalConversionRateData(totalConversionRate);
      
      /*
      console.log(totalSalesValue + " | " + totalPreviousSalesValue);
      console.log(totalSalesCountValue + " | " + totalPreviousSalesCountValue);
      console.log(totalAverageSalesValue + " | " + totalPreviousAverageSalesValue);
      */

      return result;
    };

    const fetchMasterSalesData = async (startDate, endDate, previousStartDate, previousEndDate, dataRange) => {
      let processedData;
      let processedMasterData;

      if (dataRange == 'realtime' || dataRange == 'yesterday') {
        processedData = processHourSaleData(dataRange);
        processedMasterData = processHourMasterSaleData(dataRange);
      }
      else if (dataRange == 'yearly') {
        processedData = processMonthSaleData(startDate, endDate, previousStartDate, previousEndDate);
        processedMasterData = processMonthMasterSaleData(startDate, endDate, previousStartDate, previousEndDate);
      }
      else {
        processedData = processDaySaleData(startDate, endDate, previousStartDate, previousEndDate, dataRange);
        processedMasterData = processDayMasterSaleData(startDate, endDate, previousStartDate, previousEndDate, dataRange);
      }
        
      setMasterMultipleSalesData(processedData);
      setMasterSalesData(processedMasterData);
    };

    if ((newDataLoad == true || firstLoad == true || dataReload == true) && checkToken()) {
      const moment = require('moment-timezone');
        
      let momentStartDate;
      let momentEndDate;

      let momentPreviousStartDate;
      let momentPreviousEndDate;
      
      if (dataRange == 'realtime') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(2, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(2, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(14, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(8, "days");
      }
      else if (dataRange == 'monthly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(30, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(60, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(31, "days");
      }

      let startDate;
      let endDate;

      let previousStartDate;
      let previousEndDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");

        previousStartDate = momentPreviousStartDate.format("YYYY-MM-DD");
        previousEndDate = momentPreviousEndDate.format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-daily') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "days").format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "days").format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-weekly') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "weeks").startOf('isoWeek').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "weeks").endOf('isoWeek').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-monthly') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "months").startOf('month').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "months").endOf('month').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-yearly') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "years").startOf('year').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "years").endOf('year').format("YYYY-MM-DD");
      }
      
      fetchMasterSalesData(startDate, endDate, previousStartDate, previousEndDate, dataRange);

      if (firstLoad == true)
        setFirstLoad(false);

      setDataReload(false);
    }
  }, [salesData, salesCountData, averageSalesData, conversionRateData, previousSalesData, previousSalesCountData, previousAverageSalesData, previousConversionRateData, channel, toggleSales, toggleSalesCount, toggleAverageSales, toggleConversionRate, toggleMultipleSales, dataReload]);

  useEffect(() => {
    const fetchProductModelsData = async () => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductmodels`);

      let processedData;
      processedData = result.data;

      setProductModelsData(processedData.Data);
      setModel(processedData.Data[0]);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setProductCategoriesCacheData(object);

      setCategoryFetchActive(true);
    };

    if (modelFetchActive == true && checkToken()) {
      fetchProductModelsData();
      
      setModelFetchActive(false);
    }
  }, [modelFetchActive]);

  useEffect(() => {
    const fetchProductCategoriesData = async (model) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductcategories?model=${model}`);

      let processedData;
      processedData = result.data;

      setProductCategoriesData(processedData.Data[0] ? processedData.Data : ['TIDAK ADA KATEGORI']);
      setCategory(processedData.Data[0] ? processedData.Data[0] : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of productCategoriesCacheData.Data) {
        map.set(key, value);
      }

      map.set(model, processedData.Data[0] ? processedData.Data : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setProductCategoriesCacheData(object);
    };

    if (categoryFetchActive == true && checkToken()) {
      if (productCategoriesCacheData.Data.has(model) == false) {
        fetchProductCategoriesData(model);
      }
      else {
        setProductCategoriesData(productCategoriesCacheData.Data.get(model));
        setCategory(productCategoriesCacheData.Data.get(model)[0]);
      }
      
      setCategoryFetchActive(false);
    }
  }, [categoryFetchActive]);

  useEffect(() => {
    const processMonthModelCategorySaleData = (endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;
      const startDate = processedData.LaunchDate;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let monthCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');
        monthCounter++; 
        let object = ``;

        if (dateDifference > 1095 && monthCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 730 && dateDifference <= 1095 && monthCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 365 && dateDifference <= 730 && monthCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('MMM') == 'Jan')
            object += `{"label": "${moment(currentDate).format('MMM YYYY')}"`;
          else
            object += `{"label": "${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('MMM YYYY')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = totalValue;
      totalModelCategory.quantity = totalQuantity;

      setTotalModelCategoryData(totalModelCategory);
    
      return result;
    };

    const processWeekModelCategorySaleData = (endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;
      const startDate = processedData.LaunchDate;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss").startOf('isoWeek');
      let momentEndDate = moment(endDate, "YYYY-MM-DD").startOf('isoWeek');

      let currentDate = momentStartDate;
      let weekCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        weekCounter++;
        let object = ``;

        if (dateDifference > 140 && weekCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 100 && dateDifference <= 140 && weekCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 60 && dateDifference <= 100 && weekCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          object += `{"label": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let week = parseInt(dataItem.Date.substring(4, 6));

            if (week == currentDate.isoWeek()) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'weeks');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = totalValue;
      totalModelCategory.quantity = totalQuantity;

      setTotalModelCategoryData(totalModelCategory);
    
      return result;
    };

    const processDayModelCategorySaleData = (endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;
      const startDate = processedData.LaunchDate;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dateDifference > 45 && dateCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 30 && dateDifference <= 45 && dateCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 15 && dateDifference <= 30 && dateCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }
              
              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = totalValue;
      totalModelCategory.quantity = totalQuantity;

      setTotalModelCategoryData(totalModelCategory);
    
      return result;
    };

    const fetchModelCategorySalesData = async (endDate, model, category) => {
      setModelCategoryDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelcategorysales?endDate=${endDate}&model=${model}&category=${category}`);

      let processedData;
      processedData = result.data;

      let newData;

      if (processedData.DateDifference <= 60) {
        newData = processDayModelCategorySaleData(endDate, processedData);
      }
      else if (processedData.DateDifference > 60 && processedData.DateDifference < 180) {
        newData = processWeekModelCategorySaleData(endDate, processedData);
      }
      else if (processedData.DateDifference >= 180) {
        newData = processMonthModelCategorySaleData(endDate, processedData);
      }

      setModelCategoryData(newData);
      setModelCategoryDataLoading(false);
    };

    if (checkToken() && category) {
      const moment = require('moment-timezone');

      let endDate;
      endDate = moment(modelCategoryEndDate).format("YYYY-MM-DD");

      fetchModelCategorySalesData(endDate, model, category)
    }
  }, [category, modelCategoryEndDate]);

  useEffect(() => {
    const fetchValueStockData = async (backDate) => {
      setValueStockDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getstockvaluedata?backDate=${backDate}`);

      let processedData;
      processedData = result.data;

      setValueStockData(processedData);
      setValueStockDataLoading(false);
    };

    if (checkToken()) {
      fetchValueStockData(moment(valueStockBackDate).format('YYYY-MM-DD'));
    }
  }, [valueStockBackDate]);

  useEffect(() => {
    const fetchProductModelsCustomData = async () => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductmodels`);

      let processedData;
      processedData = result.data;

      setProductModelsCustomData(processedData.Data);
      setModelCustom(processedData.Data[0]);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setProductCategoriesCustomCacheData(object);

      setCategoryCustomFetchActive(true);
    };

    if (modelCustomFetchActive == true && checkToken()) {
      fetchProductModelsCustomData();
      
      setModelCustomFetchActive(false);
    }
  }, [modelCustomFetchActive]);

  useEffect(() => {
    const fetchProductCategoriesCustomData = async (model) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductcategories?model=${model}`);

      let processedData;
      processedData = result.data;

      setProductCategoriesCustomData(processedData.Data[0] ? ['ALL', ...processedData.Data] : ['TIDAK ADA KATEGORI']);
      setCategoryCustom(processedData.Data[0] ? 'ALL' : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of productCategoriesCustomCacheData.Data) {
        map.set(key, value);
      }

      map.set(model, processedData.Data[0] ? ['ALL', ...processedData.Data] : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setProductCategoriesCustomCacheData(object);
    };

    if (categoryCustomFetchActive == true && checkToken()) {
      if (productCategoriesCustomCacheData.Data.has(modelCustom) == false) {
        fetchProductCategoriesCustomData(modelCustom);
      }
      else {
        setProductCategoriesCustomData(productCategoriesCustomCacheData.Data.get(modelCustom));
        setCategoryCustom(productCategoriesCustomCacheData.Data.get(modelCustom)[0]);
      }
      
      setCategoryCustomFetchActive(false);
    }
  }, [categoryCustomFetchActive]);

  useEffect(() => {
    const processMonthModelCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let monthCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');
        monthCounter++; 
        let object = ``;

        if (dateDifference > 1095 && monthCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 730 && dateDifference <= 1095 && monthCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 365 && dateDifference <= 730 && monthCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('MMM') == 'Jan')
            object += `{"label": "${moment(currentDate).format('MMM YYYY')}"`;
          else
            object += `{"label": "${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('MMM YYYY')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = processedData.TotalValue;
      totalModelCategory.quantity = processedData.TotalQuantity;

      setTotalModelCategoryCustomData(totalModelCategory);
    
      return result;
    };

    const processWeekModelCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD").startOf('isoWeek');
      let momentEndDate = moment(endDate, "YYYY-MM-DD").startOf('isoWeek');

      let currentDate = momentStartDate;
      let weekCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        weekCounter++;
        let object = ``;

        if (dateDifference > 140 && weekCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 100 && dateDifference <= 140 && weekCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 60 && dateDifference <= 100 && weekCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          object += `{"label": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let week = parseInt(dataItem.Date.substring(4, 6));

            if (week == currentDate.isoWeek()) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'weeks');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = processedData.TotalValue;
      totalModelCategory.quantity = processedData.TotalQuantity;

      setTotalModelCategoryCustomData(totalModelCategory);
    
      return result;
    };

    const processDayModelCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dateDifference > 45 && dateCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 30 && dateDifference <= 45 && dateCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 15 && dateDifference <= 30 && dateCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }
              
              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = processedData.TotalValue;
      totalModelCategory.quantity = processedData.TotalQuantity;

      setTotalModelCategoryCustomData(totalModelCategory);
    
      return result;
    };

    const fetchModelCategorySalesCustomData = async (startDate, endDate, modelCustom, categoryCustom) => {
      setModelCategoryCustomDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelcategorysales2?startDate=${startDate}&endDate=${endDate}&model=${modelCustom}&category=${categoryCustom}`);

      let processedData;
      processedData = result.data;

      let newData;

      if (processedData.DateDifference <= 60) {
        newData = processDayModelCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference > 60 && processedData.DateDifference < 180) {
        newData = processWeekModelCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference >= 180) {
        newData = processMonthModelCategorySaleCustomData(startDate, endDate, processedData);
      }

      if (categoryCustom == 'TIDAK ADA KATEGORI') {
        newData = null;
      }

      setModelCategoryCustomData(newData);
      setModelCategoryCustomDataLoading(false);
    };

    const fetchModelCategorySalesCustomAllData = async (startDate, endDate, modelCustom, categoryCustom) => {
      setModelCategoryCustomDataLoading(true);

      let totalValue = 0;
      let totalQuantity = 0;
      let dateDifference = 0;
      const allData = new Array();

      for (var category of productCategoriesCustomData) {
        if (category != 'ALL') {
          const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelcategorysales2?startDate=${startDate}&endDate=${endDate}&model=${modelCustom}&category=${category}`);

          let processedData = result.data;

          totalValue += processedData.TotalValue;
          totalQuantity += processedData.TotalQuantity;
          dateDifference = processedData.DateDifference;

          for (var data of processedData.Data) {
            const result = allData.findIndex( ({ Date }) => Date === data.Date );
            
            if (result == -1) {
              allData.push(data);
            }
            else {
              allData[result].Value = parseFloat(allData[result].Value) + parseFloat(data.Value);
              allData[result].Quantity = parseFloat(allData[result].Quantity) + parseFloat(data.Quantity);
            }
          }
        }
      }

      const processedAllData = new Object();
      processedAllData.TotalValue = totalValue;
      processedAllData.TotalQuantity = totalQuantity;
      processedAllData.DateDifference = dateDifference;
      processedAllData.Data = allData;

      let newData;

      if (processedAllData.DateDifference <= 60) {
        newData = processDayModelCategorySaleCustomData(startDate, endDate, processedAllData);
      }
      else if (processedAllData.DateDifference > 60 && processedAllData.DateDifference < 180) {
        newData = processWeekModelCategorySaleCustomData(startDate, endDate, processedAllData);
      }
      else if (processedAllData.DateDifference >= 180) {
        newData = processMonthModelCategorySaleCustomData(startDate, endDate, processedAllData);
      }

      setModelCategoryCustomData(newData);
      setModelCategoryCustomDataLoading(false);
    };

    if (checkToken() && categoryCustom) {
      const moment = require('moment-timezone');

      let startDate;
      startDate = moment(modelCategoryCustomStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(modelCategoryCustomEndDate).format("YYYY-MM-DD");

      if (categoryCustom != 'ALL') {
        fetchModelCategorySalesCustomData(startDate, endDate, modelCustom, categoryCustom);
      }
      else {
        fetchModelCategorySalesCustomAllData(startDate, endDate, modelCustom, categoryCustom);
      }
    }
  }, [categoryCustom, modelCategoryCustomStartDate, modelCategoryCustomEndDate]);

  useEffect(() => {
    const fetchModelStockData = async () => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductmodels`);

      let processedData;
      processedData = result.data;

      setModelStockData(processedData.Data);
      setModelStock(processedData.Data[0]);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setStockCacheData(object);

      setStockFetchActive(true);
    };

    if (modelFetchActive == true && checkToken()) {
      fetchModelStockData();
      
      setModelStockFetchActive(false);
    }
  }, [modelStockFetchActive]);

  useEffect(() => {
    const fetchStockData = async (model) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getstocklistbymodelname?modelName=${model}`);

      let processedData;
      processedData = result.data;

      if (processedData.Data[0]) {
        let newArray = new Array();
        for (let data of processedData.Data) {
          newArray.push(data.Name);
        }
        setStockData(newArray);
      }
      else {
        setStockData(['TIDAK ADA KATEGORI']);
      }

      setStock(processedData.Data[0] ? processedData.Data[0].Name : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of stockCacheData.Data) {
        map.set(key, value);
      }

      map.set(model, processedData.Data[0] ? processedData.Data : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setStockCacheData(object);
    };

    if (stockFetchActive == true && checkToken()) {
      if (stockCacheData.Data.has(modelStock) == false) {
        fetchStockData(modelStock);
      }
      else {
        let newArray = new Array();
        for (let data of stockCacheData.Data.get(modelStock)) {
          newArray.push(data.Name);
        }
        setStockData(newArray);
        setStock(stockCacheData.Data.get(modelStock)[0].Name);
      }
      
      setStockFetchActive(false);
    }
  }, [stockFetchActive]);

  useEffect(() => {
    const fetchPerformanceData = async (stockID) => {
      setPerformanceDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getstockperformancedata?stockID=${stockID}`);

      let processedData;
      processedData = result.data;

      setPerformanceData(processedData);
      setPerformanceDataLoading(false);
    };

    if (checkToken() && stock && stockCacheData.Data.get(modelStock)) {
      for (let data of stockCacheData.Data.get(modelStock)) {
        if (data.Name == stock) {
          fetchPerformanceData(data.StockID);
        }
      }
    }
  }, [stock, stockCacheData]);

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  return (
    <div className={classes.root}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid item xs={12} ref={componentRef}>
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
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 9,
                        marginLeft: 9
                      }}
                    >
                      Kriteria<br/>Utama
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 15,
                        marginLeft: 9
                      }}
                    >
                      Kriteria Utama
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Channel</InputLabel>
                  <Select
                    value={channel}
                    onChange={handleChannelChange}
                    style={{width: 295, height: 55}}
                    label="Channel"
                    classes={{ root: classes.selectRoot }}
                  >
                    {channelList && channelList.map((item, index) => (
                      <MenuItem disableRipple value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>



              <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
                { totalSalesData &&
                  <Card variant={toggleSales ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleSales ? '#367fe3' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleSalesChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Penjualan
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalSalesData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalSalesData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalSalesData.growth.toFixed(2))}%
                          </Typography>
                          { totalSalesData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                }

                { totalSalesCountData &&
                  <Card variant={toggleSalesCount ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleSalesCount ? '#f6bd16' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleSalesCountChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Pesanan
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalSalesCountData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalSalesCountData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalSalesCountData.growth.toFixed(2))}%
                          </Typography>
                          { totalSalesCountData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                }

                { totalAverageSalesData &&
                  <Card variant={toggleAverageSales ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleAverageSales ? '#fd5151' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleAverageSalesChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Penjualan/Pesanan
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalAverageSalesData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalAverageSalesData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalAverageSalesData.growth.toFixed(2))}%
                          </Typography>
                          { totalAverageSalesData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                }

                { totalConversionRateData &&
                  <Card variant={toggleConversionRate ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleConversionRate ? '#23aaab' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleConversionRateChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Konversi
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalConversionRateData.value.toFixed(2))}</span>%
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalConversionRateData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalConversionRateData.growth.toFixed(2))}%
                          </Typography>
                          { totalConversionRateData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                }
              </Box>

              
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Grafik Setiap Kriteria
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} container justifyContent="flex-end">
                  { toggleSales && 
                    <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                      <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          marginRight: 8,
                          marginTop: 3,
                        }}
                      >
                        Penjualan
                      </Typography>
                    </Box>
                  }
                  { toggleSalesCount && 
                    <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                      <FiberManualRecordIcon style={{ color: '#f6bd16', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          marginRight: 8,
                          marginTop: 3,
                        }}
                      >
                        Pesanan
                      </Typography>
                    </Box>
                  }
                  { toggleAverageSales && 
                    <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                      <FiberManualRecordIcon style={{ color: '#fd5151', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          marginRight: 8,
                          marginTop: 3,
                        }}
                      >
                        Penjualan/Pesanan
                      </Typography>
                    </Box>
                  }
                  { toggleConversionRate && 
                    <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                      <FiberManualRecordIcon style={{ color: '#23aaab', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          marginRight: 8,
                          marginTop: 3,
                        }}
                      >
                        Konversi
                      </Typography>
                    </Box>
                  }
                </Grid>
              </Grid>

              { masterSalesData &&
                <MultiTypeChart line={masterSalesData.line} chart={masterSalesData.chart} width={width}/>
              }

              <Grid item xs={12}>
                { (salesDataLoading || salesCountDataLoading || averageSalesDataLoading || conversionRateDataLoading || previousSalesDataLoading || previousSalesCountDataLoading || previousAverageSalesDataLoading || previousConversionRateDataLoading) &&
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
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
                { toggleMultipleSales && Object.entries(toggleMultipleSales).map(([key,value])=> (
                  <Card variant={value.toggle ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: value.toggle ? randomColorHSL(key) : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={() => handleToggleMultipleSalesChange(key)} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        {key}
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(value.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {value.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(value.growth.toFixed(2))}%
                          </Typography>
                          { value.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>

              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Grafik Penjualan (Channel)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} container justifyContent="flex-end">
                  { toggleMultipleSales && Object.entries(toggleMultipleSales).map(([key,value])=> (
                    <>
                    { value.toggle == true && 
                      <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                        <FiberManualRecordIcon style={{ color: randomColorHSL(key), fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            marginRight: 8,
                            marginTop: 3,
                          }}
                        >
                          {key}
                        </Typography>
                      </Box>
                    }
                    </>
                  ))}
                </Grid>
              </Grid>

              { masterMultipleSalesData && 
                <MultiChannelChart line={toggleMultipleSales} chart={masterMultipleSalesData.chart} width={width}/>
              }

              <Grid item xs={12}>
                { (salesDataLoading || previousSalesDataLoading) &&
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
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Segmentasi
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TabContext value={segmentationTab}>
                    <Box style={{marginLeft: 10, marginRight: 10}}>
                      <TabList onChange={handleSegmentationTabChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Harga Pesanan" value="1" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Jumlah Pesanan" value="2" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Tipe Pembeli" value="3" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Rentang Harga</TableCell>
                              <TableCell align="right">Total Pembeli</TableCell>
                              <TableCell align="right">% Pembeli</TableCell>
                              <TableCell align="right">Total Transaksi</TableCell>
                              <TableCell align="right">% Transaksi</TableCell>
                              <TableCell align="right">Penjualan</TableCell>
                              <TableCell align="right">% Penjualan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentationSalesData && segmentationSalesData.Data.map((row) => (
                              <TableRow
                                key={row.PriceRange}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="left" style={{minWidth: 150}}>
                                  <Typography>
                                    Rp {row.PriceRange}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomer)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomerPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalTransaction)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalTransactionPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{minWidth: 200}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.TotalSales)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalSalesPercentage)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
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
                              <TableCell align="center">Jumlah Transaksi</TableCell>
                              <TableCell align="right">Total Pembeli</TableCell>
                              <TableCell align="right">% Pembeli</TableCell>
                              <TableCell align="right">Penjualan</TableCell>
                              <TableCell align="right">% Penjualan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentationTransactionCountData && segmentationTransactionCountData.Data.map((row) => (
                              <TableRow
                                key={row.TransactionCount}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="center" style={{minWidth: 150}}>
                                  <Typography>
                                    {row.TransactionCount}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomer)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomerPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{minWidth: 200}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.TotalSales)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalSalesPercentage)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
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
                              <TableCell>Rentang Harga</TableCell>
                              <TableCell align="right">Total Pembeli</TableCell>
                              <TableCell align="right">% Pembeli</TableCell>
                              <TableCell align="right">Penjualan</TableCell>
                              <TableCell align="right">% Penjualan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentationCustomerTypeData && segmentationCustomerTypeData.Data.map((row) => (
                              <TableRow
                                key={row.CustomerStatus}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="left" style={{minWidth: 150}}>
                                  <Typography>
                                    {row.CustomerStatus}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomer)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomerPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{minWidth: 200}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.TotalSales)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalSalesPercentage)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  </TabContext>
                </Grid>
                <Grid item xs={12}>
                  { (segmentationSalesDataLoading || segmentationTransactionCountDataLoading || segmentationCustomerTypeLoading) &&
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
                    href={productTab == 1 ? "/analytic/modelsales" 
                        : productTab == 2 ? "/analytic/modelsalescount"
                        : productTab == 3 ? "/analytic/categorysales"
                        : productTab == 4 ? "/analytic/categorysalescount"
                        : productTab == 5 ? "/analytic/productsales"
                        : "/analytic/productsalescount" }
                  >
                    <Typography
                      gutterBottom
                      variant="body2"
                      style={{
                        color: "#4084e1",
                        fontWeight: "normal",
                        marginTop: 7
                      }}
                    >
                      Lainnya
                    </Typography>
                    <KeyboardArrowRightIcon
                      style={{ color: '#4084e1', fontSize: 20, marginRight: 3}}
                    />
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
                            {modelSalesData && modelSalesData.Data.map((row) => (
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
                            {modelSalesCountData && modelSalesCountData.Data.map((row) => (
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
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categorySalesData && categorySalesData.Data.map((row) => (
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
                    <TabPanel value="4">
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
                            {categorySalesCountData && categorySalesCountData.Data.map((row) => (
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
                            {productSalesData && productSalesData.Data.map((row) => (
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
                            {productSalesCountData && productSalesCountData.Data.map((row) => (
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
                <Grid item xs={12}>
                  { (productSalesDataLoading || productSalesCountDataLoading || modelSalesDataLoading || modelSalesCountDataLoading || categorySalesDataLoading || categorySalesCountDataLoading)  &&
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

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Grid item xs={12}>
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
                        Tanggal<br/>Belakang
                      </Typography>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 22,
                          marginBottom: 30,
                          marginRight: 47,
                          marginLeft: 9
                        }}
                      >
                        Tanggal Belakang
                      </Typography>
                  }
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      variant="inline"
                      format="YYYY-MM-DD"
                      label="Backdate"
                      value={valueStockBackDate}
                      style={{marginTop: 10, width: 150}}
                      onChange={handleValueStockBackDate}
                    />
                  </MuiPickersUtilsProvider>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Value Stock
                </Typography>
              </Grid>

              <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#367fe3', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock
                        <br/>
                        Packaging
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'StockValuePackaging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#f6bd16', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock by
                        <br/>
                        Harga Beli
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'StockValueByBuyPrice').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#fd5151', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock Aging {">"}90 Hari by Harga Beli
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'MoreThan90DaysStockAging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#23aaab', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock Aging {">"}150 Hari by Harga Beli 
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key == 'MoreThan150DaysStockAging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

              { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#aa88ff', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock Aging {">"}210 Hari by Harga Beli
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'MoreThan210DaysStockAging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }
              </Box>

              <Grid item xs={12}>
                { valueStockDataLoading &&
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
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 21,
                        marginLeft: 9
                      }}
                    >
                      Model<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 36,
                        marginLeft: 9
                      }}
                    >
                      Model Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={model}
                    onChange={handleModelChange}
                    options={productModelsData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Model" />}
                  />
                </FormControl>
              </Box>

              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 9,
                        marginLeft: 9
                      }}
                    >
                      Kategori<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 15,
                        marginLeft: 9
                      }}
                    >
                      Kategori Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={category}
                    onChange={handleCategoryChange}
                    options={productCategoriesData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                  />
                </FormControl>
              </Box>
              
              { modelCategoryData &&
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
                            Tanggal<br/>Akhir
                          </Typography>
                        : <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginTop: 22,
                              marginBottom: 30,
                              marginRight: 47,
                              marginLeft: 9
                            }}
                          >
                            Tanggal Akhir
                          </Typography>
                      }
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="End Date"
                          value={modelCategoryEndDate}
                          style={{marginTop: 10, width: 150}}
                          onChange={handleModelCategoryEndDateChange}
                        />
                      </MuiPickersUtilsProvider>
                    </Box>
                  </Grid>
                  { totalModelCategoryData && 
                    <Grid item xs={12} md={4} container justifyContent="flex-end">
                      <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            marginTop: isMobile ? 9 : 15,
                            marginBottom: 9,
                            marginRight: 9,
                            marginLeft: 9
                          }}
                        >
                          Total Penjualan: Rp. {Intl.NumberFormat('id').format(totalModelCategoryData.value)}
                          <br/>
                          Total Jumlah: {Intl.NumberFormat('id').format(totalModelCategoryData.quantity)}
                        </Typography>
                    </Grid>
                  }
                </Grid>
              }
              
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Grafik Penjualan (Model & Kategori)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} container justifyContent="flex-end">
                  { modelCategoryData
                    ? <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                        <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            marginRight: 8,
                            marginTop: 3,
                          }}
                        >
                          Penjualan
                        </Typography>
                      </Box>
                    : <Box className={classes.inline} style={{height: 27}}/>
                  }
                </Grid>
              </Grid>

              { modelCategoryData
                ? <MultiTypeChart line={modelCategoryData.line} chart={modelCategoryData.chart} width={width}/>
                : <EmptyChart width={width}/>
              }

              <Grid item xs={12}>
                { modelCategoryDataLoading &&
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
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 21,
                        marginLeft: 9
                      }}
                    >
                      Model<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 36,
                        marginLeft: 9
                      }}
                    >
                      Model Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={modelCustom}
                    onChange={handleModelCustomChange}
                    options={productModelsCustomData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Model" />}
                  />
                </FormControl>
              </Box>

              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 9,
                        marginLeft: 9
                      }}
                    >
                      Kategori<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 15,
                        marginLeft: 9
                      }}
                    >
                      Kategori Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={categoryCustom}
                    onChange={handleCategoryCustomChange}
                    options={productCategoriesCustomData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                  />
                </FormControl>
              </Box>
              
              { modelCategoryCustomData &&
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
                              marginRight: 97,
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
                          value={modelCategoryCustomStartDate}
                          style={{marginTop: 10, marginRight: 10, width: 150}}
                          onChange={handleModelCategoryCustomStartDateChange}
                        />
                        { !isMobile && 
                          <KeyboardDatePicker
                            variant="inline"
                            format="YYYY-MM-DD"
                            label="End Date"
                            value={modelCategoryCustomEndDate}
                            style={{marginTop: 10, width: 150}}
                            onChange={handleModelCategoryCustomEndDateChange}
                          />
                        }
                      </MuiPickersUtilsProvider>
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
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="YYYY-MM-DD"
                            label="End Date"
                            value={modelCategoryCustomEndDate}
                            style={{marginTop: 10, width: 150}}
                            onChange={handleModelCategoryCustomEndDateChange}
                          />
                        </MuiPickersUtilsProvider>
                      </Box>
                    </Grid>
                  }
                  { totalModelCategoryCustomData && 
                    <Grid item xs={12} md={4} container justifyContent="flex-end">
                      <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            marginTop: isMobile ? 9 : 15,
                            marginBottom: 9,
                            marginRight: 9,
                            marginLeft: 9
                          }}
                        >
                          Total Penjualan: Rp. {Intl.NumberFormat('id').format(totalModelCategoryCustomData.value)}
                          <br/>
                          Total Jumlah: {Intl.NumberFormat('id').format(totalModelCategoryCustomData.quantity)}
                        </Typography>
                    </Grid>
                  }
                </Grid>
              }
              
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Grafik Penjualan Custom (Model & Kategori)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} container justifyContent="flex-end">
                  { modelCategoryCustomData
                    ? <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                        <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            marginRight: 8,
                            marginTop: 3,
                          }}
                        >
                          Penjualan
                        </Typography>
                      </Box>
                    : <Box className={classes.inline} style={{height: 27}}/>
                  }
                </Grid>
              </Grid>

              { modelCategoryCustomData
                ? <MultiTypeChart line={modelCategoryCustomData.line} chart={modelCategoryCustomData.chart} width={width}/>
                : <EmptyChart width={width}/>
              }

              <Grid item xs={12}>
                { modelCategoryCustomDataLoading &&
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
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 21,
                        marginLeft: 9
                      }}
                    >
                      Model
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 86,
                        marginLeft: 9
                      }}
                    >
                      Model
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={modelStock}
                    onChange={handleModelStockChange}
                    options={modelStockData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Model" />}
                  />
                </FormControl>
              </Box>

              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 34,
                        marginLeft: 9
                      }}
                    >
                      Stok
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 101,
                        marginLeft: 9
                      }}
                    >
                      Stok
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={stock}
                    onChange={handleStockChange}
                    options={stockData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Stock" />}
                  />
                </FormControl>
              </Box>
              
              { performanceData && 
                <Box className={classes.inline}>
                  { isMobile
                    ? <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 9,
                          marginBottom: 5,
                          marginRight: 25,
                          marginLeft: 9
                        }}
                      >
                        Launch<br/>Date
                      </Typography>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 22,
                          marginBottom: 5,
                          marginRight: 44,
                          marginLeft: 9
                        }}
                      >
                        Launch Date
                      </Typography>
                  }
                  { isMobile
                    ? <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 21,
                          marginBottom: 5,
                          marginRight: 5
                        }}
                      >
                        {performanceData.Data.find(o => o.Key === 'LaunchDate').Value ? moment(performanceData.Data.find(o => o.Key === 'LaunchDate').Value).format('LL') : '-'}
                      </Typography>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 22,
                          marginBottom: 5,
                          marginRight: 5
                        }}
                      >
                        {performanceData.Data.find(o => o.Key === 'LaunchDate').Value ? moment(performanceData.Data.find(o => o.Key === 'LaunchDate').Value).format('LL') : '-'}
                      </Typography>
                  }
                </Box>
              }

              <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
                { performanceData && 
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#fd5151', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        45 Days Peformance
                      </Typography>
                      <Grid container style={{marginTop: 15}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value ? `${performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value}/${performanceData.Data.find(o => o.Key === 'StockQty').Value}` : "0/0"}
                            <br/>
                            terjual
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000",  
                              fontSize: 18,
                              textAlign: 'left',
                              fontWeight: 800,
                              display: 'inline'
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value ? `${Intl.NumberFormat('id').format((performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value / performanceData.Data.find(o => o.Key === 'StockQty').Value * 100).toFixed(2))}%` : "NaN%"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                }

                { performanceData && 
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#23aaab', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        60 Days Peformance
                      </Typography>
                      <Grid container style={{marginTop: 15}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value ? `${performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value}/${performanceData.Data.find(o => o.Key === 'StockQty').Value}` : "0/0"}
                            <br/>
                            terjual
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000",  
                              fontSize: 18,
                              textAlign: 'left',
                              fontWeight: 800,
                              display: 'inline'
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value ? `${Intl.NumberFormat('id').format((performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value / performanceData.Data.find(o => o.Key === 'StockQty').Value * 100).toFixed(2))}%` : "NaN%"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                }

                { performanceData && 
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#aa88ff', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        90 Days Peformance
                      </Typography>
                      <Grid container style={{marginTop: 15}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value ? `${performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value}/${performanceData.Data.find(o => o.Key === 'StockQty').Value}` : "0/0"}
                            <br/>
                            terjual
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000",  
                              fontSize: 18,
                              textAlign: 'left',
                              fontWeight: 800,
                              display: 'inline'
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value ? `${Intl.NumberFormat('id').format((performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value / performanceData.Data.find(o => o.Key === 'StockQty').Value * 100).toFixed(2))}%` : "NaN%"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                }
              </Box>

              <Grid item xs={12}>
                { performanceDataLoading &&
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
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
}

export default Home;