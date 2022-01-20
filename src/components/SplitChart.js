import Head from "next/head";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
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
  Divider
} from "@material-ui/core";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useWindowSize from  "../src/utils/screen.js"
import randomColorHSL from  "../src/utils/randomColorHSL"
import OutlinedInput from '@material-ui/core/OutlinedInput';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const line1 = [
  {
    column: "uv",
    color: "#82ca9d"
  },
  {
    column: "pv",
    color: "#8884d8"
  }
];

const chart1 = [
  {
    label: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    label: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    label: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    label: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    label: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    label: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    label: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
    margin: 10
  },
  paper2: {
    padding: 10,
    margin: 10,
    display: "flex",
    flexDirection: "row"
  },
  border: {
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    border: '2px solid darkgray',
    borderRadius: 10,
  },
  formControl: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "row"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectRoot: {
    '&:focus':{
      backgroundColor: 'transparent'
    }
  }
}));

const Chart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { height, width } = useWindowSize();
  
  return (
    <LineChart
      width={isMobile ? width - 35 : width / 2 - 35}
      height={320}
      data={props.chart}
      margin={{
        top: 15,
        right: 40,
        bottom: 5,
        left: 20
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" interval={0} angle={0} dx={0}/>
      <YAxis width={80} tickFormatter={(value) => {return new Intl.NumberFormat('id').format(value)}}/>
      <Tooltip formatter={(value) => {return Intl.NumberFormat('id').format(value)}}/>
      <Legend />
      {props.line.map((item, index) => (
        <Line
          type="linear"
          dataKey={item.column}
          stroke={randomColorHSL(item.column)}
          dot={false}
          activeDot={{ r: 5 }}
        />  
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

  const [fetchActive, setFetchActive] = React.useState(true);
  const [dateOption, setDateOption] = React.useState('weekly');
  const [dataRange, setDataRange] = React.useState('weekly');

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
    const processMonthSaleData = (APIData, startDate, endDate, dataRange) => {
      const line = new Array();

      let legend = new Array();
      legend = APIData.Legend;

      legend.forEach(function (item) {
        let addLine = new Object();
        addLine.column = item;
        line.push(addLine);
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      data = APIData.Data;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        let object = ``;

        object += `{"label": "${moment(currentDate).format('MMM')}"`;
        
        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');;

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
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

      const result = new Object();
      result.line = line;
      result.chart = chart;
    
      return result;
    };

    const processDaySaleData = (APIData, startDate, endDate, dataRange) => {
      const line = new Array();

      let legend = new Array();
      legend = APIData.Legend;

      legend.forEach(function (item) {
        let addLine = new Object();
        addLine.column = item;
        line.push(addLine);
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      data = APIData.Data;

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
        
        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
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

      const result = new Object();
      result.line = line;
      result.chart = chart;
    
      return result;
    };

    const processHourSaleData = (APIData) => {  
      const line = new Array();

      let legend = new Array();
      legend = APIData.Legend;

      legend.forEach(function (item) {
        let addLine = new Object();
        addLine.column = item;
        line.push(addLine);
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      data = APIData.Data;

      let hourCounter = 0;

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
        
        let hourExist = false;
        
        data.forEach(function (dataItem) {
          let hour = parseInt(dataItem.Date);

          if (hourCounter == hour) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
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

      const result = new Object();
      result.line = line;
      result.chart = chart;
    
      return result;
    };

    const processMonthConversionRateData = (APIData, startDate, endDate, dataRange) => {  
      const line = new Array();
      let addLine = new Object();
    
      addLine.column = "ALL";
      line.push(addLine);

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      data = APIData.Data;

      const moment = require('moment');
      moment.locale('id'); 

      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        let object = ``;

        object += `{"label": "${moment(currentDate).format('MMM')}"`;
        
        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');;

          if (moment(date).isSame(currentDate) == true) {
            object += `, "ALL": ${dataItem.Value}`;

            dateExist = true;
          }
        });

        if (dateExist == false) {
          object += `, "ALL": 0`;
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = line;
      result.chart = chart;
    
      return result;
    };

    const processDayConversionRateData = (APIData, startDate, endDate, dataRange) => {  
      const line = new Array();
      let addLine = new Object();
    
      addLine.column = "ALL";
      line.push(addLine);

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      data = APIData.Data;

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
        
        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            object += `, "ALL": ${dataItem.Value}`;

            dateExist = true;
          }
        });

        if (dateExist == false) {
          object += `, "ALL": 0`;
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = line;
      result.chart = chart;
    
      return result;
    };

    const fetchSalesData = async (startDate, endDate, dataRange) => {
      console.log(`http://ultigeapi-env.eba-9kkgvz2t.ap-southeast-1.elasticbeanstalk.com/ultigeapi/web/analytic/getsales?startDate=${startDate}&endDate=${endDate}`);

      const result = await axios.get(`http://ultigeapi-env.eba-9kkgvz2t.ap-southeast-1.elasticbeanstalk.com/ultigeapi/web/analytic/getsales?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          "Client-ID": '8572d3838a0e2b9b4de63e6c72e3ab5d'
        }
       });

      let processedData;

      if (dataRange == 'realtime' || dataRange == 'yesterday')
        processedData = processHourSaleData(result.data);
      else if (dataRange == 'yearly')
        processedData = processMonthSaleData(result.data, startDate, endDate, dataRange);
      else
        processedData = processDaySaleData(result.data, startDate, endDate, dataRange);

      setSalesData(processedData);
    };

    const fetchSalesCountData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`http://ultigeapi-env.eba-9kkgvz2t.ap-southeast-1.elasticbeanstalk.com/ultigeapi/web/analytic/getsalescount?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          "Client-ID": '8572d3838a0e2b9b4de63e6c72e3ab5d'
        }
       });

      let processedData;

      if (dataRange == 'realtime' || dataRange == 'yesterday')
        processedData = processHourSaleData(result.data);
      else if (dataRange == 'yearly')
        processedData = processMonthSaleData(result.data, startDate, endDate, dataRange);
      else
        processedData = processDaySaleData(result.data, startDate, endDate, dataRange);

        setSalesCountData(processedData);
    };

    const fetchAverageSalesData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`http://ultigeapi-env.eba-9kkgvz2t.ap-southeast-1.elasticbeanstalk.com/ultigeapi/web/analytic/getaveragesales?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          "Client-ID": '8572d3838a0e2b9b4de63e6c72e3ab5d'
        }
       });

      let processedData;

      if (dataRange == 'realtime' || dataRange == 'yesterday')
        processedData = processHourSaleData(result.data);
      else if (dataRange == 'yearly')
        processedData = processMonthSaleData(result.data, startDate, endDate, dataRange);
      else
        processedData = processDaySaleData(result.data, startDate, endDate, dataRange);

        setAverageSalesData(processedData);
    };

    const fetchConversionRateData = async (startDate, endDate, dataRange) => {
      const result = await axios.get(`http://ultigeapi-env.eba-9kkgvz2t.ap-southeast-1.elasticbeanstalk.com/ultigeapi/web/analytic/getconversionrate?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          "Client-ID": '8572d3838a0e2b9b4de63e6c72e3ab5d'
        }
       });

      let processedData;
      
      if (dataRange == 'yearly')
        processedData = processMonthConversionRateData(result.data, startDate, endDate, dataRange);
      else
        processedData = processDayConversionRateData(result.data, startDate, endDate, dataRange);

      setConversionRateData(processedData);
    };

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

    if (fetchActive == true) {
      fetchSalesData(startDate, endDate, dataRange);
      fetchSalesCountData(startDate, endDate, dataRange);
      fetchAverageSalesData(startDate, endDate, dataRange);
      fetchConversionRateData(startDate, endDate, dataRange);

      setFetchActive(false);
    }
  }, [fetchActive]);

  return (
    <div className={classes.root}>
      <Head>
          <title>Ultige Web</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container style={{padding: 5}}>
        <Grid item xs={12}>
          <Paper className={classes.paper2} elevation={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              { isMobile
                ? <InputLabel>Periode Data</InputLabel>
                : <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
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
                    value={dataRange}
                    onChange={handleChange}
                    defaultValue='weekly'
                    style={{height: 60, width: 375}}
                    label="Periode Data"
                    classes={{ root: classes.selectRoot }}
                  >
                    <MenuItem disableRipple value='realtime'>Real-time: <br/>Hari ini - Pk {moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00</MenuItem>
                    <MenuItem disableRipple value='yesterday'>Kemarin: <br/>{moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                    <MenuItem disableRipple value='weekly'>7 hari sebelumnya: <br/>{moment().tz("Asia/Jakarta").subtract(7, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                    <MenuItem disableRipple value='monthly'>30 hari sebelumnya: <br/>{moment().tz("Asia/Jakarta").subtract(30, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                    <Divider style={{margin: 12}}/>
                    <MenuItem disableRipple value='custom-daily'>Per Hari</MenuItem>
                    <MenuItem disableRipple value='custom-weekly'>Per Minggu</MenuItem>
                    <MenuItem disableRipple value='custom-monthly'>Per Bulan</MenuItem>
                    <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun</MenuItem>
                  </Select>
                : <Select
                    value={dateOption}
                    onChange={handleChange} 
                    defaultValue='weekly'
                    style={{height: 45, width: 450}}
                    classes={{ root: classes.selectRoot }}
                  >
                    <MenuItem disableRipple value='realtime'>Real-time: Hari ini - Pk {moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00</MenuItem>
                    <MenuItem disableRipple value='yesterday'>Kemarin: {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                    <MenuItem disableRipple value='weekly'>7 hari sebelumnya: {moment().tz("Asia/Jakarta").subtract(7, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                    <MenuItem disableRipple value='monthly'>30 hari sebelumnya: {moment().tz("Asia/Jakarta").subtract(30, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                    <Divider style={{margin: 12}}/>
                    <MenuItem disableRipple value='custom-daily'>Per Hari</MenuItem>
                    <MenuItem disableRipple value='custom-weekly'>Per Minggu</MenuItem>
                    <MenuItem disableRipple value='custom-monthly'>Per Bulan</MenuItem>
                    <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun</MenuItem>
                  </Select>
              }
            </FormControl>
            { (dateOption == "custom-daily" 
              || dateOption == "custom-weekly"
              ||dateOption == "custom-monthly"
              ||dateOption == "custom-yearly") &&
              <Grid style={{margin: 6, height: 30}}>  
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    variant="inline"
                    format="YYYY-MM-DD"
                    label="Start Date"
                    value={selectedStartDate}
                    style={{marginRight: 15, width: 150}}
                    onChange={handleStartDateChange}
                  />
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

        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} elevation={3}>
            <Typography 
              style={{
                color: "#000", 
                fontSize: 32,
                textAlign: 'center'
              }}
            >
              Penjualan
            </Typography>
            { salesData &&
              <Chart line={salesData.line} chart={salesData.chart}/>
            }
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} elevation={3}>
            <Typography 
              style={{
                color: "#000", 
                fontSize: 32,
                textAlign: 'center'
              }}
            >
              Pesanan
            </Typography>
            { salesCountData && 
              <Chart line={salesCountData.line} chart={salesCountData.chart}/>
            }
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} elevation={3}>
            <Typography 
              style={{
                color: "#000", 
                fontSize: 32,
                textAlign: 'center'
              }}
            >
              Tingkat Konversi
            </Typography>
            { conversionRateData && dataRange != 'realtime' && dataRange != 'yesterday'
              ? <Chart line={conversionRateData.line} chart={conversionRateData.chart}/>
              : <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 32,
                    textAlign: 'center',
                    margin: 136
                  }}
                >
                  // DATA TIDAK TERSEDIA //
                </Typography>
            }
          </Paper>
        </Grid>


        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} elevation={3}>
            <Typography 
              style={{
                color: "#000", 
                fontSize: 32,
                textAlign: 'center'
              }}
            >
              Penjualan/Pesanan
            </Typography>
            { averageSalesData &&
              <Chart line={averageSalesData.line} chart={averageSalesData.chart}/>
            }
          </Paper>
        </Grid>

        {/*
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper} elevation={3}>
              <Typography 
                style={{
                  color: "#000", 
                  fontSize: 32,
                  textAlign: 'center'
                }}
              >
                Repeat Order Rate
              </Typography>
              <Chart line={line1} chart={chart1}/>
            </Paper>
          </Grid>
        */}
      </Grid>
    </div>
  );
}

export default Home;