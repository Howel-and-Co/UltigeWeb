import Image from 'next/image';
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
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from '../../src/utils/moment';

import React, { useEffect } from 'react';
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

const StockDetail = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { pid } = router.query;

  const [dataLoading, setDataLoading] = React.useState(false);

  const [stockAgingDaysData, setStockAgingDaysData] = React.useState();

  const [stockName, setStockName] = React.useState();
  const [stockAlternativeName, setStockAlternativeName] = React.useState();

  const [stockCategoryTitle1, setStockCategoryTitle1] = React.useState();
  const [stockCategoryTitle2, setStockCategoryTitle2] = React.useState();
  const [stockCategoryTitle3, setStockCategoryTitle3] = React.useState();
  const [repeatNumber, setRepeatNumber] = React.useState();

  const [stockModelName, setStockModelName] = React.useState();
  const [stockColor, setStockColor] = React.useState();
  const [stockSize, setStockSize] = React.useState();
  const [stockMaterial, setStockMaterial] = React.useState();
  const [stockUnitTitle, setStockUnitTitle] = React.useState();

  const [packagingLength, setPackagingLength] = React.useState();
  const [packagingWidth, setPackagingWidth] = React.useState();
  const [packagingHeight, setPackagingHeight] = React.useState();
  const [packagingContentCount, setPackagingContentCount] = React.useState();
  const [stockVolume, setStockVolume] = React.useState();

  const [stockSellPrice, setStockSellPrice] = React.useState();

  const [launchDate, setLaunchDate] = React.useState();
  const [defaultCustomizationColor, setDefaultCustomizationColor] = React.useState();
  const [incomingDeliveryOrderDate, setIncomingDeliveryOrderDate] = React.useState();

  const [stockBarcode, setStockBarcode] = React.useState();
  const [stockImageBase64, setStockImageBase64] = React.useState();

  const [filterSettings, setFilterSettings] = React.useState({ type: 'Excel' });
  const [gridInstance, setGridInstance] = React.useState();


  useEffect(() => {
    const fetchStockDetailData = async (stockID) => {
      setDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/stock/getstock?stockID=${stockID}`);

      let processedData;
      processedData = result.data;
      //console.log(result.data);

      setStockName(processedData.Data.Name);
      setStockAlternativeName(processedData.Data.StockAlternativeName);

      setStockCategoryTitle1(processedData.Data.StockCategoryTitle1);
      setStockCategoryTitle2(processedData.Data.StockCategoryTitle2);
      setStockCategoryTitle3(processedData.Data.StockCategoryTitle3);
      setRepeatNumber(processedData.Data.RepeatNumber);

      setStockCategoryTitle1(processedData.Data.StockCategoryTitle1);
      setStockCategoryTitle2(processedData.Data.StockCategoryTitle2);
      setStockCategoryTitle3(processedData.Data.StockCategoryTitle3);
      setRepeatNumber(processedData.Data.RepeatNumber);

      setStockModelName(processedData.Data.StockModelName);
      setStockColor(processedData.Data.StockColor);
      setStockSize(processedData.Data.StockSize);
      setStockMaterial(processedData.Data.StockMaterial);
      setStockUnitTitle(processedData.Data.StockUnitTitle);

      setPackagingLength(Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PackagingLength));
      setPackagingWidth(Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PackagingWidth));
      setPackagingHeight(Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(processedData.Data.PackagingHeight));
      setPackagingContentCount(Intl.NumberFormat('en-US').format(processedData.Data.PackagingContentCount));
      setStockVolume(processedData.Data.StockVolume);

      setStockSellPrice(Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(processedData.Data.StockSellPrice));

    
      setLaunchDate(moment(processedData.Data.LaunchDate).format("DD/MM/YYYY"));
      setDefaultCustomizationColor(processedData.Data.DefaultCustomizationColor);
      if (processedData.Data.IncomingDeliveryOrderDate != null)
        setIncomingDeliveryOrderDate(moment(processedData.Data.IncomingDeliveryOrderDate).format("DD/MM/YYYY"));

      setStockBarcode(processedData.Data.StockBarcode);
      if (processedData.Data.HavePhoto == 1)
        setStockImageBase64(`data:image/jpeg;base64,${processedData.Data.StockImageBase64}`);

      let newData = new Array();

      processedData.Data.StockAgingDays.forEach(function (dataItem) {
        let object = new Object();

        object.PurchaseOrderNumber = dataItem.PurchaseOrderNumber;
        object.FirstDeliveryOrderDate = dataItem.FirstDeliveryOrderDate;
        object.TotalQuantityDO = dataItem.TotalQuantityDO;
        object.TotalQuantitySales = dataItem.TotalQuantitySales;
        object.StockDays = dataItem.StockDays;
        object.StockAging = dataItem.StockAging;

        newData.push(object);
      });

      processedData.Data = newData;
      
      setStockAgingDaysData(processedData);
      setDataLoading(false);
    };

    if (pid != undefined) {
      fetchStockDetailData(pid);
    }
  }, [pid]);

  return (
    <>
      <Layout>
        <Grid container style={{padding: 5}}>
          <Grid container xs={8}>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid style={{height: 145}}>
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginLeft: 3
                                }}
                            >
                                Nama Stok:
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
                                    marginBottom: 5,
                                    padding: 0
                                }}
                                value={stockName} 
                            />
                        </Grid>
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginLeft: 3
                                }}
                            >
                                Nama Stok Alternative:
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
                                value={stockAlternativeName} 
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 192}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Kategori 1:
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
                                        value={stockCategoryTitle1} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Kategori 2:
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
                                        value={stockCategoryTitle2} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Kategori 3:
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
                                        value={stockCategoryTitle3} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Repeat:
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
                                        value={repeatNumber} 
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 242}}>
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Model:
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
                                        value={stockModelName} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Warna:
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
                                        value={stockColor} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Ukuran:
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
                                        value={stockSize} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Material:
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
                                        value={stockMaterial} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 130
                                        }}
                                    >
                                        Satuan:
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
                                        value={stockUnitTitle} 
                                    />
                                </Box>
                            </Grid>             
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid style={{height: 360}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Panjang Packaging (cm):
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
                                        marginBottom: 4,
                                        padding: 0
                                    }}
                                    value={packagingLength} 
                                />
                            </Grid>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Lebar Packaging (cm):
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
                                        marginBottom: 4,
                                        padding: 0
                                    }}
                                    value={packagingWidth} 
                                />
                            </Grid>     
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Tinggi Packaging (cm):
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
                                        marginBottom: 4,
                                        padding: 0
                                    }}
                                    value={packagingHeight} 
                                />
                            </Grid>  
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Isi Packaging (pc):
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
                                        marginBottom: 4,
                                        padding: 0
                                    }}
                                    value={packagingContentCount} 
                                />
                            </Grid>  
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Volume Per Stock (m3):
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
                                    value={stockVolume} 
                                />
                            </Grid>             
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid style={{height: 75}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        marginLeft: 3
                                    }}
                                >
                                    Harga Jual:
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
                                    value={stockSellPrice} 
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                    <Grid container style={{height: 200}}>
                        <Grid item xs={12}>
                            <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 18,
                                    marginLeft: 5
                                }}
                            >
                                Stock Aging Days
                            </Typography>
                            <GridComponent
                                dataSource={stockAgingDaysData && stockAgingDaysData.Data}
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
                                    field="PurchaseOrderNumber"
                                    headerText="Nomor PO"
                                    width="150"
                                />
                                <ColumnDirective
                                    field="FirstDeliveryOrderDate"
                                    headerText="Tgl. DO Pertama"
                                    width="200"
                                    type="date"
                                    format="dd/MM/yyyy"
                                    textAlign="Right"
                                />
                                <ColumnDirective
                                    field="TotalQuantityDO"
                                    headerText="DO Datang"
                                    width="150"
                                    format="N0"
                                    textAlign="Right"
                                />
                                <ColumnDirective
                                    field="TotalQuantitySales"
                                    headerText="Total Terjual"
                                    width="150"
                                    format="N0"
                                    textAlign="Right"
                                />
                                <ColumnDirective
                                    field="StockDays"
                                    headerText="Stock Days"
                                    width="150"
                                    format="N0"
                                    textAlign="Right"
                                />
                                <ColumnDirective
                                    field="StockAging"
                                    headerText="Stock Aging"
                                    width="150"
                                    format="N0"
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
          <Grid item xs={4}>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 145}}>
                        <Grid item xs={12} style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 300
                                        }}
                                    >
                                        Tgl. Launching:
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
                                        value={launchDate} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 4}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 16,
                                            marginTop: -5,
                                            width: 300
                                        }}
                                    >
                                        Warna Benang<br/>Default (untuk Bordir):
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
                                        value={defaultCustomizationColor} 
                                    />
                                </Box>
                                <Box className={classes.inline} style={{marginBottom: 7}}>
                                    <Typography 
                                        style={{
                                            color: "#000", 
                                            fontSize: 18,
                                            marginTop: 6,
                                            width: 300
                                        }}
                                    >
                                        Tgl. Incoming DO:
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
                                        value={incomingDeliveryOrderDate} 
                                    />
                                </Box>
                            </Grid>          
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 75}}>
                            <Grid item xs={12} style={{marginLeft: 5, marginRight: 5}}>
                                <TextField
                                    variant="outlined"
                                    margin="dense"
                                    InputProps={{
                                        readOnly: true,
                                        style: {
                                            fontSize: 22,
                                            fontWeight: 'bold'
                                        }
                                    }}
                                    style={{
                                        width: "100%",
                                        marginTop: 5,
                                        marginBottom: 0,
                                        padding: 0
                                    }}
                                    value={stockBarcode} 
                                />
                            </Grid>                    
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={3}>
                        <Grid container style={{height: 293}}>
                            <Grid item xs={12} style={{marginLeft: 10, marginRight: 10, marginTop: 5}}>
                                <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Foto Stok:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{marginLeft: 10, marginRight: 10, marginBottom: 5}}>
                              <Image 
                                src={stockImageBase64 != null ? stockImageBase64 : "/images/no-image.jpg"}  
                                width={0}
                                height={0}
                                sizes="100vw"
                                alt="Stock Image"
                                style={{ width: 'auto', height: 250 }} 
                              />
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
    </>
  );
}

export default StockDetail;