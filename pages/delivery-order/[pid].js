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
  Checkbox,
  Button,
  Slide,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";
import moment from '../../src/utils/moment';

import React, { useState, useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';
import Router from "next/router";
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';

import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `/js/pdf.worker.min.js`;

import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Sort,
    Filter,
    Inject,
    VirtualScroll,
    Aggregate,
    AggregateColumnsDirective, 
    AggregateColumnDirective,
    AggregateDirective, 
    AggregatesDirective
  } from '@syncfusion/ej2-react-grids';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles()((theme) => {
    return {
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
        },
        pdfDocument: {
            backgroundColor: '#fafafa',
            paddingTop: 66
        },
        pdfPage: {
            display: 'table',
            margin: '0 auto',
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: '#fafafa'
        },
        pdfPageMobile: {
            display: 'table',
            margin: '0 auto',
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: '#fafafa'
        }
    };
});

const TotalPriceColumnTemplate = (props) => {
    return (<span>Rp {Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(props.Sum)}</span>);
};

const DeliveryOrderDetail = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  const [fetchActive, setFetchActive] = React.useState(false);
  const [deliveryProofFetchActive, setDeliveryProofFetchActive] = React.useState(false);
  const [invoiceProofFetchActive, setInvoiceProofFetchActive] = React.useState(false);
  const [approveActive, setApproveActive] = React.useState(false);
  const [rejectActive, setRejectActive] = React.useState(false);

  const [deliveryProofURL, setDeliveryProofURL] = React.useState(null);
  const [invoiceProofURL, setInvoiceProofURL] = React.useState(null);

  const [openImage, setOpenImage] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState(null);
  const [imageURL, setImageURL] = React.useState(null);
  const [openFile, setOpenFile] = React.useState(false);
  const [fileURL, setFileURL] = React.useState(null);
  const [numPages, setNumPages] = useState(null);

  const [createdBy, setCreatedBy] = React.useState();
  const [operationUserName, setOperationUserName] = React.useState();
  const [createDate, setCreateDate] = React.useState();
  const [deliveryDate, setDeliveryDate] = React.useState();
  const [notes, setNotes] = React.useState();
  const [purchaseOrderID, setPurchaseOrderID] = React.useState();
  const [purchaseOrderTaxID, setPurchaseOrderTaxID] = React.useState();
  const [deliveryOrderID, setDeliveryOrderID] = React.useState();
  const [purchaseOrderNumber, setPurchaseOrderNumber] = React.useState();
  const [purchaseOrderType, setPurchaseOrderType] = React.useState();
  const [statusDescription, setStatusDescription] = React.useState();
  const [statusUpdater, setStatusUpdater] = React.useState();
  const [vendorDeliveryOrderNumber, setVendorDeliveryOrderNumber] = React.useState();
  const [isSample, setIsSample] = React.useState();

  const [isPPN, setIsPPN] = React.useState();
  const [taxInvoiceIssuer, setTaxInvoiceIssuer] = React.useState();
  const [taxInvoiceDate, setTaxInvoiceDate] = React.useState();
  const [taxInvoiceNumber, setTaxInvoiceNumber] = React.useState();
  const [DPPValue, setDPPValue] = React.useState();
  const [PPNValue, setPPNValue] = React.useState();
  
  const [purchaseOrderItemsData, setPurchaseOrderItemsData] = React.useState();
  const [deliveryOrderItemsData, setDeliveryOrderItemsData] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const handleClickOpenImage = (title, url) => {
    setDialogTitle(title)
    setImageURL(url);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setDialogTitle(null);
    setImageURL(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const handleClickOpenFile = (title, url) => {
    setDialogTitle(title)
    setFileURL(url);
    setOpenFile(true);
  };

  const handleCloseFile = () => {
    setOpenFile(false);
    setDialogTitle(null);
    setFileURL(null);
  };

  const StatusDescriptionColor = (status) => {
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

  useEffect(() => {
    const fetchDeliveryOrderDetailData = async (deliveryOrderID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/deliveryorder/getdeliveryorderdetail?deliveryOrderID=${deliveryOrderID}`);

        let processedData;
        processedData = result.data;

      
        //console.log(processedData);

        setCreatedBy(processedData.Data.DeliveryOrderDetail.CreatedBy);
        setOperationUserName(processedData.Data.DeliveryOrderDetail.OperationUserName);
        if (processedData.Data.DeliveryOrderDetail.CreateDate != null)
            setCreateDate(moment(processedData.Data.DeliveryOrderDetail.CreateDate).format("DD/MM/YYYY"));
        if (processedData.Data.DeliveryOrderDetail.DeliveryDate != null)
            setDeliveryDate(moment(processedData.Data.DeliveryOrderDetail.DeliveryDate).format("DD/MM/YYYY"));
        setNotes(processedData.Data.DeliveryOrderDetail.Notes);
        setPurchaseOrderID(processedData.Data.DeliveryOrderDetail.PurchaseOrderID);
        setDeliveryOrderID(processedData.Data.DeliveryOrderDetail.DeliveryOrderID);
        setPurchaseOrderNumber(processedData.Data.PurchaseOrderDetail.PurchaseOrderNumber);
        setPurchaseOrderType(processedData.Data.PurchaseOrderDetail.PurchaseOrderType);
        setStatusDescription(processedData.Data.DeliveryOrderDetail.StatusDescription);
        setStatusUpdater(processedData.Data.DeliveryOrderDetail.StatusUpdater);
        setVendorDeliveryOrderNumber(processedData.Data.DeliveryOrderDetail.VendorDeliveryOrderNumber);
        setIsSample(processedData.Data.DeliveryOrderDetail.IsSample);

        setIsPPN(processedData.Data.PurchaseOrderDetail.IsPPN);
        if (processedData.Data.PurchaseOrderDetail.IsPPN != 0 && Object.keys(processedData.Data.PurchaseOrderTaxDetail) != 0) {
            setPurchaseOrderTaxID(processedData.Data.PurchaseOrderTaxDetail.PurchaseOrderTaxID)
            setTaxInvoiceIssuer(processedData.Data.PurchaseOrderTaxDetail.TaxInvoiceIssuer);
            if (processedData.Data.PurchaseOrderTaxDetail.TaxInvoiceDate != null)
                setTaxInvoiceDate(moment(processedData.Data.PurchaseOrderTaxDetail.TaxInvoiceDate).format("DD/MM/YYYY"));
            setTaxInvoiceNumber(processedData.Data.PurchaseOrderTaxDetail.TaxInvoiceNumber);
            setDPPValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PurchaseOrderTaxDetail.DPPValue));   
            setPPNValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PurchaseOrderTaxDetail.PPNValue));   
        }

        let newData = new Array();

        processedData.Data.PurchaseOrderItems.forEach(function (dataItem) {
            let object = new Object();

            object.ProductName = dataItem.ProductName;
            object.Quantity = dataItem.Quantity;
            object.UnitPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.UnitPrice);
            object.DPPPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.DPPPrice);
            object.PPNPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.PPNPrice);
            object.Received = dataItem.Received;
            object.Remained = dataItem.Remained;

            newData.push(object);
        });
        setPurchaseOrderItemsData(newData);

        newData = new Array();

        processedData.Data.DeliveryOrderItems.forEach(function (dataItem) {
            let object = new Object();

            object.ProductName = dataItem.ProductName;
            object.Quantity = dataItem.Quantity;
            object.UnitPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.UnitPrice);
            object.DPPPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.DPPPrice);
            object.PPNPrice = Intl.NumberFormat('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(dataItem.PPNPrice);
            object.TotalPrice = dataItem.TotalPrice;

            newData.push(object);
        });
        setDeliveryOrderItemsData(newData);

        setDataLoading(false);
    };

    if (pid != undefined || fetchActive == true) {
        fetchDeliveryOrderDetailData(pid);
        setFetchActive(false);
    }
  }, [pid, fetchActive]);

  useEffect(() => {
    const processDeliveryProof = async (deliveryOrderID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/deliveryorder/getdeliveryproof?deliveryOrderID=${deliveryOrderID}`);

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            let uri;
            if (processedData.Data.DeliveryProofExtension == ".pdf") {
                uri = `data:application/pdf;base64,${processedData.Data.DeliveryProof}`;
                setDeliveryProofURL(uri);
                handleClickOpenFile("Bukti Surat Jalan", uri);
            }
            else {
                uri = `data:image/${processedData.Data.DeliveryProofExtension.split(".")[1]};base64,${processedData.Data.DeliveryProof}`;
                setDeliveryProofURL(uri);
                handleClickOpenImage("Bukti Surat Jalan", uri);
            }
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
        }

        setDataLoading(false);
    };

    if (deliveryProofFetchActive == true) {
        if (deliveryProofURL == null) {
            processDeliveryProof(deliveryOrderID);
        }
        else {
            if (deliveryProofURL.split("/")[0] == "data:application") {
                handleClickOpenFile("Bukti Surat Jalan", deliveryProofURL);
            }
            else {
                handleClickOpenImage("Bukti Surat Jalan", deliveryProofURL);
            }
        }

        setDeliveryProofFetchActive(false);
    }
  }, [deliveryProofFetchActive]);

  useEffect(() => {
    const processInvoiceProof = async (purchaseOrderTaxID, purchaseOrderID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/deliveryorder/getinvoiceproof?purchaseOrderTaxID=${purchaseOrderTaxID}&purchaseOrderID=${purchaseOrderID}`);

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            let uri;
            if (processedData.Data.InvoiceProofExtension == ".pdf") {
                uri = `data:application/pdf;base64,${processedData.Data.InvoiceProof}`;
                setInvoiceProofURL(uri);
                handleClickOpenFile("Bukti Faktur", uri);
            }
            else {
                uri = `data:image/${processedData.Data.InvoiceProofExtension.split(".")[1]};base64,${processedData.Data.InvoiceProof}`;
                setInvoiceProofURL(uri);
                handleClickOpenImage("Bukti Faktur", uri);
            }
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
        }

        setDataLoading(false);
    };

    if (invoiceProofFetchActive == true) {
        if (invoiceProofURL == null) {
            processInvoiceProof(purchaseOrderTaxID, purchaseOrderID);
        }
        else {
            if (invoiceProofURL.split("/")[0] == "data:application") {
                handleClickOpenFile("Bukti Faktur", invoiceProofURL);
            }
            else {
                handleClickOpenImage("Bukti Faktur", invoiceProofURL);
            }
        }

        setInvoiceProofFetchActive(false);
    }
  }, [invoiceProofFetchActive]);

  useEffect(() => {
    const processApproveDeliveryOrder = async (deliveryOrderID, purchaseOrderID, purchaseOrderType, username) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/deliveryorder/approvedeliveryorder',
            data: {
                deliveryOrderID: deliveryOrderID,
                purchaseOrderID: purchaseOrderID,
                purchaseOrderType: purchaseOrderType,
                username: username
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("DO berhasil diapprove");
            Router.push("/delivery-order");
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (approveActive == true) {
        if (window.confirm("Approve DO?") == false) {
            setApproveActive(false);
            return;
        } 

        let username = Cookies.get("username");

        processApproveDeliveryOrder(deliveryOrderID, purchaseOrderID, purchaseOrderType, username);
        setApproveActive(false);
    }
  }, [approveActive]);

  useEffect(() => {
    const processRejectDeliveryOrder = async (deliveryOrderID, purchaseOrderID, createdBy, userID, username) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/deliveryorder/rejectdeliveryorder',
            data: {
                deliveryOrderID: deliveryOrderID,
                purchaseOrderID: purchaseOrderID,
                createdBy: createdBy,
                userID: userID,
                username: username
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("DO berhasil ditolak");
            Router.push("/delivery-order");
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (rejectActive == true) {
        if (window.confirm("Tolak DO?") == false) {
            setRejectActive(false);
            return;
        } 

        let userID = Cookies.get("userid");
        let username = Cookies.get("username");

        processRejectDeliveryOrder(deliveryOrderID, purchaseOrderID, createdBy, userID, username);
        setRejectActive(false);
    }
  }, [rejectActive]);

  return (
    <div ref={componentRef}>
      <Layout>
        <Grid container style={{padding: 5}}>
          <Grid container sm={12} md={5} lg={4}>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 590}}>
                        <Grid item xs={12} style={{marginTop: 5}}>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
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
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={createdBy} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    Operator Gudang:
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
                                    value={operationUserName} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    Tgl. Buat:
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
                                    value={createDate} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    Tgl. Kirim:
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
                                    value={deliveryDate} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 35,
                                        width: 275
                                    }}
                                >
                                    Notes:
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
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    ID PO:
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
                                    value={purchaseOrderID} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
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
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    Status:
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
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={statusDescription} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    A/R/C Oleh:
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
                                    value={statusUpdater} 
                                />
                            </Box>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 275
                                    }}
                                >
                                    Nomor DO Vendor:
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
                                    value={vendorDeliveryOrderNumber} 
                                />
                            </Box>
                            <Box className={classes.inlineSpace} style={{marginLeft: 0, marginRight: 5, marginBottom: 7}}>
                                <Box className={classes.inline}>
                                    <Checkbox
                                        checked={isSample ? 1 == true : false}
                                        disabled
                                        disableRipple
                                        sx={{ 
                                            '& .MuiSvgIcon-root': { fontSize: 28 },
                                        }}
                                    />
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 8,
                                            marginRight: 5
                                        }}
                                    >
                                        Sampel
                                    </Typography>
                                </Box>
                                <Button 
                                    variant="outlined"
                                    style={{
                                        borderRadius: 4,
                                        textTransform: "none",
                                        height: 40,
                                        marginTop: 2
                                    }}
                                    disableRipple
                                    disableElevation
                                    onClick={() => setDeliveryProofFetchActive(true)}
                                >
                                    Lihat Bukti Surat Jalan
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            { isPPN == true && 
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 288}}>
                            <Grid item xs={12} style={{marginTop: 5}}>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 275
                                        }}
                                    >
                                        Penerbit Faktur:
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
                                        value={taxInvoiceIssuer} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 275
                                        }}
                                    >
                                        Tanggal Faktur:
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
                                        value={taxInvoiceDate} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 275
                                        }}
                                    >
                                        Nomor Faktur:
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
                                        value={taxInvoiceNumber} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 275
                                        }}
                                    >
                                        Nominal DPP:
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
                                        value={DPPValue} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 275
                                        }}
                                    >
                                        Nominal PPN:
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
                                        value={PPNValue} 
                                    />
                                </Box>
                                <Box className={classes.inlineReverse} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Button 
                                        variant="outlined"
                                        style={{
                                            borderRadius: 4,
                                            textTransform: "none",
                                            height: 40,
                                            marginTop: 2
                                        }}
                                        disableRipple
                                        disableElevation
                                        onClick={() => setInvoiceProofFetchActive(true)}
                                    >
                                        Lihat Faktur
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            }
            <Grid item xs={12} style={{marginBottom: isMobile ? 0 : isPPN ? 0 : 205}}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 52}}>
                        { statusDescription == "PENDING" &&
                            <Grid item xs={12} style={{marginTop: 5}}>
                                <Box className={classes.inlineReverse} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Button 
                                        variant="contained"
                                        style={{
                                            borderRadius: 4,
                                            textTransform: "none",
                                            backgroundColor: "#F14343",
                                            color: "#FFFFFF",
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
                                            color: "#FFFFFF",
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
                        }
                    </Grid>
                </Paper>
            </Grid>
          </Grid>
          <Grid container sm={12} md={7} lg={8}>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 400}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Item PO
                            </Typography>
                            <GridComponent
                                dataSource={purchaseOrderItemsData}
                                allowSorting={true}
                                allowPaging={false}
                                pageSettings={{ pageSize: 50 }}
                                ref={(grid) => setGridInstance(grid)}
                                allowFiltering={true}
                                filterSettings={filterSettings}
                                height={320}
                                enableVirtualization={true}
                                resizeSettings={{mode: 'Normal'}} 
                                style={{margin: 5}}
                                allowTextWrap={true}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="ProductName"
                                        headerText="Nama Stok"
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
                                        headerText="Harga Unit"
                                        width="170"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="DPPPrice"
                                        headerText="Harga DPP"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="PPNPrice"
                                        headerText="Harga PPN"
                                        width="150"
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
                                        headerText="Tersisa"
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
            <Grid item xs={12} style={{marginBottom: isMobile ? 10 : isPPN ? 100 : 0}}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 440}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Item DO
                            </Typography>
                            <GridComponent
                                dataSource={deliveryOrderItemsData}
                                allowSorting={true}
                                allowPaging={false}
                                pageSettings={{ pageSize: 50 }}
                                ref={(grid) => setGridInstance(grid)}
                                allowFiltering={true}
                                filterSettings={filterSettings}
                                height={320}
                                enableVirtualization={true}
                                resizeSettings={{mode: 'Normal'}} 
                                style={{margin: 5}}
                                allowTextWrap={true}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="ProductName"
                                        headerText="Nama Stok"
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
                                        headerText="Harga Unit"
                                        width="170"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="DPPPrice"
                                        headerText="Harga DPP"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="PPNPrice"
                                        headerText="Harga PPN"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="TotalPrice"
                                        headerText="Harga Total"
                                        width="200"
                                        format="N2"
                                        textAlign="Right"
                                    />
                                </ColumnsDirective>
                                <AggregatesDirective>
                                    <AggregateDirective>
                                        <AggregateColumnsDirective>
                                            <AggregateColumnDirective field='TotalPrice' type='Sum' footerTemplate={TotalPriceColumnTemplate}/>
                                        </AggregateColumnsDirective>
                                    </AggregateDirective>
                                </AggregatesDirective>
                                <Inject services={[Filter, Page, Sort, VirtualScroll, Aggregate]} />
                            </GridComponent>
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

      <Dialog
        fullScreen
        open={openImage}
        onClose={handleCloseImage}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: 'fixed', background: '#ffffff', color: '#000', borderBottom: '1.5px solid #e4e4e4' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseImage}
              aria-label="close"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              style={{ backgroundColor: 'transparent' }}
            >   
              <CloseIcon />
            </IconButton>
            <Typography style={{ marginLeft: 10, flex: 1 }} variant="h6" component="div">
                {dialogTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        { imageURL && 
          <Box
            component="img"
            style={{
              paddingTop: 65
            }}
            src={imageURL}
          />
        }
      </Dialog>
      
      <Dialog
        fullScreen
        open={openFile}
        onClose={handleCloseFile}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: 'fixed', background: '#ffffff', color: '#000', borderBottom: '1.5px solid #e4e4e4' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseFile}
              aria-label="close"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              style={{ backgroundColor: 'transparent' }}
            >   
              <CloseIcon />
            </IconButton>
            <Typography style={{ marginLeft: 10, flex: 1 }} variant="h6" component="div">
                {dialogTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        { fileURL && 
          <Document
            file={fileURL}
            onLoadSuccess={onDocumentLoadSuccess}
            className={classes.pdfDocument}
          >
            {Array.from(
              new Array(numPages),
              (el, index) => (
                <PdfPage
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={width / 1.01}
                  renderMode="svg"
                  renderTextLayer={false}
                  scale={isMobile ? "0.95" : "0.8"}
                  className={isMobile ? classes.pdfPageMobile : classes.pdfPage}
                />
              ),
            )}
          </Document>
        }
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

export default DeliveryOrderDetail;