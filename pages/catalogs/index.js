import Head from "next/head";
import PublicLayout from "../../src/components/PublicLayout";
import {
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button
} from "@material-ui/core";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import React, { useState, useEffect } from 'react';
import axios from '../../src/utils/axios';

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
  }
}));

const Catalog = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                {productSalesData && productSalesData.Data.map((row) => (
                  <Grid item xs={12} md={6}>
                    { isMobile
                      ? <Paper className={classes.paper2} elevation={3}>
                          <Grid container disableGutter>
                            <Grid item xs={12}>
                              <img 
                                src={row.CatalogPreviewImageUrl != "" ? row.CatalogPreviewImageUrl : "/icons/no-image.jpg"}  
                                width="100%"
                                style={{borderRadius: 5}} 
                                alt="Catalog Image"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 16,
                                    fontWeight: 500,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    marginTop: 5,
                                    marginBottom: 10
                                }}
                              >
                                {row.CatalogName}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography 
                                style={{
                                    color: "#000", 
                                    fontSize: 12,
                                    marginLeft: 10,
                                    marginRight: 10
                                }}
                              >
                                {row.CatalogDescription}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} container justifyContent="flex-end" style={{marginTop: 20, marginBottom: 5, marginLeft: 10}}>
                              {row.CatalogCustomizationFileUrl != "" && 
                                <Button
                                  variant="outlined"
                                  style={{
                                    borderRadius: 4,
                                    textTransform: "none",
                                    fontSize: 12,
                                    marginRight: 10,
                                    marginLeft: 10,
                                    marginBottom: 10,
                                    height: 40
                                  }}
                                  onClick={() => window.open(row.CatalogCustomizationFileUrl, '_blank')}
                                  disableRipple
                                >
                                  Lihat Bordir
                                </Button>
                              }
                              <Button
                                variant="outlined"
                                style={{
                                  borderRadius: 4,
                                  textTransform: "none",
                                  fontSize: 12,
                                  marginRight: 10,
                                  marginBottom: 10,
                                  height: 40
                                }}
                                onClick={() => window.open(row.CatalogFileUrl, '_blank')}
                                disableRipple
                              >
                                Lihat Katalog
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper> 
                      : <Paper className={classes.paper} elevation={3}>
                          <Grid container disableGutter>
                            <Grid item xs={4} style={{height: 270}}>
                              <img 
                                src={row.CatalogPreviewImageUrl != "" ? row.CatalogPreviewImageUrl : "/icons/no-image.jpg"}  
                                width="100%"
                                style={{borderRadius: 3}} 
                                alt="Catalog Image"
                              />
                            </Grid>
                            <Grid item xs={8} container>
                              <Grid xs={12} style={{height: 55}}>
                                <Typography 
                                  style={{
                                      color: "#000", 
                                      fontSize: 18,
                                      fontWeight: 500,
                                      marginLeft: 10,
                                      height: 55
                                  }}
                                >
                                  {row.CatalogName}
                                </Typography>
                              </Grid>
                              <Grid xs={12} style={{height: 150}}>
                                <Typography 
                                  style={{
                                      color: "#000", 
                                      fontSize: 14,
                                      marginLeft: 10,
                                  }}
                                >
                                  {row.CatalogDescription}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} container justifyContent="flex-end">
                                {row.CatalogCustomizationFileUrl != "" && 
                                  <Button
                                    variant="outlined"
                                    style={{
                                      borderRadius: 4,
                                      textTransform: "none",
                                      fontSize: 14,
                                      marginTop: 10,
                                      marginRight: 10,
                                      height: 40
                                    }}
                                    onClick={() => window.open(row.CatalogCustomizationFileUrl, '_blank')}
                                    disableRipple
                                  >
                                    Lihat Bordir
                                  </Button>
                                }
                                <Button
                                  variant="outlined"
                                  style={{
                                    borderRadius: 4,
                                    textTransform: "none",
                                    fontSize: 14,
                                    marginTop: 10,
                                    height: 40
                                  }}
                                  onClick={() => window.open(row.CatalogFileUrl, '_blank')}
                                  disableRipple
                                >
                                  Lihat Katalog
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                    }
                  </Grid>
                ))}
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