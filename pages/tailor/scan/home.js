import Layout from "../../../src/components/Layout";
import {
  Grid,
  Typography,
  Card,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import classes from "../../../sass/login.module.scss";
  

const TailorHome = () => {

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
                            <Typography variant="h6">Silahkan Scan Kembali Barcode Anda</Typography>
                        </Card>
                    </Grid>

                </Grid>
            </Grid>
        </Layout>
    );
};

export default TailorHome;