import LoginLayout from "../src/components/LoginLayout";
import axios from '../src/utils/axios';
import {
  Grid,
  Typography,
  FormControl,
  InputBase,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Card
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import classes from "../sass/login.module.scss";
import { redirectPassword, setToken } from "../src/utils/config";
import React from 'react';
import { sha256 } from 'js-sha256';

const Login = () => {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    loading: false,
    showPassword: false,
    invalid: false
  });

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value, invalid: false });
  };

  const showPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const Login = async e => {
    setValues({ ...values, loading: !values.loading, invalid: false });
        
    try {
        const result = await axios({
            method: 'post',
            url: 'https://api.ultige.com/ultigeapi/authenticate',
            data: {
                username: values.username, 
                password: sha256(values.password)
            }
        });

        let processedData;
        processedData = result.data;

        if (processedData.changePassword == true) {
            redirectPassword(values.username, sha256(values.password));
        }
        else {
            setToken(processedData.token, processedData.userID, processedData.role, values.username, sha256(values.password));
        }
    } catch (error) {
        console.log(error);
        setValues({ ...values, invalid: true, loading: false });
    }
  };

  return (
      <LoginLayout>
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
                  <Grid item xs={10} sm={8} md={6} lg={4}>
                      <Card variant="outlined" style={{padding: 30}}>
                          <Typography variant="h6">Login</Typography>

                          <form
                              onSubmit={e => {
                                  e.preventDefault();
                                  Login();
                              }}
                              autoComplete="off"
                          >
                              <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                  <label>Username</label>
                                  <InputBase
                                      required
                                      type="text"
                                      className={classes.form}
                                      value={values.username}
                                      onChange={handleChange("username")}
                                  />
                              </FormControl>

                              <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                  <label>Password</label>
                                  <InputBase
                                      required
                                      className={classes.form}
                                      type={values.showPassword ? "text" : "password"}
                                      value={values.password}
                                      autoComplete="off"
                                      onChange={handleChange("password")}
                                      endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={showPassword}
                                                size="large">
                                                {values.showPassword ? (
                                                <Visibility 
                                                    className={classes.icon} 
                                                />
                                                ) : (
                                                <VisibilityOff 
                                                    className={classes.icon} 
                                                />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                      }
                                  />
                              </FormControl>

                              {values.invalid ? (
                                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                                  <small style={{color: "#CD4559"}}>Username atau password tidak ditemukan</small>
                                  </div>
                              ) : null}

                              <Button
                                  type="submit"
                                  disabled={values.loading}
                                  variant="outlined"
                                  style={{
                                      height: 42,
                                      width: "100%",
                                      borderRadius: 4,
                                      marginTop: 10
                                  }}
                                  disableElevation
                              >
                                  {values.loading && (
                                      <>
                                          <CircularProgress
                                              size={14}
                                              style={{ marginRight: 8, color: "#FFF" }}
                                          />
                                          Loading...
                                      </>
                                  )}
                                  {!values.loading && <span>Login</span>}
                              </Button>
                          </form>
                      </Card>
                  </Grid>
              </Grid>
          </Grid>
      </LoginLayout>
  );
};

export default Login;
