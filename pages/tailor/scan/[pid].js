import Layout from "../../../src/components/Layout";
import axios from '../../../src/utils/axios';
import {
  Grid,
  Typography,
  Card,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import classes from "../../../sass/login.module.scss";
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import Router from "next/router";
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
  

const TailorScan = () => {
    const [data, setData] = useState('');
    const [tailorItemData, setTailorItemData] = useState('');
    const [status, setStatus] = useState('');
    const [decryptedBarcode, setDecryptedBarcode] = useState('');


    const [errorMessage, setErrorMessage] = useState('');

    const [isProcessAllowed, setIsProcessAllowed] = useState(false);

    const [processActive, setProcessActive] = React.useState(false);
    const [getItemsActive, setGetItemsActive] = React.useState(true);
    const [gridInstance, setGridInstance] = React.useState();

    const router = useRouter();
    const { pid } = router.query;

    const RefreshStatus = () => {
        setStatus('');
        setData('');
    };

    const StatusColor = (status) => {
        if (status == 'Barcode sedang diproses...') {
            return '#000000'
        }
        else if (status == 'Barcode berhasil discan') {
            return '#3C8F4A'
        }
        else {
            return '#F14343'
        }
    };

    useEffect(() => {
        const getTailorItems = async (barcode) => {  
            const token = Cookies.get("token");
            if(!token)
                return;

            let userID = Cookies.get("userid");  
            let username = Cookies.get("username");  
            const encodedBarcode = encodeURIComponent(barcode);
            const result = await axios.get(`https://api.ultige.com/ultigeapi/web/tailor/verifybarcode?barcode=${encodedBarcode}&userid=${userID}&username=${username}`);
            //const result = await axios.get(`http://localhost:5000/ultigeapi/web/tailor/verifybarcode?barcode=${encodedBarcode}&userid=${userID}&username=${username}`);
            
            let processedData;
            processedData = result.data;
            console.log(processedData);
            let newData = new Array();
            
            if(processedData && Array.isArray(processedData.Data) && processedData.Data.length > 0 && processedData.Status.Code == 0){
                processedData.Data.forEach(function (dataItem) {
                    let object = new Object();
                    object.StockName = dataItem.StockName;
                    object.StockQuantity = `${dataItem.StockQuantity}`;

                    newData.push(object);
                });

                processedData.Data = newData;
                //console.log(processedData);
                
                setTailorItemData(processedData);
                setIsProcessAllowed(true);
            }
            else{
                setErrorMessage(processedData.Status.Message);
                setIsProcessAllowed(false);
            }

            setDecryptedBarcode(processedData.Status.OriginalBarcode);
        };

        if (pid != undefined && getItemsActive == true) {
            
                getTailorItems(pid);
            

            //processScanBarcode(pid, );
            setGetItemsActive(false);
        }
    }, [pid, getItemsActive]);

    useEffect(() => {
        const processScanBarcode = async (barcode, userID) => {
            setStatus('Barcode sedang diproses...');
    
            const result = await axios({
                method: 'post',
                url: 'https://api.ultige.com/ultigeapi/web/tailor/scan',
                // url: 'http://localhost:5000/ultigeapi/web/tailor/scan',
                data: {
                    barcode: barcode,
                    tailorScanUserID: userID
                }
            });
    
            let processedData;
            processedData = result.data;
            
            if (processedData.Status.Code == 200) {
                setStatus('Barcode berhasil discan');
            }
            else {
                setStatus(processedData.Status.Message);
            }

            setIsProcessAllowed(false);
        };

        if (pid != undefined && processActive == true) {
            
            let userID = Cookies.get("userid");

            processScanBarcode(decryptedBarcode, userID);
            

            //processScanBarcode(pid, );
            setProcessActive(false);
        }
    }, [pid, processActive]);

    return (
        <Layout>
            <Grid
                className={classes.register}
                style={{ marginBottom: 60, marginTop: 30, minHeight: "50vh" }}
            >
                <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    className={classes.login}
                >
                    <Grid item xs={10} sm={7} md={5} lg={4}>
                        <Card variant="outlined" style={{padding: 30}}>
                            <Typography variant="h6">Scan Barcode</Typography>
                            <Typography variant="h6">{decryptedBarcode}</Typography>
                            <Typography variant="h6" style={{ fontSize: 28, color: StatusColor(status) }}>{status}</Typography>
                            { status == 'Barcode sedang diproses...' &&
                                <Box textAlign='center' style={{ marginTop: 25 }}>
                                    <CircularProgress size={50} />
                                </Box>
                            }
                            { !isProcessAllowed
                                ? 
                                    <Typography 
                                        style={{
                                        color: "#F14343", 
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        marginTop: 9,
                                        marginBottom: 9,
                                        marginRight: 15
                                        }}
                                    >
                                        {errorMessage}
                                    </Typography>
                                : 
                                <Box textAlign='center'>
                                    <Button 
                                        variant="outlined"
                                        style={{
                                            borderRadius: 4,
                                            textTransform: "none",
                                            margin: 10,
                                            fontSize: 20,
                                        }}
                                        disableRipple
                                        onClick={() => {setProcessActive(true);}}
                                    >
                                        Proses
                                    </Button>
                                </Box>
                            }
                            
                            
                        </Card>
                    </Grid>

                    <Grid item xs={10} sm={7} md={5} lg={4} style={{ height: '100%' }}>
                        <GridComponent
                            dataSource={tailorItemData && tailorItemData.Data}
                            allowSorting={true}
                            allowPaging={false}
                            pageSettings={{ pageSize: 50 }}
                            ref={(grid) => setGridInstance(grid)}
                            allowFiltering={false}
                            //height={(height - (isMobile ? 480 : 430)) / 1.5}
                            height={200}
                            enableVirtualization={true}
                            resizeSettings={{mode: 'Normal'}}
                            style={{margin: 10}}
                            allowTextWrap={true}
                            gridLines='Both'
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="StockName"
                                    headerText="Stok"
                                    width="100"
                                />
                                <ColumnDirective
                                    field="StockQuantity"
                                    headerText="Jumlah"
                                    width="50"
                                />
                            </ColumnsDirective>
                            <Inject services={[Filter, Page, Sort, VirtualScroll]} />
                        </GridComponent>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default TailorScan;