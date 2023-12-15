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
  AppBar,
  Toolbar,
  IconButton,
  Slide
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import React, { useState, useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';
import Cookies from "js-cookie";

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

import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `/js/pdf.worker.min.js`;

import CloseIcon from '@mui/icons-material/Close';
import { checkToken } from "../../src/utils/config";

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

const SOP = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [fetchActive, setFetchActive] = React.useState(true);
  const [fileFetchActive, setFileFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(true);

  const [documentData, setDocumentData] = React.useState();

  const [documentTitle, setDocumentTitle] = React.useState();
  const [documentPath, setDocumentPath] = React.useState();
  const [documentFile, setDocumentFile] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [format, setFormat] = React.useState({ type: 'datetime', format: 'dd/MM/yyyy HH:mm:ss' });
  const [gridInstance, setGridInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  const [open, setOpen] = React.useState(false);

  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const RowSelected = (props) => {
    setDocumentTitle(props.data.DocumentTitle);
    setDocumentPath(props.data.DocumentPath);
    setFileFetchActive(true);
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

  useEffect(() => {
    const fetchDocumentData = async () => {
      let role = Cookies.get("role");
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/sop/getdocuments?userRole=${role}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.DocumentSharingID = dataItem.DocumentSharingID;
        object.DocumentTitle = dataItem.DocumentTitle;
        object.DocumentNumber = dataItem.DocumentNumber;
        object.DocumentType = dataItem.DocumentType;
        object.AddDate = dataItem.AddDate;
        object.AddOperatorUsername = dataItem.AddOperatorUsername;
        object.LastUpdateOperatorUsername = dataItem.LastUpdateOperatorUsername;
        object.LastUpdateDate = dataItem.LastUpdateDate;
        object.DocumentPath = dataItem.DocumentPath;

        newData.push(object);
      });

      processedData.Data = newData;
      
      setDocumentData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true && checkToken()) {
      fetchDocumentData();
      setFetchActive(false);
    }
  }, [fetchActive]);

  useEffect(() => {
    const fetchDocumentFile = async (documentPath) => {
      setDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/sop/getdocumentfile?documentPath=${documentPath}`);

      let processedData;
      processedData = result.data;
      
      setDocumentFile(`data:application/pdf;base64,${processedData.Data}`);
      setDataLoading(false);

      handleClickOpen();
    };

    if (fileFetchActive == true && checkToken()) {
      fetchDocumentFile(documentPath);
      setFileFetchActive(false);
    }
  }, [fileFetchActive]);

  return (
    <div ref={componentRef}>
      <Layout>
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
                    List Dokumen
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
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
                        <TextField label="Search" variant="outlined" size="small" style={{marginTop: 4, marginLeft: 8, width: 300, marginRight: 10}} value={searchValue} onChange={handleChange}/>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} container justifyContent="flex-end">
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
                        dataSource={documentData && documentData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={height - (isMobile ? 430 : 370)}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                        rowSelected={RowSelected}
                    >
                        <ColumnsDirective>
                            <ColumnDirective
                                field="DocumentTitle"
                                headerText="Dokumen"
                                width="300"
                            ></ColumnDirective>
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

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: 'fixed', background: '#ffffff', color: '#000', borderBottom: '1.5px solid #e4e4e4' }} elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              style={{ backgroundColor: 'transparent' }}
              size="large">   
              <CloseIcon />
            </IconButton>
            <Typography style={{ marginLeft: 10, flex: 1 }} variant="h6" component="div">
              {documentTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        { documentFile && 
          <Document
            file={documentFile}
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

export default SOP;