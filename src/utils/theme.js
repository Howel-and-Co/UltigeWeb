import { createTheme } from "@material-ui/core/styles";

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

const theme = createTheme({
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
    fontFamily: "GoogleSans,Arial"
  },
  overrides: {
    MuiButton: {
      root: {
        color: "#050505",
        fontWeight: 500,
        fontSize: 14
      }
    },
    MuiContainer: {
      root: {
        marginLeft: 0,
        marginRight: 0
      }
    },
    MuiCssBaseline: {
      "@global": {
        "@font-face": [
          googleSans,
          googleSansMedium,
          googleSansMediumItalic,
          googleSansItalic,
          googleSansBold,
          googleSansBoldItalic
        ]
      }
    }
  }
});

export default theme;
