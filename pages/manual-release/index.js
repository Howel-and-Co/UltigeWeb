import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogContent,
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import Cookies from "js-cookie";
import moment from '../../src/utils/moment';

import React, { useEffect } from 'react';
import axios from '../../src/utils/axios';

const useStyles = makeStyles()((theme) => {
  return {
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
      '&:focus': {
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
  };
});

const ManualRelease = () => {
  const { classes } = useStyles();

  const [fetchTransactionDataActive, setFetchTransactionData] = React.useState(false);
  const [processReleaseActive, setProcessReleaseActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [transactionID, setTransactionIDValue] = React.useState();

  const [transactionIDDisplayedData, setTransactionIDDisplayedDataValue] = React.useState('');
  const [transactionName, setTransactionName] = React.useState();
  const [orderValue, setOrderValue] = React.useState();
  const [orderDate, setOrderDate] = React.useState();
  const [paymentMethod, setPaymentMethod] = React.useState();
  const [transactionStatus, setTransactionStatus] = React.useState();
  const [releaseReason, setReleaseReason] = React.useState('');

  const handleRefreshTransactionData = () => {
    setFetchTransactionData(true);
  }

  const handleRefreshProcessReleaseState = () => {
    setProcessReleaseActive(true);
  }

  const handleTransactionIDChange = (e) => {
    setTransactionIDValue(e.target.value);
  }

  const handleReleaseReasonChange = (e) => {
    setReleaseReason(e.target.value);
  }

  useEffect(() => {
    const fetchTransactionData = async (transactionID) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/order/gettransactiondetail?transactionID=${transactionID}`);
      //const result = await axios.get(`http://localhost:5000/ultigeapi/web/order/gettransactiondetail?transactionID=${transactionID}`);
    
      let processedData;
      processedData = result.data;

      setTransactionIDDisplayedDataValue(processedData.Data.TransactionDetail.TransactionID);
      setTransactionName(processedData.Data.TransactionDetail.TransactionName);
      setOrderValue(Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(processedData.Data.TransactionDetail.OrderValue));
      setOrderDate(moment(processedData.Data.TransactionDetail.OrderDate).format("DD/MMM/YYYY HH:mm:ss"));
      setPaymentMethod(processedData.Data.TransactionDetail.PaymentMethod);
      setTransactionStatus(processedData.Data.TransactionDetail.Status);

      setDataLoading(false);
    };

    if (fetchTransactionDataActive == true) {
      if (transactionID == null || transactionID == '' || transactionID == "" || transactionID < 1) {
        window.alert("ID Transaksi Tidak Valid");
        setFetchTransactionData(false);
        return;
      }
      fetchTransactionData(transactionID);

      setFetchTransactionData(false);
    }
  }, [fetchTransactionDataActive]);

  useEffect(() => {
    const fetchProcessRelease = async (transactionID, releaseReason, releaseUsername) => {
      setDataLoading(true);

      const result = await axios({
        method: 'put',
        url: 'https://api.ultige.com/ultigeapi/web/order/releaseorder',
        // url: 'http://localhost:5000/ultigeapi/web/order/releaseorder',
        data: {
          transactionID: transactionID,
          releaseReason: releaseReason,
          releaseUsername: releaseUsername
        }
      });

      let processedData;
      processedData = result.data;

      if (processedData.Status.Code == 200) {
        window.alert("Order berhasil direlease");
      }
      else {
        window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
      }

      // Kosongkan field
      setTransactionIDValue('');
      setTransactionIDDisplayedDataValue('');
      setTransactionName('');
      setOrderValue('');
      setOrderDate('');
      setPaymentMethod('');
      setTransactionStatus('');
      setReleaseReason('');

      setDataLoading(false);
    };

    if (processReleaseActive == true) {
      if (transactionID == null || transactionID == '' || transactionID == "" || transactionID < 1) {
        window.alert("ID Transaksi Tidak Valid");
        setProcessReleaseActive(false);
        return;
      }

      if (releaseReason == '' || releaseReason == null) {
        window.alert("Belum mengisi Alasan Release");
        setProcessReleaseActive(false);
        return;
      }

      if (transactionStatus != "CONFIRM") {
        window.alert("Status Order bukan CONFIRM");
        setProcessReleaseActive(false);
        return;
      }

      if (window.confirm("Release Order?") == false) {
        setProcessReleaseActive(false);
        return;
      }

      let username = Cookies.get("username");
      fetchProcessRelease(transactionID, releaseReason, username);
      setProcessReleaseActive(false);
    }
  }, [processReleaseActive]);

  return (
    <>
      <Layout>
        <Grid container style={{ padding: 5 }}>
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
                    Manual Release
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box className={classes.inline} style={{ marginLeft: 0 }}>
                    <TextField
                      label="ID Transaksi"
                      variant="outlined"
                      size="medium"
                      style={{ marginTop: 4, marginLeft: 10, width: 283, marginRight: 10 }}
                      value={transactionID}
                      type="number"
                      onChange={handleTransactionIDChange} />
                  </Box>
                </Grid>
                <Grid item sm={12} md={8} container justifyContent="flex">
                  <Button
                    variant="contained"
                    style={{
                      borderRadius: 4,
                      textTransform: "none",
                      margin: 10,
                      color: "#FFFFFF",
                      height: 40
                    }}
                    disableRipple
                    disableElevation
                    onClick={handleRefreshTransactionData}
                  >
                    Tampilkan
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3} marginTop={10}>
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
                    Detail Transaksi
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
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
                      value={transactionIDDisplayedData}
                    />
                  </Box>

                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
                    <Typography
                      style={{
                        color: "#000",
                        fontSize: 18,
                        marginTop: 6,
                        width: 250
                      }}
                    >
                      Nama Pembeli:
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
                      value={transactionName}
                    />
                  </Box>

                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
                    <Typography
                      style={{
                        color: "#000",
                        fontSize: 18,
                        marginTop: 6,
                        width: 250
                      }}
                    >
                      Nilai Order:
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
                      value={orderValue}
                    />
                  </Box>

                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
                    <Typography
                      style={{
                        color: "#000",
                        fontSize: 18,
                        marginTop: 6,
                        width: 250
                      }}
                    >
                      Tgl Order:
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
                      value={orderDate}
                    />
                  </Box>

                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
                    <Typography
                      style={{
                        color: "#000",
                        fontSize: 18,
                        marginTop: 6,
                        width: 250
                      }}
                    >
                      Metode Bayar:
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
                      value={paymentMethod}
                    />
                  </Box>

                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
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
                      }}
                      style={{
                        width: "100%",
                        marginTop: 0,
                        marginBottom: 0,
                        padding: 0
                      }}
                      value={transactionStatus}
                    />
                  </Box>

                  <Box className={classes.inline} style={{ marginLeft: 5, marginRight: 5, marginBottom: 7 }}>
                    <Typography
                      style={{
                        color: "#000",
                        fontSize: 18,
                        marginTop: 6,
                        width: 250
                      }}
                    >
                      Alasan Release:
                    </Typography>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      size="small"
                      multiline
                      minRows={4}
                      maxRows={4}
                      InputProps={{
                        readOnly: false,
                      }}
                      style={{
                        width: "100%",
                        marginTop: 0,
                        marginBottom: 0,
                        padding: 0
                      }}
                      value={releaseReason}
                      onChange={handleReleaseReasonChange}
                    />
                  </Box>
                </Grid>


                <Grid item sm={12} container justifyContent="center">
                  <Button
                    variant="contained"
                    style={{
                      borderRadius: 4,
                      textTransform: "none",
                      margin: 10,
                      color: "#FFFFFF",
                      height: 40
                    }}
                    disableRipple
                    disableElevation
                    onClick={() => handleRefreshProcessReleaseState(true)}
                  >
                    Release
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Layout>

      <Dialog
        open={dataLoading}
      >
        <DialogContent>
          <Box className={classes.inline} style={{ marginTop: 4, marginLeft: 5, marginBottom: 15 }}>
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
    </>
  );
}

export default ManualRelease;