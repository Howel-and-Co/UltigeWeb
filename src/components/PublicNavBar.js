import {
  Grid,
  Container,
} from "@mui/material";
import Image from 'next/image';
import React from 'react';

const PublicNavBar = () => {
  return (
    <div className="container">
      <Grid container justifyContent="center">
        <Container maxWidth="lg" disableGutters>
          <Grid
            container
            style={{ paddingLeft: 32, paddingRight: 32 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item style={{ flexDirection: "column" }} xs={4}>
              <Image
                style={{ paddingTop: 14, paddingBottom: 14, width: 55, height: 'auto' }}
                width={0}
                height={0}
                sizes="100vw"
                src="/howel-logo-v2-bow.svg"
                alt=""
              />
            </Grid>

            <Grid>
            </Grid>
          </Grid>
        </Container>
      </Grid>

      <style jsx>{`
        .container {
          width: 100%;
          height: 88px;
          background-color: #ffffff;
          border-bottom: 1.5px solid #e4e4e4;
          position: fixed;
          display: flex;
          z-index: 99;
        }
      `}</style>
    </div>
  )
}

export default PublicNavBar
