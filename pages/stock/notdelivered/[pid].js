import Layout from "../../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useRef } from 'react';
import useContainerDimensions from  "../../../src/utils/screen.js";
import axios from '../../../src/utils/axios';
import { useRouter } from 'next/router';

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
    }
  };
});

const TransactionCountColumnTemplate = (props) => {
  return (<span>{props.Count} baris</span>);
};

const QuantitySumColumnTemplate = (props) => {
  return (<span>{props.Sum} produk</span>);
};

const StockNotDelivered = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  moment.locale('id');

  const [stockNotDeliveredData, setStockNotDeliveredData] = React.useState();
  const [stockID, setStockID] = React.useState();
  const [stockName, setStockName] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);


  useEffect(() => {
    const fetchStockName = async (stockID) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstockname?stockID=${stockID}`);

      let processedData;
      processedData = result.data;
      
      setStockName(processedData.Data.Name);
      
      setDataLoading(false);
    };

    const fetchStockNotDeliveredData = async (stockID) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstocknotdelivered?stockID=${stockID}`);

      let processedData;
      processedData = result.data;

      //console.log(result.data);

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.TransactionID = dataItem.TransactionID;
				object.DropshipID = dataItem.DropshipID;
				object.TransactionName = dataItem.TransactionName;
				object.TransactionPhone = dataItem.TransactionPhone;
        object.StatusDescription = dataItem.StatusDescription;
				object.ProductName = dataItem.ProductName;
				object.ProductQuantity = dataItem.ProductQuantity;
				object.ProcessDuration = dataItem.ProcessDuration;
        object.IsPendingDescription = dataItem.IsPendingDescription;
				object.ImportanceDate = dataItem.ImportanceDate;
				object.OrderDate = dataItem.OrderDate;

        newData.push(object);
      });

      processedData.Data = newData;
      //console.log(result.data);
      
      setStockNotDeliveredData(processedData);
      setDataLoading(false);
    };

    if (pid != undefined) {
      setStockID(pid);
      fetchStockName(pid);
      fetchStockNotDeliveredData(pid);
    }
  }, [pid]);

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
                    Transaksi Belum Terkirim untuk [{stockID}] {stockName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                    <GridComponent
                        dataSource={stockNotDeliveredData && stockNotDeliveredData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={height - (isMobile ? 450 : 400)}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="TransactionID"
                              headerText="Trx. ID"
                              width="120"
                          />
                          <ColumnDirective
                              field="DropshipID"
                              headerText="Dropship"
                              width="150"
                          />
                          <ColumnDirective
                              field="TransactionName"
                              headerText="Nama"
                              width="200"
                          />
                          <ColumnDirective
                              field="TransactionPhone"
                              headerText="No. HP"
                              width="150"
                          />
                          <ColumnDirective
                              field="StatusDescription"
                              headerText="Status"
                              width="150"
                          />
                          <ColumnDirective
                              field="ProductQuantity"
                              headerText="Jumlah"
                              width="130"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="ProcessDuration"
                              headerText="Durasi Proses (Hari)"
                              width="200"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="IsPendingDescription"
                              headerText="Pending"
                              width="150"
                          />
                          <ColumnDirective
                              field="ImportanceDate"
                              headerText="Tgl. Penting"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="OrderDate"
                              headerText="Tgl. Order"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                        </ColumnsDirective>
                        <AggregatesDirective>
                          <AggregateDirective>
                            <AggregateColumnsDirective>
                              <AggregateColumnDirective field='TransactionID' type='Count' footerTemplate={TransactionCountColumnTemplate}/>
                              <AggregateColumnDirective field='ProductQuantity' type='Sum' footerTemplate={QuantitySumColumnTemplate}/>
                            </AggregateColumnsDirective>
                          </AggregateDirective>
                        </AggregatesDirective>
                        <Inject services={[Filter, Page, Sort, VirtualScroll, Aggregate]} />
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

export default StockNotDelivered;