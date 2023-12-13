import Head from "next/head";
import FullScreenLayout from "../../src/components/FullScreenLayout";
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
  Dialog,
  DialogContent,
} from "@mui/material";
import { makeStyles, withStyles, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment-timezone';
import 'moment/locale/id';


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
import { getValue } from '@syncfusion/ej2-base';

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
  inlineSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  inlineReverse: {
    display: "flex",
    flexDirection: "row-reverse"
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

const CustomizeCell = (args) => {
  if (args.column.field === "StatusDescription" && args.data && args.cell) {
    if (getValue('StatusDescription', args.data) == 'PENDING') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
    else if (getValue('StatusDescription', args.data) == 'REJECTED') {
      args.cell.style.backgroundColor = '#FF0000'
    }
    else if (getValue('StatusDescription', args.data) == 'APPROVED') {
      args.cell.style.backgroundColor = '#228B22'
    }
    else if (getValue('StatusDescription', args.data) == 'CANCELLED') {
      args.cell.style.backgroundColor = '#FFA500'
    }
  }

  if (args.column.field === "ReturnDescription" && args.data && args.cell) {
    if (getValue('ReturnDescription', args.data) == 'RETUR') {
      args.cell.style.backgroundColor = '#DC143C'
    }
  }
};

const DeliveryOrder = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [fetchActive, setFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [deliveryOrderData, setDeliveryOrderData] = React.useState();
  const [deliveryOrderItemsData, setDeliveryOrderItemsData] = React.useState();
  const [dateType, setDateType] = React.useState('CreateDate');
  const [dateTypeList, setDateTypeList] = React.useState(['CreateDate', 'DeliveryDate']);

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();
  const [gridItemInstance, setGridItemInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');
  const [recordClickIndex, setRecordClickIndex] = React.useState(-1);

  moment.locale('id');

  const [deliveryOrderStartDate, setDeliveryOrderStartDate] = React.useState(moment());
  const [deliveryOrderEndDate, setDeliveryOrderEndDate] = React.useState(moment());

  const handleDeliveryOrderStartDateChange = (date) => {
    setDeliveryOrderStartDate(date);
  };

  const handleDeliveryOrderEndDateChange = (date) => {
    setDeliveryOrderEndDate(date);
  };

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const RowSelected = (props) => {
    let object = new Object();
    object.Data = props.rowData.DeliveryOrderItems;
			
    let currentCount = 0;
    if (props.rowIndex != recordClickIndex) {
      setRecordClickIndex(props.rowIndex);
      currentCount = 1;
    }
    else {
      currentCount = 2;
    }

    if (currentCount == 2) {
      window.open(`/delivery-order/${props.rowData.DeliveryOrderID}`, '_blank')
      //Router.push(`/delivery-order/${props.rowData.DeliveryOrderID}`);
    }
    else {
      setDeliveryOrderItemsData(object);
    }
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
    const fetchDeliveryOrderData = async (startDate, endDate, dateFilter) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/deliveryorder/getdeliveryorderbydate?startDate=${startDate}&endDate=${endDate}&dateFilter=${dateFilter}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.VendorName = dataItem.VendorName;
				object.StatusDescription = dataItem.StatusDescription;
				object.ReturnDescription = dataItem.ReturnDescription;
				object.StatusUpdater = dataItem.StatusUpdater;
				object.DeliveryOrderID = dataItem.DeliveryOrderID;
				object.DeliveryOrderNumber = dataItem.DeliveryOrderNumber;
				object.PurchaseOrderNumber = dataItem.PurchaseOrderNumber;
				object.Notes = dataItem.Notes != null && dataItem.Notes.length > 25 ? dataItem.Notes.substring(0, 25) + "..." : dataItem.Notes;
				object.CreatedBy = dataItem.CreatedBy;
				object.OperationUserName = dataItem.OperationUserName;
				object.CreateDate = dataItem.CreateDate;
				object.DeliveryDate = dataItem.DeliveryDate;
				object.VendorDeliveryOrderNumber = dataItem.VendorDeliveryOrderNumber;

        let items = new Array();
        dataItem.DeliveryOrderItems.forEach(function (dataItem2) {
          let itemObject = new Object();

          itemObject.ProductName = dataItem2.ProductName;
          itemObject.Quantity = dataItem2.Quantity;
          itemObject.UnitPrice = Intl.NumberFormat('id').format(dataItem2.UnitPrice);
          itemObject.TotalPrice = Intl.NumberFormat('id').format(dataItem2.TotalPrice);

          items.push(itemObject);
        });

        object.DeliveryOrderItems = items;

        newData.push(object);
      });

      processedData.Data = newData;
      //console.log(processedData);
      
      setDeliveryOrderData(processedData);
      setDeliveryOrderItemsData();
      setDataLoading(false);
    };

    if (fetchActive == true) {
    
      let startDate;
      startDate = moment(deliveryOrderStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(deliveryOrderEndDate).format("YYYY-MM-DD");

      let dateFilter = dateType;

      fetchDeliveryOrderData(startDate, endDate, dateFilter);
      setFetchActive(false);
    }
  }, [fetchActive]);

  return (
    <div className={classes.root} ref={componentRef}>
      <FullScreenLayout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <Grid container>
                <Grid item xs={12} sm={5}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 26,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    List Delivery Order
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Box className={classes.inlineReverse} style={{marginLeft: 0}}>
                      <TextField label="Search" variant="outlined" size="small" style={{marginTop: 4, marginLeft: 25, width: 283, marginRight: 10}} value={searchValue} onChange={handleChange}/>
                      <Typography 
                          style={{
                              color: "#000", 
                              fontSize: 18,
                              margin: 10
                          }}
                      >
                          Cari
                      </Typography>
                  </Box>
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
                          Jenis<br/>Tanggal
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
                    <FormControl variant="outlined" style={{marginTop: isMobile ? 16 : 6, marginRight: 10, display: "flex", flexDirection: "row"}}>
                      <InputLabel>Date Type</InputLabel>
                        <Select
                          value={dateType}
                          onChange={handleDateTypeChange}
                          style={{width: 200, height: 45}}
                          label="Date Type"
                          classes={{ root: classes.selectRoot }}
                        >
                          {dateTypeList && dateTypeList.map((item, index) => (
                            <MenuItem disableRipple value={item} key={index}>{item}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                    { !isMobile && 
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={deliveryOrderStartDate}
                          style={{marginRight: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handleDeliveryOrderStartDateChange}
                        />
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="End Date"
                          value={deliveryOrderEndDate}
                          style={{minWidth: 150, maxWidth: 150}}
                          onChange={handleDeliveryOrderEndDateChange}
                        />
                      </MuiPickersUtilsProvider>
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
                          marginTop: 9,
                          marginBottom: 16,
                          marginRight: 25,
                          marginLeft: 9
                        }}
                      >
                        Tanggal<br/>Awal
                      </Typography>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="Start Date"
                          value={deliveryOrderStartDate}
                          style={{marginTop: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handleDeliveryOrderStartDateChange}
                        />
                      </MuiPickersUtilsProvider>
                    </Box>
                  </Grid>
                }
                { isMobile && 
                  <Grid item xs={12} md={8}>
                    <Box className={classes.inline}>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
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
                          value={deliveryOrderEndDate}
                          style={{marginTop: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handleDeliveryOrderEndDateChange}
                        />
                      </MuiPickersUtilsProvider>
                    </Box>
                  </Grid>
                }
                <Grid item sm={12} md={4} container justifyContent="flex-end">
                  <Button 
                      variant="outlined"
                      style={{
                          borderRadius: 4,
                          textTransform: "none",
                          margin: 10,
                          height: 40
                      }}
                      disableRipple
                      disableElevation
                      onClick={() => handleResetFilter()}
                  >
                      Reset Filter
                  </Button>
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
                <Grid item xs={12}>
                    <GridComponent
                        dataSource={deliveryOrderData && deliveryOrderData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={(height - (isMobile ? 480 : 430)) / 1.5}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                        recordClick={RowSelected}
                        queryCellInfo={CustomizeCell}
                        gridLines='Both'
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="DeliveryOrderNumber"
                              headerText="Nomor DO"
                              width="160"
                          />
                          <ColumnDirective
                              field="VendorName"
                              headerText="Vendor"
                              width="200"
                          />
                          <ColumnDirective
                              field="StatusDescription"
                              headerText="Status"
                              width="120"
                          />
                          <ColumnDirective
                              field="ReturnDescription"
                              headerText="Retur"
                              width="120"
                          />
                          <ColumnDirective
                              field="StatusUpdater"
                              headerText="A/R/C Oleh"
                              width="120"
                          />
                          <ColumnDirective
                              field="DeliveryOrderID"
                              headerText="ID"
                              width="100"
                          />
                          <ColumnDirective
                              field="DeliveryOrderNumber"
                              headerText="Nomor PO"
                              width="160"
                          />
                          <ColumnDirective
                              field="Notes"
                              headerText="Notes"
                              width="250"
                          />
                          <ColumnDirective
                              field="CreatedBy"
                              headerText="Dibuat Oleh"
                              width="120"
                          />
                          <ColumnDirective
                              field="OperationUserName"
                              headerText="Operator Gudang"
                              width="140"
                          />
                          <ColumnDirective
                              field="CreateDate"
                              headerText="Tgl. Buat"
                              width="120"
                              type="date"
                              format="dd MMM yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="DeliveryDate"
                              headerText="Tgl. Kirim"
                              width="120"
                              type="date"
                              format="dd MMM yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="VendorDeliveryOrderNumber"
                              headerText="Nomor DO Vendor"
                              width="200"
                          />
                        </ColumnsDirective>
                        <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                    </GridComponent>
                </Grid>
                <Grid item xs={12}>
                    <GridComponent
                        dataSource={deliveryOrderItemsData && deliveryOrderItemsData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridItemInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={(height - (isMobile ? 480 : 430)) / 1.5}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{marginLeft: 10, marginRight: 10, marginBottom: 10}}
                        allowTextWrap={true}
                        gridLines='Both'
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="ProductName"
                              headerText="Produk"
                              width="325"
                          />
                          <ColumnDirective
                              field="Quantity"
                              headerText="Qty"
                              width="110"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="UnitPrice"
                              headerText="Harga Satuan"
                              width="120"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="TotalPrice"
                              headerText="Total"
                              width="120"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                        </ColumnsDirective>
                        <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                    </GridComponent>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </FullScreenLayout>

      <Dialog 
        open={dataLoading}
      >
        <DialogContent>
          <Box className={classes.inline} style={{marginTop: 4, marginLeft: 5, marginBottom: 15}}>
            <CircularProgress size={35} />
            <Typography 
                style={{
                    color: "#000", 
                    fontSize: 25,
                    marginLeft: 18
                }}
            >
                Loading
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

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

export default DeliveryOrder;