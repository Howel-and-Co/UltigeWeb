import Head from "next/head";
import Layout from "../../src/components/Layout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  TextField
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import React, { useState, useEffect, useRef } from 'react';
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
    VirtualScroll
  } from '@syncfusion/ej2-react-grids';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
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
}));

const ProductImageTemplate = (props) => {
  return (
    <img 
      src={props.ProductImage != "" ? props.ProductImage : "/icons/no-image.jpg"}  
      width={75} 
      height={75} 
      style={{borderRadius: 5}} 
      alt="Product Image"
    />
  );    
};

const ProductNameTemplate = (props) => {
  if (props.Availability == 'TERSEDIA') {
    return (
      <span>
        {props.ProductName}
        <br />
        <span style={{color: 'blue'}}>{props.SellPrice}</span>
      </span>
    );     
  }
  if (props.Availability == 'TIDAK') {
    return (
      <span style={{color: 'red'}}>
        {props.ProductName}
        <br />
        {props.SellPrice}
      </span>
    );
  }  
};

const SellPriceTemplate = (props) => {
  if (props.Availability == 'TERSEDIA') {
    return (
      <span>{props.SellPrice}</span>
    );     
  }
  if (props.Availability == 'TIDAK') {
    return (
      <span style={{color: 'red'}}>{props.SellPrice}</span>
    );
  }      
};

const ProductCategoryTemplate = (props) => {
  if (props.Availability == 'TERSEDIA') {
    return (
      <span>{props.ProductCategoryName}</span>
    );     
  }
  if (props.Availability == 'TIDAK') {
    return (
      <span style={{color: 'red'}}>{props.ProductCategoryName}</span>
    );
  }  
};

const QuantityTemplate = (props) => {
  if (props.Availability == 'TERSEDIA') {
    return (
      <span>{props.Quantity}</span>
    );     
  }
  if (props.Availability == 'TIDAK') {
    return (
      <span style={{color: 'red'}}>{props.Quantity}</span>
    );
  }      
};

const ProductIDTemplate = (props) => {
  if (props.Availability == 'TERSEDIA') {
    return (
      <span>{props.ProductID}</span>
    );     
  }
  if (props.Availability == 'TIDAK') {
    return (
      <span style={{color: 'red'}}>{props.ProductID}</span>
    );
  }  
};

const AvailabilityTemplate = (props) => {
  if (props.Availability == 'TERSEDIA') {
    return (
      <span style={{color: 'green'}}>TERSEDIA</span>
    );     
  }
  if (props.Availability == 'TIDAK') {
    return (
      <span style={{color: 'red'}}>TIDAK</span>
    );
  }  
};

const RowSelected = (props) => {
  window.open(props.data.ProductImage, '_blank')
};

const Product = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [fetchActive, setFetchActive] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(true);

  const [productData, setProductData] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [format, setFormat] = React.useState({ type: 'datetime', format: 'M/d/y hh:mm a' });
  const [gridInstance, setGridInstance] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');

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

  useEffect(() => {
    const fetchProductData = async () => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/product/getproducts`);

      let processedData;
      processedData = result.data;

      let newData = new Array();

      processedData.Data.forEach(function (dataItem) {
        let object = new Object();

        object.ProductID = dataItem.ProductID;
        object.ProductName = dataItem.ProductName;
        object.ProductImage = dataItem.ProductImage;
        object.ProductCategoryName = dataItem.ProductCategoryName;
        object.Quantity = dataItem.Quantity;
        object.SellPrice = Intl.NumberFormat('id').format(dataItem.SellPrice);
        object.Availability = dataItem.Availability == 1 ? "TERSEDIA" : "TIDAK";

        newData.push(object);
      });

      processedData.Data = newData;
      console.log(newData);
      
      setProductData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
      fetchProductData();
      setFetchActive(false);
    }
  }, [fetchActive]);

  return (
    <div className={classes.root} ref={componentRef}>
      <Layout>
        <Head>
            <title>Ultige Web</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

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
                    List Produk
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
                        dataSource={productData && productData.Data}
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
                                field="ProductImage"
                                headerText="Foto"
                                width="75"
                                template={ProductImageTemplate}
                                allowFiltering={false}
                            ></ColumnDirective> 
                            <ColumnDirective
                                field="ProductName"
                                headerText="Produk"
                                width="300"
                                template={ProductNameTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="SellPrice"
                                headerText="Harga Jual"
                                width="130"
                                format="N0"
                                textAlign="Right"
                                template={SellPriceTemplate}
                            />
                            <ColumnDirective
                                field="ProductCategoryName"
                                headerText="Kategori"
                                width="130"
                                template={ProductCategoryTemplate}
                            />
                            <ColumnDirective
                                field="Quantity"
                                headerText="Jumlah"
                                width="100"
                                textAlign="Right"
                                template={QuantityTemplate}
                            />
                            <ColumnDirective
                                field="Availability"
                                headerText="Stok"
                                width="100"
                                template={AvailabilityTemplate}
                            ></ColumnDirective>
                            <ColumnDirective
                                field="ProductID"
                                headerText="ID"
                                width="100"
                                template={ProductIDTemplate}
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

export default Product;