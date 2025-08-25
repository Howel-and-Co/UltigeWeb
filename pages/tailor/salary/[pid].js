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
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";

import React, { useEffect } from 'react';
import axios from '../../../src/utils/axios';
import Router from "next/router";
import { useRouter } from 'next/router';
import moment from '../../../src/utils/moment';

import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Sort,
    Filter,
    Inject,
    VirtualScroll,
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
    Aggregate
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

const PurchaseOrderDetail = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  const [fetchActive, setFetchActive] = React.useState(false);

  const [tailorSalaryItemsData, setTailorSalaryItemsData] = React.useState();
  const [tailorSalaryFineData, setTailorSalaryFineData] = React.useState();
  const [tailorSalaryNotes, setTailorSalaryNotes] = React.useState();


  const [tailorFullName, setTailorFullName] = React.useState('');
  const [feeDate, setFeeDate] = React.useState('');
  const [paymentStatus, setPaymentStatus] = React.useState('');
  const [invoiceStatus, setInvoiceStatus] = React.useState('');

  const [loadDataStatus, setLoadDataStatus] = React.useState('');
  const [loadDataStatusCode, setLoadDataStatusCode] = React.useState(0);

  const [extraFine, setExtraFineValue] = React.useState(0);
  const [extraBonus, setExtraBonusValue] = React.useState(0);
  const [subtotalJasa, setSubtotalJasaValue] = React.useState(0);
  const [subtotalDenda, setSubtotalDendaValue] = React.useState(0);
  const [subtotalBonus, setSubtotalBonusValue] = React.useState(0);
  const [totalBayar, setTotalBayarValue] = React.useState(0);
  const [tailorSalaryID, setTailorSalaryID] = React.useState(0);

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  useEffect(() => {
    const fetchTailorSalaryData = async (tailorSalaryID, userID) => {
        setDataLoading(true);

        const resultTailorSalary = await axios.get(`https://api.ultige.com/ultigeapi/web/tailor/gettailorsalary?tailorSalaryID=${tailorSalaryID}&userid=${userID}`);
        //const resultTailorSalary = await axios.get(`http://localhost:5000/ultigeapi/web/tailor/gettailorsalary?tailorSalaryID=${tailorSalaryID}&userid=${userID}`);

        let tailorSalaryProcessedData;
        tailorSalaryProcessedData = resultTailorSalary.data;

        // ✅ Cek apakah response valid dan punya property Data
        if (!tailorSalaryProcessedData || !tailorSalaryProcessedData.Data) {
            setLoadDataStatus(tailorSalaryProcessedData.Status.Message);
            setLoadDataStatusCode(tailorSalaryProcessedData.Status.Code);
            setDataLoading(false);
            return; // stop eksekusi biar gak error
        }

        //////
        let newData = new Array();
        tailorSalaryProcessedData.Data.TailorSalaryItems.forEach(function (dataItem) {
            let object = new Object();

            object.EmbroideryName = dataItem.EmbroideryName;
            object.StockCategoryName = dataItem.StockCategoryName;
            object.EmbroideryQuantity = dataItem.EmbroideryQuantity;
            object.EmbroideryFee = dataItem.EmbroideryFee;
            object.EmbroideryFeeTotal = dataItem.EmbroideryFeeTotal;

            newData.push(object);
        });
        setTailorSalaryItemsData(newData);

        // Untuk denda
        newData = new Array();
        tailorSalaryProcessedData.Data.TailorSalaryFine.forEach(function (dataItem) {
            let object = new Object();

            object.Notes = dataItem.Notes;
            object.EventDate = dataItem.EventDate;
            object.Fine = dataItem.Fine;
            object.ItemName = dataItem.ItemName;

            newData.push(object);
        });
        setTailorSalaryFineData(newData);

        // Untuk Detail
        newData = new Array();
        setTailorSalaryNotes(tailorSalaryProcessedData.Data.TailorSalaryDetail.Notes);
        setExtraFineValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tailorSalaryProcessedData.Data.TailorSalaryDetail.ExtraFine));
        setExtraBonusValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tailorSalaryProcessedData.Data.TailorSalaryDetail.ExtraBonus));
        setSubtotalDendaValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tailorSalaryProcessedData.Data.TailorSalaryDetail.SubtotalDenda));
        setSubtotalJasaValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tailorSalaryProcessedData.Data.TailorSalaryDetail.SubtotalJasa));
        setSubtotalBonusValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tailorSalaryProcessedData.Data.TailorSalaryDetail.SubtotalBonus));
        setTotalBayarValue("Rp " + Intl.NumberFormat('id', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tailorSalaryProcessedData.Data.TailorSalaryDetail.TotalBayar));

        setTailorFullName(tailorSalaryProcessedData.Data.TailorSalaryDetail.FullName);
        setFeeDate(tailorSalaryProcessedData.Data.TailorSalaryDetail.FeeDate);
        setPaymentStatus(tailorSalaryProcessedData.Data.TailorSalaryDetail.PaymentStatus);
        setInvoiceStatus(tailorSalaryProcessedData.Data.TailorSalaryDetail.InvoiceStatus);
        setTailorSalaryID(tailorSalaryID);

        /////
        setDataLoading(false);
    };

    if (pid != undefined || fetchActive == true) {
        let userID = Cookies.get("userid");  

        fetchTailorSalaryData(pid, userID);
        setFetchActive(false);
    }
  }, [pid, fetchActive]);



  return (
    <>
      <Layout>
        <Grid container style={{padding: 5}}>
            



            {loadDataStatusCode === 0 ? (
                <Grid container sm={12} md={12} lg={12}>
                    <Grid item xs={12} md={12} lg={12}>
                        
                        <Paper className={classes.paper} elevation={3} style={{ padding: 16}}>
                            <Grid container direction="column" spacing={2} xs={12} md={12} lg={12}>
                                {/* Baris 1: ID di tengah */}
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                <Typography
                                    style={{
                                    color: "#000",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    }}
                                >
                                    ID: {tailorSalaryID}
                                </Typography>
                                </Grid>

                                {/* Baris 2: 3 kolom */}
                                <Grid item xs={12}>
                                    <Grid container alignItems="center">
                                        {/* Nama di kiri */}
                                        <Grid item xs={12} md={3} lg={3}>
                                        <Typography
                                            style={{
                                            color: "#333",
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            }}
                                        >
                                            {tailorFullName}
                                        </Typography>
                                        </Grid>

                                        {/* Tanggal di tengah */}
                                        <Grid item xs={12} md={3} lg={3} style={{ textAlign: "left" }}>
                                        <Typography
                                            style={{
                                            color: "#555",
                                            fontSize: 16,
                                            }}
                                        >
                                            {feeDate}
                                        </Typography>
                                        </Grid>

                                        {/* Status di kanan */}
                                        <Grid item xs={12} md={3} lg={3} textAlign="left">
                                            <Grid container direction={isMobile ? "column" : "row"} justifyContent="flex-end" alignItems="left" spacing={1}>
                                                <Grid item>
                                                <Typography
                                                    sx={{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    color: "#555",
                                                    }}
                                                >
                                                    Status Invoice:
                                                </Typography>
                                                </Grid>
                                                <Grid item>
                                                <Typography
                                                    style={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    padding: "4px 12px",
                                                    borderRadius: 12,
                                                    display: "inline-block",
                                                    backgroundColor:
                                                        paymentStatus === "PAID"
                                                        ? "#0a11edff"
                                                        : paymentStatus === "PENDING"
                                                        ? "#e5ff00ff"
                                                        : "#f44336",
                                                    color: "#fff",
                                                    }}
                                                >
                                                    {invoiceStatus}
                                                </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>



                                        {/* Status di kanan */}
                                        <Grid item xs={12} md={3} lg={3} textAlign="left">
                                            <Grid container direction={isMobile ? "column" : "row"} justifyContent="flex-end" alignItems="left" spacing={1}>
                                                <Grid item>
                                                <Typography
                                                    sx={{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    color: "#555",
                                                    }}
                                                >
                                                    Status Bayar:
                                                </Typography>
                                                </Grid>
                                                <Grid item>
                                                <Typography
                                                    style={{
                                                    fontSize: 16,
                                                    fontWeight: "bold",
                                                    padding: "4px 12px",
                                                    borderRadius: 12,
                                                    display: "inline-block",
                                                    backgroundColor:
                                                        paymentStatus === "PAID"
                                                        ? "#0a11edff"
                                                        : paymentStatus === "PENDING"
                                                        ? "#e5ff00ff"
                                                        : "#f44336",
                                                    color: "#fff",
                                                    }}
                                                >
                                                    {paymentStatus}
                                                </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>



                    </Grid>
                    
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper className={classes.paper} elevation={3}>
                            <Grid container style={{height: 350}}>
                            <Grid item xs={12}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginLeft: 5,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        JASA BORDIR
                                    </Typography>
                                    {tailorSalaryItemsData && tailorSalaryItemsData.length > 0 ? (
                                    <GridComponent
                                        dataSource={tailorSalaryItemsData}
                                        allowSorting={true}
                                        allowPaging={false}
                                        pageSettings={{ pageSize: 50 }}
                                        ref={(grid) => setGridInstance(grid)}
                                        allowFiltering={true}
                                        filterSettings={filterSettings}
                                        height={220}
                                        enableVirtualization={true}
                                        resizeSettings={{mode: 'Normal'}} 
                                        style={{margin: 5}}
                                        allowTextWrap={true}
                                    >
                                        <ColumnsDirective>
                                            <ColumnDirective
                                                field="EmbroideryName"
                                                headerText="Bordir"
                                                width="150"
                                            />
                                            <ColumnDirective
                                                field="StockCategoryName"
                                                headerText="Kategori"
                                                width="150"
                                            />
                                            <ColumnDirective
                                                field="EmbroideryQuantity"
                                                headerText="Jumlah"
                                                width="150"
                                                textAlign="Right"
                                            />
                                            <ColumnDirective
                                                field="EmbroideryFee"
                                                headerText="Harga"
                                                width="170"
                                                format="#,##0.##"
                                                template={(props2) => (
                                                    <span>Rp {props2.EmbroideryFeeTotal.toLocaleString('id-ID')}</span>
                                                )}
                                                textAlign="Right"
                                            />
                                            <ColumnDirective
                                                field="EmbroideryFeeTotal"
                                                headerText="Total"
                                                width="170"
                                                format="#,##0.##"
                                                template={(props2) => (
                                                    <span>Rp {props2.EmbroideryFeeTotal.toLocaleString('id-ID')}</span>
                                                )}
                                                textAlign="Right"
                                            />
                                        </ColumnsDirective>

                                        <AggregatesDirective>
                                            <AggregateDirective>
                                                <AggregateColumnsDirective>
                                                    <AggregateColumnDirective
                                                    field="EmbroideryFeeTotal"
                                                    type="Sum"
                                                    format="N0"
                                                    footerTemplate={(props) => (
                                                        <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                            fontWeight: "bold",
                                                            fontSize: "15px",
                                                        }}
                                                        >
                                                        <span style={{ marginRight: "40px", letterSpacing: "1px" }}>
                                                            SUBTOTAL
                                                        </span>
                                                        <span style={{ minWidth: "120px", textAlign: "right" }}>
                                                            Rp {props.Sum.toLocaleString("id-ID")}
                                                        </span>
                                                        </div>
                                                    )}
                                                    />
                                                </AggregateColumnsDirective>
                                            </AggregateDirective>
                                        </AggregatesDirective>

                                        <Inject services={[Filter, Page, Sort, VirtualScroll, Aggregate]} />
                                    </GridComponent>
                                    ) : (
                                        <p>No records to display</p>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12}>
                        <Paper className={classes.paper} elevation={3}>
                            <Grid container style={{height: 350}}>
                            <Grid item xs={12}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginLeft: 5,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        DENDA
                                    </Typography>
                                    {tailorSalaryFineData && tailorSalaryFineData.length > 0 ? (
                                    <GridComponent
                                        dataSource={tailorSalaryFineData}
                                        allowSorting={true}
                                        allowPaging={false}
                                        pageSettings={{ pageSize: 50 }}
                                        ref={(grid) => setGridInstance(grid)}
                                        allowFiltering={true}
                                        filterSettings={filterSettings}
                                        height={220}
                                        enableVirtualization={true}
                                        resizeSettings={{mode: 'Normal'}} 
                                        style={{margin: 5}}
                                        allowTextWrap={true}
                                    >
                                        <ColumnsDirective>
                                            <ColumnDirective
                                                field="EventDate"
                                                headerText="Tgl"
                                                width="150"
                                            />
                                            <ColumnDirective
                                                field="Notes"
                                                headerText="Keterangan"
                                                width="150"
                                            />
                                            <ColumnDirective
                                                field="ItemName"
                                                headerText="Barang"
                                                width="250"
                                            />
                                            <ColumnDirective
                                                field="Fine"
                                                headerText="Denda"
                                                width="170"
                                                format="#,##0.##"
                                                template={(props2) => (
                                                    <span>Rp {props2.Fine.toLocaleString('id-ID')}</span>
                                                )}
                                                textAlign="Right"
                                            />
                                        </ColumnsDirective>

                                        <AggregatesDirective>
                                            <AggregateDirective>
                                                <AggregateColumnsDirective>
                                                    <AggregateColumnDirective
                                                    field="Fine"
                                                    type="Sum"
                                                    format="N0"
                                                    footerTemplate={(props) => (
                                                        <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                            fontWeight: "bold",
                                                            fontSize: "15px",
                                                        }}
                                                        >
                                                        <span style={{ marginRight: "40px", letterSpacing: "1px" }}>
                                                            SUBTOTAL
                                                        </span>
                                                        <span style={{ minWidth: "120px", textAlign: "right" }}>
                                                            Rp {props.Sum.toLocaleString("id-ID")}
                                                        </span>
                                                        </div>
                                                    )}
                                                    />
                                                </AggregateColumnsDirective>
                                            </AggregateDirective>
                                        </AggregatesDirective>

                                        <Inject services={[Filter, Page, Sort, VirtualScroll, Aggregate]} />
                                    </GridComponent>
                                    ) : (
                                        <p>No records to display</p>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                        <Paper className={classes.paper} elevation={3}>
                            <Grid container style={{height: 200}}>
                                <Grid item xs={12} style={{marginTop: 0}}>
                                    <Box className={classes.inline} style={{marginLeft: 5, marginRight: 5, marginBottom: 7, flexDirection: "column"}}>
                                        <Typography 
                                            style={{
                                                color: "#000", 
                                                fontSize: 18,
                                                marginTop: 0,
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
                                            minRows={6}
                                            maxRows={6}
                                            style={{
                                                width: "100%",
                                                marginTop: 0,
                                                marginBottom: 0,
                                                padding: 0
                                            }}
                                            value={tailorSalaryNotes} 
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper className={classes.paper} elevation={3}>
                            <Grid container spacing={0} style={{height: 300}}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography
                                            sx={{ color: "#000", fontSize: 16, minWidth: 150 }}
                                        >
                                            Subtotal Jasa:   
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            size="small"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            inputProps={{
                                                style: { textAlign: "right" } // ini yang bikin teks rata kanan
                                            }}
                                            style={{
                                                width: "95%",
                                                marginTop: 0,
                                                marginBottom: 4,
                                                marginLeft: 5,
                                                padding: 0
                                            }}
                                            value={subtotalJasa} 
                                        />
                                    </Box>
                                </Grid>  
                                <Grid item xs={12} md={12} lg={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography
                                            sx={{ color: "#000", fontSize: 16, minWidth: 150 }}
                                        >
                                            Subtotal Denda:   
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            size="small"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            inputProps={{
                                                style: { textAlign: "right" } // ini yang bikin teks rata kanan
                                            }}
                                            style={{
                                                width: "95%",
                                                marginTop: 0,
                                                marginBottom: 4,
                                                marginLeft: 5,
                                                padding: 0
                                            }}
                                            value={subtotalDenda} 
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography
                                            sx={{ color: "#000", fontSize: 16, minWidth: 150 }}
                                        >
                                            Denda Tambahan:   
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            size="small"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            inputProps={{
                                                style: { textAlign: "right" } // ini yang bikin teks rata kanan
                                            }}
                                            style={{
                                                width: "95%",
                                                marginTop: 0,
                                                marginBottom: 4,
                                                marginLeft: 5,
                                                padding: 0
                                            }}
                                            value={extraFine} 
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography
                                            sx={{ color: "#000", fontSize: 16, minWidth: 150 }}
                                        >
                                            Subtotal Bonus:   
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            size="small"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            inputProps={{
                                                style: { textAlign: "right" } // ini yang bikin teks rata kanan
                                            }}
                                            style={{
                                                width: "95%",
                                                marginTop: 0,
                                                marginBottom: 4,
                                                marginLeft: 5,
                                                padding: 0
                                            }}
                                            value={subtotalBonus} 
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography
                                            sx={{ color: "#000", fontSize: 16, minWidth: 150 }}
                                        >
                                            Bonus Tambahan:   
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            size="small"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            inputProps={{
                                                style: { textAlign: "right" } // ini yang bikin teks rata kanan
                                            }}
                                            style={{
                                                width: "95%",
                                                marginTop: 0,
                                                marginBottom: 4,
                                                marginLeft: 5,
                                                padding: 0
                                            }}
                                            value={extraBonus} 
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography
                                            sx={{ color: "#000", fontSize: 16, minWidth: 150 }}
                                            fontWeight={"bold"}
                                        >
                                            TOTAL BAYAR:   
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            margin="dense"
                                            size="small"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            inputProps={{
                                                style: { textAlign: "right" } // ini yang bikin teks rata kanan
                                            }}
                                            style={{
                                                width: "95%",
                                                marginTop: 0,
                                                marginBottom: 4,
                                                marginLeft: 5,
                                                padding: 0
                                            }}
                                            value={totalBayar} 
                                        />
                                    </Box>
                                </Grid>                        
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            ):(
                <Grid container sm={12} md={12} lg={12}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper className={classes.paper} elevation={3}>
                            <Grid container style={{height: 110}}>
                            <Grid item xs={12}>
                                    <Typography 
                                        align="center"
                                        style={{
                                            color: "#000", 
                                            fontSize: 24,
                                            marginLeft: 5,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {loadDataStatus}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}
            



            {/* <Grid container sm={12} md={7} lg={12}>
                <Grid item md={12} lg={6} style={{marginBottom: isTablet ? 10 : isLaptop ? 0 : statusDescription == "CANCELLED" ? 310 : 0}}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: isMobile ? 250 : 170}}>
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
                            <Grid item xs={8} sm={4} lg={3}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginLeft: 5
                                    }}
                                >
                                    Subtotal Jasa:
                                </Typography>
                            </Grid>    
                            <Grid item xs={4} sm={2} lg={3} container justifyContent="flex-end">
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginRight: 10,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {subtotalJasa}
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
                                    Subtotal Denda:
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
                                    {subtotalDenda}
                                </Typography>
                            </Grid>
                            <Grid item xs={8} sm={4} lg={3}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginLeft: 5
                                    }}
                                >
                                    Subtotal Bonus:
                                </Typography>
                            </Grid>    
                            <Grid item xs={4} sm={2} lg={3} container justifyContent="flex-end">
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginRight: 10,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {subtotalBonus}
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
                                    Denda Tambahan:
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
                                    {extraFine}
                                </Typography>
                            </Grid>

                            <Grid item xs={8} sm={4} lg={3}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginLeft: 5
                                    }}
                                >
                                    Bonus Tambahan:
                                </Typography>
                            </Grid>    
                            <Grid item xs={4} sm={2} lg={3} container justifyContent="flex-end">
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginRight: 10,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {extraBonus}
                                </Typography>
                            </Grid>

                            <Grid item xs={8} sm={4} lg={3}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginLeft: 5
                                    }}
                                >
                                    Total Bayar:
                                </Typography>
                            </Grid>    
                            <Grid item xs={4} sm={2} lg={3} container justifyContent="flex-end">
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        marginRight: 10,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {totalBayar}
                                </Typography>
                            </Grid>  
                        </Grid>
                    </Paper>
                </Grid>
            </Grid> */}
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

export default PurchaseOrderDetail;