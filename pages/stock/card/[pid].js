import Head from "next/head";
import Layout from "../../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import React, { useState, useEffect, useRef } from 'react';
import useContainerDimensions from  "../../../src/utils/screen.js";
import axios from '../../../src/utils/axios';
import Router from "next/router";
import { useRouter } from 'next/router';

import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment-timezone';
import 'moment/locale/id';

import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Sort,
    Filter,
    Inject,
    VirtualScroll,
  } from '@syncfusion/ej2-react-grids';

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
  }
}));

const StockCard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { pid } = router.query;

  const [fetchActive, setFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  moment.locale('id');

  const [stockCardData, setStockCardData] = React.useState();
  const [stockID, setStockID] = React.useState();
  const [stockName, setStockName] = React.useState();
  const [stockStartDate, setStockStartDate] = React.useState(moment());
  const [stockEndDate, setStockEndDate] = React.useState(moment());

  const handleStockStartDateChange = (date) => {
    setStockStartDate(date);
  };

  const handleStockEndDateChange = (date) => {
    setStockEndDate(date);
  };

  const handleStockCardApply = () => {
    setFetchActive(true);
  };

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);


  useEffect(() => {
    const fetchStockName = async (stockID) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstockname?stockID=${stockID}`);

      let processedData;
      processedData = result.data;
      
      setStockName(processedData.Data.Name);
      
      setDataLoading(false);
    };

    if (pid != undefined) {
      setStockID(pid);
      fetchStockName(pid);
    }
  }, [pid]);

  useEffect(() => {
    const fetchStockCardData = async (stockID, startDate, endDate) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstockcard?stockID=${stockID}&startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.ActivityDate = dataItem.ActivityDate;
				object.Note = dataItem.Note;
				object.SummedQuantity = dataItem.SummedQuantity;
				object.Stock = dataItem.Stock;

        newData.push(object);
      });

      processedData.Data = newData;
      
      setStockCardData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
      
        let startDate;
        startDate = moment(stockStartDate).format("YYYY-MM-DD");

        let endDate;
        endDate = moment(stockEndDate).format("YYYY-MM-DD");

        fetchStockCardData(stockID, startDate, endDate);
        setFetchActive(false);
    }
  }, [fetchActive]);

  return (
    <div className={classes.root} ref={componentRef}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid item xs={12}>
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
                    Kartu Stok [{stockID}] {stockName}
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
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={stockStartDate}
                          style={{marginTop: 10, marginRight: 10, width: 150}}
                          onChange={handleStockStartDateChange}
                        />
                        { !isMobile && 
                          <KeyboardDatePicker
                            variant="inline"
                            format="YYYY-MM-DD"
                            label="End Date"
                            value={stockEndDate}
                            style={{marginTop: 10, width: 150}}
                            onChange={handleStockEndDateChange}
                          />
                        }
                      </MuiPickersUtilsProvider>
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
                            onClick={handleStockCardApply}
                        >
                            Tampilkan
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
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <KeyboardDatePicker
                            variant="inline"
                            format="YYYY-MM-DD"
                            label="End Date"
                            value={stockEndDate}
                            style={{marginTop: 10, width: 150}}
                            onChange={handleStockEndDateChange}
                          />
                        </MuiPickersUtilsProvider>
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
                            onClick={handleStockCardApply}
                        >
                            Tampilkan
                        </Button>
                    </Grid>
                }
                <Grid item xs={12}>
                    <GridComponent
                        dataSource={stockCardData && stockCardData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={height - (isMobile ? 450 : 400)}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="ActivityDate"
                              headerText="Tgl. Aktivitas"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Center"
                          />
                          <ColumnDirective
                              field="Note"
                              headerText="Keterangan"
                              width="300"
                          />
                          <ColumnDirective
                              field="SummedQuantity"
                              headerText="Jumlah"
                              width="130"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Stock"
                              headerText="Stock"
                              width="130"
                              format="N0"
                              textAlign="Right"
                          />
                        </ColumnsDirective>
                        <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                    </GridComponent>
                </Grid>
                <Grid item xs={12}>
                  { dataLoading &&
                    <Box className={classes.inline} style={{marginTop: 10, marginLeft: 15, marginBottom: 10}}>
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
      
      <style jsx global>{` 
        .e-grid {
            font-family: GoogleSans;
        }

        .e-grid .e-headercelldiv {
            color: #000;
         }
      `}</style> 
    </div>
  );
}

export default StockCard;