import Head from "next/head";
import PublicLayout from "../../src/components/PublicLayout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import React, { useState, useEffect } from 'react';
import axios from '../../src/utils/axios';

import GetAppIcon from '@material-ui/icons/GetApp';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 10,
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
  }
}));

const Catalog = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [fetchActive, setFetchActive] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(true);

  const [productSalesData, setProductSalesData] = React.useState();

  useEffect(() => {
    const fetchProductCatalogData = async () => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/catalog/getactivecatalogs`);

      let processedData;
      processedData = result.data;

      setProductSalesData(processedData);
      setDataLoading(false);
    };

    if (fetchActive == true) {
      fetchProductCatalogData();
      setFetchActive(false);
    }
  }, [fetchActive]);

  return (
    <div className={classes.root}>
      <PublicLayout>
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
                    Katalog
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{padding: 15}}>
                  { !dataLoading &&
                    <TableContainer component={Paper} variant="outlined">
                        <Table >
                        <TableBody>
                            {productSalesData && productSalesData.Data.map((row) => (
                            <TableRow
                                key={row.No}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left" style={{width: isMobile ? "35%" : "20%", minWidth: 80}}>
                                  <img 
                                    src={row.CatalogPreviewImageUrl != "" ? row.CatalogPreviewImageUrl : "/icons/no-image.jpg"}  
                                    width="100%"
                                    style={{borderRadius: 5}} 
                                    alt="Catalog Image"
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <Typography 
                                    style={{
                                        color: "#000", 
                                        fontSize: isMobile ? 16 : 20,
                                        fontWeight: 500
                                    }}
                                  >
                                    {row.CatalogName}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <a style={{color: "#555"}} target="_blank" href={row.CatalogFileUrl} rel="noopener noreferrer">
                                    <GetAppIcon style={{fontSize: 25, marginTop: 5}}/>
                                  </a>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                  }
                </Grid>
                <Grid item xs={12}>
                  { dataLoading &&
                    <Box className={classes.inline} style={{marginTop: 20, marginLeft: 30, marginBottom: 20}}>
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
      </PublicLayout>
    </div>
  );
}

export default Catalog;