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
    if (getValue('StatusDescription', args.data) == 'SETTLED') {
      args.cell.style.backgroundColor = '#32CD32'
    }
    else if (getValue('StatusDescription', args.data) == 'CANCELLED') {
      args.cell.style.backgroundColor = '#DC143C'
    }
    else if (getValue('StatusDescription', args.data) == 'ONGOING') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
  }

  if (args.column.field === "PaymentMenuDescription" && args.data && args.cell) {
    if (getValue('PaymentMenuDescription', args.data) == 'BARU') {
      args.cell.style.backgroundColor = '#0080FF'
    }
    else if (getValue('PaymentMenuDescription', args.data) == 'LAMA') {
      args.cell.style.backgroundColor = '#FF8C00'
    }
  }

  if (args.column.field === "DeliveryStatusDescription" && args.data && args.cell) {
    if (getValue('DeliveryStatusDescription', args.data) == 'DONE') {
      args.cell.style.backgroundColor = '#32DC32'
    }
    else if (getValue('DeliveryStatusDescription', args.data) == 'NOT DONE') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
  }

  if (args.column.field === "PayStatusDescription" && args.data && args.cell) {
    if (getValue('PayStatusDescription', args.data) == 'DONE') {
      args.cell.style.backgroundColor = '#32DC32'
    }
    else if (getValue('PayStatusDescription', args.data) == 'NOT DONE') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
  }

  if (args.column.field === "ApprovalStatusDescription" && args.data && args.cell) {
    if (getValue('ApprovalStatusDescription', args.data) == 'APPROVED') {
      args.cell.style.backgroundColor = '#32CD32'
    }
    else if (getValue('ApprovalStatusDescription', args.data) == 'REJECTED') {
      args.cell.style.backgroundColor = '#DC143C'
    }
    else if (getValue('ApprovalStatusDescription', args.data) == 'PENDING') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
  }
};

