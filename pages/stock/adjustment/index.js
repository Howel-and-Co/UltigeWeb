import FullScreenLayout from "../../../src/components/FullScreenLayout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import React, { useEffect, useRef } from 'react';
import useContainerDimensions from  "../../../src/utils/screen.js";
import axios from '../../../src/utils/axios';

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
    }
  };
});

const CustomizeCell = (args) => {
  if (args.column.field === "StatusDescription" && args.data && args.cell) {
    if (getValue('StatusDescription', args.data) == 'PENDING') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
    else if (getValue('StatusDescription', args.data) == 'REJECTED') {
      args.cell.style.backgroundColor = '#FF0000'
    }
    else if (getValue('StatusDescription', args.data) == 'APPROVED') {
      args.cell.style.backgroundColor = '#228B22'
    }
    else if (getValue('StatusDescription', args.data) == 'CANCELLED') {
      args.cell.style.backgroundColor = '#FFA500'
    }
    else if (getValue('StatusDescription', args.data) == 'PAID') {
      args.cell.style.backgroundColor = '#1E90FF'
    }
    else if (getValue('StatusDescription', args.data) == 'HALF PAID') {
      args.cell.style.backgroundColor = '#B0C4DE'
    }
  }
};

const Adjustment = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [fetchActive, setFetchActive] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [stockAdjustmentRequestData, setStockAdjustmentRequestData] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');
  const [recordClickIndex, setRecordClickIndex] = React.useState(-1);

  const [requestLimit, setRequestLimit] = React.useState(50);

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);
  
  const RowSelected = (props) => {
    let currentCount = 0;
    if (props.rowIndex != recordClickIndex) {
      setRecordClickIndex(props.rowIndex);
      currentCount = 1;
    }
    else {
      currentCount = 2;
    }

    if (currentCount == 2) {
      window.open(`/stock/adjustment/${props.rowData.StockAdjustmentRequestID}`, '_blank')
      //Router.push(`/stock/adjustment/${props.rowData.StockAdjustmentRequestID}`);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    gridInstance.search(e.target.value);
  }

  const handleRequestLimitChange = (e) => {
    setRequestLimit(e.target.value);
  }

  const handleResetFilter = () => {
    gridInstance.clearFiltering();
    gridInstance.clearSorting();
    gridInstance.search('');
    setSearchValue('');
  }

  const handleRefreshData = () => {
    setFetchActive(true);
  }

  useEffect(() => {
    const fetchStockAdjustmentRequestData = async (requestLimit) => {
      setDataLoading(true);

      const result = await axios.get(`http://localhost:5000/ultigeapi/web/stock/getstocksdjustmentrequests?requestLimit=${requestLimit}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.StockAdjustmentRequestID = dataItem.StockAdjustmentRequestID;
        object.Requestor = dataItem.Requestor;
        object.RequestDate = dataItem.RequestDate;
        object.AdjustDate = dataItem.AdjustDate;
        object.Notes = dataItem.Notes;
        object.StatusDescription = dataItem.StatusDescription;

        newData.push(object);
      });

      processedData.Data = newData;
      //console.log(newData);
      
      setStockAdjustmentRequestData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
      fetchStockAdjustmentRequestData(requestLimit);
      setFetchActive(false);
    }
  }, [fetchActive]);

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
                    List Adjustment Request
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
                          Jumlah<br/>Request:
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
                          Jumlah Request:
                        </Typography>
                    }
                    { isMobile
                      ? <TextField
                            variant="standard"
                            type="number"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
                                    e.preventDefault()
                                }
                            }}
                            style={{
                                fontSize: 16,
                                marginTop: 15,
                                width: 70
                            }}
                            value={requestLimit} 
                            onChange={handleRequestLimitChange}
                            inputProps={{ min: "0", max: "99999", step: "1" }}
                        />
                      : <TextField
                            variant="standard"
                            type="number"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+") {
                                    e.preventDefault()
                                }
                            }}
                            style={{
                                fontSize: 18,
                                marginTop: 10,
                                width: 70
                            }}
                            value={requestLimit} 
                            onChange={handleRequestLimitChange}
                            inputProps={{ min: "0", max: "99999", step: "1" }}
                        />
                    }
                  </Box>
                </Grid>

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
                        dataSource={stockAdjustmentRequestData && stockAdjustmentRequestData.Data}
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
                        recordClick={RowSelected}
                        queryCellInfo={CustomizeCell}
                        gridLines='Both'
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="StockAdjustmentRequestID"
                              headerText="Req. ID"
                              width="110"
                          />
                          <ColumnDirective
                              field="Requestor"
                              headerText="Requestor"
                              width="140"
                          />
                          <ColumnDirective
                              field="RequestDate"
                              headerText="Tgl. Req"
                              width="170"
                              type="date"
                              format="dd/MM/yyyy HH:mm:ss"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="AdjustDate"
                              headerText="Tgl. Adjust"
                              width="130"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Notes"
                              headerText="Catatan"
                              width="250"
                          />
                          <ColumnDirective
                              field="StatusDescription"
                              headerText="Status"
                              width="120"
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

export default Adjustment;