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
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import React, { useEffect, useRef } from 'react';
import useContainerDimensions from  "../../src/utils/screen.js";
import axios from '../../src/utils/axios';

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
    AggregatesDirective,
    ContextMenu
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
  if (args.column.field === "IsActiveDescription" && args.data && args.cell) {
    if (getValue('IsActiveDescription', args.data) == 'AKTIF') {
      args.cell.style.backgroundColor = '#3CB371'
    }
    else if (getValue('IsActiveDescription', args.data) == 'NON-AKTIF') {
      args.cell.style.backgroundColor = '#DC143C'
    }
  }


  if (args.column.field === "ProductMovement" && args.data && args.cell) {
    if (getValue('ProductMovement', args.data) == 'New Arrival') {
      args.cell.style.backgroundColor = '#87CEFA'
    }
    else if (getValue('ProductMovement', args.data) == 'Fast Moving') {
      args.cell.style.backgroundColor = '#3CB371'
    }
    else if (getValue('ProductMovement', args.data) == 'Middle Moving') {
      args.cell.style.backgroundColor = '#FFFF00'
    }
    else if (getValue('ProductMovement', args.data) == 'Slow Moving') {
      args.cell.style.backgroundColor = '#FFA500'
    }
    else if (getValue('ProductMovement', args.data) == 'Super Slow Moving') {
      args.cell.style.backgroundColor = '#DC143C'
    }
  }
};

const StockCountColumnTemplate = (props) => {
  return (<span>{props.Count} stok</span>);
};

const PriceColumnTemplate = (props) => {
  return (<span>Rp {Intl.NumberFormat('id', { maximumFractionDigits: 2 }).format(props.Sum)}</span>);
};

