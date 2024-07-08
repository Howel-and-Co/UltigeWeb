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
  DialogTitle,
  IconButton,
  AppBar,
  Toolbar,
  Slide
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MomentUtils from '@date-io/moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import moment from '../../src/utils/moment';
import { getCurrentTime } from '../../src/utils/momentSystem';
import Cookies from "js-cookie";


import React, { useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';
import CloseIcon from '@mui/icons-material/Close';

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

import { Invoice, Page as PdfPage, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `/js/pdf.worker.min.js`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

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

const CustomizeCell = (args) => {
  if (args.column.field === "PayStatusDescription" && args.data && args.cell) {
    if (getValue('PayStatusDescription', args.data) == 'PENDING') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
    else if (getValue('PayStatusDescription', args.data) == 'REJECTED') {
      args.cell.style.backgroundColor = '#FF0000'
    }
    else if (getValue('PayStatusDescription', args.data) == 'APPROVED') {
      args.cell.style.backgroundColor = '#228B22'
    }
    else if (getValue('PayStatusDescription', args.data) == 'CANCELLED') {
      args.cell.style.backgroundColor = '#FFA500'
    }
    else if (getValue('PayStatusDescription', args.data) == 'PAID') {
      args.cell.style.backgroundColor = '#1E90FF'
    }
  }


  if (args.column.field === "ApprovalStatusDescription" && args.data && args.cell) {
    if (getValue('ApprovalStatusDescription', args.data) == 'TIDAK') {
      args.cell.style.backgroundColor = '#FF0000'
    }
    else if (getValue('ApprovalStatusDescription', args.data) == 'YA') {
      args.cell.style.backgroundColor = '#228B22'
    }
  }
};

const TailorSalary = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [fetchActive, setFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [tailorSalaryData, setTailorSalaryData] = React.useState();
  const [tailorSalaryPaymentData, setTailorSalaryPaymentData] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');

  const [tailorSalaryStartDate, setTailorSalaryStartDate] = React.useState(getCurrentTime());
  const [tailorSalaryEndDate, setTailorSalaryEndDate] = React.useState(getCurrentTime());
  const [tailorSalaryPaymentDate, setTailorSalaryPaymentDate] = React.useState(getCurrentTime());

  const [open, setOpen] = React.useState(false);
  const [paymentFetchActive, setPaymentFetchActive] = React.useState(false);
  const [paymentDataLoading, setPaymentDataLoading] = React.useState(false);

  const [invoiceTitle, setInvoiceTitle] = React.useState();
  const [invoicePath, setInvoicePath] = React.useState();
  const [invoiceFile, setInvoiceFile] = React.useState();
  const [fileFetchActive, setFileFetchActive] = React.useState(false);

  const handleTailorSalaryStartDateChange = (date) => {
    setTailorSalaryStartDate(date);
  };

  const handleTailorSalaryEndDateChange = (date) => {
    setTailorSalaryEndDate(date);
  };

  const handleTailorSalaryPaymentDateChange = (date) => {
    setTailorSalaryPaymentDate(date);
  };

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

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

  const handleSalaryPayment = () => {
    setOpen(true);
  }

  const handleRefreshData = () => {
    setFetchActive(true);
  }

  const handleRefreshPaymentData = () => {
    setPaymentFetchActive(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const RowSelected = (props) => {
    setInvoiceTitle("Nota Pembayaran " + props.data.RequestDate);
    setInvoicePath(props.data.InvoicePath);
    setFileFetchActive(true);
  };


  useEffect(() => {
    const fetchTailorSalaryData = async (startDate, endDate, tailorName) => {
      setDataLoading(true);

      const result = await axios({
        method: 'post',
        url: 'https://api.ultige.com/ultigeapi/web/tailor/gettailorsalary',
        data: {
          startDate: startDate,
          endDate: endDate,
          tailorName: tailorName
        }
      });

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.TailorSalaryID = dataItem.TailorSalaryID;
				object.TailorID = dataItem.TailorID;
				object.FullName = dataItem.FullName;
				object.FeeDate = dataItem.FeeDate;
				object.EmbroideryFee = Intl.NumberFormat('id').format(dataItem.EmbroideryFee);
        object.FineTotal = Intl.NumberFormat('id').format(dataItem.FineTotal);
        object.BonusTotal = Intl.NumberFormat('id').format(dataItem.BonusTotal);
        object.Total = Intl.NumberFormat('id').format(dataItem.Total);
				object.PayDate = dataItem.PayDate;
				object.PayStatus = dataItem.PayStatus;
				object.PayStatusDescription = dataItem.PayStatusDescription;
				object.ApprovalStatusDescription = dataItem.ApprovalStatusDescription;

        newData.push(object);
      });

      processedData.Data = newData;
      console.log(newData);
      
      setTailorSalaryData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
    
      let startDate;
      startDate = moment(tailorSalaryStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(tailorSalaryEndDate).format("YYYY-MM-DD");

      let username = Cookies.get("username");

      fetchTailorSalaryData(startDate, endDate, "BENI");
      setFetchActive(false);
    }
  }, [fetchActive]);

  useEffect(() => {
    const fetchTailorSalaryPaymentData = async (paymentDate, tailorName) => {
      setPaymentDataLoading(true);

      const result = await axios({
        method: 'post',
        url: 'https://api.ultige.com/ultigeapi/web/tailor/gettailorsalarypayment',
        data: {
          endDate: paymentDate,
          tailorName: tailorName
        }
      });

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.TransferRequestID = dataItem.TransferRequestID;
				object.FullName = dataItem.FullName;
				object.RequestDate = dataItem.RequestDate;
				object.RequestValue = Intl.NumberFormat('id').format(dataItem.RequestValue);
        object.InvoicePath = dataItem.InvoicePath;

        newData.push(object);
      });

      processedData.Data = newData;
      console.log(newData);
      
      setTailorSalaryPaymentData(processedData);
      setPaymentDataLoading(false);
    };

    if (paymentFetchActive == true) {
      let paymentDate;
      paymentDate = moment(tailorSalaryPaymentDate).format("YYYY-MM-DD");

      let username = Cookies.get("username");

      fetchTailorSalaryPaymentData(paymentDate, "BENI");
      setPaymentFetchActive(false);
    }
  }, [paymentFetchActive]);

  useEffect(() => {
    const fetchInvoiceFile = async (invoicePath) => {
      setPaymentDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/tailor/getinvoicefile?invoicePath=${invoicePath}`);

      let processedData;
      processedData = result.data;
      
      setPaymentDataLoading(false);

      var byteCharacters = atob(processedData.Data);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      //handleInvoiceOpen();
    };

    if (fileFetchActive == true) {
      fetchInvoiceFile(invoicePath);
      setFileFetchActive(false);
    }
  }, [fileFetchActive]);

  return (
    <div ref={componentRef}>
      <FullScreenLayout>
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
                      Nota Pekerjaan Harian
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
                    { !isMobile && 
                      <Typography 
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
                    { !isMobile && 
                      <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="Start Date"
                          value={tailorSalaryStartDate}
                          onChange={handleTailorSalaryStartDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginRight: 10, minWidth: 150, width: 150}} {...props} />}
                          minDate={moment('01-01-2016').toDate()}
                          maxDate={getCurrentTime().toDate()}
                        />
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="End Date"
                          value={tailorSalaryEndDate}
                          onChange={handleTailorSalaryEndDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{minWidth: 150, width: 150}} {...props} />}
                          minDate={moment('01-01-2016').toDate()}
                          maxDate={getCurrentTime().toDate()}
                        />
                      </LocalizationProvider>
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
                      <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="Start Date"
                          value={tailorSalaryStartDate}
                          onChange={handleTailorSalaryStartDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, minWidth: 150, width: 150}} {...props} />}
                          minDate={moment('01-01-2016').toDate()}
                          maxDate={getCurrentTime().toDate()}
                        />
                      </LocalizationProvider>
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
                      <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="End Date"
                          value={tailorSalaryEndDate}
                          onChange={handleTailorSalaryEndDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, minWidth: 150, width: 150}} {...props} />}
                          minDate={moment('01-01-2016').toDate()}
                          maxDate={getCurrentTime().toDate()}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                }        

                <Grid item xs={12} md={4} container justifyContent="flex-end">
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
                      onClick={() => handleSalaryPayment()}
                  >
                      Nota Pembayaran
                  </Button>
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
                        color: "#FFFFFF",
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
                        dataSource={tailorSalaryData && tailorSalaryData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={height - (isMobile ? 380 : 330)}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                        queryCellInfo={CustomizeCell}
                        gridLines='Both'
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="FullName"
                              headerText="Name"
                              width="120"
                          />
                          <ColumnDirective
                              field="FeeDate"
                              headerText="Confirmed"
                              width="150"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="EmbroideryFee"
                              headerText="Fee"
                              width="130"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="FineTotal"
                              headerText="Fine"
                              width="130"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="BonusTotal"
                              headerText="Bonus"
                              width="130"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Total"
                              headerText="Total"
                              width="130"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="PayDate"
                              headerText="Paid"
                              width="120"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="PayStatusDescription"
                              headerText="Status Byr."
                              width="140"
                          />
                          <ColumnDirective
                              field="ApprovalStatusDescription"
                              headerText="OPS Approval"
                              width="140"
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
      </FullScreenLayout>

      <Dialog 
        fullScreen={isMobile} 
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          { isMobile &&
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              style={{ backgroundColor: 'transparent', marginBottom: 4 }}>   
              <CloseIcon />
            </IconButton>
          }
          Nota Pembayaran
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} sm={5}>
              <Box className={classes.inline}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    marginTop: 12,
                    marginBottom: 25,
                    marginRight: 20
                  }}
                >
                  Bulan
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                  <DatePicker
                    views={['year', 'month']}
                    inputFormat="yyyy-MM"
                    label="Month"
                    value={tailorSalaryPaymentDate}
                    onChange={handleTailorSalaryPaymentDateChange}
                    renderInput={(props) => <TextField variant="standard" style={{marginRight: 10, minWidth: 150, width: 150}} {...props} />}
                    minDate={moment('01-01-2016').toDate()}
                    maxDate={getCurrentTime().toDate()}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>
            <Grid item xs={12} sm={7} container justifyContent="flex-end">
              <Button 
                  variant="outlined"
                  style={{
                      borderRadius: 4,
                      textTransform: "none",
                      marginTop: 10,
                      marginBottom: 10,
                      height: 40
                  }}
                  disableRipple
                  disableElevation
                  onClick={() => handleRefreshPaymentData()}
              >
                  Refresh Data
              </Button>
            </Grid>
          </Grid>
          <GridComponent
            dataSource={tailorSalaryPaymentData && tailorSalaryPaymentData.Data}
            allowSorting={true}
            allowPaging={false}
            pageSettings={{ pageSize: 50 }}
            ref={(grid) => setGridInstance(grid)}
            allowFiltering={true}
            filterSettings={filterSettings}
            height={height - (isMobile ? 450 : 400)}
            enableVirtualization={true}
            resizeSettings={{mode: 'Normal'}}
            style={{marginBottom: 20}}
            allowTextWrap={true}
            rowSelected={RowSelected}
          >
            <ColumnsDirective>
              <ColumnDirective
                  field="RequestDate"
                  headerText="Tanggal"
                  width="140"
                  type="date"
                  format="dd/MM/yyyy"
              />
              <ColumnDirective
                  field="RequestValue"
                  headerText="Nilai"
                  minWidth="140"
                  format="#,##0.##"
                  textAlign="Right"
              />
            </ColumnsDirective>
            <Inject services={[Filter, Page, Sort, VirtualScroll]} />
          </GridComponent>
          { paymentDataLoading &&
            <Box className={classes.inline} style={{marginLeft: 5, marginBottom: 20}}>
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

export default TailorSalary;