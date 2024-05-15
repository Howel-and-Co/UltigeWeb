import Layout from "../../../src/components/Layout";
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
import { makeStyles } from 'tss-react/mui';
import Cookies from "js-cookie";
import moment from '../../../src/utils/moment';

import React, { useEffect } from 'react';
import axios from '../../../src/utils/axios';
import Router from "next/router";
import { useRouter } from 'next/router';

import MomentUtils from '@date-io/moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { getCurrentTime } from '../../../src/utils/momentSystem';

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
    };
});

const CustomizeCell = (args) => {
    if (args.column.field === "Activity" && args.data && args.cell) {
        if (args.data["Activity"] == 'OUT') {
            args.cell.style.backgroundColor = '#FF0000'
        }
        else {
            args.cell.style.backgroundColor = '#228B22'
        }
    }
};

const StockAdjustmentRequestDetail = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  const [fetchActive, setFetchActive] = React.useState(false);
  const [approveActive, setApproveActive] = React.useState(false);
  const [rejectActive, setRejectActive] = React.useState(false);
  
  const [stockAdjustmentRequestItemsData, setStockAdjustmentRequestItemsData] = React.useState();

  const [stockAdjustmentRequestID, setStockAdjustmentRequestID] = React.useState();
  const [notes, setNotes] = React.useState();
  const [requestor, setRequestor] = React.useState();
  const [requestDate, setRequestDate] = React.useState();
  const [adjustDate, setAdjustDate] = React.useState();
  const [warehouseID, setWarehouseID] = React.useState();
  const [warehouseName, setWarehouseName] = React.useState();
  const [requestStatus, setRequestStatus] = React.useState();
  const [requestStatusDescription, setRequestStatusDescription] = React.useState();
  const [totalCOGS, setTotalCOGS] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  const handleAdjustDateChange = (date) => {
    setAdjustDate(date);
  };

  const RequestStatusColor = (requestStatus) => {
    if (requestStatus == 'PENDING') {
        return '#000000'
    }
    else if (requestStatus == 'REJECTED') {
        return '#F14343'
    }
    else if (requestStatus == 'APPROVED') {
        return '#3C8F4A'
    }
    else if (requestStatus == 'CANCELLED') {
        return '#FC6F03'
    }
    else if (requestStatus == 'PAID') {
        return '#536FB7'
    }
    else if (requestStatus == 'HALF PAID') {
        return '#536FB7'
    }
    else {
        return '#00000'
    }
  };

  useEffect(() => {
    const fetchStockAdjustmentRequestDetailData = async (stockAdjustmentRequestID) => {
        setDataLoading(true);

        const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstocksdjustmentrequestdetail?stockAdjustmentRequestID=${stockAdjustmentRequestID}`);

        let processedData;
        processedData = result.data;

        setStockAdjustmentRequestID(processedData.Data.StockAdjustmentRequestDetail.StockAdjustmentRequestID);
        setNotes(processedData.Data.StockAdjustmentRequestDetail.Notes);
        setRequestor(processedData.Data.StockAdjustmentRequestDetail.Requestor);
        setRequestDate(processedData.Data.StockAdjustmentRequestDetail.RequestDate);
        if (processedData.Data.StockAdjustmentRequestDetail.AdjustDate != null)
            setAdjustDate(moment(processedData.Data.StockAdjustmentRequestDetail.AdjustDate).format("DD/MM/YYYY"));
        setWarehouseID(processedData.Data.StockAdjustmentRequestDetail.WarehouseID);
        setWarehouseName(processedData.Data.StockAdjustmentRequestDetail.WarehouseName);
        setRequestStatus(processedData.Data.StockAdjustmentRequestDetail.RequestStatus);
        setRequestStatusDescription(processedData.Data.StockAdjustmentRequestDetail.RequestStatusDescription);
        setTotalCOGS(Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(processedData.Data.StockAdjustmentRequestDetail.TotalCOGS));

        let newData = new Array();

        processedData.Data.StockAdjustmentRequestItems.forEach(function (dataItem) {
            let object = new Object();

            object.StockAdjustmentItemDetailID = dataItem.StockAdjustmentItemDetailID;
            object.StockID = dataItem.StockID;
            object.StockName = dataItem.StockName;
            object.Quantity = dataItem.Quantity;
            object.PackagingContentCount = dataItem.PackagingContentCount;
            object.Activity = dataItem.Activity;
            object.HargaBeli = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(dataItem.HargaBeli);
            object.HargaJual = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(dataItem.HargaJual);

            newData.push(object);
        });

        setStockAdjustmentRequestItemsData(newData);

        setDataLoading(false);
    };

    if (pid != undefined || fetchActive == true) {
        fetchStockAdjustmentRequestDetailData(pid);
        setFetchActive(false);
    }
  }, [pid, fetchActive]);

  useEffect(() => {
    const processApproveRequest = async (stockAdjustmentRequestID, statusUpdateBy, adjustDate, notes, warehouseID) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/stock/approvestockadjustmentrequest',
            data: {
                stockAdjustmentRequestID: stockAdjustmentRequestID,
                statusUpdateBy: statusUpdateBy,
                adjustDate: adjustDate,
                notes: notes,
                warehouseID: warehouseID
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("Adjustment berhasil diapprove");
            Router.push("/stock/adjustment");
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (approveActive == true) {
        if (window.confirm("Approve adjustment?") == false) {
            setApproveActive(false);
            return;
        } 

        let username = Cookies.get("username");
        let date = moment(adjustDate).format("YYYY-MM-DD");

        processApproveRequest(stockAdjustmentRequestID, username, date, notes, warehouseID);
        setApproveActive(false);
    }
  }, [approveActive]);

  useEffect(() => {
    const processRejectRequest = async (stockAdjustmentRequestID, statusUpdateBy, adjustDate, notes, warehouseID) => {
        setDataLoading(true);

        const result = await axios({
            method: 'put',
            url: 'https://api.ultige.com/ultigeapi/web/stock/rejectstockadjustmentrequest',
            data: {
                stockAdjustmentRequestID: stockAdjustmentRequestID,
                statusUpdateBy: statusUpdateBy,
                adjustDate: adjustDate,
                notes: notes,
                warehouseID: warehouseID
            }
        });

        let processedData;
        processedData = result.data;
        
        if (processedData.Status.Code == 200) {
            window.alert("Adjustment berhasil direject");
            Router.push("/stock/adjustment");
        }
        else {
            window.alert(processedData.Status.Message + "\nTerjadi kesalahan, mohon coba kembali atau hubungi administrator");
            setDataLoading(false);
        }
    };

    if (rejectActive == true) {
        if (window.confirm("Reject adjustment?") == false) {
            setRejectActive(false);
            return;
        } 

        let username = Cookies.get("username");
        let date = moment(adjustDate).format("YYYY-MM-DD");

        processRejectRequest(stockAdjustmentRequestID, username, date, notes, warehouseID);
        setRejectActive(false);
    }
  }, [rejectActive]);

  return (
    <>
      <Layout>
        <Grid container style={{padding: 5}}>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={8}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 5,
                                        marginTop: 5
                                    }}
                                >
                                    Detail Penyesuaian Stok
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Box className={classes.inlineReverse} style={{marginRight: 8}}>
                                    <Typography 
                                        style={{
                                            color: RequestStatusColor(requestStatusDescription),
                                            fontSize: 22,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {requestStatusDescription}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <GridComponent
                            dataSource={stockAdjustmentRequestItemsData}
                            allowSorting={true}
                            allowPaging={false}
                            pageSettings={{ pageSize: 50 }}
                            ref={(grid) => setGridInstance(grid)}
                            allowFiltering={true}
                            filterSettings={filterSettings}
                            height={290}
                            enableVirtualization={true}
                            resizeSettings={{mode: 'Normal'}} 
                            style={{margin: 5}}
                            queryCellInfo={CustomizeCell}
                            allowTextWrap={true}
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="StockAdjustmentItemDetailID"
                                    headerText="ID Stok"
                                    width="150"
                                />
                                <ColumnDirective
                                    field="StockName"
                                    headerText="Nama Stok"
                                    width="500"
                                />
                                <ColumnDirective
                                    field="Quantity"
                                    headerText="Jumlah"
                                    width="130"
                                    format="N0"
                                    textAlign="Center"
                                />
                                <ColumnDirective
                                    field="PackagingContentCount"
                                    headerText="Isi Bal"
                                    width="130"
                                    format="N0"
                                    textAlign="Center"
                                />
                                <ColumnDirective
                                    field="Activity"
                                    headerText="Aktivitas"
                                    width="130"
                                    textAlign="Center"
                                />
                                <ColumnDirective
                                    field="HargaBeli"
                                    headerText="Total COGS"
                                    width="150"
                                    format="#,##0.##"
                                    textAlign="Right"
                                />
                            </ColumnsDirective>
                            <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                        </GridComponent>
                    </Grid>
                    <Grid item xs={12}>
                        <Box className={classes.inlineReverse} style={{marginRight: 8}}>
                            <Typography 
                                style={{
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                    width: 190
                                }}
                            >
                                {totalCOGS}
                            </Typography>
                            <Typography 
                                style={{
                                    fontSize: 22,
                                    fontWeight: 'bold'
                                }}
                            >
                                TOTAL COGS:
                            </Typography>
                        </Box>   
                    </Grid>   
                </Paper>
            </Grid>
            <Grid container xs={12} sm={9}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid>
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
                                    Tgl. Adjust:
                                </Typography>
                                { requestStatus == 0 ?
                                    <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                                        <DatePicker
                                            inputFormat="dd/MM/yyyy"
                                            value={adjustDate}
                                            onChange={handleAdjustDateChange}
                                            renderInput={(props) => <TextField variant="outlined" margin="dense" size="small" style={{
                                                width: "100%",
                                                marginTop: 0,
                                                marginBottom: 0,
                                                padding: 0
                                            }} {...props} />}
                                            minDate={moment('01-01-2016').toDate()}
                                            maxDate={getCurrentTime().toDate()}
                                        />
                                    </LocalizationProvider> :
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
                                        value={adjustDate} 
                                    />
                                }
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
                                    Lokasi Warehouse:
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
                                    value={warehouseName} 
                                />
                            </Box>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
            { requestStatus == 0 &&
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5, marginBottom: 5}}>
                                <Box className={classes.inlineReverse} style={{marginTop: 7}}>
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
                        </Grid>
                    </Paper>
                </Grid>
            }
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
    </>
  );
}

export default StockAdjustmentRequestDetail;