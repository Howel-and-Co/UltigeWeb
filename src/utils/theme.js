import { createTheme } from "@mui/material/styles";

const googleSans = {
  fontFamily: "GoogleSans",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: "normal",
  src: `
    url('/fonts/GoogleSans-Regular.ttf') format("truetype")
  `
};

const googleSansMedium = {
  fontFamily: "GoogleSans",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
    url('/fonts/GoogleSans-Medium.ttf') format("truetype")
  `
};

const googleSansMediumItalic = {
  fontFamily: "GoogleSans",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
    url('/fonts/GoogleSans-MediumItalic.ttf') format("truetype")
  `
};

const googleSansItalic = {
  fontFamily: "GoogleSans",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    url('/fonts/GoogleSans-Italic.ttf') format("truetype")
  `
};

const googleSansBold = {
  fontFamily: "GoogleSans",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: "bold",
  src: `
    url('/fonts/GoogleSans-Bold.ttf') format("truetype")
  `
};

const googleSansBoldItalic = {
  fontFamily: "GoogleSans",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: "bold",
  src: `
    url('/fonts/GoogleSans-BoldItalic.ttf') format("truetype")
  `
};

let theme = createTheme({
  palette: {
    background: {
      default: "#FAFAFA"
    },
    grey: {
      "100": "#F0F2F5",
      "300": "#8A8C90",
      "400": "#8A8C90"
    },
    common: {
      black: "#050505"
    },
    primary: {
      main: "#387AEF"
    },
    text: {
      primary: '#2C3A47'
    }
  },
  typography: {
    body2: {
      fontWeight: "bold",
      fontSize: 14
    },
    button: {
      textTransform: "none"
    },
    h6: {
      fontWeight: "bold"
    },
    fontFamily: "GoogleSans, Arial"
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#050505",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          fontWeight: 500,
          fontSize: 14
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': googleSans,
        fallbacks: [
          {'@font-face': googleSansMedium},
          {'@font-face': googleSansMediumItalic},
          {'@font-face': googleSansItalic},
          {'@font-face': googleSansBold},
          {'@font-face': googleSansBoldItalic}
        ]
      }
    },
  }
});

theme = createTheme(theme, {
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          [theme.breakpoints.up('lg')]: {
              maxWidth: 1280
          },
        }
      }
    }
  }
});

export default theme;