const Stock = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchActive, setFetchActive] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(false);

  const [stockData, setStockData] = React.useState();
  const [status, setStatus] = React.useState('STOK AKTIF');
  const [statusList, setStatusList] = React.useState(['STOK AKTIF', 'STOK NON-AKTIF', 'SEMUA']);

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');

  const [open, setOpen] = React.useState(false);
  const [stockRelatedProductsData, setStockRelatedProductsData] = React.useState();
  const [stockID, setStockID] = React.useState(0);
  const [stockName, setStockName] = React.useState("");
  const [relatedFetchActive, setRelatedFetchActive] = React.useState(false);
  const [relatedDataLoading, setRelatedDataLoading] = React.useState(false);

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

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleRefreshData = () => {
    setFetchActive(true);
  }

  const handleClose = () => {
    setOpen(false);
    setStockID(0);
    setStockName("");
    setStockRelatedProductsData(null);
  }

  const contextMenuItems = [
    { text: 'Detil Stok', target: '.e-content', id: 'stockDetail' },
    { text: 'Produk Terhubung', target: '.e-content', id: 'stockRelatedProducts' },
    { text: 'Kartu Stok', target: '.e-content', id: 'stockCard' },
    { text: 'Transaksi Non-Delivered', target: '.e-content', id: 'stockNotDelivered' }
  ];

  const contextMenuClick = (args) => {
    if (gridInstance) {
      if (args.item.id === 'stockDetail') {
        window.open(`/stock/detail/${args.rowInfo.rowData.StockID}`, '_blank');
      }
      else if (args.item.id === 'stockRelatedProducts') {
        setStockID(args.rowInfo.rowData.StockID);
        setStockName(args.rowInfo.rowData.Name);
        setRelatedFetchActive(true);
        setOpen(true);
      }
      else if (args.item.id === 'stockCard') {
        window.open(`/stock/card/${args.rowInfo.rowData.StockID}`, '_blank');
      }
      else if (args.item.id === 'stockNotDelivered') {
        window.open(`/stock/notdelivered/${args.rowInfo.rowData.StockID}`, '_blank');
      }
    }
  };

  useEffect(() => {
    const fetchStockData = async (status) => {
      setDataLoading(true);

      let statusIndex = 1;
      if (status == "STOK NON-AKTIF") {
        statusIndex = 0;
      }
      else if (status == "SEMUA") {
        statusIndex = 2;
      }

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstocks?status=${statusIndex}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.StockID = dataItem.StockID;
				object.IsActive = dataItem.IsActive;
				object.IsActiveDescription = dataItem.IsActiveDescription;
				object.Name = dataItem.Name;
				object.StockAlternativeName = dataItem.StockAlternativeName;
				object.Quantity = dataItem.Quantity;
				object.StockUnitTitle = dataItem.StockUnitTitle;
				object.POQuantity = dataItem.POQuantity;
				object.SalesQuantity = dataItem.SalesQuantity;
				object.DOQuantity = dataItem.DOQuantity;
				object.SellThru = dataItem.SellThru;
				object.StockCategoryID = dataItem.StockCategoryID;
				object.Tier1Category = dataItem.Tier1Category;
				object.Tier2Category = dataItem.Tier2Category;
				object.Tier3Category = dataItem.Tier3Category;
				object.StockModelName = dataItem.StockModelName;
				object.StockMaterial = dataItem.StockMaterial;
				object.StockColor = dataItem.StockColor;
				object.StockSize = dataItem.StockSize;
				object.VendorName = dataItem.VendorName;
				object.StockSellPrice = Intl.NumberFormat('id').format(dataItem.StockSellPrice);
				object.TotalStockSellPrice = dataItem.TotalStockSellPrice;
				object.PurchaseOrderPrice = dataItem.PurchaseOrderPrice;
				object.COGSUnitPrice = dataItem.COGSUnitPrice;
				object.COGSPrice = dataItem.COGSPrice;
				object.Alias = dataItem.Alias;
				object.DefaultCustomizationColor = dataItem.DefaultCustomizationColor;
				object.IsDeleted = dataItem.IsDeleted;
				object.StockDays = dataItem.StockDays;
				object.StockAging = dataItem.StockAging;
				object.ProductMovement = dataItem.ProductMovement;
				object.LaunchDate = dataItem.LaunchDate;
				object.IncomingDeliveryOrderDate = dataItem.IncomingDeliveryOrderDate;
        object.StockDays2 = dataItem.StockDays2;
				object.StockSold90Days = dataItem.StockSold90Days;

        newData.push(object);
      });

      processedData.Data = newData;
      //console.log(newData);
      
      setStockData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
      fetchStockData(status);
      setFetchActive(false);
    }
  }, [fetchActive]);

  useEffect(() => {
    const fetchStockRelatedProductsData = async (stockID) => {
      setRelatedDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstockrelatedproducts?stockID=${stockID}`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.Name = dataItem.Name;

        newData.push(object);
      });

      processedData.Data = newData;
      
      setStockRelatedProductsData(processedData);
      setRelatedDataLoading(false);
    };

    if (relatedFetchActive == true) {
      fetchStockRelatedProductsData(stockID);
      setRelatedFetchActive(false);
    }
  }, [relatedFetchActive]);

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
                    List Stok
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7} container justifyContent="flex-end">
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
                      <TextField label="Search" variant="outlined" size="small" style={{marginTop: 4, marginLeft: 25, width: 283, marginRight: 10}} value={searchValue} onChange={handleChange}/>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.inline}>
                    <Typography 
                      style={{
                          color: "#000", 
                          fontSize: 18,
                          margin: 10
                      }}
                    >
                        Status
                    </Typography>
                    <FormControl variant="outlined" style={{marginTop: 4, marginLeft: 8, marginRight: 10, display: "flex", flexDirection: "row"}}>
                      <InputLabel>Status</InputLabel>
                        <Select
                          value={status}
                          onChange={handleStatusChange}
                          style={{width: 283, height: 40}}
                          label="Status"
                          classes={{ root: classes.selectRoot }}
                        >
                          {statusList && statusList.map((item, index) => (
                            <MenuItem disableRipple value={item} key={index}>{item}</MenuItem>
                          ))}
                        </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent="flex-end">
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
                        color: "#FFFFFF"
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
                        dataSource={stockData && stockData.Data}
                        allowSorting={true}
                        allowPaging={false}
                        pageSettings={{ pageSize: 50 }}
                        ref={(grid) => setGridInstance(grid)}
                        allowFiltering={true}
                        filterSettings={filterSettings}
                        height={height - (isMobile ? 410 : 360)}
                        enableVirtualization={true}
                        resizeSettings={{mode: 'Normal'}}
                        style={{margin: 10}}
                        allowTextWrap={true}
                        contextMenuItems={contextMenuItems}
                        contextMenuClick={contextMenuClick}
                        queryCellInfo={CustomizeCell}
                        gridLines='Both'
                    >
                        <ColumnsDirective>
                          <ColumnDirective
                              field="StockID"
                              headerText="ID"
                              width="100"
                          />
                          <ColumnDirective
                              field="IsActiveDescription"
                              headerText="Status Aktif"
                              width="120"
                          />
                          <ColumnDirective
                              field="Name"
                              headerText="Stok"
                              width="280"
                          />
                          <ColumnDirective
                              field="StockAlternativeName"
                              headerText="Nama Alternative"
                              width="280"
                          />
                          <ColumnDirective
                              field="Quantity"
                              headerText="Qty"
                              width="110"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="StockUnitTitle"
                              headerText="Satuan"
                              width="120"
                          />
                          <ColumnDirective
                              field="POQuantity"
                              headerText="Qty PO"
                              width="110"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="SalesQuantity"
                              headerText="Sales Qty"
                              width="110"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="DOQuantity"
                              headerText="DO Qty"
                              width="110"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="SellThru"
                              headerText="ST%"
                              width="110"
                              format="P2"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="Tier1Category"
                              headerText="Kategori 1"
                              width="200"
                          />
                          <ColumnDirective
                              field="Tier2Category"
                              headerText="Kategori 2"
                              width="200"
                          />
                          <ColumnDirective
                              field="Tier3Category"
                              headerText="Kategori 3"
                              width="200"
                          />
                          <ColumnDirective
                              field="StockModelName"
                              headerText="Model"
                              width="200"
                          />
                          <ColumnDirective
                              field="StockMaterial"
                              headerText="Material"
                              width="200"
                          />
                          <ColumnDirective
                              field="StockColor"
                              headerText="Warna"
                              width="160"
                          />
                          <ColumnDirective
                              field="StockSize"
                              headerText="Ukuran"
                              width="160"
                          />
                          <ColumnDirective
                              field="VendorName"
                              headerText="Supplier"
                              width="200"
                          />
                          <ColumnDirective
                              field="StockSellPrice"
                              headerText="Harga Jual"
                              width="120"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="TotalStockSellPrice"
                              headerText="Total Harga Jual"
                              width="200"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="PurchaseOrderPrice"
                              headerText="Total Beli"
                              width="200"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="COGSUnitPrice"
                              headerText="COGS Satuan"
                              width="120"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="COGSPrice"
                              headerText="Total Harga COGS"
                              width="200"
                              format="#,##0.##"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="DefaultCustomizationColor"
                              headerText="Warna Benang"
                              width="170"
                          />
                          <ColumnDirective
                              field="StockDays"
                              headerText="Stock Days"
                              width="120"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="StockAging"
                              headerText="Stock Aging"
                              width="120"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="ProductMovement"
                              headerText="Movement"
                              width="170"
                          />
                          <ColumnDirective
                              field="LaunchDate"
                              headerText="Tgl. Launching"
                              width="140"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="IncomingDeliveryOrderDate"
                              headerText="Tgl. Datang DO"
                              width="150"
                              type="date"
                              format="dd/MM/yyyy"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="StockDays2"
                              headerText="Stock Days (90 Hari)"
                              width="150"
                              format="N0"
                              textAlign="Right"
                          />
                          <ColumnDirective
                              field="StockSold90Days"
                              headerText="Penjualan 90 Hari"
                              width="140"
                              format="N0"
                              textAlign="Right"
                          />
                        </ColumnsDirective>
                        <AggregatesDirective>
                          <AggregateDirective>
                            <AggregateColumnsDirective>
                              <AggregateColumnDirective field='StockID' type='Count' footerTemplate={StockCountColumnTemplate}/>
                              <AggregateColumnDirective field='TotalStockSellPrice' type='Sum' footerTemplate={PriceColumnTemplate}/>
                              <AggregateColumnDirective field='PurchaseOrderPrice' type='Sum' footerTemplate={PriceColumnTemplate}/>
                              <AggregateColumnDirective field='COGSPrice' type='Sum' footerTemplate={PriceColumnTemplate}/>
                            </AggregateColumnsDirective>
                          </AggregateDirective>
                        </AggregatesDirective>
                        <Inject services={[Filter, Page, Sort, VirtualScroll, Aggregate, ContextMenu]} />
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
        <DialogTitle>Produk Terkait dari [{stockID}] {stockName}</DialogTitle>
        <DialogContent>
          <GridComponent
            dataSource={stockRelatedProductsData && stockRelatedProductsData.Data}
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
        >
            <ColumnsDirective>
              <ColumnDirective
                  field="Name"
                  headerText="Nama"
              />
            </ColumnsDirective>
            <Inject services={[Filter, Page, Sort, VirtualScroll]} />
          </GridComponent>
          { relatedDataLoading &&
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

export default Stock;