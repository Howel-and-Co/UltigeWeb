import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/utils/theme";
import React from 'react';

import "../sass/scroll.scss"
import dynamic from "next/dynamic";

const App = ({ Component, pageProps }) => {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
          jssStyles.parentElement.removeChild(jssStyles);
        }
      }, []);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    );
}

export default dynamic(() => Promise.resolve(App), {
    ssr: false,
});