import Head from "next/head";
import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import React, { useState, useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';
import Router from "next/router";

import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Sort,
    Filter,
    Inject,
    VirtualScroll
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

const StatusDescriptionTemplate = (props) => {
  if (props.StatusDescription == 'PENDING') {
    return (
      <span style={{color: '#F6AF43'}}>
        {props.StatusDescription}
      </span>
    );
  }
  else if (props.StatusDescription == 'REJECTED') {
    return (
      <span style={{color: '#F14343'}}>
        {props.StatusDescription}
      </span>
    );
  }
  else if (props.StatusDescription == 'APPROVED') {
    return (
      <span style={{color: '#3C8F4A'}}>
        {props.StatusDescription}
      </span>
    );
  }
  else if (props.StatusDescription == 'CANCELLED') {
    return (
      <span style={{color: '#FC6F03'}}>
        {props.StatusDescription}
      </span>
    );
  }
  else if (props.StatusDescription == 'PAID') {
    return (
      <span style={{color: '#536FB7'}}>
        {props.StatusDescription}
      </span>
    );
  }
  else if (props.StatusDescription == 'HALF PAID') {
    return (
      <span style={{color: '#97A8D3'}}>
        {props.StatusDescription}
      </span>
    );
  }
};

const PaymentCategoryCountTemplate = (props) => {
  if (props.PaymentCategoryCount > 1) {
    return (
      <span style={{color: '#F6AF43'}}>
        {props.PaymentCategoryCount}
      </span>
    );
  }
  else {
    return (
      <span>
        {props.PaymentCategoryCount}
      </span>
    );
  }
};

const GetDateFilter = (dateType) => {
  let dateFilter;

  if (dateType == 'TGL. INVOICE')
    dateFilter = 'InvoiceDate'
  else if (dateType == 'TGL. JATUH TEMPO')
    dateFilter = 'DueDate'
  else if (dateType == 'APPROVAL')
    dateFilter = 'InvoiceDate'
  else if (dateType == 'TGL. REQUEST')
    dateFilter = 'RequestDate'
  else if (dateType == 'TGL. ORDER')
    dateFilter = 'OrderDate'

  return dateFilter;
}

const TransferRequest = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchActive, setFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [transferRequestData, setTransferRequestData] = React.useState();
  const [dateType, setDateType] = React.useState('TGL. INVOICE');
  const [dateTypeList, setDateTypeList] = React.useState(['TGL. INVOICE', 'TGL. ORDER', 'TGL. REQUEST', 'TGL. JATUH TEMPO', 'TGL. APPROVAL']);

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');

  const moment = require('moment-timezone');
  moment.locale('id');

  const [transferRequestStartDate, setTransferRequestStartDate] = React.useState(moment());
  const [transferRequestEndDate, setTransferRequestEndDate] = React.useState(moment());

  const handleTransferRequestStartDateChange = (date) => {
    setTransferRequestStartDate(date);
  };

  const handleTransferRequestEndDateChange = (date) => {
    setTransferRequestEndDate(date);
  };

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const RowSelected = (props) => {
    Router.push(`/transfer-request/${props.rowData.TransferRequestID}`);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    gridInstance.search(e.target.value);
  }

  const handleResetFilter = () => {
    gridInstance.clearFiltering();
    gridInstance.clearSorting();
    gridInstance.search('');
    setSearchValue('');
  }

  const handleDateTypeChange = (event) => {
    setDateType(event.target.value);
  };

  const handleRefreshData = () => {
    setFetchActive(true);
  }

  useEffect(() => {
    const fetchTransferRequestData = async (startDate, endDate, dateFilter) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/transferrequest/gettransferrequestbydate?startDate=${startDate}&endDate=${endDate}&dateFilter=${dateFilter}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.TransferRequestID = dataItem.TransferRequestID;
				object.MutationID = dataItem.MutationID;
				object.StatusDescription = dataItem.StatusDescription;
				object.TransactionID = dataItem.TransactionID;
				object.OrderDate = dataItem.OrderDate;
				object.RequestDate = dataItem.RequestDate;
				object.InvoiceDate = dataItem.InvoiceDate;
				object.DueDate = dataItem.DueDate;
				object.Requestor = dataItem.Requestor;
				object.RequestValue = Intl.NumberFormat('id').format(dataItem.RequestValue);
				object.DestinationAccountName = dataItem.DestinationAccountName;
				object.DestinationBank = dataItem.DestinationBank;
				object.DestinationAccountNumber = dataItem.DestinationAccountNumber;
				object.PaymentCategoryTitle1 = dataItem.PaymentCategoryTitle1;
				object.PaymentCategoryTitle2 = dataItem.PaymentCategoryTitle2;
				object.PaymentCategoryTitle3 = dataItem.PaymentCategoryTitle3;
				object.PaymentCategoryCount = dataItem.PaymentCategoryCount;
				object.RequestReason = dataItem.RequestReason.length > 30 ? dataItem.RequestReason.substring(0, 30) + "..." : dataItem.RequestReason;
				object.ApprovalDate = dataItem.ApprovalDate;
				object.Approver = dataItem.Approver;

        newData.push(object);
      });

      processedData.Data = newData;
      //console.log(newData);
      
      setTransferRequestData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
      const moment = require('moment-timezone');

      let startDate;
      startDate = moment(transferRequestStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(transferRequestEndDate).format("YYYY-MM-DD");

      let dateFilter = GetDateFilter(dateType);

      fetchTransferRequestData(startDate, endDate, dateFilter);
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
                    List Transfer Request
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box className={classes.inline}>
                    { isMobile
                      ? <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
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
                            marginTop: 12,
                            marginBottom: 25,
                            marginRight: 20,
                            marginLeft: 10
                          }}
                        >
                          Tanggal
                        </Typography>
                    }
                    <FormControl variant="outlined" style={{marginTop: 6, marginRight: 10, display: "flex", flexDirection: "row"}}>
                      <InputLabel>Date Type</InputLabel>
                        <Select
                          value={dateType}
                          onChange={handleDateTypeChange}
                          style={{width: 200, height: 45}}
                          label="Date Type"
                          classes={{ root: classes.selectRoot }}
                        >
                          {dateTypeList && dateTypeList.map((item, index) => (
                            <MenuItem disableRipple value={item}>{item}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        variant="inline"
                        format="YYYY-MM-DD"
                        label="Start Date"
                        value={transferRequestStartDate}
                        style={{marginRight: 10, minWidth: 150, maxWidth: 150}}
                        onChange={handleTransferRequestStartDateChange}
                      />
                      { !isMobile && 
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="End Date"
                          value={transferRequestEndDate}
                          style={{minWidth: 150, maxWidth: 150}}
                          onChange={handleTransferRequestEndDateChange}
                        />
                      }
                    </MuiPickersUtilsProvider>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} container justifyContent="flex-end">
                  <Button 
                    variant="contained"
                    style={{
                        borderRadius: 4,
                        textTransform: "none",
                        margin: 10,
                        backgroundColor: "#8854D0",
                        height: 40
                    }}
                    disableRipple
                    disableElevation
                    onClick={() => handleRefreshData()}
                  >
                      Refresh Data
                  </Button>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Box className={classes.inline}>
                      <Typography 
                          style={{
                              color: "#000", 
                              fontSize: 18,
                              margin: 10
                          }}
                      >
                          Cari
                      </Typography>
                      <TextField label="Search" variant="outlined" size="small" style={{marginTop: 4, marginLeft: 25, width: 283, marginRight: 10}} value={searchValue} onChange={handleChange}/>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5} container justifyContent="flex-end">
                    <Button 
                        variant="outlined"
                        style={{
                            borderRadius: 4,
                            textTransform: "none",
                            margin: 10
                        }}
                        disableRipple
                        onClick={() => {handleResetFilter();}}
                    >
                        Reset Filter
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <GridComponent
                        dataSource={transferRequestData && transferRequestData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={height - (isMobile ? 480 : 430)}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                        recordDoubleClick={RowSelected}
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="TransferRequestID"
                              headerText="Req. ID"
                              width="120"
                          />
                          <ColumnDirective
                              field="MutationID"
                              headerText="ID Mutasi"
                              width="150"
                          />
                          <ColumnDirective
                              field="StatusDescription"
                              headerText="Status"
                              width="150"
                              template={StatusDescriptionTemplate}
                          />
                          <ColumnDirective
                              field="TransactionID"
                              headerText="Trx. ID"
                              width="120"
                          />
                          <ColumnDirective
                              field="OrderDate"
                              headerText="Tgl. Order"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="RequestDate"
                              headerText="Tgl. Req"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="InvoiceDate"
                              headerText="Tgl. Invoice"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="DueDate"
                              headerText="Tgl. Jatuh Tempo"
                              width="200"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Requestor"
                              headerText="Requestor"
                              width="150"
                          />
                          <ColumnDirective
                              field="RequestValue"
                              headerText="Nominal"
                              width="150"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="DestinationAccountName"
                              headerText="Nama Penerima"
                              width="200"
                          />
                          <ColumnDirective
                              field="DestinationBank"
                              headerText="Bank"
                              width="120"
                          />
                          <ColumnDirective
                              field="DestinationAccountNumber"
                              headerText="No. Penerima"
                              width="200"
                          />
                          <ColumnDirective
                              field="PaymentCategoryTitle1"
                              headerText="Kategori 1"
                              width="200"
                          />
                          <ColumnDirective
                              field="PaymentCategoryTitle2"
                              headerText="Kategori 2"
                              width="200"
                          />
                          <ColumnDirective
                              field="PaymentCategoryTitle3"
                              headerText="Kategori 3"
                              width="200"
                          />
                          <ColumnDirective
                              field="PaymentCategoryCount"
                              headerText="Jumlah Kas"
                              width="160"
                              format="N0"
                              textAlign="Right"
                              template={PaymentCategoryCountTemplate}
                          />
                          <ColumnDirective
                              field="RequestReason"
                              headerText="Alasan"
                              width="250"
                          />
                          <ColumnDirective
                              field="ApprovalDate"
                              headerText="Tgl. Approve"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Approver"
                              headerText="Approver"
                              width="150"
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

export default TransferRequest;