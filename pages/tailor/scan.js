import Layout from "../../src/components/Layout";
import axios from '../../src/utils/axios';
import {
  Grid,
  Typography,
  Card,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import classes from "../../sass/login.module.scss";
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const TailorScan = () => {
    const [data, setData] = useState('');
    const [status, setStatus] = useState('');

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
        const processScanBarcode = async (barcode, userID) => {
            setStatus('Barcode sedang diproses...');
    
            const result = await axios({
                method: 'post',
                url: 'https://api.ultige.com/ultigeapi/web/tailor/scan',
                data: {
                    barcode: barcode,
                    tailorScanBy: userID
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
        };
    
        if (data.includes('PB-')) {
            let userID = Cookies.get("userid");

            processScanBarcode(data, userID);
        }
      }, [data]);
    
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
                    className={classes.login}
                >
                    <Grid item xs={10} sm={7} md={5} lg={4}>
                        <Card variant="outlined" style={{padding: 30}}>
                            <Typography variant="h6">Scan Barcode</Typography>
                            { status == '' &&
                                <QrReader
                                    onResult={(result) => {
                                        if (!!result && result?.text.includes('PB-')) {
                                            setData(result?.text);
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                    constraints={{ facingMode: 'environment' }}
                                />
                            }
                            <Typography variant="h6" style={{ fontSize: 28, color: StatusColor(status) }}>{status}</Typography>
                            { status == 'Barcode sedang diproses...' &&
                                <Box textAlign='center' style={{ marginTop: 25 }}>
                                    <CircularProgress size={50} />
                                </Box>
                            }
                            { status != '' && status != 'Barcode sedang diproses...' &&
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
                                        onClick={() => {RefreshStatus();}}
                                    >
                                        Scan Lagi
                                    </Button>
                                </Box>
                            }
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default TailorScan;