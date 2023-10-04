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
} from "@material-ui/core";
import Checkbox from '@mui/material/Checkbox';
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Cookies from "js-cookie";
import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useState, useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';
import { useRouter } from 'next/router';

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

const TransferRequestDetail = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  moment.locale('id');

  const [fetchActive, setFetchActive] = React.useState(false);
  const [approveActive, setApproveActive] = React.useState(false);
  const [rejectActive, setRejectActive] = React.useState(false);
  const [requestProofFetchActive, setRequestProofFetchActive] = React.useState(false);
  const [paymentProof1FetchActive, setPaymentProof1FetchActive] = React.useState(false);
  const [paymentProof2FetchActive, setPaymentProof2FetchActive] = React.useState(false);

  const [requestProofURL, setRequestProofURL] = React.useState(null);
  const [paymentProofURL1, setPaymentProofURL1] = React.useState(null);
  const [paymentProofURL2, setPaymentProofURL2] = React.useState(null);

  const [similarRequestData, setSimilarRequestData] = React.useState();
  const [paymentCategoriesData, setPaymentCategoriesData] = React.useState();

  const [requestDate, setRequestDate] = React.useState();
  const [invoiceDate, setInvoiceDate] = React.useState();
  const [requestValue, setRequestValue] = React.useState();
  const [kasTransferBank, setKasTransferBank] = React.useState();
  const [kasInfo, setKasInfo] = React.useState();
  const [dueDate, setDueDate] = React.useState();

  const [transferRequestID, setTransferRequestID] = React.useState();
  const [transactionID, setTransactionID] = React.useState();
  const [purchaseOrderPaymentID, setPurchaseOrderPaymentID] = React.useState();
  const [reimbursementRequestID, setReimbursementRequestID] = React.useState();
  const [phoneBrand, setPhoneBrand] = React.useState();
  const [requestor, setRequestor] = React.useState();
  const [status, setStatus] = React.useState();
  const [statusDescription, setStatusDescription] = React.useState();

  const [destinationAccountName, setDestinationAccountName] = React.useState();
  const [destinationAccountNumber, setDestinationAccountNumber] = React.useState();
  const [destinationBank, setDestinationBank] = React.useState();
  const [destinationBankBranch, setDestinationBankBranch] = React.useState();
  const [businessEntity, setBusinessEntity] = React.useState();
  const [taxable, setTaxable] = React.useState();
  const [pkp, setPKP] = React.useState();
  const [contactName, setContactName] = React.useState();
  const [contactPhoneNumber, setContactPhoneNumber] = React.useState();
  const [contactEmail, setContactEmail] = React.useState();

  const [requestReason, setRequestReason] = React.useState();
  const [approver, setApprover] = React.useState();
  const [approvalDate, setApprovalDate] = React.useState();
  const [approvalReason, setApprovalReason] = React.useState();
  const [payer, setPayer] = React.useState();
  const [payDate, setPayDate] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const handleApprovalReasonChange = (e) => {
    setApprovalReason(e.target.value);
  }

  const StatusColor = (status) => {
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
    else if (status == 'PAID') {
        return '#536FB7'
    }
    else if (status == 'HALF PAID') {
        return '#536FB7'
    }
    else {
        return '#00000'
    }
  };

  useEffect(() => {
    const fetchTransferRequestDetailData = async (transferRequestID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/transferrequest/gettransferrequestdetail?transferRequestID=${transferRequestID}`);

        let processedData;
        processedData = result.data;

      
        setRequestDate(moment(processedData.Data.TransferRequestDetail.RequestDate).format("DD/MM/YYYY"));
        setInvoiceDate(moment(processedData.Data.TransferRequestDetail.InvoiceDate).format("DD/MM/YYYY"));
        setRequestValue(Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(processedData.Data.TransferRequestDetail.RequestValue));
        setKasTransferBank(processedData.Data.TransferRequestDetail.KasTransferBank);
        setKasInfo(processedData.Data.TransferRequestDetail.KasInfo);
        if (processedData.Data.TransferRequestDetail.DueDate != null)
            setDueDate(moment(processedData.Data.TransferRequestDetail.DueDate).format("DD/MM/YYYY"));

        setTransferRequestID(processedData.Data.TransferRequestDetail.TransferRequestID);
        setTransactionID(processedData.Data.TransferRequestDetail.TransactionID);
        setPurchaseOrderPaymentID(processedData.Data.TransferRequestDetail.PurchaseOrderPaymentID);
        setReimbursementRequestID(processedData.Data.TransferRequestDetail.ReimbursementRequestID);
        setPhoneBrand(processedData.Data.TransferRequestDetail.PhoneBrand);
        setRequestor(processedData.Data.TransferRequestDetail.Requestor);
        setStatus(processedData.Data.TransferRequestDetail.Status);
        setStatusDescription(processedData.Data.TransferRequestDetail.StatusDescription);

        setDestinationAccountName(processedData.Data.TransferRequestDetail.DestinationAccountName);
        setDestinationAccountNumber(processedData.Data.TransferRequestDetail.DestinationAccountNumber);
        setDestinationBank(processedData.Data.TransferRequestDetail.DestinationBank);
        setDestinationBankBranch(processedData.Data.TransferRequestDetail.DestinationBankBranch);
        setBusinessEntity(processedData.Data.TransferRequestDetail.BusinessEntity);
        setTaxable(processedData.Data.TransferRequestDetail.Taxable);
        setPKP(processedData.Data.TransferRequestDetail.PKP);
        setContactName(processedData.Data.TransferRequestDetail.ContactName);
        setContactPhoneNumber(processedData.Data.TransferRequestDetail.ContactPhoneNumber);
        setContactEmail(processedData.Data.TransferRequestDetail.ContactEmail.replaceAll(';', '\n'));

        setRequestReason(processedData.Data.TransferRequestDetail.RequestReason);
        setApprover(processedData.Data.TransferRequestDetail.Approver);
        if (processedData.Data.TransferRequestDetail.ApprovalDate != null)
            setApprovalDate(moment(processedData.Data.TransferRequestDetail.ApprovalDate).format("DD/MM/YYYY"));
        setApprovalReason(processedData.Data.TransferRequestDetail.ApprovalReason);
        setPayer(processedData.Data.TransferRequestDetail.Payer);
        if (processedData.Data.TransferRequestDetail.PayDate != null)
            setPayDate(moment(processedData.Data.TransferRequestDetail.PayDate).format("DD/MM/YYYY"));
        

        let newData = new Array();

        processedData.Data.SimilarRequest.forEach(function (dataItem) {
        let object = new Object();

        object.Requestor = dataItem.Requestor;
        object.RequestReason = dataItem.RequestReason;
        object.StatusDescription = dataItem.StatusDescription;
        object.KasInfo = dataItem.KasInfo;
        object.RequestValue = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(dataItem.RequestValue);

        newData.push(object);
        });

        setSimilarRequestData(newData);

        let newData2 = new Array();

        processedData.Data.PaymentCategories.forEach(function (dataItem) {
        let object = new Object();

        object.TransferRequestPaymentCategoryID = dataItem.TransferRequestPaymentCategoryID;
        object.TransferRequestID = dataItem.TransferRequestID;
        object.PaymentCategoryID = dataItem.PaymentCategoryID;
        object.PaymentCategoryTitle1 = dataItem.PaymentCategoryTitle1;
        object.PaymentCategoryTitle2 = dataItem.PaymentCategoryTitle2;
        object.PaymentCategoryTitle3 = dataItem.PaymentCategoryTitle3;
        object.PaymentValue = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(dataItem.PaymentValue);
        object.TaxInvoiceIssuer = dataItem.TaxInvoiceIssuer;
        object.TaxInvoiceDate = dataItem.TaxInvoiceDate;
        object.TaxInvoiceNumber = dataItem.TaxInvoiceNumber;
        object.FileExist = dataItem.FileExist;
        object.IsNotificationSent = dataItem.IsNotificationSent;
        object.TaxType = dataItem.TaxType;

        newData2.push(object);
        });

        setPaymentCategoriesData(newData2);

        setDataLoading(false);
    };

    if (pid != undefined || fetchActive == true) {
        fetchTransferRequestDetailData(pid);
        setFetchActive(false);
    }
  }, [pid, fetchActive]);

  useEffect(() => {
    const processApproveRequest = async (transferRequestID, approverUserID, approverUsername, approvalReason) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/transferrequest/approvetransferrequest',
            data: {
                transferRequestID: transferRequestID,
                approverUserID: approverUserID,
                approverUsername: approverUsername,
                approvalReason: approvalReason
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("Request berhasil diapprove");
            setFetchActive(true);
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (approveActive == true) {
        if (approvalReason == null || approvalReason == "") {
            window.alert("Alasan Approve/Reject harus diisi");
            setApproveActive(false);
            return;
        }

        if (window.confirm("Approve request?") == false) {
            setApproveActive(false);
            return;
        } 

        let userID = Cookies.get("userid");
        let username = Cookies.get("username");

        processApproveRequest(transferRequestID, userID, username, approvalReason);
        setApproveActive(false);
    }
  }, [approveActive]);

  useEffect(() => {
    const processRejectRequest = async (transferRequestID, approverUserID, approverUsername, approvalReason) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/transferrequest/rejecttransferrequest',
            data: {
                transferRequestID: transferRequestID,
                approverUserID: approverUserID,
                approverUsername: approverUsername,
                approvalReason: approvalReason
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("Request berhasil direject");
            setFetchActive(true);
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (rejectActive == true) {
        if (approvalReason == null || approvalReason == "") {
            window.alert("Alasan Approve/Reject harus diisi");
            setRejectActive(false);
            return;
        }

        if (window.confirm("Reject request?") == false) {
            setRejectActive(false);
            return;
        } 

        let userID = Cookies.get("userid");
        let username = Cookies.get("username");

        processRejectRequest(transferRequestID, userID, username, approvalReason);
        setRejectActive(false);
    }
  }, [rejectActive]);

  useEffect(() => {
    const processRequestProof = async (transferRequestID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/transferrequest/getrequestproof?transferRequestID=${transferRequestID}`);

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            setRequestProofURL(`https://ultige.s3.ap-southeast-1.amazonaws.com/` + processedData.Data.RequestProofURL);
            window.open(`https://ultige.s3.ap-southeast-1.amazonaws.com/` + processedData.Data.RequestProofURL, '_blank');
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
        }

        setDataLoading(false);
    };

    if (requestProofFetchActive == true) {
        if (requestProofURL == null) {
            processRequestProof(transferRequestID);
        }
        else {
            window.open(requestProofURL, '_blank');
        }

        setRequestProofFetchActive(false);
    }
  }, [requestProofFetchActive]);

  useEffect(() => {
    const processPaymentProof = async (transferRequestID, openFile) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/transferrequest/getpaymentproof?transferRequestID=${transferRequestID}`);

        let processedData;
        processedData = result.data;
        
        let fileOpened = false;
        if (processedData.Status.Code == 200) {
            if (processedData.Data.TransferProofURL_1 != null) {
                setPaymentProofURL1(`https://ultige.s3.ap-southeast-1.amazonaws.com/` + processedData.Data.TransferProofURL_1);

                if (openFile == 1) {
                    window.open(`https://ultige.s3.ap-southeast-1.amazonaws.com/` + processedData.Data.TransferProofURL_1, '_blank');
                    fileOpened = true;
                }
            }
            
            if (processedData.Data.TransferProofURL_2 != null) {
                setPaymentProofURL2(`https://ultige.s3.ap-southeast-1.amazonaws.com/` + processedData.Data.TransferProofURL_2);

                if (openFile == 2) {
                    window.open(`https://ultige.s3.ap-southeast-1.amazonaws.com/` + processedData.Data.TransferProofURL_2, '_blank');
                    fileOpened = true;
                }
            }
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
            return;
        }

        if (fileOpened == false) {
            window.alert("Belum ada bukti transfer");
        }

        setDataLoading(false);
    };

    if (paymentProof1FetchActive == true) {
        if (paymentProofURL1 == null) {
            processPaymentProof(transferRequestID, 1);
        }
        else {
            window.open(paymentProofURL1, '_blank');
        }

        setPaymentProof1FetchActive(false);
    }
    else if (paymentProof2FetchActive == true) {
        if (paymentProofURL2 == null) {
            processPaymentProof(transferRequestID, 2);
        }
        else {
            window.open(paymentProofURL2, '_blank');
        }

        setPaymentProof2FetchActive(false);
    }
  }, [paymentProof1FetchActive, paymentProof2FetchActive]);

  return (
    <div className={classes.root} ref={componentRef}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container style={{padding: 5}}>
          <Grid container xs={7}>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 335}}>
                        <Grid item xs={6} style={{marginTop: 5}}>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
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
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={requestDate} 
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
                                    Tgl. Invoice:
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
                                    value={invoiceDate} 
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
                                    Nominal Transfer:
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
                                    value={requestValue} 
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
                                    Sumber Dana:
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
                                    value={kasTransferBank} 
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
                                    Info:
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
                                    value={kasInfo} 
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
                                    Jatuh Tempo:
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
                                    value={dueDate} 
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
                                    Status:
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        readOnly: true,
                                        style: {color: StatusColor(statusDescription)}
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
                        </Grid>
                        <Grid item xs={6} style={{marginTop: 5}}>
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
                                    }}
                                >
                                    ID Request:
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
                                    value={transferRequestID} 
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
                                    ID Transaksi:
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
                                    value={transactionID} 
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
                                    ID Payment:
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
                                    value={purchaseOrderPaymentID} 
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
                                    ID Reimburse:
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
                                    value={reimbursementRequestID} 
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
                                    Channel:
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
                                    value={phoneBrand} 
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
                                        width: "100%",
                                        marginTop: 0,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={requestor} 
                                />
                            </Box>
                            <Box className={classes.inlineReverse} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Button 
                                    variant="outlined"
                                    style={{
                                        borderRadius: 4,
                                        textTransform: "none",
                                        height: 40,

                                    }}
                                    disableRipple
                                    disableElevation
                                    onClick={() => setRequestProofFetchActive(true)}
                                >
                                    Lihat Bukti Request
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
          </Grid>
          <Grid item xs={5}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 335}}>
                            <Grid item xs={12}>
                                <GridComponent
                                    dataSource={similarRequestData}
                                    allowSorting={true}
                                    allowPaging={false}
                                    pageSettings={{ pageSize: 50 }}
                                    ref={(grid) => setGridInstance(grid)}
                                    allowFiltering={true}
                                    filterSettings={filterSettings}
                                    height={272}
                                    enableVirtualization={true}
                                    resizeSettings={{mode: 'Normal'}} 
                                    style={{margin: 5}}
                                    allowTextWrap={true}
                                >
                                    <ColumnsDirective>
                                        <ColumnDirective
                                            field="Requestor"
                                            headerText="Requestor"
                                            width="150"
                                        />
                                        <ColumnDirective
                                            field="RequestReason"
                                            headerText="Alasan Request"
                                            width="200"
                                        />
                                        <ColumnDirective
                                            field="StatusDescription"
                                            headerText="Status"
                                            width="120"
                                        />
                                        <ColumnDirective
                                            field="KasInfo"
                                            headerText="Kas Info"
                                            width="200"
                                        />
                                        <ColumnDirective
                                            field="RequestValue"
                                            headerText="Nominal"
                                            width="150"
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
          <Grid container xs={9}>
            <Grid item xs={6}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid style={{height: 477}}>
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
                                    Nama Rekening:
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
                                    value={destinationAccountName} 
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
                                    No. Rekening:
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
                                    value={destinationAccountNumber} 
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
                                    Bank:
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
                                    value={destinationBank} 
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
                                    Cabang Bank:
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
                                    value={destinationBankBranch} 
                                />
                            </Box>
                            { transactionID == 0 &&
                                <>
                                    <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 0}}>
                                        <Typography 
                                            style={{
                                                color: "#000", 
                                                fontSize: 18,
                                                marginTop: 6,
                                                width: 250
                                            }}
                                        >
                                            Badan Usaha:
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
                                            value={businessEntity} 
                                        />
                                    </Box>
                                    <Box className={classes.inline} style={{marginLeft: 155, marginRight: 5, marginBottom: 7}}>
                                        <Checkbox
                                            checked={taxable ? 1 == true : false}
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
                                                marginTop: 10,
                                                marginRight: 5
                                            }}
                                        >
                                            Taxable
                                        </Typography>
                                        <Checkbox
                                            checked={pkp ? 1 == true : false}
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
                                                marginTop: 10
                                            }}
                                        >
                                            PKP
                                        </Typography>
                                    </Box>
                                </>
                            }
                            <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginTop: 6,
                                        width: 250
                                    }}
                                >
                                    Nama:
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
                                    value={contactName} 
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
                                    Nomor Telepon:
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
                                    value={contactPhoneNumber} 
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
                                    Email:
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
                                    value={contactEmail} 
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid style={{height: 482}}>
                        <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginTop: 35,
                                    width: 250
                                }}
                            >
                                Alasan Request:
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
                                value={requestReason} 
                            />
                        </Box>
                        { (status != 0 && status != 3) &&
                            <>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 250
                                        }}
                                    >
                                        Approver:
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
                                        value={approver} 
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
                                        Tgl. Approve:
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
                                        value={approvalDate} 
                                    />
                                </Box>
                            </>
                        }
                        <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginTop: 25,
                                    width: 250
                                }}
                            >
                                Alasan Approve/
                                Reject:
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                size="small"
                                InputProps={{
                                    readOnly: status == 0 ? false : true,
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
                                value={approvalReason} 
                                onChange={handleApprovalReasonChange}
                            />
                        </Box>
                        { status == 4 &&
                            <>
                                <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 250
                                        }}
                                    >
                                        Pembayar:
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
                                        value={payer} 
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
                                        Tgl. Bayar:
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
                                        value={payDate} 
                                    />
                                </Box>
                            </>
                        }
                        <Box className={classes.inlineReverse} style={{marginLeft: 5, marginRight: 5, marginBottom: 7}}>
                            <Button 
                                variant="outlined"
                                style={{
                                    borderRadius: 4,
                                    textTransform: "none",
                                    height: 40,
                                    marginLeft: 5

                                }}
                                disableRipple
                                disableElevation
                                onClick={() => setPaymentProof2FetchActive(true)}
                            >
                                Lihat Bukti Transfer 2
                            </Button>
                            <Button 
                                variant="outlined"
                                style={{
                                    borderRadius: 4,
                                    textTransform: "none",
                                    height: 40,

                                }}
                                disableRipple
                                disableElevation
                                onClick={() => setPaymentProof1FetchActive(true)}
                            >
                                Lihat Bukti Transfer 1
                            </Button>
                        </Box>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid style={{height: 200}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Info Kas
                            </Typography>
                            <GridComponent
                                dataSource={paymentCategoriesData}
                                allowSorting={true}
                                allowPaging={false}
                                pageSettings={{ pageSize: 50 }}
                                ref={(grid) => setGridInstance(grid)}
                                allowFiltering={true}
                                filterSettings={filterSettings}
                                height={120}
                                enableVirtualization={true}
                                resizeSettings={{mode: 'Normal'}} 
                                style={{margin: 5}}
                                allowTextWrap={true}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="PaymentValue"
                                        headerText="Nominal Kas"
                                        width="150"
                                        format="#,##0.##"
                                        textAlign="Right"
                                    />
                                    <ColumnDirective
                                        field="PaymentCategoryTitle1"
                                        headerText="Kategori 1"
                                        width="210"
                                    />
                                    <ColumnDirective
                                        field="PaymentCategoryTitle2"
                                        headerText="Kategori 2"
                                        width="210"
                                    />
                                    <ColumnDirective
                                        field="PaymentCategoryTitle3"
                                        headerText="Kategori 3"
                                        width="210"
                                    />
                                </ColumnsDirective>
                                <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                            </GridComponent>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
          </Grid>
          <Grid item xs={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 120}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Harus Transfer:
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
                                    value={requestValue} 
                                />
                                { status == 0 &&
                                    <Box className={classes.inlineReverse} style={{marginTop: 7}}>
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
                                }
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

export default TransferRequestDetail;