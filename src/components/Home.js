import Head from "next/head";
import Layout from "../src/components/Layout";
import {
  Grid,
} from "@material-ui/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

export default function Home() {
  return (
    <>
      <Layout>
        <Head>
          <title>Web Landing</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="linear"
            dataKey="pv"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="linear" 
            dataKey="uv" 
            stroke="#82ca9d"
            dot={false}
            activeDot={{ r: 5 }} 
          />
        </LineChart>

        {/*
        <Grid container spacing={2} style={{marginTop: 50, marginBottom: 70}}>
          <Grid item xs={6}>
            <p className="title-head">Welcome to</p>

            <h1 className="title">
              <a href="https://nextjs.org">Next.js</a> with HowelAndCo
            </h1>

            <p className="description">
              Get started by editing <code>pages/index.js</code> then save and
              publish again
            </p>
          </Grid>
          <Grid item xs={6}>
            <div className="logo-head">
              <img src="/next.svg" alt="Next Logo" className="logo" />
              <img src="/cross.svg" alt="Cross" className="cross" />
              <img src="/howel-logo.svg" alt="HowelAndCo Logo" className="logo" />
            </div>
          </Grid>
        </Grid>
        */}

        <style jsx>{`
          a {
            color: inherit;
            text-decoration: none;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title-head {
            font-size: 2rem;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: left;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
            max-width: 584px;
            padding: 10px;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .logo-head {
            display: flex;
            flex-direction: column;
            padding: 20px;
            align-items: center;
          }

          .logo {
            height: 120px;
          }

          .cross {
            width: 20px;
            height: 20px;
            margin-top: 30px;
            margin-bottom: 30px;
          }
        `}</style>
      </Layout>
    </>
  );
}
