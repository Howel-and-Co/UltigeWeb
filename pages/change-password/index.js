import Head from "next/head";
import Layout from "../../src/components/Layout";
import axios from '../../src/utils/axios';
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
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import classes from "../../sass/main.scss";
import { checkToken, setToken } from "../../src/utils/config";
import Cookies from "js-cookie";
import LoginLayout from "../../src/components/LoginLayout";

const ChangePassword = () => {
  const [values, setValues] = React.useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    loading: false,
    showOldPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false,
    invalid: false,
    invalidMessage: ""
  });

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value, invalid: false });
  };

  const showOldPassword = () => {
    setValues({ ...values, showOldPassword: !values.showOldPassword });
  };

  const showNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const showConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword });
  };

  const ChangePassword = async e => {
    setValues({ ...values, loading: !values.loading, invalid: false, invalidMessage: "" });
    const newUsername = Cookies.get("username");
    const oldPassword = Cookies.get("password");
    var sha256 = require('js-sha256');
    
    try {
        if (sha256(values.oldPassword).localeCompare(oldPassword)) {
            setValues({ ...values, invalid: true, invalidMessage: "Password lama tidak sesuai", loading: false });
            return;
        }

        if (values.newPassword.length < 6) {
            setValues({ ...values, invalid: true, invalidMessage: "Password minimal terdiri dari 6 karakter", loading: false });
            return;
        }

        if (values.newPassword.localeCompare(values.confirmNewPassword) != 0) {
            setValues({ ...values, invalid: true, invalidMessage: "Konfirmasi password tidak sesuai", loading: false });
            return;
        }

        const data = {
            username: newUsername, 
            oldPassword: sha256(values.oldPassword),
            newPassword: sha256(values.confirmNewPassword)
        }

        const result = await axios({
            method: 'post',
            url: 'https://api.ultige.com/ultigeapi/web/password/changepassword',
            data: data
        });

        let processedData;
        processedData = result.data;

        if (processedData.passwordChanged == false) {
            setValues({ ...values, invalid: true, invalidMessage: "Password baru sudah pernah digunakan, mohon gunakan password lain", loading: false });
            return;
        }

        const result2 = await axios({
            method: 'post',
            url: 'https://api.ultige.com/ultigeapi/authenticate',
            data: {
                username: newUsername, 
                password: sha256(values.confirmNewPassword)
            }
        });

        processedData = result2.data;
        
        setToken(processedData.token, processedData.role, newUsername, sha256(values.confirmNewPassword));
    } catch (error) {
        console.log(error);
        setValues({ ...values, invalid: true, invalidMessage: "Ganti password gagal, mohon coba kembali", loading: false });
    }
  };

  return (
    <>
        { checkToken() ? 
            <Layout>
                <Head>
                    <title>Ultige Web</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Grid
                    className={classes.register}
                    style={{ marginBottom: 60, marginTop: 30, minHeight: "50vh" }}
                >
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        className={classes.login}
                    >
                        <Grid item xs={10} sm={8} md={6} lg={4}>
                            <Card variant="outlined" style={{padding: 30}}>
                                <Typography variant="h6">Change Password</Typography>

                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        ChangePassword();
                                    }}
                                    autoComplete="off"
                                >
                                    <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                        <label>Old Password</label>
                                        <InputBase
                                            required
                                            className={classes.form}
                                            type={values.showOldPassword ? "text" : "password"}
                                            value={values.oldPassword}
                                            autoComplete="off"
                                            onChange={handleChange("oldPassword")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    onClick={showOldPassword}
                                                >
                                                    {values.showOldPassword ? (
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

                                    <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                        <label>New Password</label>
                                        <InputBase
                                            required
                                            className={classes.form}
                                            type={values.showNewPassword ? "text" : "password"}
                                            value={values.newPassword}
                                            autoComplete="off"
                                            onChange={handleChange("newPassword")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    onClick={showNewPassword}
                                                >
                                                    {values.showNewPassword ? (
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

                                    <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                        <label>Confirm New Password</label>
                                        <InputBase
                                            required
                                            className={classes.form}
                                            type={values.showConfirmNewPassword ? "text" : "password"}
                                            value={values.confirmNewPassword}
                                            autoComplete="off"
                                            onChange={handleChange("confirmNewPassword")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    onClick={showConfirmNewPassword}
                                                >
                                                    {values.showConfirmNewPassword ? (
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
                                        <small style={{color: "#CD4559"}}>{values.invalidMessage}</small>
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
                                        {!values.loading && <span>Confirm</span>}
                                    </Button>
                                </form>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Layout> :
            <LoginLayout>
                <Head>
                    <title>Ultige Web</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Grid
                    className={classes.register}
                    style={{ marginBottom: 60, marginTop: 30, minHeight: "50vh" }}
                >
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        className={classes.login}
                    >
                        <Grid item xs={10} sm={8} md={6} lg={4}>
                            <Card variant="outlined" style={{padding: 30}}>
                                <Typography variant="h6">Change Password</Typography>

                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        ChangePassword();
                                    }}
                                    autoComplete="off"
                                >
                                    <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                        <label>Old Password</label>
                                        <InputBase
                                            required
                                            className={classes.form}
                                            type={values.showOldPassword ? "text" : "password"}
                                            value={values.oldPassword}
                                            autoComplete="off"
                                            onChange={handleChange("oldPassword")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    onClick={showOldPassword}
                                                >
                                                    {values.showOldPassword ? (
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

                                    <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                        <label>New Password</label>
                                        <InputBase
                                            required
                                            className={classes.form}
                                            type={values.showNewPassword ? "text" : "password"}
                                            value={values.newPassword}
                                            autoComplete="off"
                                            onChange={handleChange("newPassword")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    onClick={showNewPassword}
                                                >
                                                    {values.showNewPassword ? (
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

                                    <FormControl style={{ width: "100%", marginBottom: 16 }}>
                                        <label>Confirm New Password</label>
                                        <InputBase
                                            required
                                            className={classes.form}
                                            type={values.showConfirmNewPassword ? "text" : "password"}
                                            value={values.confirmNewPassword}
                                            autoComplete="off"
                                            onChange={handleChange("confirmNewPassword")}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                <IconButton
                                                    onClick={showConfirmNewPassword}
                                                >
                                                    {values.showConfirmNewPassword ? (
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
                                        <small style={{color: "#CD4559"}}>{values.invalidMessage}</small>
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
                                        {!values.loading && <span>Confirm</span>}
                                    </Button>
                                </form>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </LoginLayout>
        }
    </>
  );
};

export default ChangePassword;