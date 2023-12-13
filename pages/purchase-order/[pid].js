import Head from "next/head";
import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogContent,
  Button
} from "@mui/material";
import { makeStyles, withStyles, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";

import React, { useState, useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';
import { useRouter } from 'next/router';
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
    VirtualScroll
  } from '@syncfusion/ej2-react-grids';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 5,
    margin: 5
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

const PurchaseOrderDetail = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  moment.locale('id');

  const [fetchActive, setFetchActive] = React.useState(false);
  const [approveActive, setApproveActive] = React.useState(false);
  const [rejectActive, setRejectActive] = React.useState(false);

  const [name, setName] = React.useState();
  const [dealType, setDealType] = React.useState();
  const [contractType, setContractType] = React.useState();
  const [purchaseOrderNumber, setPurchaseOrderNumber] = React.useState();
  const [notes, setNotes] = React.useState();

  const [dueDate, setDueDate] = React.useState();
  const [estimationDate, setEstimationDate] = React.useState();
  const [statusDescription, setStatusDescription] = React.useState();
  const [shippingCost, setShippingCost] = React.useState();
  const [createDate, setCreateDate] = React.useState();
  const [assuranceValue, setAssuranceValue] = React.useState();
  const [createdBy, setCreatedBy] = React.useState();
  const [adminValue, setAdminValue] = React.useState();

  const [approvalStatusDescription, setApprovalStatusDescription] = React.useState();
  const [approverUsername, setApproverUsername] = React.useState();
  const [approvalDate, setApprovalDate] = React.useState();
  const [deliveryStatusDescription, setDeliveryStatusDescription] = React.useState();
  const [payStatusDescription, setPayStatusDescription] = React.useState();
  
  const [cancellationStatusDescription, setCancellationStatusDescription] = React.useState();
  const [cancellationRequestorName, setCancellationRequestorName] = React.useState();
  const [cancellationRequestDate, setCancellationRequestDate] = React.useState();
  const [approverRequestorName, setApproverRequestorName] = React.useState();
  const [cancellationApproveDate, setCancellationApproveDate] = React.useState();
  const [cancellationReason, setCancellationReason] = React.useState();

  const [ppnPercentage, setPPNPercentage] = React.useState();
  const [freezeNotes, setFreezeNotes] = React.useState();

  const [deliveryOrdersData, setDeliveryOrdersData] = React.useState();
  const [purchaseOrderPaymentsData, setPurchaseOrderPaymentsData] = React.useState();
  const [purchaseOrderItemsData, setPurchaseOrderItemsData] = React.useState();

  const [purchaseOrderValue, setPurchaseOrderValue] = React.useState(0);
  const [valueReceived, setValueReceived] = React.useState(0);
  const [valueNotYetReceived, setValueNotYetReceived] = React.useState(0);
  const [paymentValue, setPaymentValue] = React.useState(0);
  const [valuePaid, setValuePaid] = React.useState(0);
  const [valuePending, setValuePending] = React.useState(0);
  const [valueCredit, setValueCredit] = React.useState(0);

  const [totalQuantity, setTotalQuantity] = React.useState(0);
  const [totalReceivedQuantity, setTotalReceivedQuantity] = React.useState(0);
  const [totalRemainingQuantity, setTotalRemainingQuantity] = React.useState(0);
  const [totalQuantityInValue, setTotalQuantityInValue] = React.useState(0);
  const [totalReceivedInValue, setTotalReceivedInValue] = React.useState(0);
  const [totalRemainingInValue, setTotalRemainingInValue] = React.useState(0);

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const StatusDescriptionColor = (status) => {
    if (status == 'ONGOING') {
        return '#F6AF43'
    }
    else if (status == 'CANCELLED') {
        return '#F14343'
    }
    else if (status == 'SETTLED') {
        return '#3C8F4A'
    }
    else {
        return '#00000'
    }
  };

  const ApprovalStatusDescriptionColor = (status) => {
    if (status == 'PENDING') {
        return '#F6AF43'
    }
    else if (status == 'REJECTED') {
        return '#F14343'
    }
    else if (status == 'APPROVED') {
        return '#3C8F4A'
    }
    else if (status == 'CANCELLED') {
        return '#FC6F03'
    }
    else {
        return '#00000'
    }
  };

  const DOStatusDescriptionTemplate = (props) => {
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
  };

  const PaymentStatusDescriptionTemplate = (props) => {
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
  };

  useEffect(() => {
    const fetchPurchaseOrderDetailData = async (purchaseOrderID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/purchaseorder/getpurchaseorderdetail?purchaseOrderID=${purchaseOrderID}`);

        let processedData;
        processedData = result.data;

      
        //console.log(processedData);

        setName(processedData.Data.PurchaseOrderDetail.Name);
        setDealType(processedData.Data.PurchaseOrderDetail.DealType);
        setContractType(processedData.Data.PurchaseOrderDetail.ContractType);
        setPurchaseOrderNumber(processedData.Data.PurchaseOrderDetail.PurchaseOrderNumber);
        setNotes(processedData.Data.PurchaseOrderDetail.Notes);

        if (processedData.Data.PurchaseOrderDetail.DueDate != null)
            setDueDate(moment(processedData.Data.PurchaseOrderDetail.DueDate).format("DD/MM/YYYY"));
        if (processedData.Data.PurchaseOrderDetail.EstimationDate != null)
            setEstimationDate(moment(processedData.Data.PurchaseOrderDetail.EstimationDate).format("DD/MM/YYYY"));
        setStatusDescription(processedData.Data.PurchaseOrderDetail.StatusDescription);
        //setStatusDescription("CANCELLED");
        setShippingCost("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PurchaseOrderDetail.ShippingCost));
        if (processedData.Data.PurchaseOrderDetail.CreateDate != null)
            setCreateDate(moment(processedData.Data.PurchaseOrderDetail.CreateDate).format("DD/MM/YYYY"));
        setAssuranceValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PurchaseOrderDetail.AssuranceValue));    
        setCreatedBy(processedData.Data.PurchaseOrderDetail.CreatedBy);
        setAdminValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PurchaseOrderDetail.AdminValue));    

        setApprovalStatusDescription(processedData.Data.PurchaseOrderDetail.ApprovalStatusDescription);
        setApproverUsername(processedData.Data.PurchaseOrderDetail.ApproverUsername);
        if (processedData.Data.PurchaseOrderDetail.ApprovalDate != null)
            setApprovalDate(moment(processedData.Data.PurchaseOrderDetail.ApprovalDate).format("DD/MM/YYYY HH:mm:ss"));
        setDeliveryStatusDescription(processedData.Data.PurchaseOrderDetail.DeliveryStatusDescription);
        setPayStatusDescription(processedData.Data.PurchaseOrderDetail.PayStatusDescription);

        setCancellationStatusDescription(processedData.Data.PurchaseOrderDetail.CancellationStatusDescription);
        setCancellationRequestorName(processedData.Data.PurchaseOrderDetail.CancellationRequestorName);
        if (processedData.Data.PurchaseOrderDetail.CancellationRequestDate != null)
            setCancellationRequestDate(moment(processedData.Data.PurchaseOrderDetail.CancellationRequestDate).format("DD/MM/YYYY HH:mm:ss"));
        setApproverRequestorName(processedData.Data.PurchaseOrderDetail.ApproverRequestorName);
        if (processedData.Data.PurchaseOrderDetail.CancellationApproveDate != null)
            setCancellationApproveDate(moment(processedData.Data.PurchaseOrderDetail.CancellationApproveDate).format("DD/MM/YYYY HH:mm:ss"));
        setCancellationReason(processedData.Data.PurchaseOrderDetail.CancellationReason);

        setPPNPercentage(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PurchaseOrderDetail.PPNPercentage) + "%");
        setFreezeNotes(processedData.Data.PurchaseOrderDetail.FreezeNotes);
        //setFreezeNotes("TEST");

        let newData = new Array();

        let tempPurchaseOrderValue = 0;
        let tempValueReceived = 0;
        let tempValueNotYetReceived = 0;
        let tempPaymentValue = 0;
        let tempValuePaid = 0;
        let tempValuePending = 0;
        let tempValueCredit = 0;

        let tempTotalQuantity = 0;
        let tempTotalReceivedQuantity = 0;
        let tempTotalRemainingQuantity = 0;
        let tempTotalQuantityInValue = 0;
        let tempTotalReceivedInValue = 0;
        let tempTotalRemainingInValue = 0;

        processedData.Data.DeliveryOrders.forEach(function (dataItem) {
            let object = new Object();

            object.DeliveryOrderID = dataItem.DeliveryOrderID;
            object.CreateDate = dataItem.CreateDate;
            object.DeliveryDate = dataItem.DeliveryDate;
            object.CreatedBy = dataItem.CreatedBy;
            object.DeliveryOrderNumber = dataItem.DeliveryOrderNumber;
            object.StatusDescription = dataItem.StatusDescription;

            newData.push(object);
        });
        setDeliveryOrdersData(newData);

        newData = new Array();

        processedData.Data.PurchaseOrderPayments.forEach(function (dataItem) {
            let object = new Object();

            object.PurchaseOrderPaymentID = dataItem.PurchaseOrderPaymentID;
            object.InvoiceValue = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.InvoiceValue);
            object.FinalValue = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.FinalValue);
            object.Method = dataItem.Method;
            object.StatusDescription = dataItem.StatusDescription;

            if (dataItem.Status == 4) {
                tempValuePaid += parseFloat(dataItem.FinalValue);
            }
            else if (dataItem.Status == 1 || dataItem.Status == 0) {
                tempValuePending += parseFloat(dataItem.FinalValue);
            }

            tempPaymentValue += parseFloat(dataItem.FinalValue);

            newData.push(object);
        });
        setPurchaseOrderPaymentsData(newData);

        newData = new Array();

        processedData.Data.PurchaseOrderItems.forEach(function (dataItem) {
            let object = new Object();

            object.ProductID = dataItem.ProductID;
            object.ProductName = dataItem.ProductName;
            object.Quantity = dataItem.Quantity;
            object.UnitPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.UnitPrice);
            object.DPPPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.DPPPrice);
            object.PPNPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.PPNPrice);
            object.TotalPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.TotalPrice);
            object.TotalReceivedPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.TotalReceivedPrice);
            object.TotalRemainedPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.TotalRemainedPrice);
            object.Received = dataItem.Received;
            object.Remained = dataItem.Remained;

            tempPurchaseOrderValue += parseFloat(dataItem.TotalPrice);
            tempValueReceived += parseFloat(dataItem.TotalReceivedPrice);

            tempTotalQuantity += parseInt(dataItem.Quantity);
            tempTotalReceivedQuantity += parseInt(dataItem.Received);
            tempTotalRemainingQuantity += parseInt(dataItem.Remained);
            tempTotalQuantityInValue += parseFloat(dataItem.TotalPrice);
            tempTotalReceivedInValue += parseFloat(dataItem.TotalReceivedPrice);
            tempTotalRemainingInValue += parseFloat(dataItem.TotalRemainedPrice);

            newData.push(object);
        });
        setPurchaseOrderItemsData(newData);

        tempValueNotYetReceived = tempPurchaseOrderValue - tempValueReceived;
        tempValueCredit = tempPurchaseOrderValue - tempPaymentValue;

        setPurchaseOrderValue(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempPurchaseOrderValue));
        setValueReceived(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempValueReceived));
        setValueNotYetReceived(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempValueNotYetReceived));
        setPaymentValue(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempPaymentValue));
        setValuePaid(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempValuePaid));
        setValuePending(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempValuePending));
        setValueCredit(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempValueCredit));

        setTotalQuantity(Intl.NumberFormat('id').format(tempTotalQuantity));
        setTotalReceivedQuantity(Intl.NumberFormat('id').format(tempTotalReceivedQuantity));
        setTotalRemainingQuantity(Intl.NumberFormat('id').format(tempTotalRemainingQuantity));
        setTotalQuantityInValue(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempTotalQuantityInValue));
        setTotalReceivedInValue(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempTotalReceivedInValue));
        setTotalRemainingInValue(Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tempTotalRemainingInValue));

        setDataLoading(false);
    };

    if (pid != undefined || fetchActive == true) {
        fetchPurchaseOrderDetailData(pid);
        setFetchActive(false);
    }
  }, [pid, fetchActive]);

  useEffect(() => {
    const processApprovePurchaseOrder = async (purchaseOrderID, approvalStatus, userID) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/purchaseorder/updatepurchaseorder',
            data: {
                purchaseOrderID: purchaseOrderID,
                approvalStatus: approvalStatus,
                userID: userID
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("PO berhasil diapprove");
            setFetchActive(true);
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (approveActive == true) {
        if (window.confirm("Approve PO?") == false) {
            setApproveActive(false);
            return;
        } 

        let userID = Cookies.get("userid");

        processApprovePurchaseOrder(pid, 1, userID);
        setApproveActive(false);
    }
  }, [approveActive]);

  useEffect(() => {
    const processRejectPurchaseOrder = async (purchaseOrderID, approvalStatus, userID) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/purchaseorder/updatepurchaseorder',
            data: {
                purchaseOrderID: purchaseOrderID,
                approvalStatus: approvalStatus,
                userID: userID
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("Approval PO berhasil ditolak");
            setFetchActive(true);
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (rejectActive == true) {
        if (window.confirm("Tolak approval PO?") == false) {
            setRejectActive(false);
            return;
        } 

        let userID = Cookies.get("userid");

        processRejectPurchaseOrder(pid, 2, userID);
        setRejectActive(false);
    }
  }, [rejectActive]);

  return (
    <div className={classes.root} ref={componentRef}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid container sm={12} md={5} lg={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 300}}>
                        <Grid item xs={12} style={{marginTop: 5}}>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
                                    }}
                                >
                                    Vendor:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={name} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
                                    }}
                                >
                                    Jenis Deal:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={dealType} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
                                    }}
                                >
                                    Jenis Kontrak:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={contractType} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
                                    }}
                                >
                                    Nomor PO:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={purchaseOrderNumber} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 35,
                                        width: 250
                                    }}
                                >
                                    Catatan:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    multiline
                                    minRows={4}
                                    maxRows={4}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={notes} 
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 300}}>
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Tgl. Jatuh Tempo:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={dueDate} 
                            />
                        </Grid>  
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Tgl. Estimasi:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={estimationDate} 
                            />
                        </Grid> 
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Status PO:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    style: {color: StatusDescriptionColor(statusDescription)}
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={statusDescription} 
                            />
                        </Grid>  
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Biaya Pengiriman:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={shippingCost} 
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Tgl. Buat PO:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={createDate} 
                            />
                        </Grid>  
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Asuransi:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={assuranceValue} 
                            />
                        </Grid>     
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Dibuat Oleh:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={createdBy} 
                            />
                        </Grid>  
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Biaya Admin:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={adminValue} 
                            />
                        </Grid>                      
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} style={{marginBottom: statusDescription == "CANCELLED" ? 0 : isTablet ? 0 : isLaptop ? (freezeNotes == null ? 480 : 680) : 120}}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 300}}>
                        { approvalStatusDescription == "PENDING" ?
                            <>
                                <Grid item xs={6}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginLeft: 8
                                        }}
                                    >
                                        Status Approval PO:
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        InputProps={{
                                            readOnly: true,
                                            style: {color: ApprovalStatusDescriptionColor(approvalStatusDescription)}
                                        }}
                                        style={{
                                            width: "95%",
                                            marginTop: 0,
                                            marginBottom: 4,
                                            marginLeft: 5,
                                            padding: 0
                                        }}
                                        value={approvalStatusDescription} 
                                    />
                                </Grid>  
                                <Grid item xs={6} style={{marginTop: 26}}>
                                    <Box className={classes.inlineReverse} style={{marginLeft: 5, marginRight: 5}}>
                                        <Button 
                                            variant="contained"
                                            style={{
                                                borderRadius: 4,
                                                textTransform: "none",
                                                backgroundColor: "#F14343",
                                                height: 40
                                            }}
                                            disableRipple
                                            disableElevation
                                            onClick={() => setRejectActive(true)}
                                        >
                                            Reject
                                        </Button>
                                        <Button 
                                            variant="contained"
                                            style={{
                                                borderRadius: 4,
                                                textTransform: "none",
                                                marginRight: 5,
                                                backgroundColor: "#3C8F4A",
                                                height: 40
                                            }}
                                            disableRipple
                                            disableElevation
                                            onClick={() => setApproveActive(true)}
                                        >
                                            Approve
                                        </Button>
                                    </Box>
                                </Grid>
                            </> :
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Status Approval PO:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                        style: {color: ApprovalStatusDescriptionColor(approvalStatusDescription)}
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 4,
                                        padding: 0
                                    }}
                                    value={approvalStatusDescription} 
                                />
                            </Grid> 
                        }
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Approver/Rejector:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={approverUsername} 
                            />
                        </Grid>  
                        <Grid item xs={6}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 8
                                }}
                            >
                                Tgl. Approve/Reject:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "95%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    marginLeft: 5,
                                    padding: 0
                                }}
                                value={approvalDate} 
                            />
                        </Grid>  
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 3
                                }}
                            >
                                Status Pengiriman:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "100%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    padding: 0
                                }}
                                value={deliveryStatusDescription} 
                            />
                        </Grid> 
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 3
                                }}
                            >
                                Status Pembayaran:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "100%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    padding: 0
                                }}
                                value={payStatusDescription} 
                            />
                        </Grid>           
                    </Grid>
                </Paper>
            </Grid>
            { statusDescription == "CANCELLED" && 
                <Grid item xs={12} style={{marginBottom: isTablet ? 0 : isLaptop ? (freezeNotes == null ? 110 : 310) : 0}}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 355}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Status Cancel:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 4,
                                        padding: 0
                                    }}
                                    value={cancellationStatusDescription} 
                                />
                            </Grid> 
                            <Grid item xs={6}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 8
                                    }}
                                >
                                    Requestor:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "95%",
                                        marginTop: 0,
                                        marginBottom: 4,
                                        marginLeft: 5,
                                        padding: 0
                                    }}
                                    value={cancellationRequestorName} 
                                />
                            </Grid>  
                            <Grid item xs={6}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 8
                                    }}
                                >
                                    Tgl. Request:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "95%",
                                        marginTop: 0,
                                        marginBottom: 4,
                                        marginLeft: 5,
                                        padding: 0
                                    }}
                                    value={cancellationRequestDate} 
                                />
                            </Grid>  
                            <Grid item xs={6}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 8
                                    }}
                                >
                                    Approver/Rejector:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "95%",
                                        marginTop: 0,
                                        marginBottom: 4,
                                        marginLeft: 5,
                                        padding: 0
                                    }}
                                    value={approverRequestorName} 
                                />
                            </Grid>  
                            <Grid item xs={6}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 8
                                    }}
                                >
                                    Tgl. Approve/Reject:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{
                                        width: "95%",
                                        marginTop: 0,
                                        marginBottom: 4,
                                        marginLeft: 5,
                                        padding: 0
                                    }}
                                    value={cancellationApproveDate} 
                                />
                            </Grid> 
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Alasan Cancel:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    multiline
                                    minRows={4}
                                    maxRows={4}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={cancellationReason} 
                                />
                            </Grid>           
                        </Grid>
                    </Paper>
                </Grid>
            }
          </Grid>
          <Grid container sm={12} md={7} lg={8}>
            <Grid item xs={12} md={12} lg={6}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 250}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Delivery Order
                            </Typography>
                            <GridComponent
                                dataSource={deliveryOrdersData}
                                allowSorting={true}
                                allowPaging={false}
                                pageSettings={{ pageSize: 50 }}
                                ref={(grid) => setGridInstance(grid)}
                                allowFiltering={true}
                                filterSettings={filterSettings}
                                height={170}
                                enableVirtualization={true}
                                resizeSettings={{mode: 'Normal'}} 
                                style={{margin: 5}}
                                allowTextWrap={true}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="DeliveryOrderID"
                                        headerText="ID"
                                        width="100"
                                    />
                                    <ColumnDirective
                                        field="CreateDate"
                                        headerText="Create Date"
                                        width="160"
                                        type="date"
                                        format="dd/MM/yyyy"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="DeliveryDate"
                                        headerText="Delivery Date"
                                        width="160"
                                        type="date"
                                        format="dd/MM/yyyy"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="CreatedBy"
                                        headerText="Created By"
                                        width="150"
                                    />
                                    <ColumnDirective
                                        field="DeliveryOrderNumber"
                                        headerText="DO Number"
                                        width="170"
                                    />
                                    <ColumnDirective
                                        field="StatusDescription"
                                        headerText="Status"
                                        width="150"
                                        template={DOStatusDescriptionTemplate}
                                    />
                                </ColumnsDirective>
                                <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                            </GridComponent>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 250}}>
                    <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Histori Pembayaran
                            </Typography>
                            <GridComponent
                                dataSource={purchaseOrderPaymentsData}
                                allowSorting={true}
                                allowPaging={false}
                                pageSettings={{ pageSize: 50 }}
                                ref={(grid) => setGridInstance(grid)}
                                allowFiltering={true}
                                filterSettings={filterSettings}
                                height={170}
                                enableVirtualization={true}
                                resizeSettings={{mode: 'Normal'}} 
                                style={{margin: 5}}
                                allowTextWrap={true}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="PurchaseOrderPaymentID"
                                        headerText="ID"
                                        width="100"
                                    />
                                    <ColumnDirective
                                        field="InvoiceValue"
                                        headerText="Nilai Invoice"
                                        width="170"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="FinalValue"
                                        headerText="Nilai Tagihan"
                                        width="170"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="Method"
                                        headerText="Method"
                                        width="150"
                                    />
                                    <ColumnDirective
                                        field="StatusDescription"
                                        headerText="Status"
                                        width="150"
                                        template={PaymentStatusDescriptionTemplate}
                                    />
                                </ColumnsDirective>
                                <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                            </GridComponent>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 500}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Produk
                            </Typography>
                            <GridComponent
                                dataSource={purchaseOrderItemsData}
                                allowSorting={true}
                                allowPaging={false}
                                pageSettings={{ pageSize: 50 }}
                                ref={(grid) => setGridInstance(grid)}
                                allowFiltering={true}
                                filterSettings={filterSettings}
                                height={420}
                                enableVirtualization={true}
                                resizeSettings={{mode: 'Normal'}} 
                                style={{margin: 5}}
                                allowTextWrap={true}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="ProductID"
                                        headerText="ID"
                                        width="100"
                                    />
                                    <ColumnDirective
                                        field="ProductName"
                                        headerText="Nama"
                                        width="350"
                                    />
                                    <ColumnDirective
                                        field="Quantity"
                                        headerText="Jumlah"
                                        width="130"
                                        format="N0"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="UnitPrice"
                                        headerText="Harga Satuan"
                                        width="170"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="DPPPrice"
                                        headerText="DPP"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="PPNPrice"
                                        headerText="PPN"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="TotalPrice"
                                        headerText="Total"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="TotalReceivedPrice"
                                        headerText="Total Nominal Diterima"
                                        width="210"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="TotalRemainedPrice"
                                        headerText="Total Nominal Tersisa"
                                        width="210"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="Received"
                                        headerText="Diterima"
                                        width="130"
                                        format="N0"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="Remained"
                                        headerText="Sisa"
                                        width="130"
                                        format="N0"
                                        textAlign="Right"
                                    />
                                </ColumnsDirective>
                                <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                            </GridComponent>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} md={12} lg={3}>
                <Paper className={classes.paper} style={{marginBottom: 10}} elevation={3}>
                    <Grid container style={{height: 75}}>
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 3
                                }}
                            >
                                PPN:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{
                                    width: "100%",
                                    marginTop: 0,
                                    marginBottom: 4,
                                    padding: 0
                                }}
                                value={ppnPercentage} 
                            />
                        </Grid> 
                    </Grid>
                </Paper>
                { freezeNotes != null && 
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 175}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Freeze Notes:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    multiline
                                    minRows={6}
                                    maxRows={6}
                                    style={{
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={freezeNotes} 
                                />
                            </Grid> 
                        </Grid>
                    </Paper>
                }
            </Grid>
            <Grid item md={12} lg={9} style={{marginBottom: isTablet ? 10 : isLaptop ? 0 : statusDescription == "CANCELLED" ? 310 : 0}}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: isMobile ? 350 : 270}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5,
                                    fontWeight: 'bold'
                                }}
                            >
                                Total
                            </Typography>
                        </Grid>    
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Nilai PO:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {purchaseOrderValue}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Qty
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalQuantity}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Nilai brg diterima:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {valueReceived}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Qty diterima:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalReceivedQuantity}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Nilai brg blm diterima:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {valueNotYetReceived}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Qty blm diterima:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalRemainingQuantity}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Total bayar:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {paymentValue}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Nilai qty:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalQuantityInValue}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Total terbayar:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {valuePaid}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Nilai qty diterima:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalReceivedInValue}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Total bayar pending:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {valuePending}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Nilai qty blm diterima:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {totalRemainingInValue}
                            </Typography>
                        </Grid>  
                        <Grid item xs={8} sm={4}>
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginLeft: 5
                                }}
                            >
                                Total hutang:
                            </Typography>
                        </Grid>    
                        <Grid item xs={4} sm={2} container justifyContent="flex-end">
                            <Typography 
                                style={{
                                    color: "#F14343", 
                                    fontSize: 16,
                                    marginRight: 10,
                                    fontWeight: 'bold'
                                }}
                            >
                                {valueCredit}
                            </Typography>
                        </Grid>  
                    </Grid>
                </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Layout>

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

export default PurchaseOrderDetail;