const PurchaseOrder = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchActive, setFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [purchaseOrderData, setPurchaseOrderData] = React.useState();
  const [purchaseOrderItemsData, setPurchaseOrderItemsData] = React.useState();
  const [dateType, setDateType] = React.useState('CreateDate');
  const [dateTypeList, setDateTypeList] = React.useState(['CreateDate', 'ApprovalDate', 'SettleDate']);

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();
  const [gridItemInstance, setGridItemInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');
  const [recordClickIndex, setRecordClickIndex] = React.useState(-1);

  moment.locale('id');

  const [purchaseOrderStartDate, setPurchaseOrderStartDate] = React.useState(moment());
  const [purchaseOrderEndDate, setPurchaseOrderEndDate] = React.useState(moment());

  const handlePurchaseOrderStartDateChange = (date) => {
    setPurchaseOrderStartDate(date);
  };

  const handlePurchaseOrderEndDateChange = (date) => {
    setPurchaseOrderEndDate(date);
  };

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const RowSelected = (props) => {
    let object = new Object();
    object.Data = props.rowData.PurchaseOrderItems;
			
    let currentCount = 0;
    if (props.rowIndex != recordClickIndex) {
      setRecordClickIndex(props.rowIndex);
      currentCount = 1;
    }
    else {
      currentCount = 2;
    }

    if (currentCount == 2) {
      window.open(`/purchase-order/${props.rowData.PurchaseOrderID}`, '_blank')
      //Router.push(`/purchase-order/${props.rowData.PurchaseOrderID}`);
    }
    else {
      setPurchaseOrderItemsData(object);
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
    const fetchPurchaseOrderData = async (startDate, endDate, dateFilter) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/purchaseorder/getpurchaseorderbydate?startDate=${startDate}&endDate=${endDate}&dateFilter=${dateFilter}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.StatusDescription = dataItem.StatusDescription;
				object.PayStatusDescription = dataItem.PayStatusDescription;
				object.DeliveryStatusDescription = dataItem.DeliveryStatusDescription;
				object.ApprovalStatusDescription = dataItem.ApprovalStatusDescription;
				object.PurchaseOrderID = dataItem.PurchaseOrderID;
				object.PurchaseOrderNumber = dataItem.PurchaseOrderNumber;
				object.Name = dataItem.Name;
				object.DealType = dataItem.DealType;
				object.PaymentMenuDescription = dataItem.PaymentMenuDescription;
				object.ContractType = dataItem.ContractType;
        object.Notes = dataItem.Notes != null && dataItem.Notes.length > 25 ? dataItem.Notes.substring(0, 25) + "..." : dataItem.Notes;
				object.CreatedBy = dataItem.CreatedBy;
				object.CreateDate = dataItem.CreateDate;
				object.SettleDate = dataItem.SettleDate;
				object.DueDate = dataItem.DueDate;
				object.EstimationDate = dataItem.EstimationDate;

        let items = new Array();
        dataItem.PurchaseOrderItems.forEach(function (dataItem2) {
          let itemObject = new Object();

          itemObject.ProductName = dataItem2.ProductName;
          itemObject.Quantity = dataItem2.Quantity;
          itemObject.Received = dataItem2.Received;
          itemObject.Remained = dataItem2.Remained;
          itemObject.UnitPrice = Intl.NumberFormat('id').format(dataItem2.UnitPrice);
          itemObject.DPPPrice = Intl.NumberFormat('id').format(dataItem2.DPPPrice);
          itemObject.PPNPrice = Intl.NumberFormat('id').format(dataItem2.PPNPrice);
          itemObject.TotalPrice = Intl.NumberFormat('id').format(dataItem2.TotalPrice);
          itemObject.TotalReceivedPrice = Intl.NumberFormat('id').format(dataItem2.TotalReceivedPrice);
          itemObject.TotalRemainedPrice = Intl.NumberFormat('id').format(dataItem2.TotalRemainedPrice);

          items.push(itemObject);
        });

        object.PurchaseOrderItems = items;

        newData.push(object);
      });

      processedData.Data = newData;
      //console.log(processedData);
      
      setPurchaseOrderData(processedData);
      setPurchaseOrderItemsData();
      setDataLoading(false);
    };

    if (fetchActive == true) {
    
      let startDate;
      startDate = moment(purchaseOrderStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(purchaseOrderEndDate).format("YYYY-MM-DD");

      let dateFilter = dateType;

      fetchPurchaseOrderData(startDate, endDate, dateFilter);
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
                    List Purchase Order
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
                          value={purchaseOrderStartDate}
                          style={{marginRight: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handlePurchaseOrderStartDateChange}
                        />
                        <KeyboardDatePicker
                          variant="inline"
                          format="YYYY-MM-DD"
                          label="End Date"
                          value={purchaseOrderEndDate}
                          style={{minWidth: 150, maxWidth: 150}}
                          onChange={handlePurchaseOrderEndDateChange}
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
                          value={purchaseOrderStartDate}
                          style={{marginTop: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handlePurchaseOrderStartDateChange}
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
                          value={purchaseOrderEndDate}
                          style={{marginTop: 10, minWidth: 150, maxWidth: 150}}
                          onChange={handlePurchaseOrderEndDateChange}
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
                        dataSource={purchaseOrderData && purchaseOrderData.Data}
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
                              field="StatusDescription"
                              headerText="Status"
                              width="120"
                          />
                          <ColumnDirective
                              field="PayStatusDescription"
                              headerText="Status Bayar"
                              width="120"
                          />
                          <ColumnDirective
                              field="DeliveryStatusDescription"
                              headerText="Status Kirim"
                              width="120"
                          />
                          <ColumnDirective
                              field="ApprovalStatusDescription"
                              headerText="Status Approval"
                              width="135"
                          />
                          <ColumnDirective
                              field="PurchaseOrderID"
                              headerText="ID PO"
                              width="100"
                          />
                          <ColumnDirective
                              field="PurchaseOrderNumber"
                              headerText="Nomor PO"
                              width="150"
                          />
                          <ColumnDirective
                              field="Name"
                              headerText="Vendor"
                              width="200"
                          />
                          <ColumnDirective
                              field="DealType"
                              headerText="Jenis Deal"
                              width="160"
                          />
                          <ColumnDirective
                              field="PaymentMenuDescription"
                              headerText="Menu Bayar"
                              width="120"
                          />
                          <ColumnDirective
                              field="ContractType"
                              headerText="Jenis Kontrak"
                              width="130"
                          />
                          <ColumnDirective
                              field="Notes"
                              headerText="Catatan"
                              width="250"
                          />
                          <ColumnDirective
                              field="CreatedBy"
                              headerText="Dibuat Oleh"
                              width="120"
                          />
                          <ColumnDirective
                              field="CreateDate"
                              headerText="Tgl. Buat PO"
                              width="130"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="SettleDate"
                              headerText="Tgl. Settle"
                              width="120"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="DueDate"
                              headerText="Tgl. Jatuh Tempo"
                              width="140"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="EstimationDate"
                              headerText="Tgl. Estimasi"
                              width="130"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                        </ColumnsDirective>
                        <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                    </GridComponent>
                </Grid>
                <Grid item xs={12}>
                    <GridComponent
                        dataSource={purchaseOrderItemsData && purchaseOrderItemsData.Data}
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
                              field="Received"
                              headerText="Qty. Received"
                              width="135"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Remained"
                              headerText="Qty. Remained"
                              width="140"
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
                              field="DPPPrice"
                              headerText="DPP"
                              width="110"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="PPNPrice"
                              headerText="PPN"
                              width="110"
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
                          <ColumnDirective
                              field="TotalReceivedPrice"
                              headerText="Tot. Received"
                              width="135"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="TotalRemainedPrice"
                              headerText="Tot. Remained"
                              width="140"
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

export default PurchaseOrder;