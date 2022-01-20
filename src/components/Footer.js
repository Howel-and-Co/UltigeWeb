import { Typography, Link } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  mainWrap: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("lg")]: {
      paddingTop: 30
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: 30,
      paddingBottom: 20
    }
  }
}));

const Footer = () => {
  const classes = useStyles();

  const menus = [
    {
      label: "About Us",
      path: "#"
    },
    {
      label: "FAQ",
      path: "#"
    },
    {
      label: "News",
      path: "#"
    },
    {
      label: "Gallery",
      path: "#"
    },
    {
      label: "Terms Of Service",
      path: "#"
    }
  ];

  return (
    <footer className={classes.mainWrap} style={{ background: "#8854D0" }}>
      <Grid container justify="center">
        <Container maxWidth="lg">
          <Grid container direction="row" justify="space-between">
            <Grid>
              <img
                style={{ marginLeft: 40, marginTop: 20 }}
                src="/next-white.svg"
              />
            </Grid>

            <Grid item style={{ marginBottom: 40, marginTop: 20 }}>
              {menus.map((item, i) => (
                <Link href={item.path} key={i}>
                  <Typography
                    gutterBottom
                    variant="body2"
                    style={{ color: "#FFF" }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Grid>

            <Grid item style={{ marginBottom: 40, marginTop: 20 }}>
              <Typography
                gutterBottom
                variant="body2"
                style={{ color: "#FFF" }}
              >
                Follow Us
              </Typography>
              <Link
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  textDecoration: "none"
                }}
                href="#"
              >
                <img
                  style={{ height: 16, width: 16 }}
                  src="/icons/facebook.svg"
                  alt=""
                />
                <Typography
                  gutterBottom
                  variant="body2"
                  style={{
                    color: "#FFF",
                    fontWeight: "normal",
                    marginLeft: 5,
                    marginTop: 5
                  }}
                >
                  Facebook
                </Typography>
              </Link>
              <Link
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  textDecoration: "none"
                }}
                href="#"
              >
                <img
                  style={{ height: 16, width: 16 }}
                  src="/icons/instagram.svg"
                  alt=""
                />
                <Typography
                  gutterBottom
                  variant="body2"
                  style={{
                    color: "#FFF",
                    fontWeight: "normal",
                    marginLeft: 5,
                    marginTop: 5
                  }}
                >
                  Instagram
                </Typography>
              </Link>
              <Link
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  textDecoration: "none"
                }}
                href="#"
              >
                <img
                  style={{ height: 16, width: 16 }}
                  src="/icons/twitter.svg"
                  alt=""
                />
                <Typography
                  gutterBottom
                  variant="body2"
                  style={{
                    color: "#FFF",
                    fontWeight: "normal",
                    marginLeft: 5,
                    marginTop: 5
                  }}
                >
                  Twitter
                </Typography>
              </Link>
              <Link
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  textDecoration: "none"
                }}
                href="#"
              >
                <img
                  style={{ height: 16, width: 16 }}
                  src="/icons/youtube.svg"
                  alt=""
                />
                <Typography
                  gutterBottom
                  variant="body2"
                  style={{
                    color: "#FFF",
                    fontWeight: "normal",
                    marginLeft: 5,
                    marginTop: 5
                  }}
                >
                  Youtube
                </Typography>
              </Link>
              <Link
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
                href="#"
              >
                <img
                  style={{ height: 16, width: 16 }}
                  src="/icons/linkedin.svg"
                  alt=""
                />
                <Typography
                  gutterBottom
                  variant="body2"
                  style={{
                    color: "#FFF",
                    fontWeight: "normal",
                    marginLeft: 5,
                    marginTop: 5
                  }}
                >
                  LinkedIn
                </Typography>
              </Link>
            </Grid>
            
            <Grid item>
            </Grid>
          </Grid>
          <Grid container>
            <p style={{ marginLeft: 40, color: "#FFF" }}>
              v0.0.1
            </p>
          </Grid>
        </Container>
      </Grid>
      <style jsx>{`
        footer {
          background: "#D04154";
        }
      `}</style>
    </footer>
  );
};

export default Footer;
