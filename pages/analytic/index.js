import Image from 'next/image';
import Layout from "../../src/components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from "recharts";
import {
  Grid,
  Typography,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Divider,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Tab,
  Link,
  CircularProgress,
  Tooltip
} from "@mui/material";
import MomentUtils from '@date-io/moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { makeStyles, withStyles } from 'tss-react/mui';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useContainerDimensions from  "../../src/utils/screen.js";
import randomColorHSL from  "../../src/utils/randomColorHSL";
import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useState, useEffect, useRef } from 'react';
import axios from '../../src/utils/axios';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { checkToken } from "../../src/utils/config";
import { DataGrid } from '@mui/x-data-grid';
import { InView } from 'react-intersection-observer';

const useStyles = makeStyles()((theme) => {
  return {
    paper: {
      padding: 10,
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
  };
});

const LineColor = (column) => {
  let color;

  if (column == 'Penjualan')
    color = '#367fe3'
  else if (column == 'Pesanan')
    color = '#f6bd16'
  else if (column == 'Jumlah')
    color = '#f6bd16'
  else if (column == 'Penjualan/Pesanan')
    color = '#fd5151'
  else if (column == 'Margin (Rp)')
    color = '#aa88ff'
  else if (column == 'Margin (%)')
    color = '#23aaab'

  return color;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card variant="outlined" style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 3}}>
        <p>{`${payload[0].payload.dataLabel}`}</p>
        {payload.map((item, index) => (
          <p key={index} style={{color: `${item.stroke}`, marginTop: -8}}>{`${item.name} : ${item.name != 'Pesanan' && item.name != 'Jumlah' && item.name != 'Margin (%)' ? "Rp " : ""}${Intl.NumberFormat('id').format(item.payload[item.name])}${item.name == 'Margin (%)' ? "%" : ""}`}</p>
        ))}
      </Card>
    );
  }

  return null;
};

const CustomMultipleTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card variant="outlined" style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 3}}>
        <p>{`${payload[0].payload.dataLabel}`}</p>
        {payload.map((item, index) => (
          <p key={index} style={{color: `${item.stroke}`, marginTop: -8}}>{`${item.name} : Rp ${Intl.NumberFormat('id').format(item.payload[item.name])} , ${Intl.NumberFormat('id').format(item.payload[item.name + " QTY"])} pcs`}</p>
        ))}
      </Card>
    );
  }

  return null;
};

const MultiTypeChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  return (
    <LineChart
      width={props.width - 40}
      height={320}
      data={props.chart}
      margin={{
        top: 15,
        right: 40,
        bottom: 5,
        left: isMobile ? 30 : 35
      }}
    >
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis interval="preserveStartEnd" dataKey="label" angle={0} dx={0}/>
      <YAxis yAxisId="Penjualan" hide={true}/>
      <YAxis yAxisId="Pesanan" hide={true}/>
      <YAxis yAxisId="Jumlah" hide={true}/>
      <YAxis yAxisId="Penjualan/Pesanan" hide={true}/>
      <YAxis yAxisId="Margin (Rp)" hide={true}/>
      <YAxis yAxisId="Margin (%)" hide={true}/>
      <RechartsTooltip 
        content={<CustomTooltip />}
      />
      {props.line.map((item, index) => (
        <Line
          key={index}
          yAxisId={item.column}
          type="linear"
          dataKey={item.column}
          stroke={LineColor(item.column)}
          strokeWidth={item.column != 'Jumlah' ? 2 : 0}
          dot={false}
          activeDot={{ r: item.column != 'Jumlah' ? 5 : 0 }}
        />  
      ))}
    </LineChart>
  );
}

const EmptyChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  return (
    <>
      <Typography align='center' style={{position: "absolute", width: props.width - 40, height: 320, marginTop: 140, fontSize: 26}}>
        TIDAK ADA DATA
      </Typography>
      <LineChart
        width={props.width - 40}
        height={320}
        margin={{
          top: 15,
          right: 40,
          bottom: 25,
          left: isMobile ? 30 : 35
        }}
      >
        <CartesianGrid strokeDasharray="4 4" />
      </LineChart>
    </>
  );
}

const MultiChannelChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  return (
    <LineChart
      width={props.width - 40}
      height={320}
      data={props.chart}
      margin={{
        top: 15,
        right: 40,
        bottom: 5,
        left: isMobile ? 30 : 35
      }}
    >
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis interval="preserveStartEnd" dataKey="label" angle={0} dx={0}/>
      <YAxis hide={true}/>
      <RechartsTooltip 
        content={<CustomTooltip />}
      />
      {props.line && Object.entries(props.line).map(([key,value])=> (
        <>
          { value.toggle == true &&
            <Line
              type="linear"
              dataKey={value.toggle ? key : null}
              stroke={randomColorHSL(key)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          }
        </>
      ))}
    </LineChart>
  );
}

const MultiCategoryChart = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  return (
    <LineChart
      width={props.width - 40}
      height={320}
      data={props.chart}
      margin={{
        top: 15,
        right: 40,
        bottom: 5,
        left: isMobile ? 30 : 35
      }}
    >
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis interval="preserveStartEnd" dataKey="label" angle={0} dx={0}/>
      <YAxis hide={true}/>
      <RechartsTooltip 
        content={<CustomMultipleTooltip />}
      />
      {props.line && props.line.map((lineItem)=> (
        <>
          <Line
            type="linear"
            dataKey={lineItem.column}
            stroke={randomColorHSL(lineItem.column)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </>
      ))}
    </LineChart>
  );
}

const HtmlTooltip = withStyles(Tooltip, (theme) => ({
  tooltip: {
    backgroundColor: '#ffffff',
    color: 'rgba(0, 0, 0, 1)',
    maxWidth: 300,
    fontSize: 13,
    border: '1px solid #d3d3d3',
  },
}));

const columns = [
  { field: 'tierCategory', headerName: 'Kategori Produk', flex: 1, minWidth: 200 },
];

const Home = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [salesData, setSalesData] = useState();
  const [salesCountData, setSalesCountData] = useState();
  const [averageSalesData, setAverageSalesData] = useState();
  const [marginData, setMarginData] = useState();
  const [previousSalesData, setPreviousSalesData] = useState();
  const [previousSalesCountData, setPreviousSalesCountData] = useState();
  const [previousAverageSalesData, setPreviousAverageSalesData] = useState();
  const [previousMarginData, setPreviousMarginData] = useState();
  const [salesDataLoading, setSalesDataLoading] = useState(false);
  const [salesCountDataLoading, setSalesCountDataLoading] = useState(false);
  const [averageSalesDataLoading, setAverageSalesDataLoading] = useState(false);
  const [marginDataLoading, setMarginDataLoading] = useState(false);
  const [previousSalesDataLoading, setPreviousSalesDataLoading] = useState(false);
  const [previousSalesCountDataLoading, setPreviousSalesCountDataLoading] = useState(false);
  const [previousAverageSalesDataLoading, setPreviousAverageSalesDataLoading] = useState(false);
  const [previousMarginDataLoading, setPreviousMarginDataLoading] = useState(false);

  const [masterSalesData, setMasterSalesData] = useState();
  const [masterMultipleSalesData, setMasterMultipleSalesData] = useState();

  const [fetchActive, setFetchActive] = React.useState(true);
  const [dateOption, setDateOption] = React.useState('realtime');
  const [dataRange, setDataRange] = React.useState('realtime');
  const [dataRangeCount, setDataRangeCount] = React.useState(0);
  const [channel, setChannel] = React.useState('');
  const [channelList, setChannelList] = React.useState();
  const [newDataLoad, setNewDataLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [currentStartDate, setCurrentStartDate] = React.useState();
  const [currentEndDate, setCurrentEndDate] = React.useState();

  const [toggleSales, setToggleSales] = React.useState(true);
  const [toggleSalesCount, setToggleSalesCount] = React.useState(true);
  const [toggleAverageSales, setToggleAverageSales] = React.useState(true);
  const [toggleMarginValue, setToggleMarginValue] = React.useState(true);
  const [toggleMarginRate, setToggleMarginRate] = React.useState(true);
  const [toggleMultipleSales, setToggleMultipleSales] = React.useState();

  const [dataReload, setDataReload] = React.useState(true);

  const [totalSalesData, setTotalSalesData] = React.useState();
  const [totalSalesCountData, setTotalSalesCountData] = React.useState();
  const [totalAverageSalesData, setTotalAverageSalesData] = React.useState();
  const [totalMarginValueData, setTotalMarginValueData] = React.useState();
  const [totalMarginRateData, setTotalMarginRateData] = React.useState();

  const [salesDataDescription, setSalesDataDescription] = useState('');
  const [salesCountDataDescription, setSalesCountDataDescription] = useState('');
  const [averageSalesDataDescription, setAverageSalesDataDescription] = useState('');
  const [marginDataDescription, setMarginDataDescription] = useState('');
  const [marginRateDataDescription, setMarginRateDataDescription] = useState('');

  const [productSalesData, setProductSalesData] = React.useState();
  const [productSalesCountData, setProductSalesCountData] = React.useState();
  const [modelSalesData, setModelSalesData] = React.useState();
  const [modelSalesCountData, setModelSalesCountData] = React.useState();
  const [categorySalesData, setCategorySalesData] = React.useState();
  const [categorySalesCountData, setCategorySalesCountData] = React.useState();
  const [productSalesDataLoading, setProductSalesDataLoading] = React.useState(false);
  const [productSalesCountDataLoading, setProductSalesCountDataLoading] = React.useState(false);
  const [modelSalesDataLoading, setModelSalesDataLoading] = React.useState(false);
  const [modelSalesCountDataLoading, setModelSalesCountDataLoading] = React.useState(false);
  const [categorySalesDataLoading, setCategorySalesDataLoading] = React.useState(false);
  const [categorySalesCountDataLoading, setCategorySalesCountDataLoading] = React.useState(false);

  const [productFetchActive, setProductFetchActive] = React.useState(false);

  const [segmentationSalesData, setSegmentationSalesData] = React.useState();
  const [segmentationTransactionCountData, setSegmentationTransactionCountData] = React.useState();
  const [segmentationCustomerTypeData, setSegmentationCustomerTypeData] = React.useState();
  const [segmentationSalesDataLoading, setSegmentationSalesDataLoading] = React.useState(false);
  const [segmentationTransactionCountDataLoading, setSegmentationTransactionCountDataLoading] = React.useState(false);
  const [segmentationCustomerTypeDataLoading, setSegmentationCustomerTypeDataLoading] = React.useState(false);

  const [segmentationFetchActive, setSegmentationFetchActive] = React.useState(false);

  const [customDayRange, setCustomDayRange] = React.useState('');
  const [customWeekRange, setCustomWeekRange] = React.useState('');
  const [customMonthRange, setCustomMonthRange] = React.useState('');
  const [customYearRange, setCustomYearRange] = React.useState('');
  const [customDateRange, setCustomDateRange] = React.useState('');

  const [model, setModel] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [productModelsData, setProductModelsData] = useState([""]);
  const [productCategoriesData, setProductCategoriesData] = useState([""]);
  const [productCategoriesCacheData, setProductCategoriesCacheData] = useState();
  const [modelCategoryData, setModelCategoryData] = useState();
  const [modelCategoryDataLoading, setModelCategoryDataLoading] = React.useState(false);
  const [totalModelCategoryData, setTotalModelCategoryData] = React.useState();
  const [modelCategoryDataActive, setModelCategoryDataActive] = useState(true);
  
  const [modelFetchActive, setModelFetchActive] = React.useState(false);
  const [categoryFetchActive, setCategoryFetchActive] = React.useState(false);

  const [modelCustom, setModelCustom] = React.useState('');
  const [categoryCustom, setCategoryCustom] = React.useState('');
  const [productModelsCustomData, setProductModelsCustomData] = useState([""]);
  const [productCategoriesCustomData, setProductCategoriesCustomData] = useState([""]);
  const [productCategoriesCustomCacheData, setProductCategoriesCustomCacheData] = useState();
  const [modelCategoryCustomData, setModelCategoryCustomData] = useState();
  const [modelCategoryCustomDataLoading, setModelCategoryCustomDataLoading] = React.useState(false);
  const [totalModelCategoryCustomData, setTotalModelCategoryCustomData] = React.useState();
  const [modelCategoryCustomDataActive, setModelCategoryCustomDataActive] = useState(true);
  
  const [modelCustomFetchActive, setModelCustomFetchActive] = React.useState(false);
  const [categoryCustomFetchActive, setCategoryCustomFetchActive] = React.useState(false);

  const [tierCustom, setTierCustom] = React.useState('');
  const [tierCategoryCustom, setTierCategoryCustom] = React.useState('');
  const [productTiersCustomData, setProductTiersCustomData] = useState([""]);
  const [productTierCategoriesCustomData, setProductTierCategoriesCustomData] = useState([""]);
  const [productTierCategoriesCustomCacheData, setProductTierCategoriesCustomCacheData] = useState();
  const [tierCategoryCustomData, setTierCategoryCustomData] = useState();
  const [tierCategoryCustomDataLoading, setTierCategoryCustomDataLoading] = React.useState(false);
  const [totalTierCategoryCustomData, setTotalTierCategoryCustomData] = React.useState();
  
  const [tierCustomFetchActive, setTierCustomFetchActive] = React.useState(true);
  const [tierCategoryCustomFetchActive, setTierCategoryCustomFetchActive] = React.useState(false);

  const [tierMultipleCustom, setTierMultipleCustom] = React.useState('');
  const [tierMultipleCategoryCustom, setTierMultipleCategoryCustom] = React.useState([]);
  const [tierMultipleCategoryLiveCustom, setTierMultipleCategoryLiveCustom] = React.useState([]);
  const [productTiersMultipleCustomData, setProductTiersMultipleCustomData] = useState([]);
  const [productTierMultipleCategoriesCustomData, setProductTierMultipleCategoriesCustomData] = useState();
  const [productTierMultipleCategoriesCustomCacheData, setProductTierMultipleCategoriesCustomCacheData] = useState();
  const [tierMultipleCategoryCustomData, setTierMultipleCategoryCustomData] = useState();
  const [tierMultipleCategoryCustomDataLoading, setTierMultipleCategoryCustomDataLoading] = React.useState(false);
  const [totalTierMultipleCategoryCustomData, setTotalTierMultipleCategoryCustomData] = React.useState();
  
  const [tierMultipleCustomFetchActive, setTierMultipleCustomFetchActive] = React.useState(true);
  const [tierMultipleCategoryCustomFetchActive, setTierMultipleCategoryCustomFetchActive] = React.useState(false);

  const [valueStockData, setValueStockData] = useState();
  const [valueStockDataLoading, setValueStockDataLoading] = useState(false);

  const [modelStock, setModelStock] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [modelStockData, setModelStockData] = useState([""]);
  const [stockData, setStockData] = useState([""]);
  const [stockCacheData, setStockCacheData] = useState();
  const [performanceData, setPerformanceData] = useState();
  const [performanceDataLoading, setPerformanceDataLoading] = React.useState(false);
  
  const [modelStockFetchActive, setModelStockFetchActive] = React.useState(false);
  const [stockFetchActive, setStockFetchActive] = React.useState(false);

  const [monthlyStartDate, setMonthlyStartDate] = useState();
  const [monthlyEndDate, setMonthlyEndDate] = useState();

  moment.locale('id');

  const handleModelCategoryDataActive = (event) => {
    setModelCategoryDataActive(event.target.value);
    setModelFetchActive(true);
  };

  const handleModelCategoryCustomDataActive = (event) => {
    setModelCategoryCustomDataActive(event.target.value);
    setModelCustomFetchActive(true);
  };

  const handleChange = (event) => {
    setDateOption(event.target.value);

    if (event.target.value != 'custom-daily' 
      && event.target.value != 'custom-weekly' 
      && event.target.value != 'custom-monthly' 
      && event.target.value != 'custom-yearly'
      && event.target.value != 'custom-date') {
      setDataRange(event.target.value);
      setFetchActive(true);
    }
  };

  const handleChannelChange = (event) => {
    setChannel(event.target.value);
  };

  const handleModelChange = (event, newValue) => {
    if (newValue !== null) {
      setModel(newValue);
      setCategoryFetchActive(true);
    }
  };
  const handleCategoryChange = (event, newValue) => {
    if (newValue !== null) {
      setCategory(newValue);
    }
  };

  const handleModelCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setModelCustom(newValue);
      setCategoryCustomFetchActive(true);
    }
  };
  const handleCategoryCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setCategoryCustom(newValue);
    }
  };

  const handleTierCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setTierCustom(newValue);
      setTierCategoryCustomFetchActive(true);
    }
  };
  const handleTierCategoryCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setTierCategoryCustom(newValue);
    }
  };

  const handleTierMultipleCustomChange = (event, newValue) => {
    if (newValue !== null) {
      setTierMultipleCustom(newValue);
      setTierMultipleCategoryCustomFetchActive(true);
    }
  };

  const handleModelStockChange = (event, newValue) => {
    if (newValue !== null) {
      setModelStock(newValue);
      setStockFetchActive(true);
    }
  };
  const handleStockChange = (event, newValue) => {
    if (newValue !== null) {
      setStock(newValue);
    }
  };

  const handleToggleSalesChange = () => {
    if (toggleSales && !(!toggleSalesCount && !toggleAverageSales && !toggleMarginValue && !toggleMarginRate))
      setToggleSales(false);
    else
      setToggleSales(true);
  };

  const handleToggleSalesCountChange = () => {
    if (toggleSalesCount && !(!toggleSales && !toggleAverageSales && !toggleMarginValue && !toggleMarginRate))
      setToggleSalesCount(false);
    else
      setToggleSalesCount(true);
  };

  const handleToggleAverageSalesChange = () => {
    if (toggleAverageSales && !(!toggleSalesCount && !toggleSales && !toggleMarginValue && !toggleMarginRate))
      setToggleAverageSales(false);
    else
      setToggleAverageSales(true);
  };

  const handleToggleMarginValueChange = () => {
    if (toggleMarginValue && !(!toggleSalesCount && !toggleSales && !toggleAverageSales && !toggleMarginRate))
      setToggleMarginValue(false);
    else
      setToggleMarginValue(true);
  };

  const handleToggleMarginRateChange = () => {
    if (toggleMarginRate && !(!toggleSalesCount && !toggleSales && !toggleAverageSales && !toggleMarginValue))
      setToggleMarginRate(false);
    else
      setToggleMarginRate(true);
  };

  const handleToggleMultipleSalesChange = (key) => {
    var counter = 0;
    for (const [key, value] of Object.entries(toggleMultipleSales)) {
      if (value.toggle == true)
        counter++;
    }

    if (counter > 1 || toggleMultipleSales[key].toggle == false) {
      if (toggleMultipleSales[key].toggle == false) 
        toggleMultipleSales[key].toggle = true;
      else
        toggleMultipleSales[key].toggle = false;

      setDataReload(true);
    }
  };


  const [selectedStartDate, setSelectedStartDate] = React.useState(moment());
  const [selectedEndDate, setSelectedEndDate] = React.useState(moment());
  const [newStartDate, setNewStartDate] = React.useState(moment());
  const [newEndDate, setNewEndDate] = React.useState(moment());

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const [valueStockFetchActive, setValueStockFetchActive] = React.useState(false);

  const [modelCategoryEndDate, setModelCategoryEndDate] = React.useState(moment());
  const [modelCategoryCustomStartDate, setModelCategoryCustomStartDate] = React.useState(moment());
  const [modelCategoryCustomEndDate, setModelCategoryCustomEndDate] = React.useState(moment());
  const [tierCategoryCustomStartDate, setTierCategoryCustomStartDate] = React.useState(moment());
  const [tierCategoryCustomEndDate, setTierCategoryCustomEndDate] = React.useState(moment());
  const [tierMultipleCategoryCustomStartDate, setTierMultipleCategoryCustomStartDate] = React.useState(moment());
  const [tierMultipleCategoryCustomEndDate, setTierMultipleCategoryCustomEndDate] = React.useState(moment());

  const handleModelCategoryEndDateChange = (date) => {
    setModelCategoryEndDate(date);
  };

  const handleModelCategoryCustomStartDateChange = (date) => {
    setModelCategoryCustomStartDate(date);
  };

  const handleModelCategoryCustomEndDateChange = (date) => {
    setModelCategoryCustomEndDate(date);
  };

  const handleTierCategoryCustomStartDateChange = (date) => {
    setTierCategoryCustomStartDate(date);
  };

  const handleTierCategoryCustomEndDateChange = (date) => {
    setTierCategoryCustomEndDate(date);
  };

  const handleTierMultipleCategoryCustomStartDateChange = (date) => {
    setTierMultipleCategoryCustomStartDate(date);
  };

  const handleTierMultipleCategoryCustomEndDateChange = (date) => {
    setTierMultipleCategoryCustomEndDate(date);
  };

  const vsLabel = () => {
    if (dateOption == 'custom-daily' && dataRangeCount == 0) {
      return "vs. Hari Sebelumnya";
    }
    else if (dateOption == 'custom-weekly') {
      return "vs. Minggu Sebelumnya";
    }
    else if (dateOption == 'custom-monthly') {
      return "vs. Bulan Sebelumnya";
    }
    else if (dateOption == 'custom-yearly') {
      return "vs. Tahun Sebelumnya";
    }
    else if (dateOption == 'custom-date') {
      return `vs. ${dataRangeCount + 1} Hari Sebelumnya`;
    }
    else if (dataRange == 'realtime') {
      return `vs. Kemarin pada 00:00-${moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00`;
    }
    else if (dataRange == 'yesterday') {
      return "vs. Hari Sebelumnya";
    }
    else if (dataRange == 'weekly') {
      return "vs. Minggu Sebelumnya";
    }
    else if (dataRange == 'monthly') {
      return "vs. Bulan Sebelumnya";
    }
  };

  const applyCustomDate = () => {
    if (dateOption == 'custom-daily') {
      setNewStartDate(moment(selectedStartDate).format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).format("YYYY-MM-DD"));
      setDataRange('realtime');
    }
    else if (dateOption == 'custom-weekly') {
      setNewStartDate(moment(selectedStartDate).startOf('isoWeek').format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).endOf('isoWeek').format("YYYY-MM-DD"));
      setDataRange('weekly');
    }
    else if (dateOption == 'custom-monthly') {
      setNewStartDate(moment(selectedStartDate).startOf('month').format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).endOf('month').format("YYYY-MM-DD"));
      setDataRange('monthly');
    }
    else if (dateOption == 'custom-yearly') {
      setNewStartDate(moment(selectedStartDate).startOf('year').format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedStartDate).endOf('year').format("YYYY-MM-DD"));
      setDataRange('yearly');
    }
    else if (dateOption == 'custom-date') {
      setNewStartDate(moment(selectedStartDate).format("YYYY-MM-DD"));
      setNewEndDate(moment(selectedEndDate).format("YYYY-MM-DD"));

      let endDate = moment(selectedEndDate);
      let startDate = moment(selectedStartDate);
      let dateRange = Math.abs(endDate.diff(startDate, 'days'));

      setDataRangeCount(dateRange);

      if (dateRange == 0) {
        setDataRange('realtime');
      }
      else if (dateRange > 0 && dateRange <= 14) {
        setDataRange('weekly');
      }
      else if (dateRange > 14 && dateRange <= 31) {
        setDataRange('monthly');
      }
      else if (dateRange > 31) {
        setDataRange('yearly');
      }
    }

    setFetchActive(true);
  };

  const [productTab, setProductTab] = React.useState('1');

  const handleProductTabChange = (event, newValue) => {
    if (newValue == 2 && !modelSalesCountData && !modelSalesCountDataLoading) {
      fetchModelSalesCountData(currentStartDate, currentEndDate);
    }
    else if (newValue == 3 && !categorySalesData && !categorySalesDataLoading) {
      fetchCategorySalesData(currentStartDate, currentEndDate);
    }
    else if (newValue == 4 && !categorySalesCountData && !categorySalesCountDataLoading) {
      fetchCategorySalesCountData(currentStartDate, currentEndDate);
    }
    else if (newValue == 5 && !productSalesData && !productSalesDataLoading) {
      fetchProductSalesData(currentStartDate, currentEndDate);
    }
    else if (newValue == 6 && !productSalesCountData && !productSalesCountDataLoading) {
      fetchProductSalesCountData(currentStartDate, currentEndDate);
    }

    setProductTab(newValue);
  };

  const [segmentationTab, setSegmentationTab] = React.useState('1');

  const handleSegmentationTabChange = (event, newValue) => {
    if (newValue == 2 && !segmentationTransactionCountData && !segmentationTransactionCountDataLoading) {
      fetchSegmentationTransactionCountData(currentStartDate, currentEndDate);
    }
    else if (newValue == 3 && !segmentationCustomerTypeData && !segmentationCustomerTypeDataLoading) {
      fetchSegmentationCustomerTypeData(currentStartDate, currentEndDate);
    }

    setSegmentationTab(newValue);
  };

  const handleSegmentationFetchChange = (active) => {
    //console.log("Segmentation " + active);
    if (!segmentationSalesData && !segmentationSalesDataLoading && active == true) {
      //console.log("Fetch Segmentation");
      setSegmentationFetchActive(true);
    }
  };

  const handleProductFetchChange = (active) => {
    //console.log("Product " + active);
    if (!modelSalesData && !modelSalesDataLoading && active == true) {
      //console.log("Fetch Product");
      setProductFetchActive(true);
    }
  };

  const handleValueStockFetchChange = (active) => {
    //console.log("ValueStock " + active);
    if (!valueStockData && !valueStockDataLoading && active == true) {
      //console.log("Fetch ValueStock");
      setValueStockFetchActive(true);
    }
  };

  const handleModelFetchChange = (active) => {
    //console.log("Model " + active);
    if (productModelsData.length == 1 && !modelCategoryDataLoading && active == true) {
      //console.log("Fetch Model");
      setModelFetchActive(true);
    }
  };

  const handleModelCustomFetchChange = (active) => {
    //console.log("ModelsCustom " + active);
    if (productModelsCustomData.length == 1 && !modelCategoryCustomDataLoading && active == true) {
      //console.log("Fetch ModelsCustom");
      setModelCustomFetchActive(true);
    }
  };

  const handleModelStockFetchChange = (active) => {
    //console.log("ModelStock " + active);
    if (modelStockData.length == 1 && !performanceDataLoading && active == true) {
      //console.log("Fetch ModelStock");
      setModelStockFetchActive(true);
    }
  };


  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleSelection = (newSelection) => {
    const selectedRowsData = newSelection.map((id) => productTierMultipleCategoriesCustomData.find((row) => row.id === id));
    let categories = [];
    for (const row of selectedRowsData)
    {
      categories.push(row.tierCategory);
    }

    setSelectionModel(newSelection);
    setTierMultipleCategoryCustom(categories);
  }

  const handleTierMultipleCategoryData = () => {
    const processMonthTierMultipleCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      tierMultipleCategoryCustom.forEach(function (categoryItem) {
        addLine = new Object();
        addLine.column = categoryItem;
        line.push(addLine);
        chartLine.push(addLine);
      });
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let monthCounter = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');
        monthCounter++; 
        let object = ``;

        if (dateDifference > 1095 && monthCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 730 && dateDifference <= 1095 && monthCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 365 && dateDifference <= 730 && monthCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('MMM') == 'Jan')
            object += `{"label": "${moment(currentDate).format('MMM YYYY')}"`;
          else
            object += `{"label": "${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('MMM YYYY')}"`;
        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

          if (moment(date).isSame(currentDate) == true) {
            line.forEach(function (lineItem) {
              if (lineItem.column in dataItem) {
                object += `, "${lineItem.column}": ${dataItem[lineItem.column]}`;
                object += `, "${lineItem.column + " QTY"}": ${dataItem[lineItem.column + " QTY"]}`;
              }
              else {
                object += `, "${lineItem.column}": 0`;
                object += `, "${lineItem.column + " QTY"}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          line.forEach(function (lineItem) {
            object += `, "${lineItem.column}": 0`;
            object += `, "${lineItem.column + " QTY"}": 0`;
          });
        }

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierMultipleCategory = new Object();
      totalTierMultipleCategory.value = processedData.TotalValue;
      totalTierMultipleCategory.quantity = processedData.TotalQuantity;

      setTotalTierMultipleCategoryCustomData(totalTierMultipleCategory);
    
      return result;
    };

    const processWeekTierMultipleCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      tierMultipleCategoryCustom.forEach(function (categoryItem) {
        addLine = new Object();
        addLine.column = categoryItem;
        line.push(addLine);
        chartLine.push(addLine);
      });
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD").startOf('isoWeek');
      let momentEndDate = moment(endDate, "YYYY-MM-DD").startOf('isoWeek');

      let currentDate = momentStartDate;
      let weekCounter = 0;

      while (currentDate <= momentEndDate) { 
        weekCounter++;
        let object = ``;

        if (dateDifference > 140 && weekCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 100 && dateDifference <= 140 && weekCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 60 && dateDifference <= 100 && weekCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          object += `{"label": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;

        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let week = parseInt(dataItem.Date.substring(4, 6));

          if (week == currentDate.isoWeek()) {
            line.forEach(function (lineItem) {
              if (lineItem.column in dataItem) {
                object += `, "${lineItem.column}": ${dataItem[lineItem.column]}`;
                object += `, "${lineItem.column + " QTY"}": ${dataItem[lineItem.column + " QTY"]}`;
              }
              else {
                object += `, "${lineItem.column}": 0`;
                object += `, "${lineItem.column + " QTY"}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          line.forEach(function (lineItem) {
            object += `, "${lineItem.column}": 0`;
            object += `, "${lineItem.column + " QTY"}": 0`;
          });
        }

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'weeks');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierMultipleCategory = new Object();
      totalTierMultipleCategory.value = processedData.TotalValue;
      totalTierMultipleCategory.quantity = processedData.TotalQuantity;

      setTotalTierMultipleCategoryCustomData(totalTierMultipleCategory);
    
      return result;
    };

    const processDayTierMultipleCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      tierMultipleCategoryCustom.forEach(function (categoryItem) {
        addLine = new Object();
        addLine.column = categoryItem;
        line.push(addLine);
        chartLine.push(addLine);
      });
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dateDifference > 45 && dateCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 30 && dateDifference <= 45 && dateCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 15 && dateDifference <= 30 && dateCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            line.forEach(function (lineItem) {
              if (lineItem.column in dataItem) {
                object += `, "${lineItem.column}": ${dataItem[lineItem.column]}`;
                object += `, "${lineItem.column + " QTY"}": ${dataItem[lineItem.column + " QTY"]}`;
              }
              else {
                object += `, "${lineItem.column}": 0`;
                object += `, "${lineItem.column + " QTY"}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          line.forEach(function (lineItem) {
            object += `, "${lineItem.column}": 0`;
            object += `, "${lineItem.column + " QTY"}": 0`;
          });
        }

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierMultipleCategory = new Object();
      totalTierMultipleCategory.value = processedData.TotalValue;
      totalTierMultipleCategory.quantity = processedData.TotalQuantity;

      setTotalTierMultipleCategoryCustomData(totalTierMultipleCategory);
    
      return result;
    };

    const processHourTierMultipleCategorySaleCustomData = (processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      tierMultipleCategoryCustom.forEach(function (categoryItem) {
        addLine = new Object();
        addLine.column = categoryItem;
        line.push(addLine);
        chartLine.push(addLine);
      });
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      let hourCounter = 0;
      let lastHour = 23;

      while (hourCounter <= 23) { 
        let object = ``;

        if (hourCounter % 6 == 0) {
          if (parseInt(hourCounter / 10) > 0)
            object += `{"label": "${hourCounter}:00"`;
          else
            object += `{"label": "0${hourCounter}:00"`;
        }
        else {
          object += `{"label": ""`;
        }

        if (parseInt(hourCounter / 10) > 0)
          object += `, "dataLabel": "${hourCounter}:00"`;
        else
          object += `, "dataLabel": "0${hourCounter}:00"`;

        let hourExist = false;
      
        data.forEach(function (dataItem) {
          let hour = parseInt(dataItem.Date);

          if (hourCounter == hour) {
            line.forEach(function (lineItem) {
              if (lineItem.column in dataItem) {
                object += `, "${lineItem.column}": ${dataItem[lineItem.column]}`;
                object += `, "${lineItem.column + " QTY"}": ${dataItem[lineItem.column + " QTY"]}`;
              }
              else {
                object += `, "${lineItem.column}": 0`;
                object += `, "${lineItem.column + " QTY"}": 0`;
              }
            });

            hourExist = true;
          }
        });

        if (hourExist == false) {
          line.forEach(function (lineItem) {
            object += `, "${lineItem.column}": 0`;
            object += `, "${lineItem.column + " QTY"}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        hourCounter++;
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierMultipleCategory = new Object();
      totalTierMultipleCategory.value = processedData.TotalValue;
      totalTierMultipleCategory.quantity = processedData.TotalQuantity;

      setTotalTierMultipleCategoryCustomData(totalTierMultipleCategory);

      return result;
    };

    const fetchTierMultipleCategorySalesCustomData = async (startDate, endDate, tierMultipleCustom, tierMultipleCategoryCustom) => {
      setTierMultipleCategoryCustomDataLoading(true);

      const result = await axios({
        method: 'post',
        url: 'https://api.ultige.com/ultigeapi/web/analytic/getproductmultiplecategorysales',
        data: {
          startDate: startDate, 
          endDate: endDate,
          tier: tierMultipleCustom, 
          categories: tierMultipleCategoryCustom
        }
      });

      let processedData;
      processedData = result.data;


      let newData;

      if (processedData.DateDifference == 0) {
        newData = processHourTierMultipleCategorySaleCustomData(processedData);
      }
      else if (processedData.DateDifference > 0 && processedData.DateDifference <= 60) {
        newData = processDayTierMultipleCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference > 60 && processedData.DateDifference < 180) {
        newData = processWeekTierMultipleCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference >= 180) {
        newData = processMonthTierMultipleCategorySaleCustomData(startDate, endDate, processedData);
      }

      setTierMultipleCategoryCustomData(newData);
      setTierMultipleCategoryLiveCustom(tierMultipleCategoryCustom);
      setTierMultipleCategoryCustomDataLoading(false);
    };

    if (checkToken() && tierMultipleCategoryCustom) {

      let startDate;
      startDate = moment(tierMultipleCategoryCustomStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(tierMultipleCategoryCustomEndDate).format("YYYY-MM-DD");

      fetchTierMultipleCategorySalesCustomData(startDate, endDate, tierMultipleCustom, tierMultipleCategoryCustom);
    }
  };

  const fetchSegmentationSalesData = async (startDate, endDate) => {
    setSegmentationSalesDataLoading(true);

    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcustomersegmentationbysales?startDate=${startDate}&endDate=${endDate}`);

    let processedData;
    processedData = result.data;

    setSegmentationSalesData(processedData);
    setSegmentationSalesDataLoading(false);
  };

  const fetchSegmentationTransactionCountData = async (startDate, endDate) => {
    setSegmentationTransactionCountDataLoading(true);

    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcustomersegmentationbytransaction?startDate=${startDate}&endDate=${endDate}`);

    let processedData;
    processedData = result.data;

    setSegmentationTransactionCountData(processedData);
    setSegmentationTransactionCountDataLoading(false);
  };

  const fetchSegmentationCustomerTypeData = async (startDate, endDate) => {
    setSegmentationCustomerTypeDataLoading(true);

    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcustomersegmentationbytype?startDate=${startDate}&endDate=${endDate}`);

    let processedData;
    processedData = result.data;

    setSegmentationCustomerTypeData(processedData);
    setSegmentationCustomerTypeDataLoading(false);
  };

  const fetchModelSalesData = async (startDate, endDate) => {
    setModelSalesDataLoading(true);
    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

    let processedData;
    processedData = result.data;

    setModelSalesData(processedData);
    setModelSalesDataLoading(false);
  };

  const fetchModelSalesCountData = async (startDate, endDate) => {
    setModelSalesCountDataLoading(true);
    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

    let processedData;
    processedData = result.data;

    setModelSalesCountData(processedData);
    setModelSalesCountDataLoading(false);
  };

  const fetchCategorySalesData = async (startDate, endDate) => {
    setCategorySalesDataLoading(true);
    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

    let processedData;
    processedData = result.data;

    setCategorySalesData(processedData);
    setCategorySalesDataLoading(false);
  };
  
  const fetchCategorySalesCountData = async (startDate, endDate) => {
    setCategorySalesCountDataLoading(true);
    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

    let processedData;
    processedData = result.data;

    setCategorySalesCountData(processedData);
    setCategorySalesCountDataLoading(false);
  };

  const fetchProductSalesData = async (startDate, endDate) => {
    setProductSalesDataLoading(true);
    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsales?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

    let processedData;
    processedData = result.data;

    setProductSalesData(processedData);
    setProductSalesDataLoading(false);
  };
  
  const fetchProductSalesCountData = async (startDate, endDate) => {
    setProductSalesCountDataLoading(true);
    const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductsalescount?startDate=${startDate}&endDate=${endDate}&limit=10&page=1`);

    let processedData;
    processedData = result.data;

    setProductSalesCountData(processedData);
    setProductSalesCountDataLoading(false);
  };

  useEffect(() => {
    const fetchSalesData = async (startDate, endDate) => {
      setSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;
      let processedLegend;
      processedLegend = result.data.Legend;

      let resultObject = new Object();

      processedLegend.forEach(function (item) {
        let newObject = new Object();

        newObject.toggle = true;
        newObject.value = 0;
        newObject.range = vsLabel();
        newObject.growth = 0 / 0;
        newObject.growthTrend = 'down';

        resultObject[item] = newObject;
      });

      setSalesData(processedData);
      setSalesDataLoading(false);
      setToggleMultipleSales(resultObject);
      setNewDataLoad(true);
    };

    const fetchSalesCountData = async (startDate, endDate) => {
      setSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsalescount?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setSalesCountData(processedData);
      setSalesCountDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchAverageSalesData = async (startDate, endDate) => {
      setAverageSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getaveragesales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setAverageSalesData(processedData);
      setAverageSalesDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchMarginData = async (startDate, endDate) => {
      setMarginDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getanalyticgrossmargin?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setMarginData(processedData);
      setMarginDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchDescriptionData = async () => {
      setMarginDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getanalytictooltipdescription`);

      let processedData;
      processedData = result.data;

      setSalesDataDescription(processedData.Data.Sales);
      setSalesCountDataDescription(processedData.Data.SalesCount);
      setAverageSalesDataDescription(processedData.Data.AverageSalesValue);
      setMarginDataDescription(processedData.Data.MarginValue);
      setMarginRateDataDescription(processedData.Data.MarginValueRate);
    };

    const fetchPreviousSalesData = async (startDate, endDate) => {
      setPreviousSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousSalesData(processedData);
      setPreviousSalesDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousSalesCountData = async (startDate, endDate) => {
      setPreviousSalesCountDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getsalescount?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousSalesCountData(processedData);
      setPreviousSalesCountDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousAverageSalesData = async (startDate, endDate) => {
      setPreviousAverageSalesDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getaveragesales?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousAverageSalesData(processedData);
      setPreviousAverageSalesDataLoading(false);
      setNewDataLoad(true);
    };

    const fetchPreviousMarginData = async (startDate, endDate) => {
      setPreviousMarginDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getanalyticgrossmargin?startDate=${startDate}&endDate=${endDate}`);

      let processedData;
      processedData = result.data;

      setPreviousMarginData(processedData);
      setPreviousMarginDataLoading(false);
      setNewDataLoad(true);
    };

    if (fetchActive == true && checkToken()) {
      setNewDataLoad(false);
      setChannel(null);
      setChannelList(null);

      setCustomDayRange('');
      setCustomWeekRange('');
      setCustomMonthRange('');
      setCustomYearRange('');
      setCustomDateRange('');

      
      let momentStartDate;
      let momentEndDate;

      let momentPreviousStartDate;
      let momentPreviousEndDate;

      momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

      while (momentStartDate.month() == momentEndDate.month()) {
        momentStartDate = momentStartDate.subtract(1, "days");
      }

      while (momentStartDate.date() > momentEndDate.date()) {
        momentStartDate = momentStartDate.subtract(1, "days");
      }

      setMonthlyStartDate(momentStartDate.format('DD-MM-YYYY'));
      setMonthlyEndDate(momentEndDate.format('DD-MM-YYYY'));
      
      if (dataRange == 'realtime') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(2, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(2, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(14, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(8, "days");
      }
      else if (dataRange == 'monthly') {
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentStartDate.month() == momentEndDate.month()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        while (momentStartDate.date() > momentEndDate.date()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        momentPreviousEndDate = moment(momentStartDate).tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousStartDate = moment(momentPreviousEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentPreviousStartDate.month() == momentPreviousEndDate.month()) {
          momentPreviousStartDate = momentPreviousStartDate.subtract(1, "days");
        }

        while (momentPreviousStartDate.date() > momentPreviousEndDate.date()) {
          momentPreviousStartDate = momentPreviousStartDate.subtract(1, "days");
        }
      }

      let startDate;
      let endDate;

      let previousStartDate;
      let previousEndDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly'
        && dateOption != 'custom-date') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");

        previousStartDate = momentPreviousStartDate.format("YYYY-MM-DD");
        previousEndDate = momentPreviousEndDate.format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-daily') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomDayRange(`${moment(newStartDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "days").format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "days").format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-weekly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomWeekRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "weeks").startOf('isoWeek').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "weeks").endOf('isoWeek').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-monthly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomMonthRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "months").startOf('month').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "months").endOf('month').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-yearly') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomYearRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(1, "years").startOf('year').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "years").endOf('year').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-date') {
        startDate = newStartDate;
        endDate = newEndDate;

        setCustomDateRange(`${moment(newStartDate).format('DD-MM-YYYY')} - ${moment(newEndDate).format('DD-MM-YYYY')}`);

        previousStartDate = moment(newStartDate).subtract(dataRangeCount + 1, "days").format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(dataRangeCount + 1, "days").format("YYYY-MM-DD");
      }

      setCurrentStartDate(startDate);
      setCurrentEndDate(endDate);

      setSegmentationSalesData();
      setSegmentationTransactionCountData();
      setSegmentationCustomerTypeData();

      setSegmentationTab('1');

      setProductSalesData();
      setProductSalesCountData();
      setModelSalesData();
      setModelSalesCountData();
      setCategorySalesData();
      setCategorySalesCountData();
      
      setProductTab('1');

      fetchSalesData(startDate, endDate);
      fetchSalesCountData(startDate, endDate);
      fetchAverageSalesData(startDate, endDate);
      fetchMarginData(startDate, endDate);
      fetchDescriptionData();

      fetchPreviousSalesData(previousStartDate, previousEndDate);
      fetchPreviousSalesCountData(previousStartDate, previousEndDate);
      fetchPreviousAverageSalesData(previousStartDate, previousEndDate);
      fetchPreviousMarginData(previousStartDate, previousEndDate);

      setFetchActive(false);
    }
  }, [fetchActive]);
  
  useEffect(() => {
    const processMonthSaleData = (startDate, endDate, previousStartDate, previousEndDate) => {
      let legend = new Array();
      if (salesData)
        legend = salesData.Legend;

      let totalSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalSalesObject[item] = newObject;
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      if (salesData)
        data = salesData.Data;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        let object = ``;

        object += `{"label": "${moment(currentDate).format('MMM')}"`;
        object += `, "dataLabel": "${moment(currentDate).format('MMM')}"`;

        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
                totalSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
              else {
                object += `, "${legendItem}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          legend.forEach(function (legendItem) {
            object += `, "${legendItem}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }


      if (previousSalesData)
        data = previousSalesData.Data;

      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalPreviousSalesObject[item] = newObject;
      });


      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                totalPreviousSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
            });
          }
        });

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.chart = chart;
      
      legend.forEach(function (item) {
        if (toggleMultipleSales && toggleMultipleSales[item] != null) {
          toggleMultipleSales[item].value = totalSalesObject[item].value;
          toggleMultipleSales[item].range = vsLabel();
          if (totalSalesObject[item].value >= totalPreviousSalesObject[item].value) {
            toggleMultipleSales[item].growth = ((totalSalesObject[item].value / totalPreviousSalesObject[item].value) - 1) * 100;
            toggleMultipleSales[item].growthTrend = 'up';
          }
          else {
            toggleMultipleSales[item].growth = (1 - (totalSalesObject[item].value / totalPreviousSalesObject[item].value)) * 100;
            toggleMultipleSales[item].growthTrend = 'down';
          }
        }
      });
    
      return result;
    };

    const processDaySaleData = (startDate, endDate, previousStartDate, previousEndDate, dataRange) => {
      let legend = new Array();
      if (salesData)
        legend = salesData.Legend;

      let totalSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalSalesObject[item] = newObject;
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      if (salesData)
        data = salesData.Data;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dataRange == "monthly" && dateCounter % 2 == 0) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1' || moment(currentDate).format('Do') == '2')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        let dateExist = false;
        
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
                totalSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
              else {
                object += `, "${legendItem}": 0`;
              }
            });

            dateExist = true;
          }
        });

        if (dateExist == false) {
          legend.forEach(function (legendItem) {
            object += `, "${legendItem}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }



      if (previousSalesData)
        data = previousSalesData.Data;
      
      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalPreviousSalesObject[item] = newObject;
      });

      while (currentDate <= momentEndDate) { 
        data.forEach(function (dataItem) {
          let date = moment(dataItem.Date, "DD/MM/YYYY");

          if (moment(date).isSame(currentDate) == true) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                totalPreviousSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
            });
          }
        });

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.chart = chart;
      
      legend.forEach(function (item) {
        if (toggleMultipleSales && toggleMultipleSales[item] != null) {
          toggleMultipleSales[item].value = totalSalesObject[item].value;
          toggleMultipleSales[item].range = vsLabel();
          if (totalSalesObject[item].value >= totalPreviousSalesObject[item].value) {
            toggleMultipleSales[item].growth = ((totalSalesObject[item].value / totalPreviousSalesObject[item].value) - 1) * 100;
            toggleMultipleSales[item].growthTrend = 'up';
          }
          else {
            toggleMultipleSales[item].growth = (1 - (totalSalesObject[item].value / totalPreviousSalesObject[item].value)) * 100;
            toggleMultipleSales[item].growthTrend = 'down';
          }
        }
      });
    
      return result;
    };

    const processHourSaleData = (dataRange) => {
      let legend = new Array();
      if (salesData)
        legend = salesData.Legend;

      let totalSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalSalesObject[item] = newObject;
      });

      const chart = new Array();
      let addChart = new Object();
    
      let data = new Array();
      if (salesData)
        data = salesData.Data;

      let hourCounter = 0;
      let lastHour;

      if (dataRange == 'realtime' && dateOption != 'custom-daily')
        lastHour = parseInt(moment().tz("Asia/Jakarta").format('LT').slice(0, -3));
      else
        lastHour = 23;

      while (hourCounter <= 23) { 
        let object = ``;

        if (hourCounter % 6 == 0) {
          if (parseInt(hourCounter / 10) > 0)
            object += `{"label": "${hourCounter}:00"`;
          else
            object += `{"label": "0${hourCounter}:00"`;
        }
        else {
          object += `{"label": ""`;
        }

        if (parseInt(hourCounter / 10) > 0)
          object += `, "dataLabel": "${hourCounter}:00"`;
        else
          object += `, "dataLabel": "0${hourCounter}:00"`;

        let hourExist = false;
      
        data.forEach(function (dataItem) {
          let hour = parseInt(dataItem.Date);

          if (hourCounter == hour) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {
                object += `, "${legendItem}": ${dataItem[legendItem]}`;
                totalSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
              else {
                object += `, "${legendItem}": 0`;
              }
            });

            hourExist = true;
          }
        });

        if (hourExist == false) {
          legend.forEach(function (legendItem) {
            object += `, "${legendItem}": 0`;
          });
        }

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        hourCounter++;
      }

      hourCounter = 0;

      if (previousSalesData)
        data = previousSalesData.Data;

      let totalPreviousSalesObject = new Object();

      legend.forEach(function (item) {
        let newObject = new Object();

        newObject.value = 0;

        totalPreviousSalesObject[item] = newObject;
      });

      while (hourCounter <= lastHour) { 
        data.forEach(function (dataItem) {
          let hour = parseInt(dataItem.Date);

          if (hourCounter == hour) {
            legend.forEach(function (legendItem) {
              if (legendItem in dataItem) {    
                totalPreviousSalesObject[legendItem].value += parseFloat(dataItem[legendItem]);
              }
            });
          }
        });

        hourCounter++;
      }

      const result = new Object();
      result.chart = chart;
      
      legend.forEach(function (item) {
        if (toggleMultipleSales && toggleMultipleSales[item] != null) {
          toggleMultipleSales[item].value = totalSalesObject[item].value;
          toggleMultipleSales[item].range = vsLabel();
          if (totalSalesObject[item].value >= totalPreviousSalesObject[item].value) {
            toggleMultipleSales[item].growth = ((totalSalesObject[item].value / totalPreviousSalesObject[item].value) - 1) * 100;
            toggleMultipleSales[item].growthTrend = 'up';
          }
          else {
            toggleMultipleSales[item].growth = (1 - (totalSalesObject[item].value / totalPreviousSalesObject[item].value)) * 100;
            toggleMultipleSales[item].growthTrend = 'down';
          }
        }
      });
    
      return result;
    };

    const processMonthMasterSaleData = (startDate, endDate, previousStartDate, previousEndDate) => {
      const channelData = new Array();

      if (salesData) {
        channelData.push('ALL');
        salesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (salesCountData) {
        channelData.push('ALL');
        salesCountData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (averageSalesData) {
        channelData.push('ALL');
        averageSalesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (marginData) {
        channelData.push('ALL');
        marginData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      setChannelList(channelData);

      let currentChannel = 'NULL';

      if (channelData && channel == null) {
        currentChannel = channelData[0];
        setChannel(currentChannel);
      }
      else {
        currentChannel = channel;
      }

      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      if (toggleSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Pesanan';
      line.push(addLine);
      if (toggleSalesCount)
        chartLine.push(addLine);
      
      addLine = new Object();
      addLine.column = 'Penjualan/Pesanan';
      line.push(addLine);
      if (toggleAverageSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Margin (Rp)';
      line.push(addLine);
      if (toggleMarginValue)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Margin (%)';
      line.push(addLine);
      if (toggleMarginRate)
        chartLine.push(addLine);  

      const chart = new Array();
      let addChart = new Object();

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;

      let totalSalesValue = 0;
      let totalSalesCountValue = 0;
      let totalAverageSalesValue = 0;
      let totalMarginValue = 0;
      let totalMarginRateValue = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        let object = ``;

        object += `{"label": "${moment(currentDate).format('MMM')}"`;
        object += `, "dataLabel": "${moment(currentDate).format('MMM')}"`;

        let tempSalesValue = 0;
        let tempSalesCountValue = 0;
        let tempAverageSalesValue = 0;
        let tempMarginValue = 0;
        let tempMarginRateValue = 0;
        let tempMarginRateCounter = 0;

        line.forEach(function (lineItem) {
          let dateExist = false;
          let data = new Array();
          let legend = new Array();

          if (salesData && lineItem.column == 'Penjualan') {
            data = salesData.Data;
            legend = salesData.Legend;
          }
          else if (salesCountData && lineItem.column == 'Pesanan') {
            data = salesCountData.Data;
            legend = salesCountData.Legend;
          }
          else if (averageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = averageSalesData.Data;
            legend = averageSalesData.Legend;
          }
          else if (marginData && lineItem.column == 'Margin (Rp)') {
            data = marginData.Data;
            legend = marginData.Legend;
          }
          else if (marginData && lineItem.column == 'Margin (%)') {
            data = marginData.RateData;
            legend = marginData.Legend;
            totalMarginRateValue = marginData.TotalRate;
          }

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (legendItem == currentChannel && dataItem[legendItem] != undefined) {
                  object += `, "${lineItem.column}": ${dataItem[legendItem]}`;
                  dateExist = true;
                }

                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalSalesValue += parseFloat(dataItem[legendItem]);
                    tempSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalSalesCountValue += parseInt(dataItem[legendItem]);
                    tempSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (Rp)') {
                    totalMarginValue += parseFloat(dataItem[legendItem]);
                    tempMarginValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (%)') {
                    tempMarginRateValue += parseFloat(dataItem[legendItem]);
                    tempMarginRateCounter++;
                  }
                }
              });
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }

          tempAverageSalesValue = tempSalesCountValue == 0 ? 0 : (tempSalesValue / tempSalesCountValue);
          tempMarginRateValue = tempMarginRateCounter == 0 ? 0 : (tempMarginRateValue / tempMarginRateCounter);

          if (currentChannel == 'ALL') {
            if (lineItem.column == 'Penjualan') {
              object += `, "${lineItem.column}": ${tempSalesValue}`;
            }
            else if (lineItem.column == 'Pesanan') {
              object += `, "${lineItem.column}": ${tempSalesCountValue}`;
            }
            else if (lineItem.column == 'Penjualan/Pesanan') {
              object += `, "${lineItem.column}": ${tempAverageSalesValue}`;
            } 
            else if (lineItem.column == 'Margin (Rp)') {
              object += `, "${lineItem.column}": ${tempMarginValue}`;
            }
            else if (lineItem.column == 'Margin (%)') {
              object += `, "${lineItem.column}": ${tempMarginRateValue}`;
            }
          }
        });

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      totalAverageSalesValue = totalSalesCountValue == 0 ? 0 : (totalSalesValue / totalSalesCountValue);
      


      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesValue = 0;
      let totalPreviousSalesCountValue = 0;
      let totalPreviousAverageSalesValue = 0;
      let totalPreviousMarginValue = 0;
      let totalPreviousMarginRateValue = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');

        line.forEach(function (lineItem) {
          let data = new Array();
          let legend = new Array();

          if (previousSalesData && lineItem.column == 'Penjualan') {
            data = previousSalesData.Data;
            legend = previousSalesData.Legend;
          }
          else if (previousSalesCountData && lineItem.column == 'Pesanan') {
            data = previousSalesCountData.Data;
            legend = previousSalesCountData.Legend;
          }
          else if (previousAverageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = previousAverageSalesData.Data;
            legend = previousAverageSalesData.Legend;
          }
          else if (previousMarginData && lineItem.column == 'Margin (Rp)') {
            data = previousMarginData.Data;
            legend = previousMarginData.Legend;
          }
          else if (previousMarginData && lineItem.column == 'Margin (%)') {
            data = previousMarginData.RateData;
            legend = previousMarginData.Legend;
            totalPreviousMarginRateValue = previousMarginData.TotalRate;
          }

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalPreviousSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalPreviousSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (Rp)') {
                    totalPreviousMarginValue += parseFloat(dataItem[legendItem]);
                  }
                }
              });
            }
          });
        });

        currentDate.add(1, 'months');
      }
      
      totalPreviousAverageSalesValue = totalPreviousSalesCountValue == 0 ? 0 : (totalPreviousSalesValue / totalPreviousSalesCountValue);

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;
      
      const totalSales = new Object();
      totalSales.value = totalSalesValue;
      totalSales.range = vsLabel();
      if (totalSalesValue >= totalPreviousSalesValue) {
        totalSales.growth = ((totalSalesValue / totalPreviousSalesValue) - 1) * 100;
        totalSales.growthTrend = 'up';
      }
      else {
        totalSales.growth = (1 - (totalSalesValue / totalPreviousSalesValue)) * 100;
        totalSales.growthTrend = 'down';
      }
      setTotalSalesData(totalSales);

      const totalSalesCount = new Object();
      totalSalesCount.value = totalSalesCountValue;
      totalSalesCount.range = vsLabel();
      if (totalSalesCountValue >= totalPreviousSalesCountValue) {
        totalSalesCount.growth = ((totalSalesCountValue / totalPreviousSalesCountValue) - 1) * 100;
        totalSalesCount.growthTrend = 'up';
      }
      else {
        totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
        totalSalesCount.growthTrend = 'down';
      }
      setTotalSalesCountData(totalSalesCount);

      const totalAverageSales = new Object();
      totalAverageSales.value = totalAverageSalesValue;
      totalAverageSales.range = vsLabel();
      if (totalAverageSalesValue >= totalPreviousAverageSalesValue) {
        totalAverageSales.growth = ((totalAverageSalesValue / totalPreviousAverageSalesValue) - 1) * 100;
        totalAverageSales.growthTrend = 'up';
      }
      else {
        totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
        totalAverageSales.growthTrend = 'down';
      }
      setTotalAverageSalesData(totalAverageSales);

      const totalMargin = new Object();
      totalMargin.value = totalMarginValue;
      totalMargin.range = vsLabel();
      if (totalMarginValue >= totalPreviousMarginValue) {
        totalMargin.growth = ((totalMarginValue / totalPreviousMarginValue) - 1) * 100;
        totalMargin.growthTrend = 'up';
      }
      else {
        totalMargin.growth = (1 - (totalMarginValue / totalPreviousMarginValue)) * 100;
        totalMargin.growthTrend = 'down';
      }
      setTotalMarginValueData(totalMargin);

      const totalMarginRate = new Object();
      totalMarginRate.value = totalMarginRateValue;
      totalMarginRate.range = vsLabel();
      if (totalMarginRateValue >= totalPreviousMarginRateValue) {
        totalMarginRate.growth = totalMarginRateValue - totalPreviousMarginRateValue;
        totalMarginRate.growthTrend = 'up';
      }
      else {
        totalMarginRate.growth = totalPreviousMarginRateValue - totalMarginRateValue;
        totalMarginRate.growthTrend = 'down';
      }
      setTotalMarginRateData(totalMarginRate);

      /*
      console.log(totalSalesValue + " | " + totalPreviousSalesValue);
      console.log(totalSalesCountValue + " | " + totalPreviousSalesCountValue);
      console.log(totalAverageSalesValue + " | " + totalPreviousAverageSalesValue);
      */
    
      return result;
    };

    const processDayMasterSaleData = (startDate, endDate, previousStartDate, previousEndDate, dataRange) => {
      const channelData = new Array();

      if (salesData) {
        channelData.push('ALL');
        salesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (salesCountData) {
        channelData.push('ALL');
        salesCountData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (averageSalesData) {
        channelData.push('ALL');
        averageSalesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (marginData) {
        channelData.push('ALL');
        marginData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      setChannelList(channelData);

      let currentChannel = 'NULL';

      if (channelData && channel == null) {
        currentChannel = channelData[0];
        setChannel(currentChannel);
      }
      else {
        currentChannel = channel;
      }

      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      if (toggleSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Pesanan';
      line.push(addLine);
      if (toggleSalesCount)
        chartLine.push(addLine);
      
      addLine = new Object();
      addLine.column = 'Penjualan/Pesanan';
      line.push(addLine);
      if (toggleAverageSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Margin (Rp)';
      line.push(addLine);
      if (toggleMarginValue)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Margin (%)';
      line.push(addLine);
      if (toggleMarginRate)
        chartLine.push(addLine);  
    
      const chart = new Array();
      let addChart = new Object();

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalSalesValue = 0;
      let totalSalesCountValue = 0;
      let totalAverageSalesValue = 0;
      let totalMarginValue = 0;
      let totalMarginRateValue = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dataRange == "monthly" && dateCounter % 2 == 0) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1' || moment(currentDate).format('Do') == '2')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        let tempSalesValue = 0;
        let tempSalesCountValue = 0;
        let tempAverageSalesValue = 0;
        let tempMarginValue = 0;
        let tempMarginRateValue = 0;
        let tempMarginRateCounter = 0;

        line.forEach(function (lineItem) {
          let dateExist = false;
          let data = new Array();
          let legend = new Array();

          if (salesData && lineItem.column == 'Penjualan') {
            data = salesData.Data;
            legend = salesData.Legend;
          }
          else if (salesCountData && lineItem.column == 'Pesanan') {
            data = salesCountData.Data;
            legend = salesCountData.Legend;
          }
          else if (averageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = averageSalesData.Data;
            legend = averageSalesData.Legend;
          }
          else if (marginData && lineItem.column == 'Margin (Rp)') {
            data = marginData.Data;
            legend = marginData.Legend;
          }
          else if (marginData && lineItem.column == 'Margin (%)') {
            data = marginData.RateData;
            legend = marginData.Legend;
            totalMarginRateValue = marginData.TotalRate;
          }

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (legendItem == currentChannel && dataItem[legendItem] != undefined) {
                  object += `, "${lineItem.column}": ${dataItem[legendItem]}`;
                  dateExist = true;
                }

                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalSalesValue += parseFloat(dataItem[legendItem]);
                    tempSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalSalesCountValue += parseInt(dataItem[legendItem]);
                    tempSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (Rp)') {
                    totalMarginValue += parseFloat(dataItem[legendItem]);
                    tempMarginValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (%)') {
                    tempMarginRateValue += parseFloat(dataItem[legendItem]);
                    tempMarginRateCounter++;
                  }
                }
              });
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }

          tempAverageSalesValue = tempSalesCountValue == 0 ? 0 : (tempSalesValue / tempSalesCountValue);
          tempMarginRateValue = tempMarginRateCounter == 0 ? 0 : (tempMarginRateValue / tempMarginRateCounter);

          if (currentChannel == 'ALL') {
            if (lineItem.column == 'Penjualan') {
              object += `, "${lineItem.column}": ${tempSalesValue}`;
            }
            else if (lineItem.column == 'Pesanan') {
              object += `, "${lineItem.column}": ${tempSalesCountValue}`;
            }
            else if (lineItem.column == 'Penjualan/Pesanan') {
              object += `, "${lineItem.column}": ${tempAverageSalesValue}`;
            } 
            else if (lineItem.column == 'Margin (Rp)') {
              object += `, "${lineItem.column}": ${tempMarginValue}`;
            }
            else if (lineItem.column == 'Margin (%)') {
              object += `, "${lineItem.column}": ${tempMarginRateValue}`;
            }
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      totalAverageSalesValue = totalSalesCountValue == 0 ? 0 : (totalSalesValue / totalSalesCountValue);

      
      
      momentStartDate = moment(previousStartDate, "YYYY-MM-DD");
      momentEndDate = moment(previousEndDate, "YYYY-MM-DD");

      currentDate = momentStartDate;

      let totalPreviousSalesValue = 0;
      let totalPreviousSalesCountValue = 0;
      let totalPreviousAverageSalesValue = 0;
      let totalPreviousMarginValue = 0;
      let totalPreviousMarginRateValue = 0;

      while (currentDate <= momentEndDate) { 
        line.forEach(function (lineItem) {
          let data = new Array();
          let legend = new Array();

          if (previousSalesData && lineItem.column == 'Penjualan') {
            data = previousSalesData.Data;
            legend = previousSalesData.Legend;
          }
          else if (previousSalesCountData && lineItem.column == 'Pesanan') {
            data = previousSalesCountData.Data;
            legend = previousSalesCountData.Legend;
          }
          else if (previousAverageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = previousAverageSalesData.Data;
            legend = previousAverageSalesData.Legend;
          }
          else if (previousMarginData && lineItem.column == 'Margin (Rp)') {
            data = previousMarginData.Data;
            legend = previousMarginData.Legend;
          }
          else if (previousMarginData && lineItem.column == 'Margin (%)') {
            data = previousMarginData.RateData;
            legend = previousMarginData.Legend;
            totalPreviousMarginRateValue = previousMarginData.TotalRate;
          }

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalPreviousSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalPreviousSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (Rp)') {
                    totalPreviousMarginValue += parseFloat(dataItem[legendItem]);
                  }
                }
              });
            }
          });
        });

        currentDate.add(1, 'days');
      }

      totalPreviousAverageSalesValue = totalPreviousSalesCountValue == 0 ? 0 : (totalPreviousSalesValue / totalPreviousSalesCountValue);

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;
      
      const totalSales = new Object();
      totalSales.value = totalSalesValue;
      totalSales.range = vsLabel();
      if (totalSalesValue >= totalPreviousSalesValue) {
        totalSales.growth = ((totalSalesValue / totalPreviousSalesValue) - 1) * 100;
        totalSales.growthTrend = 'up';
      }
      else {
        totalSales.growth = (1 - (totalSalesValue / totalPreviousSalesValue)) * 100;
        totalSales.growthTrend = 'down';
      }
      setTotalSalesData(totalSales);

      const totalSalesCount = new Object();
      totalSalesCount.value = totalSalesCountValue;
      totalSalesCount.range = vsLabel();
      if (totalSalesCountValue >= totalPreviousSalesCountValue) {
        totalSalesCount.growth = ((totalSalesCountValue / totalPreviousSalesCountValue) - 1) * 100;
        totalSalesCount.growthTrend = 'up';
      }
      else {
        totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
        totalSalesCount.growthTrend = 'down';
      }
      setTotalSalesCountData(totalSalesCount);

      const totalAverageSales = new Object();
      totalAverageSales.value = totalAverageSalesValue;
      totalAverageSales.range = vsLabel();
      if (totalAverageSalesValue >= totalPreviousAverageSalesValue) {
        totalAverageSales.growth = ((totalAverageSalesValue / totalPreviousAverageSalesValue) - 1) * 100;
        totalAverageSales.growthTrend = 'up';
      }
      else {
        totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
        totalAverageSales.growthTrend = 'down';
      }
      setTotalAverageSalesData(totalAverageSales);

      const totalMargin = new Object();
      totalMargin.value = totalMarginValue;
      totalMargin.range = vsLabel();
      if (totalMarginValue >= totalPreviousMarginValue) {
        totalMargin.growth = ((totalMarginValue / totalPreviousMarginValue) - 1) * 100;
        totalMargin.growthTrend = 'up';
      }
      else {
        totalMargin.growth = (1 - (totalMarginValue / totalPreviousMarginValue)) * 100;
        totalMargin.growthTrend = 'down';
      }
      setTotalMarginValueData(totalMargin);

      const totalMarginRate = new Object();
      totalMarginRate.value = totalMarginRateValue;
      totalMarginRate.range = vsLabel();
      if (totalMarginRateValue >= totalPreviousMarginRateValue) {
        totalMarginRate.growth = totalMarginRateValue - totalPreviousMarginRateValue;
        totalMarginRate.growthTrend = 'up';
      }
      else {
        totalMarginRate.growth = totalPreviousMarginRateValue - totalMarginRateValue;
        totalMarginRate.growthTrend = 'down';
      }
      setTotalMarginRateData(totalMarginRate);

      /*
      console.log(totalSalesValue + " | " + totalPreviousSalesValue);
      console.log(totalSalesCountValue + " | " + totalPreviousSalesCountValue);
      console.log(totalAverageSalesValue + " | " + totalPreviousAverageSalesValue);
      */
    
      return result;
    };

    const processHourMasterSaleData = (dataRange) => {
      const channelData = new Array();

      if (salesData) {
        channelData.push('ALL');
        salesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (salesCountData) {
        channelData.push('ALL');
        salesCountData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (averageSalesData) {
        channelData.push('ALL');
        averageSalesData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      else if (marginData) {
        channelData.push('ALL');
        marginData.Legend.forEach(function (lineItem) {
          channelData.push(lineItem);
        });
      }
      setChannelList(channelData);

      let currentChannel = 'NULL';

      if (channelData && channel == null) {
        currentChannel = channelData[0];
        setChannel(currentChannel);
      }
      else {
        currentChannel = channel;
      }

      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      if (toggleSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Pesanan';
      line.push(addLine);
      if (toggleSalesCount)
        chartLine.push(addLine);
      
      addLine = new Object();
      addLine.column = 'Penjualan/Pesanan';
      line.push(addLine);
      if (toggleAverageSales)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Margin (Rp)';
      line.push(addLine);
      if (toggleMarginValue)
        chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Margin (%)';
      line.push(addLine);
      if (toggleMarginRate)
        chartLine.push(addLine);  

      const chart = new Array();
      let addChart = new Object();

      let hourCounter = 0;

      let totalSalesValue = 0;
      let totalSalesCountValue = 0;
      let totalAverageSalesValue = 0;
      let totalMarginValue = 0;
      let totalMarginRateValue = 0;

      let lastHour;

      if (dataRange == 'realtime' && dateOption != 'custom-daily')
        lastHour = parseInt(moment().tz("Asia/Jakarta").format('LT').slice(0, -3));
      else
        lastHour = 23;

      while (hourCounter <= 23) { 
        let object = ``;

        if (hourCounter % 6 == 0) {
          if (parseInt(hourCounter / 10) > 0)
            object += `{"label": "${hourCounter}:00"`;
          else
            object += `{"label": "0${hourCounter}:00"`;
        }
        else {
          object += `{"label": ""`;
        }

        if (parseInt(hourCounter / 10) > 0)
          object += `, "dataLabel": "${hourCounter}:00"`;
        else
          object += `, "dataLabel": "0${hourCounter}:00"`;

        let tempSalesValue = 0;
        let tempSalesCountValue = 0;
        let tempAverageSalesValue = 0;
        let tempMarginValue = 0;
        let tempMarginRateValue = 0;
        let tempMarginRateCounter = 0;

        line.forEach(function (lineItem) {
          let hourExist = false;
          let data = new Array();
          let legend = new Array();

          if (salesData && lineItem.column == 'Penjualan') {
            data = salesData.Data;
            legend = salesData.Legend;
          }
          else if (salesCountData && lineItem.column == 'Pesanan') {
            data = salesCountData.Data;
            legend = salesCountData.Legend;
          }
          else if (averageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = averageSalesData.Data;
            legend = averageSalesData.Legend;
          }
          else if (marginData && lineItem.column == 'Margin (Rp)') {
            data = marginData.Data;
            legend = marginData.Legend;
          }
          else if (marginData && lineItem.column == 'Margin (%)') {
            data = marginData.RateData;
            legend = marginData.Legend;
            totalMarginRateValue = marginData.TotalRate;
          }

          data.forEach(function (dataItem) {
            let hour = parseInt(dataItem.Date);

            if (hourCounter == hour) {
              legend.forEach(function (legendItem) {
                if (legendItem == currentChannel && dataItem[legendItem] != undefined) {
                  object += `, "${lineItem.column}": ${dataItem[legendItem]}`;
                  hourExist = true;
                }
                
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalSalesValue += parseFloat(dataItem[legendItem]);
                    tempSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalSalesCountValue += parseInt(dataItem[legendItem]);
                    tempSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (Rp)') {
                    totalMarginValue += parseFloat(dataItem[legendItem]);
                    tempMarginValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (%)') {
                    tempMarginRateValue += parseFloat(dataItem[legendItem]);
                    tempMarginRateCounter++;
                  }
                }
              });
            } 
          });

          if (hourExist == false) {
            object += `, "${lineItem.column}": 0`;
          }

          tempAverageSalesValue = tempSalesCountValue == 0 ? 0 : (tempSalesValue / tempSalesCountValue);
          tempMarginRateValue = tempMarginRateCounter == 0 ? 0 : (tempMarginRateValue / tempMarginRateCounter);
          
          if (currentChannel == 'ALL') {
            if (lineItem.column == 'Penjualan') {
              object += `, "${lineItem.column}": ${tempSalesValue}`;
            }
            else if (lineItem.column == 'Pesanan') {
              object += `, "${lineItem.column}": ${tempSalesCountValue}`;
            }
            else if (lineItem.column == 'Penjualan/Pesanan') {
              object += `, "${lineItem.column}": ${tempAverageSalesValue}`;
            } 
            else if (lineItem.column == 'Margin (Rp)') {
              object += `, "${lineItem.column}": ${tempMarginValue}`;
            }
            else if (lineItem.column == 'Margin (%)') {
              object += `, "${lineItem.column}": ${tempMarginRateValue}`;
            }
          }
        });

        object += `}`;
            
        addChart = JSON.parse(object);
        chart.push(addChart);

        hourCounter++;
      }

      totalAverageSalesValue = totalSalesCountValue == 0 ? 0 : (totalSalesValue / totalSalesCountValue);



      hourCounter = 0;

      let totalPreviousSalesValue = 0;
      let totalPreviousSalesCountValue = 0;
      let totalPreviousAverageSalesValue = 0;
      let totalPreviousMarginValue = 0;
      let totalPreviousMarginRateValue = 0;

      while (hourCounter <= lastHour) { 
        line.forEach(function (lineItem) {
          let data = new Array();
          let legend = new Array();

          if (previousSalesData && lineItem.column == 'Penjualan') {
            data = previousSalesData.Data;
            legend = previousSalesData.Legend;
          }
          else if (previousSalesCountData && lineItem.column == 'Pesanan') {
            data = previousSalesCountData.Data;
            legend = previousSalesCountData.Legend;
          }
          else if (previousAverageSalesData && lineItem.column == 'Penjualan/Pesanan') {
            data = previousAverageSalesData.Data;
            legend = previousAverageSalesData.Legend;
          }
          else if (previousMarginData && lineItem.column == 'Margin (Rp)') {
            data = previousMarginData.Data;
            legend = previousMarginData.Legend;
          }
          else if (previousMarginData && lineItem.column == 'Margin (%)') {
            data = previousMarginData.RateData;
            legend = previousMarginData.Legend;
            totalPreviousMarginRateValue = previousMarginData.TotalRate;
          }

          data.forEach(function (dataItem) {
            let hour = parseInt(dataItem.Date);

            if (hourCounter == hour) {
              legend.forEach(function (legendItem) {
                if (dataItem[legendItem] != undefined && (legendItem == currentChannel || currentChannel == 'ALL')) {
                  if (lineItem.column == 'Penjualan') {
                    totalPreviousSalesValue += parseFloat(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Pesanan') {
                    totalPreviousSalesCountValue += parseInt(dataItem[legendItem]);
                  }
                  else if (lineItem.column == 'Margin (Rp)') {
                    totalPreviousMarginValue += parseFloat(dataItem[legendItem]);
                  }
                }
              });
            }
          });
        });

        hourCounter++;
      }

      totalPreviousAverageSalesValue = totalPreviousSalesCountValue == 0 ? 0 : (totalPreviousSalesValue / totalPreviousSalesCountValue);

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;
      
      const totalSales = new Object();
      totalSales.value = totalSalesValue;
      totalSales.range = vsLabel();
      if (totalSalesValue >= totalPreviousSalesValue) {
        totalSales.growth = ((totalSalesValue / totalPreviousSalesValue) - 1) * 100;
        totalSales.growthTrend = 'up';
      }
      else {
        totalSales.growth = (1 - (totalSalesValue / totalPreviousSalesValue)) * 100;
        totalSales.growthTrend = 'down';
      }
      setTotalSalesData(totalSales);

      const totalSalesCount = new Object();
      totalSalesCount.value = totalSalesCountValue;
      totalSalesCount.range = vsLabel();
      totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
      if (totalSalesCountValue >= totalPreviousSalesCountValue) {
        totalSalesCount.growth = ((totalSalesCountValue / totalPreviousSalesCountValue) - 1) * 100;
        totalSalesCount.growthTrend = 'up';
      }
      else {
        totalSalesCount.growth = (1 - (totalSalesCountValue / totalPreviousSalesCountValue)) * 100;
        totalSalesCount.growthTrend = 'down';
      }
      setTotalSalesCountData(totalSalesCount);

      const totalAverageSales = new Object();
      totalAverageSales.value = totalAverageSalesValue;
      totalAverageSales.range = vsLabel();
      totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
      if (totalAverageSalesValue >= totalPreviousAverageSalesValue) {
        totalAverageSales.growth = ((totalAverageSalesValue / totalPreviousAverageSalesValue) - 1) * 100;
        totalAverageSales.growthTrend = 'up';
      }
      else {
        totalAverageSales.growth = (1 - (totalAverageSalesValue / totalPreviousAverageSalesValue)) * 100;
        totalAverageSales.growthTrend = 'down';
      }
      setTotalAverageSalesData(totalAverageSales);

      const totalMargin = new Object();
      totalMargin.value = totalMarginValue;
      totalMargin.range = vsLabel();
      if (totalMarginValue >= totalPreviousMarginValue) {
        totalMargin.growth = ((totalMarginValue / totalPreviousMarginValue) - 1) * 100;
        totalMargin.growthTrend = 'up';
      }
      else {
        totalMargin.growth = (1 - (totalMarginValue / totalPreviousMarginValue)) * 100;
        totalMargin.growthTrend = 'down';
      }
      setTotalMarginValueData(totalMargin);

      const totalMarginRate = new Object();
      totalMarginRate.value = totalMarginRateValue;
      totalMarginRate.range = vsLabel();
      if (totalMarginRateValue >= totalPreviousMarginRateValue) {
        totalMarginRate.growth = totalMarginRateValue - totalPreviousMarginRateValue;
        totalMarginRate.growthTrend = 'up';
      }
      else {
        totalMarginRate.growth = totalPreviousMarginRateValue - totalMarginRateValue;
        totalMarginRate.growthTrend = 'down';
      }
      setTotalMarginRateData(totalMarginRate);
      
      /*
      console.log(totalSalesValue + " | " + totalPreviousSalesValue);
      console.log(totalSalesCountValue + " | " + totalPreviousSalesCountValue);
      console.log(totalAverageSalesValue + " | " + totalPreviousAverageSalesValue);
      */

      return result;
    };

    const fetchMasterSalesData = async (startDate, endDate, previousStartDate, previousEndDate, dataRange) => {
      let processedData;
      let processedMasterData;

      if (dataRange == 'realtime' || dataRange == 'yesterday') {
        processedData = processHourSaleData(dataRange);
        processedMasterData = processHourMasterSaleData(dataRange);
      }
      else if (dataRange == 'yearly') {
        processedData = processMonthSaleData(startDate, endDate, previousStartDate, previousEndDate);
        processedMasterData = processMonthMasterSaleData(startDate, endDate, previousStartDate, previousEndDate);
      }
      else {
        processedData = processDaySaleData(startDate, endDate, previousStartDate, previousEndDate, dataRange);
        processedMasterData = processDayMasterSaleData(startDate, endDate, previousStartDate, previousEndDate, dataRange);
      }
        
      setMasterMultipleSalesData(processedData);
      setMasterSalesData(processedMasterData);
    };

    if ((newDataLoad == true || firstLoad == true || dataReload == true) && checkToken()) {
        
      let momentStartDate;
      let momentEndDate;

      let momentPreviousStartDate;
      let momentPreviousEndDate;
      
      if (dataRange == 'realtime') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(2, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(2, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");

        momentPreviousStartDate = moment().tz("Asia/Jakarta").subtract(14, "days");
        momentPreviousEndDate = moment().tz("Asia/Jakarta").subtract(8, "days");
      }
      else if (dataRange == 'monthly') {
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentStartDate.month() == momentEndDate.month()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        while (momentStartDate.date() > momentEndDate.date()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        momentPreviousEndDate = moment(momentStartDate).tz("Asia/Jakarta").subtract(1, "days");
        momentPreviousStartDate = moment(momentPreviousEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentPreviousStartDate.month() == momentPreviousEndDate.month()) {
          momentPreviousStartDate = momentPreviousStartDate.subtract(1, "days");
        }

        while (momentPreviousStartDate.date() > momentPreviousEndDate.date()) {
          momentPreviousStartDate = momentPreviousStartDate.subtract(1, "days");
        }
      }

      let startDate;
      let endDate;

      let previousStartDate;
      let previousEndDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly'
        && dateOption != 'custom-date') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");

        previousStartDate = momentPreviousStartDate.format("YYYY-MM-DD");
        previousEndDate = momentPreviousEndDate.format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-daily') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "days").format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "days").format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-weekly') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "weeks").startOf('isoWeek').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "weeks").endOf('isoWeek').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-monthly') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "months").startOf('month').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "months").endOf('month').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-yearly') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(1, "years").startOf('year').format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(1, "years").endOf('year').format("YYYY-MM-DD");
      }
      else if (dateOption == 'custom-date') {
        startDate = newStartDate;
        endDate = newEndDate;

        previousStartDate = moment(newStartDate).subtract(dataRangeCount + 1, "days").format("YYYY-MM-DD");
        previousEndDate = moment(newEndDate).subtract(dataRangeCount + 1, "days").format("YYYY-MM-DD");
      }
      
      fetchMasterSalesData(startDate, endDate, previousStartDate, previousEndDate, dataRange);

      if (firstLoad == true)
        setFirstLoad(false);

      setDataReload(false);
    }
  }, [salesData, salesCountData, averageSalesData, marginData, previousSalesData, previousSalesCountData, previousAverageSalesData, previousMarginData, channel, toggleSales, toggleSalesCount, toggleAverageSales, toggleMarginValue, toggleMarginRate, toggleMultipleSales, dataReload]);

  useEffect(() => {
    if (segmentationFetchActive == true && checkToken()) {
      
      let momentStartDate;
      let momentEndDate;
      
      if (dataRange == 'realtime') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'monthly') {
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentStartDate.month() == momentEndDate.month()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        while (momentStartDate.date() > momentEndDate.date()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }
      }

      let startDate;
      let endDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly'
        && dateOption != 'custom-date') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");
      }
      else {
        startDate = newStartDate;
        endDate = newEndDate;
      }

      fetchSegmentationSalesData(startDate, endDate);

      setSegmentationFetchActive(false);
    }
  }, [segmentationFetchActive]);

  useEffect(() => {
    if (productFetchActive == true && checkToken()) {
      
      let momentStartDate;
      let momentEndDate;
      
      if (dataRange == 'realtime') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(0, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(0, "days");
      }
      else if (dataRange == 'yesterday') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'weekly') {
        momentStartDate = moment().tz("Asia/Jakarta").subtract(7, "days");
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
      }
      else if (dataRange == 'monthly') {
        momentEndDate = moment().tz("Asia/Jakarta").subtract(1, "days");
        momentStartDate = moment(momentEndDate).tz("Asia/Jakarta").subtract(28, "days");

        while (momentStartDate.month() == momentEndDate.month()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }

        while (momentStartDate.date() > momentEndDate.date()) {
          momentStartDate = momentStartDate.subtract(1, "days");
        }
      }

      let startDate;
      let endDate;

      if (dateOption != 'custom-daily' 
        && dateOption != 'custom-weekly' 
        && dateOption != 'custom-monthly' 
        && dateOption != 'custom-yearly'
        && dateOption != 'custom-date') {
        startDate = momentStartDate.format("YYYY-MM-DD");
        endDate = momentEndDate.format("YYYY-MM-DD");
      }
      else {
        startDate = newStartDate;
        endDate = newEndDate;
      }

      fetchModelSalesData(startDate, endDate);

      setProductFetchActive(false);
    }
  }, [productFetchActive]);

  useEffect(() => {
    const fetchProductModelsData = async (active) => {
      setModelCategoryDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductmodels?active=${active}`);

      let processedData;
      processedData = result.data;

      setProductModelsData(processedData.Data);
      setModel(processedData.Data[0]);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setProductCategoriesCacheData(object);

      setCategoryFetchActive(true);
      setModelCategoryDataLoading(false);
    };

    if (modelFetchActive == true && checkToken()) {
      fetchProductModelsData(modelCategoryDataActive);
      
      setModelFetchActive(false);
    }
  }, [modelFetchActive]);

  useEffect(() => {
    const fetchProductCategoriesData = async (model) => {
      setModelCategoryDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductcategories?model=${model}`);

      let processedData;
      processedData = result.data;

      setProductCategoriesData(processedData.Data[0] ? processedData.Data : ['TIDAK ADA KATEGORI']);
      setCategory(processedData.Data[0] ? processedData.Data[0] : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of productCategoriesCacheData.Data) {
        map.set(key, value);
      }

      map.set(model, processedData.Data[0] ? processedData.Data : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setProductCategoriesCacheData(object);
      setModelCategoryDataLoading(false);
    };

    if (categoryFetchActive == true && checkToken()) {
      if (productCategoriesCacheData.Data.has(model) == false) {
        fetchProductCategoriesData(model);
      }
      else {
        setProductCategoriesData(productCategoriesCacheData.Data.get(model));
        setCategory(productCategoriesCacheData.Data.get(model)[0]);
      }
      
      setCategoryFetchActive(false);
    }
  }, [categoryFetchActive]);

  useEffect(() => {
    const processMonthModelCategorySaleData = (endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;
      const startDate = processedData.LaunchDate;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let monthCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');
        monthCounter++; 
        let object = ``;

        if (dateDifference > 1095 && monthCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 730 && dateDifference <= 1095 && monthCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 365 && dateDifference <= 730 && monthCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('MMM') == 'Jan')
            object += `{"label": "${moment(currentDate).format('MMM YYYY')}"`;
          else
            object += `{"label": "${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('MMM YYYY')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = totalValue;
      totalModelCategory.quantity = totalQuantity;

      setTotalModelCategoryData(totalModelCategory);
    
      return result;
    };

    const processWeekModelCategorySaleData = (endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;
      const startDate = processedData.LaunchDate;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss").startOf('isoWeek');
      let momentEndDate = moment(endDate, "YYYY-MM-DD").startOf('isoWeek');

      let currentDate = momentStartDate;
      let weekCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        weekCounter++;
        let object = ``;

        if (dateDifference > 140 && weekCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 100 && dateDifference <= 140 && weekCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 60 && dateDifference <= 100 && weekCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          object += `{"label": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let week = parseInt(dataItem.Date.substring(4, 6));

            if (week == currentDate.isoWeek()) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'weeks');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = totalValue;
      totalModelCategory.quantity = totalQuantity;

      setTotalModelCategoryData(totalModelCategory);
    
      return result;
    };

    const processDayModelCategorySaleData = (endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;
      const startDate = processedData.LaunchDate;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD HH:mm:ss");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dateDifference > 45 && dateCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 30 && dateDifference <= 45 && dateCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 15 && dateDifference <= 30 && dateCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }
              
              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = totalValue;
      totalModelCategory.quantity = totalQuantity;

      setTotalModelCategoryData(totalModelCategory);
    
      return result;
    };

    const fetchModelCategorySalesData = async (endDate, model, category) => {
      setModelCategoryDataLoading(true);

      const result = await axios({
        method: 'post',
        url: 'https://api.ultige.com/ultigeapi/web/analytic/getmodelcategorysales_v2',
        data: {
          endDate: endDate,
          model: model, 
          category: category
        }
      });

      let processedData;
      processedData = result.data;

      let newData;

      if (processedData.DateDifference <= 60) {
        newData = processDayModelCategorySaleData(endDate, processedData);
      }
      else if (processedData.DateDifference > 60 && processedData.DateDifference < 180) {
        newData = processWeekModelCategorySaleData(endDate, processedData);
      }
      else if (processedData.DateDifference >= 180) {
        newData = processMonthModelCategorySaleData(endDate, processedData);
      }

      if (category == 'TIDAK ADA KATEGORI') {
        newData = null;
      }

      setModelCategoryData(newData);
      setModelCategoryDataLoading(false);
    };

    if (checkToken() && category) {
      let endDate;
      endDate = moment(modelCategoryEndDate).format("YYYY-MM-DD");
      
      fetchModelCategorySalesData(endDate, model, category)
    }
  }, [category, modelCategoryEndDate]);

  useEffect(() => {
    const fetchValueStockData = async () => {
      setValueStockDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getstockvaluedata`);

      let processedData;
      processedData = result.data;

      setValueStockData(processedData);
      setValueStockDataLoading(false);
      setValueStockFetchActive(false);
    };

    if (valueStockFetchActive && checkToken()) {
      fetchValueStockData();
    }
  }, [valueStockFetchActive]);

  useEffect(() => {
    const fetchProductModelsCustomData = async (active) => {
      setModelCategoryCustomDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductmodels?active=${active}`);

      let processedData;
      processedData = result.data;

      setProductModelsCustomData(processedData.Data);
      setModelCustom(processedData.Data[0]);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setProductCategoriesCustomCacheData(object);

      setCategoryCustomFetchActive(true);
      setModelCategoryCustomDataLoading(false);
    };

    if (modelCustomFetchActive == true && checkToken()) {
      fetchProductModelsCustomData(modelCategoryCustomDataActive);
      
      setModelCustomFetchActive(false);
    }
  }, [modelCustomFetchActive]);

  useEffect(() => {
    const fetchProductCategoriesCustomData = async (model) => {
      setModelCategoryCustomDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductcategories?model=${model}`);

      let processedData;
      processedData = result.data;

      setProductCategoriesCustomData(processedData.Data[0] ? ['ALL', ...processedData.Data] : ['TIDAK ADA KATEGORI']);
      setCategoryCustom(processedData.Data[0] ? 'ALL' : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of productCategoriesCustomCacheData.Data) {
        map.set(key, value);
      }

      map.set(model, processedData.Data[0] ? ['ALL', ...processedData.Data] : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setProductCategoriesCustomCacheData(object);
      setModelCategoryCustomDataLoading(false);
    };

    if (categoryCustomFetchActive == true && checkToken()) {
      if (productCategoriesCustomCacheData.Data.has(modelCustom) == false) {
        fetchProductCategoriesCustomData(modelCustom);
      }
      else {
        setProductCategoriesCustomData(productCategoriesCustomCacheData.Data.get(modelCustom));
        setCategoryCustom(productCategoriesCustomCacheData.Data.get(modelCustom)[0]);
      }
      
      setCategoryCustomFetchActive(false);
    }
  }, [categoryCustomFetchActive]);

  useEffect(() => {
    const processMonthModelCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let monthCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');
        monthCounter++; 
        let object = ``;

        if (dateDifference > 1095 && monthCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 730 && dateDifference <= 1095 && monthCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 365 && dateDifference <= 730 && monthCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('MMM') == 'Jan')
            object += `{"label": "${moment(currentDate).format('MMM YYYY')}"`;
          else
            object += `{"label": "${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('MMM YYYY')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = processedData.TotalValue;
      totalModelCategory.quantity = processedData.TotalQuantity;

      setTotalModelCategoryCustomData(totalModelCategory);
    
      return result;
    };

    const processWeekModelCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD").startOf('isoWeek');
      let momentEndDate = moment(endDate, "YYYY-MM-DD").startOf('isoWeek');

      let currentDate = momentStartDate;
      let weekCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        weekCounter++;
        let object = ``;

        if (dateDifference > 140 && weekCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 100 && dateDifference <= 140 && weekCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 60 && dateDifference <= 100 && weekCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          object += `{"label": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let week = parseInt(dataItem.Date.substring(4, 6));

            if (week == currentDate.isoWeek()) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'weeks');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = processedData.TotalValue;
      totalModelCategory.quantity = processedData.TotalQuantity;

      setTotalModelCategoryCustomData(totalModelCategory);
    
      return result;
    };

    const processDayModelCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dateDifference > 45 && dateCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 30 && dateDifference <= 45 && dateCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 15 && dateDifference <= 30 && dateCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }
              
              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalModelCategory = new Object();
      totalModelCategory.value = processedData.TotalValue;
      totalModelCategory.quantity = processedData.TotalQuantity;

      setTotalModelCategoryCustomData(totalModelCategory);
    
      return result;
    };

    const fetchModelCategorySalesCustomData = async (startDate, endDate, modelCustom, categoryCustom) => {
      setModelCategoryCustomDataLoading(true);

      const result = await axios({
        method: 'post',
        url: 'https://api.ultige.com/ultigeapi/web/analytic/getmodelcategorysales2_v2',
        data: {
          startDate: startDate, 
          endDate: endDate,
          model: modelCustom, 
          category: categoryCustom
        }
      });

      let processedData;
      processedData = result.data;

      let newData;

      if (processedData.DateDifference <= 60) {
        newData = processDayModelCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference > 60 && processedData.DateDifference < 180) {
        newData = processWeekModelCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference >= 180) {
        newData = processMonthModelCategorySaleCustomData(startDate, endDate, processedData);
      }

      if (categoryCustom == 'TIDAK ADA KATEGORI') {
        newData = null;
      }

      setModelCategoryCustomData(newData);
      setModelCategoryCustomDataLoading(false);
    };

    const fetchModelCategorySalesCustomAllData = async (startDate, endDate, modelCustom, categoryCustom) => {
      setModelCategoryCustomDataLoading(true);

      let totalValue = 0;
      let totalQuantity = 0;
      let dateDifference = 0;
      const allData = new Array();

      for (var category of productCategoriesCustomData) {
        if (category != 'ALL') {
          const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelcategorysales2?startDate=${startDate}&endDate=${endDate}&model=${modelCustom}&category=${category}`);

          let processedData = result.data;

          totalValue += processedData.TotalValue;
          totalQuantity += processedData.TotalQuantity;
          dateDifference = processedData.DateDifference;

          for (var data of processedData.Data) {
            const result = allData.findIndex( ({ Date }) => Date === data.Date );
            
            if (result == -1) {
              allData.push(data);
            }
            else {
              allData[result].Value = parseFloat(allData[result].Value) + parseFloat(data.Value);
              allData[result].Quantity = parseFloat(allData[result].Quantity) + parseFloat(data.Quantity);
            }
          }
        }
      }

      const processedAllData = new Object();
      processedAllData.TotalValue = totalValue;
      processedAllData.TotalQuantity = totalQuantity;
      processedAllData.DateDifference = dateDifference;
      processedAllData.Data = allData;

      let newData;

      if (processedAllData.DateDifference <= 60) {
        newData = processDayModelCategorySaleCustomData(startDate, endDate, processedAllData);
      }
      else if (processedAllData.DateDifference > 60 && processedAllData.DateDifference < 180) {
        newData = processWeekModelCategorySaleCustomData(startDate, endDate, processedAllData);
      }
      else if (processedAllData.DateDifference >= 180) {
        newData = processMonthModelCategorySaleCustomData(startDate, endDate, processedAllData);
      }

      setModelCategoryCustomData(newData);
      setModelCategoryCustomDataLoading(false);
    };

    if (checkToken() && categoryCustom) {

      let startDate;
      startDate = moment(modelCategoryCustomStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(modelCategoryCustomEndDate).format("YYYY-MM-DD");

      fetchModelCategorySalesCustomData(startDate, endDate, modelCustom, categoryCustom);
    }
  }, [categoryCustom, modelCategoryCustomStartDate, modelCategoryCustomEndDate]);

  useEffect(() => {
    const fetchProductTiersCustomData = async () => {
      setProductTiersCustomData([1, 2, 3]);
      setTierCustom(1);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setProductTierCategoriesCustomCacheData(object);

      setTierCategoryCustomFetchActive(true);
    };

    if (tierCustomFetchActive == true && checkToken()) {
      fetchProductTiersCustomData();
      
      setTierCustomFetchActive(false);
    }
  }, [tierCustomFetchActive]);

  useEffect(() => {
    const fetchProductTierCategoriesCustomData = async (tier) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproducttiercategories?tier=${tier}`);

      let processedData;
      processedData = result.data;

      setProductTierCategoriesCustomData(processedData.Data[0] ? ['ALL', ...processedData.Data] : ['TIDAK ADA KATEGORI']);
      setTierCategoryCustom(processedData.Data[0] ? 'ALL' : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of productTierCategoriesCustomCacheData.Data) {
        map.set(key, value);
      }

      map.set(tier, processedData.Data[0] ? ['ALL', ...processedData.Data] : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setProductTierCategoriesCustomCacheData(object);
    };

    if (tierCategoryCustomFetchActive == true && checkToken()) {
      if (productTierCategoriesCustomCacheData.Data.has(tierCustom) == false) {
        fetchProductTierCategoriesCustomData(tierCustom);
      }
      else {
        setProductTierCategoriesCustomData(productTierCategoriesCustomCacheData.Data.get(tierCustom));
        setTierCategoryCustom(productTierCategoriesCustomCacheData.Data.get(tierCustom)[0]);
      }
      
      setTierCategoryCustomFetchActive(false);
    }
  }, [tierCategoryCustomFetchActive]);

  useEffect(() => {
    const processMonthTierCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let monthCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        currentDate.startOf('month');
        monthCounter++; 
        let object = ``;

        if (dateDifference > 1095 && monthCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 730 && dateDifference <= 1095 && monthCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 365 && dateDifference <= 730 && monthCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('MMM') == 'Jan')
            object += `{"label": "${moment(currentDate).format('MMM YYYY')}"`;
          else
            object += `{"label": "${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('MMM YYYY')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "MM/YYYY").startOf('month');

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'months');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierCategory = new Object();
      totalTierCategory.value = processedData.TotalValue;
      totalTierCategory.quantity = processedData.TotalQuantity;

      setTotalTierCategoryCustomData(totalTierCategory);
    
      return result;
    };

    const processWeekTierCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD").startOf('isoWeek');
      let momentEndDate = moment(endDate, "YYYY-MM-DD").startOf('isoWeek');

      let currentDate = momentStartDate;
      let weekCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        weekCounter++;
        let object = ``;

        if (dateDifference > 140 && weekCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 100 && dateDifference <= 140 && weekCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 60 && dateDifference <= 100 && weekCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          object += `{"label": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;
        }

        object += `, "dataLabel": "Week ${currentDate.isoWeek()} ${moment(currentDate).format('MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let week = parseInt(dataItem.Date.substring(4, 6));

            if (week == currentDate.isoWeek()) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }

              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'weeks');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierCategory = new Object();
      totalTierCategory.value = processedData.TotalValue;
      totalTierCategory.quantity = processedData.TotalQuantity;

      setTotalTierCategoryCustomData(totalTierCategory);
    
      return result;
    };

    const processDayTierCategorySaleCustomData = (startDate, endDate, processedData) => {
      const line = new Array();
      const chartLine = new Array();
      let addLine;

      addLine = new Object();
      addLine.column = 'Penjualan';
      line.push(addLine);
      chartLine.push(addLine);

      addLine = new Object();
      addLine.column = 'Jumlah';
      line.push(addLine);
      chartLine.push(addLine);
    
      const chart = new Array();
      let addChart = new Object();

      let data = new Array();
      data = processedData.Data;

      const dateDifference = processedData.DateDifference;

 
      let momentStartDate = moment(startDate, "YYYY-MM-DD");
      let momentEndDate = moment(endDate, "YYYY-MM-DD");

      let currentDate = momentStartDate;
      let dateCounter = 0;

      let totalValue = 0;
      let totalQuantity = 0;

      while (currentDate <= momentEndDate) { 
        dateCounter++; 
        let object = ``;

        if (dateDifference > 45 && dateCounter % 4 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 30 && dateDifference <= 45 && dateCounter % 3 != 1) {
          object += `{"label": ""`;
        }
        else if (dateDifference > 15 && dateDifference <= 30 && dateCounter % 2 != 1) {
          object += `{"label": ""`;
        }
        else {
          if (moment(currentDate).format('Do') == '1')
            object += `{"label": "${moment(currentDate).format('Do MMM')}"`;
          else
            object += `{"label": "${moment(currentDate).format('Do')}"`;
        }

        object += `, "dataLabel": "${moment(currentDate).format('Do MMM')}"`;

        line.forEach(function (lineItem) {
          let dateExist = false;

          data.forEach(function (dataItem) {
            let date = moment(dataItem.Date, "DD/MM/YYYY");

            if (moment(date).isSame(currentDate) == true) {
              if (lineItem.column == 'Penjualan') {
                object += `, "${lineItem.column}": ${dataItem.Value}`;
                totalValue += parseFloat(dataItem.Value);
              }
              else if (lineItem.column == 'Jumlah') {
                object += `, "${lineItem.column}": ${dataItem.Quantity}`;
                totalQuantity += parseFloat(dataItem.Quantity);
              }
              
              dateExist = true;
            }
          });

          if (dateExist == false) {
            object += `, "${lineItem.column}": 0`;
          }
        });

        object += `}`;

        addChart = JSON.parse(object);
        chart.push(addChart);

        currentDate.add(1, 'days');
      }

      const result = new Object();
      result.line = chartLine;
      result.chart = chart;

      const totalTierCategory = new Object();
      totalTierCategory.value = processedData.TotalValue;
      totalTierCategory.quantity = processedData.TotalQuantity;

      setTotalTierCategoryCustomData(totalTierCategory);
    
      return result;
    };

    const fetchTierCategorySalesCustomData = async (startDate, endDate, tierCustom, tierCategoryCustom) => {
      setTierCategoryCustomDataLoading(true);

      const result = await axios({
        method: 'post',
        url: 'https://api.ultige.com/ultigeapi/web/analytic/getproductcategorysales2_v2',
        data: {
          startDate: startDate, 
          endDate: endDate,
          tier: tierCustom, 
          category: tierCategoryCustom
        }
      });

      let processedData;
      processedData = result.data;


      let newData;

      if (processedData.DateDifference <= 60) {
        newData = processDayTierCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference > 60 && processedData.DateDifference < 180) {
        newData = processWeekTierCategorySaleCustomData(startDate, endDate, processedData);
      }
      else if (processedData.DateDifference >= 180) {
        newData = processMonthTierCategorySaleCustomData(startDate, endDate, processedData);
      }

      if (tierCategoryCustom == 'TIDAK ADA KATEGORI') {
        newData = null;
      }

      setTierCategoryCustomData(newData);
      setTierCategoryCustomDataLoading(false);
    };

    if (checkToken() && tierCategoryCustom) {

      let startDate;
      startDate = moment(tierCategoryCustomStartDate).format("YYYY-MM-DD");

      let endDate;
      endDate = moment(tierCategoryCustomEndDate).format("YYYY-MM-DD");

      fetchTierCategorySalesCustomData(startDate, endDate, tierCustom, tierCategoryCustom);
    }
  }, [tierCustom, tierCategoryCustom, tierCategoryCustomStartDate, tierCategoryCustomEndDate]);

  useEffect(() => {
    const fetchProductTiersMultipleCustomData = async () => {
      setProductTiersMultipleCustomData([1, 2, 3]);
      setTierMultipleCustom(1);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setProductTierMultipleCategoriesCustomCacheData(object);

      setTierMultipleCategoryCustomFetchActive(true);
    };

    if (tierMultipleCustomFetchActive == true && checkToken()) {
      fetchProductTiersMultipleCustomData();
      
      setTierMultipleCustomFetchActive(false);
    }
  }, [tierMultipleCustomFetchActive]);

  useEffect(() => {
    const fetchProductTierMultipleCategoriesCustomData = async (tier) => {
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproducttiercategories?tier=${tier}`);

      let processedData;
      processedData = result.data;
      
      let categories = [];
      for (let i = 0; i < processedData.Data.length; i++)
      {
        let category = {
          "id": i,
          "tierCategory": processedData.Data[i]
        }
        categories.push(category);
      }

      setProductTierMultipleCategoriesCustomData(categories);
      
      let map = new Map();

      for (let [key, value] of productTierMultipleCategoriesCustomCacheData.Data) {
        map.set(key, value);
      }

      map.set(tier, categories);

      let object = new Object();
      object.Data = map;

      setProductTierMultipleCategoriesCustomCacheData(object);
    };

    if (tierMultipleCategoryCustomFetchActive == true && checkToken()) {
      setSelectionModel([]);
      setTierMultipleCategoryCustom([]);

      if (productTierMultipleCategoriesCustomCacheData.Data.has(tierMultipleCustom) == false) {
        fetchProductTierMultipleCategoriesCustomData(tierMultipleCustom);
      }
      else {
        setProductTierMultipleCategoriesCustomData(productTierMultipleCategoriesCustomCacheData.Data.get(tierMultipleCustom));
      } 
      
      setTierMultipleCategoryCustomFetchActive(false);
    }
  }, [tierMultipleCategoryCustomFetchActive]);

  useEffect(() => {
    const fetchModelStockData = async () => {
      setPerformanceDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getproductmodels?active=true`);

      let processedData;
      processedData = result.data;

      setModelStockData(processedData.Data);
      setModelStock(processedData.Data[0]);

      let map = new Map();

      let object = new Object();
      object.Data = map;

      setStockCacheData(object);

      setStockFetchActive(true);
      setPerformanceDataLoading(false);
    };

    if (modelStockFetchActive == true && checkToken()) {
      fetchModelStockData();
      
      setModelStockFetchActive(false);
    }
  }, [modelStockFetchActive]);

  useEffect(() => {
    const fetchStockData = async (model) => {
      setPerformanceDataLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getstocklistbymodelname?modelName=${model}`);

      let processedData;
      processedData = result.data;

      if (processedData.Data[0]) {
        let newArray = new Array();
        for (let data of processedData.Data) {
          newArray.push(data.Name);
        }
        setStockData(newArray);
      }
      else {
        setStockData(['TIDAK ADA KATEGORI']);
      }

      setStock(processedData.Data[0] ? processedData.Data[0].Name : 'TIDAK ADA KATEGORI');
      
      let map = new Map();

      for (let [key, value] of stockCacheData.Data) {
        map.set(key, value);
      }

      map.set(model, processedData.Data[0] ? processedData.Data : ['TIDAK ADA KATEGORI']);

      //console.log(map);

      let object = new Object();
      object.Data = map;

      setStockCacheData(object);
    };

    if (stockFetchActive == true && checkToken()) {
      if (stockCacheData.Data.has(modelStock) == false) {
        fetchStockData(modelStock);
      }
      else {
        let newArray = new Array();
        for (let data of stockCacheData.Data.get(modelStock)) {
          newArray.push(data.Name);
        }
        setStockData(newArray);
        setStock(stockCacheData.Data.get(modelStock)[0].Name);
      }
      
      setStockFetchActive(false);
      setPerformanceDataLoading(false);
    }
  }, [stockFetchActive]);

  useEffect(() => {
    const fetchPerformanceData = async (stockID) => {
      setPerformanceDataLoading(true);

      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getstockperformancedata?stockID=${stockID}`);

      let processedData;
      processedData = result.data;

      setPerformanceData(processedData);
      setPerformanceDataLoading(false);
    };

    if (checkToken() && stock && stockCacheData.Data.get(modelStock)) {
      for (let data of stockCacheData.Data.get(modelStock)) {
        if (data.Name == stock) {
          fetchPerformanceData(data.StockID);
        }
      }
    }
  }, [stock, stockCacheData]);

  const CustomSalesRow = ({ row }) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [empty, setEmpty] = React.useState(false);

    const fetchModelSalesDetailData = async (startDate, endDate, modelName, categoryName) => {
      setLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalesdetail?startDate=${startDate}&endDate=${endDate}&modelName=${modelName}&categoryName=${categoryName}`);
  
      let processedData;
      processedData = result.data;

      if (processedData.Data.length == 0) {
        setEmpty(true);
        setLoading(false);
        return;
      }

      let tempData = modelSalesData;

      for (const data of tempData.Data) {
        if (data.ModelName == modelName && data.CategoryName == categoryName) {
          data.Variant = processedData.Data;
          break;
        }
      }

      setModelSalesData(tempData);
      setOpen(true);
      setLoading(false);
    };
  
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            { !empty && 
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  if (loading == false) {
                    if (row.Variant.length == 0)
                      fetchModelSalesDetailData(currentStartDate, currentEndDate, row.ModelName, row.CategoryName);
                    else
                      setOpen(!open);
                  }
                }}
              >
                {loading ? <CircularProgress size={21} /> : open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          </TableCell>
          <TableCell component="th" scope="row" align="center" style={{width: 100}}>
            <Typography>
              {row.Rank}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Grid container style={{marginTop: 10}}>
              <Image 
                src={row.ProductImage != "" ? row.ProductImage : "/images/no-image.jpg"}  
                width={75} 
                height={75} 
                style={{borderRadius: 5}} 
                alt="Product Image"
              />
              <Typography 
                style={{
                    color: "#000", 
                    fontSize: 16,
                    fontWeight: 500,
                    marginTop: 5,
                    marginLeft: 10
                }}
              >
                {row.ProductName}
                <br/>
                <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
              </Typography>
            </Grid>
          </TableCell>
          <TableCell align="right" style={{width: 225}}>
            <Typography>
              Rp {Intl.NumberFormat('id').format(row.Value)}
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 150}}>
            <Typography>
              {Intl.NumberFormat('id').format(row.Proportion)}%
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 175}}>
            <Grid container justifyContent="flex-end">
              <Typography>
                {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
              </Typography>
              { row.Growth >= 0
              ? <TrendingUpIcon
                  style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              : <TrendingDownIcon
                  style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              }
            </Grid>
          </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#fcfcfc' }}>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Peringkat</TableCell>
                      <TableCell align="left">Informasi Varian</TableCell>
                      <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                      <TableCell align="right">Proporsi</TableCell>
                      <TableCell align="right">Tingkat Perubahan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.Variant && row.Variant.map((row2) => (
                      <TableRow
                        key={row2.Rank}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                          <Typography>
                              {row2.Rank}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Grid container style={{marginTop: 10}}>
                            <Typography 
                            style={{
                                color: "#000", 
                                fontSize: 16,
                                fontWeight: 500,
                                marginTop: 5
                            }}
                            >
                            {row2.ProductName}
                            <br/>
                            <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell align="right" style={{width: 225}}>
                          <Typography>
                            Rp {Intl.NumberFormat('id').format(row2.Value)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 150}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Proportion)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 175}}>
                          <Grid container justifyContent="flex-end">
                            <Typography>
                            {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                            </Typography>
                            { row2.Growth >= 0
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const CustomSalesCountRow = ({ row }) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [empty, setEmpty] = React.useState(false);

    const fetchModelSalesCountDetailData = async (startDate, endDate, modelName, categoryName) => {
      setLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getmodelsalescountdetail?startDate=${startDate}&endDate=${endDate}&modelName=${modelName}&categoryName=${categoryName}`);
  
      let processedData;
      processedData = result.data;

      if (processedData.Data.length == 0) {
        setEmpty(true);
        setLoading(false);
        return;
      }

      let tempData = modelSalesCountData;

      for (const data of tempData.Data) {
        if (data.ModelName == modelName && data.CategoryName == categoryName) {
          data.Variant = processedData.Data;
          break;
        }
      }

      setModelSalesCountData(tempData);
      setOpen(true);
      setLoading(false);
    };
  
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
            { !empty && 
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  if (loading == false) {
                    if (row.Variant.length == 0)
                      fetchModelSalesCountDetailData(currentStartDate, currentEndDate, row.ModelName, row.CategoryName);
                    else
                      setOpen(!open);
                  }
                }}
              >
                {loading ? <CircularProgress size={21} /> : open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          </TableCell>
          <TableCell component="th" scope="row" align="center" style={{width: 100}}>
            <Typography>
              {row.Rank}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Grid container style={{marginTop: 10}}>
              <Image 
                src={row.ProductImage != "" ? row.ProductImage : "/images/no-image.jpg"}  
                width={75} 
                height={75} 
                style={{borderRadius: 5}} 
                alt="Product Image"
              />
              <Typography 
                style={{
                    color: "#000", 
                    fontSize: 16,
                    fontWeight: 500,
                    marginTop: 5,
                    marginLeft: 10
                }}
              >
                {row.ProductName}
                <br/>
                <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
              </Typography>
            </Grid>
          </TableCell>
          <TableCell align="right" style={{width: 225}}>
            <Typography>
              {Intl.NumberFormat('id').format(row.Value)}
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 150}}>
            <Typography>
              {Intl.NumberFormat('id').format(row.Proportion)}%
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 175}}>
            <Grid container justifyContent="flex-end">
              <Typography>
                {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
              </Typography>
              { row.Growth >= 0
              ? <TrendingUpIcon
                  style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              : <TrendingDownIcon
                  style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              }
            </Grid>
          </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#fcfcfc' }}>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Peringkat</TableCell>
                      <TableCell align="left">Informasi Varian</TableCell>
                      <TableCell align="right">Total Produk Dipesan</TableCell>
                      <TableCell align="right">Proporsi</TableCell>
                      <TableCell align="right">Tingkat Perubahan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.Variant && row.Variant.map((row2) => (
                      <TableRow
                        key={row2.Rank}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                          <Typography>
                              {row2.Rank}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Grid container style={{marginTop: 10}}>
                            <Typography 
                            style={{
                                color: "#000", 
                                fontSize: 16,
                                fontWeight: 500,
                                marginTop: 5
                            }}
                            >
                            {row2.ProductName}
                            <br/>
                            <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell align="right" style={{width: 225}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Value)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 150}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Proportion)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 175}}>
                          <Grid container justifyContent="flex-end">
                            <Typography>
                            {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                            </Typography>
                            { row2.Growth >= 0
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const CustomCategorySalesRow = ({ row }) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [empty, setEmpty] = React.useState(false);

    const fetchCategorySalesDetailData = async (startDate, endDate, productCategoryName) => {
      setLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalesdetail?startDate=${startDate}&endDate=${endDate}&productCategoryName=${productCategoryName}`);
  
      let processedData;
      processedData = result.data;

      if (processedData.Data.length == 0) {
        setEmpty(true);
        setLoading(false);
        return;
      }

      let tempData = categorySalesData;

      for (const data of tempData.Data) {
        if (data.ProductCategoryName == productCategoryName) {
          data.Variant = processedData.Data;
          break;
        }
      }

      setCategorySalesData(tempData);
      setOpen(true);
      setLoading(false);
    };
  
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            { !empty && 
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  if (loading == false) {
                    if (row.Variant.length == 0)
                      fetchCategorySalesDetailData(currentStartDate, currentEndDate, row.ProductCategoryName);
                    else
                      setOpen(!open);
                  }
                }}
              >
                {loading ? <CircularProgress size={21} /> : open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          </TableCell>
          <TableCell component="th" scope="row" align="center" style={{width: 100}}>
            <Typography>
              {row.Rank}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Grid container style={{marginTop: 10}}>
              <Image 
                src={row.ProductImage != "" ? row.ProductImage : "/images/no-image.jpg"}  
                width={75} 
                height={75} 
                style={{borderRadius: 5}} 
                alt="Product Image"
              />
              <Typography 
                style={{
                    color: "#000", 
                    fontSize: 16,
                    fontWeight: 500,
                    marginTop: 5,
                    marginLeft: 10
                }}
              >
                {row.ProductCategoryName}
                <br/>
                <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
              </Typography>
            </Grid>
          </TableCell>
          <TableCell align="right" style={{width: 225}}>
            <Typography>
              Rp {Intl.NumberFormat('id').format(row.Value)}
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 150}}>
            <Typography>
              {Intl.NumberFormat('id').format(row.Proportion)}%
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 175}}>
            <Grid container justifyContent="flex-end">
              <Typography>
                {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
              </Typography>
              { row.Growth >= 0
              ? <TrendingUpIcon
                  style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              : <TrendingDownIcon
                  style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              }
            </Grid>
          </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#fcfcfc' }}>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Peringkat</TableCell>
                      <TableCell align="left">Informasi Varian</TableCell>
                      <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                      <TableCell align="right">Proporsi</TableCell>
                      <TableCell align="right">Tingkat Perubahan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.Variant && row.Variant.map((row2) => (
                      <TableRow
                        key={row2.Rank}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                          <Typography>
                              {row2.Rank}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Grid container style={{marginTop: 10}}>
                            <Typography 
                            style={{
                                color: "#000", 
                                fontSize: 16,
                                fontWeight: 500,
                                marginTop: 5
                            }}
                            >
                            {row2.ProductName}
                            <br/>
                            <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell align="right" style={{width: 225}}>
                          <Typography>
                            Rp {Intl.NumberFormat('id').format(row2.Value)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 150}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Proportion)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 175}}>
                          <Grid container justifyContent="flex-end">
                            <Typography>
                            {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                            </Typography>
                            { row2.Growth >= 0
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const CustomCategorySalesCountRow = ({ row }) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [empty, setEmpty] = React.useState(false);

    const fetchCategorySalesCountDetailData = async (startDate, endDate, productCategoryName) => {
      setLoading(true);
      const result = await axios.get(`https://api.ultige.com/ultigeapi/web/analytic/getcategorysalescountdetail?startDate=${startDate}&endDate=${endDate}&productCategoryName=${productCategoryName}`);
  
      let processedData;
      processedData = result.data;

      if (processedData.Data.length == 0) {
        setEmpty(true);
        setLoading(false);
        return;
      }

      let tempData = categorySalesCountData;

      for (const data of tempData.Data) {
        if (data.ProductCategoryName == productCategoryName) {
          data.Variant = processedData.Data;
          break;
        }
      }

      setCategorySalesCountData(tempData);
      setOpen(true);
      setLoading(false);
    };
  
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            { !empty && 
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  if (loading == false) {
                    if (row.Variant.length == 0)
                      fetchCategorySalesCountDetailData(currentStartDate, currentEndDate, row.ProductCategoryName);
                    else
                      setOpen(!open);
                  }
                }}
              >
                {loading ? <CircularProgress size={21} /> : open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          </TableCell>
          <TableCell component="th" scope="row" align="center" style={{width: 100}}>
            <Typography>
              {row.Rank}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Grid container style={{marginTop: 10}}>
              <Image 
                src={row.ProductImage != "" ? row.ProductImage : "/images/no-image.jpg"}  
                width={75} 
                height={75} 
                style={{borderRadius: 5}} 
                alt="Product Image"
              />
              <Typography 
                style={{
                    color: "#000", 
                    fontSize: 16,
                    fontWeight: 500,
                    marginTop: 5,
                    marginLeft: 10
                }}
              >
                {row.ProductCategoryName}
                <br/>
                <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
              </Typography>
            </Grid>
          </TableCell>
          <TableCell align="right" style={{width: 225}}>
            <Typography>
              {Intl.NumberFormat('id').format(row.Value)}
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 150}}>
            <Typography>
              {Intl.NumberFormat('id').format(row.Proportion)}%
            </Typography>
          </TableCell>
          <TableCell align="right" style={{width: 175}}>
            <Grid container justifyContent="flex-end">
              <Typography>
                {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
              </Typography>
              { row.Growth >= 0
              ? <TrendingUpIcon
                  style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              : <TrendingDownIcon
                  style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                  />
              }
            </Grid>
          </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#fcfcfc' }}>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Peringkat</TableCell>
                      <TableCell align="left">Informasi Varian</TableCell>
                      <TableCell align="right">Total Produk Dipesan</TableCell>
                      <TableCell align="right">Proporsi</TableCell>
                      <TableCell align="right">Tingkat Perubahan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.Variant && row.Variant.map((row2) => (
                      <TableRow
                        key={row2.Rank}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                          <Typography>
                              {row2.Rank}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Grid container style={{marginTop: 10}}>
                            <Typography 
                            style={{
                                color: "#000", 
                                fontSize: 16,
                                fontWeight: 500,
                                marginTop: 5
                            }}
                            >
                            {row2.ProductName}
                            <br/>
                            <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row2.ProductID}</span>
                            </Typography>
                          </Grid>
                        </TableCell>
                        <TableCell align="right" style={{width: 225}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Value)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 150}}>
                          <Typography>
                            {Intl.NumberFormat('id').format(row2.Proportion)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{width: 175}}>
                          <Grid container justifyContent="flex-end">
                            <Typography>
                            {Intl.NumberFormat('id').format(Math.abs(row2.Growth))}%
                            </Typography>
                            { row2.Growth >= 0
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                />
                            }
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  return (
    <Layout>
      <Grid container style={{padding: 5}}>
        <Grid item xs={12} ref={componentRef}>
          <Paper className={classes.paper} elevation={3}>
            <Box className={classes.inline}>
              <FormControl variant="outlined" className={classes.formControl}>
                { isMobile
                  ? <InputLabel>Periode Data</InputLabel>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 15
                      }}
                    >
                      Periode Data
                    </Typography>
                }
                { isMobile
                  ? <Select
                      value={dateOption}
                      onChange={handleChange}
                      style={{height: 60, width: 375}}
                      label="Periode Data"
                      classes={{ root: classes.selectRoot }}
                    >
                      <MenuItem disableRipple value='realtime'>Real-time: <br/>Hari ini - Pk {moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00</MenuItem>
                      <MenuItem disableRipple value='yesterday'>Kemarin: <br/>{moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                      <MenuItem disableRipple value='weekly'>Minggu sebelumnya: <br/>{moment().tz("Asia/Jakarta").subtract(7, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                      <MenuItem disableRipple value='monthly'>Bulan sebelumnya: <br/>{monthlyStartDate} - {monthlyEndDate}</MenuItem>
                      <Divider style={{margin: 12}}/>
                      <MenuItem disableRipple value='custom-daily'>Per Hari{customDayRange != '' && ': '}{customDayRange != '' && <br/>}{customDayRange}</MenuItem>
                      <MenuItem disableRipple value='custom-weekly'>Per Minggu{customWeekRange != '' && ': '}{customWeekRange != '' && <br/>}{customWeekRange}</MenuItem>
                      <MenuItem disableRipple value='custom-monthly'>Per Bulan{customMonthRange != '' && ': '}{customMonthRange != '' && <br/>}{customMonthRange}</MenuItem>
                      <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun{customYearRange != '' && ': '}{customYearRange != '' && <br/>}{customYearRange}</MenuItem>
                      <MenuItem disableRipple value='custom-date'>Custom Tanggal{customDateRange != '' && ': '}{customDateRange != '' && <br/>}{customDateRange}</MenuItem>
                    </Select>
                  : <Select
                      value={dateOption}
                      onChange={handleChange}
                      style={{height: 45, width: 450}}
                      classes={{ root: classes.selectRoot }}
                    >
                      <MenuItem disableRipple value='realtime'>Real-time: Hari ini - Pk {moment().tz("Asia/Jakarta").format('LT').slice(0, -3)}:00</MenuItem>
                      <MenuItem disableRipple value='yesterday'>Kemarin: {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                      <MenuItem disableRipple value='weekly'>Minggu sebelumnya: {moment().tz("Asia/Jakarta").subtract(7, "days").format('DD-MM-YYYY')} - {moment().tz("Asia/Jakarta").subtract(1, "days").format('DD-MM-YYYY')}</MenuItem>
                      <MenuItem disableRipple value='monthly'>Bulan sebelumnya: {monthlyStartDate} - {monthlyEndDate}</MenuItem>
                      <Divider style={{margin: 12}}/>
                      <MenuItem disableRipple value='custom-daily'>Per Hari{customDayRange != '' && ': '}{customDayRange}</MenuItem>
                      <MenuItem disableRipple value='custom-weekly'>Per Minggu{customWeekRange != '' && ': '}{customWeekRange}</MenuItem>
                      <MenuItem disableRipple value='custom-monthly'>Per Bulan{customMonthRange != '' && ': '}{customMonthRange}</MenuItem>
                      <MenuItem disableRipple value='custom-yearly'>Berdasarkan Tahun{customYearRange != '' && ': '}{customYearRange}</MenuItem>
                      <MenuItem disableRipple value='custom-date'>Custom Tanggal{customDateRange != '' && ': '}{customDateRange}</MenuItem>
                    </Select>
                }
              </FormControl>
              { (dateOption == "custom-daily" 
                || dateOption == "custom-weekly"
                || dateOption == "custom-monthly"
                || dateOption == "custom-yearly"
                || dateOption == "custom-date") && !isMobile &&
                <Grid style={{margin: 10}}>  
                  <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                    { (dateOption == "custom-daily" || dateOption == "custom-weekly" || dateOption == "custom-date") &&
                      <DatePicker
                        orientation="landscape"
                        inputFormat="yyyy-MM-dd"
                        label="Start Date"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                      />
                    }
                    { dateOption == "custom-monthly" &&
                      <DatePicker
                        orientation="landscape"
                        views={["month"]}
                        inputFormat="yyyy-MM-dd"
                        label="Start Date"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                      />
                    }
                    { dateOption == "custom-yearly" &&
                      <DatePicker
                        orientation="landscape"
                        views={["year"]}
                        inputFormat="yyyy-MM-dd"
                        label="Start Date"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                      />
                    }
                    { dateOption == "custom-date" &&
                      <DatePicker
                        orientation="landscape"
                        inputFormat="yyyy-MM-dd"
                        label="End Date"
                        value={selectedEndDate}
                        style={{marginRight: 15, width: 150}}
                        onChange={handleEndDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                      />
                    }
                  </LocalizationProvider>
                  <Button 
                    variant="outlined"
                    style={{
                      borderRadius: 4,
                      textTransform: "none",
                      marginTop: 8
                    }}
                    disableRipple
                    onClick={applyCustomDate}
                  >
                    Apply
                  </Button>
                </Grid>
              }
            </Box>
            { (dateOption == "custom-daily" 
              || dateOption == "custom-weekly"
              || dateOption == "custom-monthly"
              || dateOption == "custom-yearly"
              || dateOption == "custom-date") && isMobile &&
              <Grid style={{margin: 10}}>  
                <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                  { (dateOption == "custom-daily" || dateOption == "custom-weekly" || dateOption == "custom-date") &&
                    <DatePicker
                      inputFormat="yyyy-MM-dd"
                      label="Start Date"
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                    />
                  }
                  { dateOption == "custom-monthly" &&
                    <DatePicker
                      views={["month"]}
                      inputFormat="yyyy-MM-dd"
                      label="Start Date"
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                    />
                  }
                  { dateOption == "custom-yearly" &&
                    <DatePicker
                      views={["year"]}
                      inputFormat="yyyy-MM-dd"
                      label="Start Date"
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                    />
                  }
                  { dateOption == "custom-date" &&
                    <DatePicker
                      inputFormat="yyyy-MM-dd"
                      label="End Date"
                      value={selectedEndDate}
                      onChange={handleEndDateChange}
                      renderInput={(props) => <TextField variant="standard" style={{marginRight: 15, width: 150}} {...props} />}
                    />
                  }
                </LocalizationProvider>
                <Button 
                  variant="outlined"
                  style={{
                    borderRadius: 4,
                    textTransform: "none",
                    marginTop: 8
                  }}
                  disableRipples
                  onClick={applyCustomDate}
                >
                  Apply
                </Button>
              </Grid>
            }
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={3}>
            <Box className={classes.inline}>
              { isMobile
                ? <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 9,
                      marginBottom: 9,
                      marginRight: 9,
                      marginLeft: 9
                    }}
                  >
                    Kriteria<br/>Utama
                  </Typography>
                : <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 22,
                      marginBottom: 9,
                      marginRight: 15,
                      marginLeft: 9
                    }}
                  >
                    Kriteria Utama
                  </Typography>
              }
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={channel}
                  onChange={handleChannelChange}
                  style={{width: 295, height: 55}}
                  label="Channel"
                  classes={{ root: classes.selectRoot }}
                >
                  {channelList && channelList.map((item, index) => (
                    <MenuItem key={index} disableRipple value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>



            <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
              { totalSalesData &&
                <HtmlTooltip title={<span><p>{salesDataDescription.split("\n")[0]}</p><p>{salesDataDescription.split("\n")[1]}</p></span>}>
                  <Card variant={toggleSales ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleSales ? '#367fe3' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleSalesChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Penjualan
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalSalesData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalSalesData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalSalesData.growth.toFixed(2))}%
                          </Typography>
                          { totalSalesData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </HtmlTooltip>
              }

              { totalSalesCountData &&
                <HtmlTooltip title={<span><p>{salesCountDataDescription.split("\n")[0]}</p><p>{salesCountDataDescription.split("\n")[1]}</p></span>}>
                  <Card variant={toggleSalesCount ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleSalesCount ? '#f6bd16' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleSalesCountChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Pesanan
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalSalesCountData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalSalesCountData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalSalesCountData.growth.toFixed(2))}%
                          </Typography>
                          { totalSalesCountData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </HtmlTooltip>
              }

              { totalAverageSalesData &&
                <HtmlTooltip title={<span><p>{averageSalesDataDescription.split("\n")[0]}</p><p>{averageSalesDataDescription.split("\n")[1]}</p></span>}>
                  <Card variant={toggleAverageSales ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleAverageSales ? '#fd5151' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleAverageSalesChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Penjualan/Pesanan
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalAverageSalesData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalAverageSalesData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalAverageSalesData.growth.toFixed(2))}%
                          </Typography>
                          { totalAverageSalesData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </HtmlTooltip>
              }

              { totalMarginValueData &&
                <HtmlTooltip title={<span><p>{marginDataDescription.split("\n")[0]}</p><p>{marginDataDescription.split("\n")[1]}</p></span>}>
                  <Card variant={toggleMarginValue ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleMarginValue ? '#aa88ff' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleMarginValueChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Margin (Rp)
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalMarginValueData.value)}</span>
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalMarginValueData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalMarginValueData.growth.toFixed(2))}%
                          </Typography>
                          { totalMarginValueData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </HtmlTooltip>
              }

              { totalMarginRateData &&
                <HtmlTooltip title={<span><p>{marginRateDataDescription.split("\n")[0]}</p><p>{marginRateDataDescription.split("\n")[1]}</p></span>}>
                  <Card variant={toggleMarginRate ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: toggleMarginRate ? '#23aaab' : 'transparent', height: 5, width: '100%'}}/>
                    <CardActionArea style={{padding: 15}} onClick={handleToggleMarginRateChange} disableRipple>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Margin (%)
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(totalMarginRateData.value.toFixed(2))}</span>%
                      </Typography>
                      <Grid container style={{marginTop: 10}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 11,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {totalMarginRateData.range}
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500,
                              display: 'inline'
                            }}
                          >
                            {Intl.NumberFormat('id').format(totalMarginRateData.growth.toFixed(2))}%
                          </Typography>
                          { totalMarginRateData.growthTrend == 'up'
                            ? <TrendingUpIcon
                                style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                              />
                            : <TrendingDownIcon
                                style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                              />
                          }
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                </HtmlTooltip>
              }
            </Box>

            
            <Grid container>
              <Grid item xs={12} md={4}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Grafik Setiap Kriteria
                </Typography>
              </Grid>
              <Grid item xs={12} md={8} container justifyContent="flex-end">
                { toggleSales && 
                  <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                    <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        marginRight: 8,
                        marginTop: 3,
                      }}
                    >
                      Penjualan
                    </Typography>
                  </Box>
                }
                { toggleSalesCount && 
                  <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                    <FiberManualRecordIcon style={{ color: '#f6bd16', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        marginRight: 8,
                        marginTop: 3,
                      }}
                    >
                      Pesanan
                    </Typography>
                  </Box>
                }
                { toggleAverageSales && 
                  <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                    <FiberManualRecordIcon style={{ color: '#fd5151', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        marginRight: 8,
                        marginTop: 3,
                      }}
                    >
                      Penjualan/Pesanan
                    </Typography>
                  </Box>
                }
                { toggleMarginValue && 
                  <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                    <FiberManualRecordIcon style={{ color: '#aa88ff', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        marginRight: 8,
                        marginTop: 3,
                      }}
                    >
                      Margin (Rp)
                    </Typography>
                  </Box>
                }
                { toggleMarginRate && 
                  <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                    <FiberManualRecordIcon style={{ color: '#23aaab', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        marginRight: 8,
                        marginTop: 3,
                      }}
                    >
                      Margin (%)
                    </Typography>
                  </Box>
                }
              </Grid>
            </Grid>

            { masterSalesData &&
              <MultiTypeChart line={masterSalesData.line} chart={masterSalesData.chart} width={width}/>
            }

            <Grid item xs={12}>
              { (salesDataLoading || salesCountDataLoading || averageSalesDataLoading || marginDataLoading || previousSalesDataLoading || previousSalesCountDataLoading || previousAverageSalesDataLoading || previousMarginDataLoading) &&
                <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={3}>
            <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
              { toggleMultipleSales && Object.entries(toggleMultipleSales).map(([key,value])=> (
                <Card key={key} variant={value.toggle ? "elevation" : "outlined"} style={{width: 220, height: 128, marginRight: 12, marginBottom: 12}}>
                  <div style={{backgroundColor: value.toggle ? randomColorHSL(key) : 'transparent', height: 5, width: '100%'}}/>
                  <CardActionArea style={{padding: 15}} onClick={() => handleToggleMultipleSalesChange(key)} disableRipple>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 14,
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      {key}
                    </Typography>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 14,
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}
                    >
                      Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(value.value)}</span>
                    </Typography>
                    <Grid container style={{marginTop: 10}}>
                      <Grid item xs={7}>
                        <Typography 
                          style={{
                            color: "#888", 
                            fontSize: 11,
                            textAlign: 'left',
                            fontWeight: 500
                          }}
                        >
                          {value.range}
                        </Typography>
                      </Grid>
                      <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 13,
                            textAlign: 'left',
                            fontWeight: 500,
                            display: 'inline'
                          }}
                        >
                          {Intl.NumberFormat('id').format(value.growth.toFixed(2))}%
                        </Typography>
                        { value.growthTrend == 'up'
                          ? <TrendingUpIcon
                              style={{ color: 'green', fontSize: 20, marginLeft: 3}}
                            />
                          : <TrendingDownIcon
                              style={{ color: 'red', fontSize: 20, marginLeft: 3}}
                            />
                        }
                      </Grid>
                    </Grid>
                  </CardActionArea>
                </Card>
              ))}
            </Box>

            <Grid container>
              <Grid item xs={12} md={4}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Grafik Penjualan (Channel)
                </Typography>
              </Grid>
              <Grid item xs={12} md={8} container justifyContent="flex-end">
                { toggleMultipleSales && Object.entries(toggleMultipleSales).map(([key,value])=> (
                  <>
                  { value.toggle == true && 
                    <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                      <FiberManualRecordIcon style={{ color: randomColorHSL(key), fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          marginRight: 8,
                          marginTop: 3,
                        }}
                      >
                        {key}
                      </Typography>
                    </Box>
                  }
                  </>
                ))}
              </Grid>
            </Grid>

            { masterMultipleSalesData && 
              <MultiChannelChart line={toggleMultipleSales} chart={masterMultipleSalesData.chart} width={width}/>
            }

            <Grid item xs={12}>
              { (salesDataLoading || previousSalesDataLoading) &&
                <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <InView onChange={(inView, entry) => handleSegmentationFetchChange(inView)}>
            <Paper className={classes.paper} elevation={3}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Segmentasi
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TabContext value={segmentationTab}>
                    <Box style={{marginLeft: 10, marginRight: 10}}>
                      <TabList onChange={handleSegmentationTabChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Harga Pesanan" value="1" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Jumlah Pesanan" value="2" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Tipe Pembeli" value="3" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Rentang Harga</TableCell>
                              <TableCell align="right">Total Pembeli</TableCell>
                              <TableCell align="right">% Pembeli</TableCell>
                              <TableCell align="right">Total Transaksi</TableCell>
                              <TableCell align="right">% Transaksi</TableCell>
                              <TableCell align="right">Penjualan</TableCell>
                              <TableCell align="right">% Penjualan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentationSalesData && segmentationSalesData.Data.map((row) => (
                              <TableRow
                                key={row.PriceRange}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="left" style={{minWidth: 150}}>
                                  <Typography>
                                    Rp {row.PriceRange}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomer)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomerPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalTransaction)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalTransactionPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{minWidth: 200}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.TotalSales)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalSalesPercentage)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="2">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Jumlah Transaksi</TableCell>
                              <TableCell align="right">Total Pembeli</TableCell>
                              <TableCell align="right">% Pembeli</TableCell>
                              <TableCell align="right">Penjualan</TableCell>
                              <TableCell align="right">% Penjualan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentationTransactionCountData && segmentationTransactionCountData.Data.map((row) => (
                              <TableRow
                                key={row.TransactionCount}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="center" style={{minWidth: 150}}>
                                  <Typography>
                                    {row.TransactionCount}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomer)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomerPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{minWidth: 200}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.TotalSales)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalSalesPercentage)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="3">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Rentang Harga</TableCell>
                              <TableCell align="right">Total Pembeli</TableCell>
                              <TableCell align="right">% Pembeli</TableCell>
                              <TableCell align="right">Penjualan</TableCell>
                              <TableCell align="right">% Penjualan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {segmentationCustomerTypeData && segmentationCustomerTypeData.Data.map((row) => (
                              <TableRow
                                key={row.CustomerStatus}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="left" style={{minWidth: 150}}>
                                  <Typography>
                                    {row.CustomerStatus}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomer)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalCustomerPercentage)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{minWidth: 200}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.TotalSales)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.TotalSalesPercentage)}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  </TabContext>
                </Grid>
                <Grid item xs={12}>
                  { (segmentationSalesDataLoading || segmentationTransactionCountDataLoading || segmentationCustomerTypeDataLoading) &&
                    <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </InView>
        </Grid>

        <Grid item xs={12}>
          <InView onChange={(inView, entry) => handleProductFetchChange(inView)}>
            <Paper className={classes.paper} elevation={3}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Peringkat Produk (teratas)
                  </Typography>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                  <Link
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      textDecoration: "none"
                    }}
                    href={`/analytic/productranking`}
                  >
                    <Typography
                      gutterBottom
                      variant="body2"
                      style={{
                        color: "#4084e1",
                        fontWeight: "normal",
                        marginTop: 7
                      }}
                    >
                      Lainnya
                    </Typography>
                    <KeyboardArrowRightIcon
                      style={{ color: '#4084e1', fontSize: 20, marginRight: 3}}
                    />
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <TabContext value={productTab}>
                    <Box style={{marginLeft: 10, marginRight: 10}}>
                      <TabList onChange={handleProductTabChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Nominal Terjual (model)" value="1" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Jumlah Terjual (model)" value="2" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Nominal Terjual (kategori)" value="3" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Jumlah Terjual (kategori)" value="4" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Nominal Terjual" value="5" />
                        <Tab classes={{ root: classes.tab }} wrapped disableRipple label="Berdasarkan Jumlah Terjual" value="6" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {modelSalesData && modelSalesData.Data.map((row) => (
                              <CustomSalesRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="2">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Total Produk Dipesan</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {modelSalesCountData && modelSalesCountData.Data.map((row) => (
                              <CustomSalesCountRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="3">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categorySalesData && categorySalesData.Data.map((row) => (
                              <CustomCategorySalesRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="4">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 50 }}/>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Total Produk Dipesan</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categorySalesCountData && categorySalesCountData.Data.map((row) => (
                              <CustomCategorySalesCountRow key={row.Rank} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="5">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Penjualan (Pesanan Dibayar)</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {productSalesData && productSalesData.Data.map((row) => (
                              <TableRow
                                key={row.Rank}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                                  <Typography>
                                    {row.Rank}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Grid container style={{marginTop: 10}}>
                                    <Image 
                                      src={row.ProductImage != "" ? row.ProductImage : "/images/no-image.jpg"}  
                                      width={75} 
                                      height={75} 
                                      style={{borderRadius: 5}} 
                                      alt="Product Image"
                                    />
                                    <Typography 
                                      style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        fontWeight: 500,
                                        marginTop: 5,
                                        marginLeft: 10
                                      }}
                                    >
                                      {row.ProductName}
                                      <br/>
                                      <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
                                    </Typography>
                                  </Grid>
                                </TableCell>
                                <TableCell align="right" style={{width: 225}}>
                                  <Typography>
                                    Rp {Intl.NumberFormat('id').format(row.Value)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{width: 150}}>
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.Proportion)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{width: 175}}>
                                  <Grid container justifyContent="flex-end">
                                    <Typography>
                                      {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
                                    </Typography>
                                    { row.Growth >= 0
                                      ? <TrendingUpIcon
                                          style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                        />
                                      : <TrendingDownIcon
                                          style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                        />
                                    }
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel value="6">
                      <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Peringkat</TableCell>
                              <TableCell align="left">Informasi Produk</TableCell>
                              <TableCell align="right">Total Produk Dipesan</TableCell>
                              <TableCell align="right">Proporsi</TableCell>
                              <TableCell align="right">Tingkat Perubahan</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {productSalesCountData && productSalesCountData.Data.map((row) => (
                              <TableRow
                                key={row.Rank}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row" align="center" style={{width: 100}}>
                                  <Typography>
                                    {row.Rank}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Grid container style={{marginTop: 10}}>
                                    <Image 
                                      src={row.ProductImage != "" ? row.ProductImage : "/images/no-image.jpg"} 
                                      width={75} 
                                      height={75} 
                                      style={{borderRadius: 5}} 
                                      alt="Product Image"
                                    />
                                    <Typography 
                                      style={{
                                        color: "#000", 
                                        fontSize: 16,
                                        fontWeight: 500,
                                        marginTop: 5,
                                        marginLeft: 10
                                      }}
                                    >
                                      {row.ProductName}
                                      <br/>
                                      <span style={{fontSize: 14, color: "#999"}}>ID Produk: {row.ProductID}</span>
                                    </Typography>
                                  </Grid>
                                </TableCell>
                                <TableCell align="right" style={{width: 225}}>
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.Value)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{width: 150}}>
                                  <Typography>
                                    {Intl.NumberFormat('id').format(row.Proportion)}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" style={{width: 175}}>
                                  <Grid container justifyContent="flex-end">
                                    <Typography>
                                      {Intl.NumberFormat('id').format(Math.abs(row.Growth))}%
                                    </Typography>
                                    { row.Growth >= 0
                                      ? <TrendingUpIcon
                                          style={{ color: 'green', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                        />
                                      : <TrendingDownIcon
                                          style={{ color: 'red', fontSize: 20, marginLeft: 3, marginTop: 2}}
                                        />
                                    }
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  </TabContext>
                </Grid>
                <Grid item xs={12}>
                  { (productSalesDataLoading || productSalesCountDataLoading || modelSalesDataLoading || modelSalesCountDataLoading || categorySalesDataLoading || categorySalesCountDataLoading)  &&
                    <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </InView>
        </Grid>

        <Grid item xs={12}>
          <InView onChange={(inView, entry) => handleValueStockFetchChange(inView)}>
            <Paper className={classes.paper} elevation={3}>
              <Grid item xs={12}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Value Stock
                </Typography>
              </Grid>

              <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#367fe3', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock
                        <br/>
                        Packaging
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'StockValuePackaging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#f6bd16', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock by
                        <br/>
                        Harga Beli
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'StockValueByBuyPrice').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#fd5151', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock Aging {">"}90 Hari by Harga Beli
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'MoreThan90DaysStockAging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

                { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#aa88ff', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock Aging {">"}150 Hari by Harga Beli 
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key == 'MoreThan150DaysStockAging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }

              { valueStockData &&
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#23aaab', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Stock Aging {">"}210 Hari by Harga Beli
                      </Typography>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        Rp <span style={{fontSize: 20, fontWeight: 'bold'}}>{Intl.NumberFormat('id').format(valueStockData.Data.find(o => o.Key === 'MoreThan210DaysStockAging').Value)}</span>
                      </Typography>
                    </CardContent>
                  </Card>
                }
              </Box>

              <Grid item xs={12}>
                { valueStockDataLoading &&
                  <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
            </Paper>
          </InView>
        </Grid>
        
        <Grid item xs={12}>
          <InView onChange={(inView, entry) => handleModelFetchChange(inView)}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 21,
                        marginLeft: 9
                      }}
                    >
                      Model<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 36,
                        marginLeft: 9
                      }}
                    >
                      Model Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={model}
                    onChange={handleModelChange}
                    options={productModelsData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Model" />}
                  />
                </FormControl>
              </Box>

              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 9,
                        marginLeft: 9
                      }}
                    >
                      Kategori<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 15,
                        marginLeft: 9
                      }}
                    >
                      Kategori Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={category}
                    onChange={handleCategoryChange}
                    options={productCategoriesData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                  />
                </FormControl>
              </Box>

              <FormControl style={{
                marginLeft: 9
              }}>
                <RadioGroup
                  row
                  value={modelCategoryDataActive}
                  onChange={handleModelCategoryDataActive}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Aktif" />
                  <FormControlLabel value={false} control={<Radio />} label="Tidak Aktif" />
                </RadioGroup>
              </FormControl>
                          
              { modelCategoryData &&
                <Grid container>
                  <Grid item xs={12} md={8}>
                    <Box className={classes.inline}>
                      { isMobile
                        ? <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 16,
                              fontWeight: 'bold',
                              marginTop: 9,
                              marginBottom: 16,
                              marginRight: 25,
                              marginLeft: 9
                            }}
                          >
                            Tanggal<br/>Akhir
                          </Typography>
                        : <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginTop: 22,
                              marginBottom: 30,
                              marginRight: 47,
                              marginLeft: 9
                            }}
                          >
                            Tanggal Akhir
                          </Typography>
                      }
                      <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="End Date"
                          value={modelCategoryEndDate}
                          onChange={handleModelCategoryEndDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  { totalModelCategoryData && 
                    <Grid item xs={12} md={4} container justifyContent="flex-end">
                      <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            marginTop: isMobile ? 9 : 15,
                            marginBottom: 9,
                            marginRight: 9,
                            marginLeft: 9
                          }}
                        >
                          Total Penjualan: Rp. {Intl.NumberFormat('id').format(totalModelCategoryData.value)}
                          <br/>
                          Total Jumlah: {Intl.NumberFormat('id').format(totalModelCategoryData.quantity)}
                        </Typography>
                    </Grid>
                  }
                </Grid>
              }
              
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Grafik Penjualan (Model & Kategori)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} container justifyContent="flex-end">
                  { modelCategoryData
                    ? <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                        <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            marginRight: 8,
                            marginTop: 3,
                          }}
                        >
                          Penjualan
                        </Typography>
                      </Box>
                    : <Box className={classes.inline} style={{height: 27}}/>
                  }
                </Grid>
              </Grid>

              { modelCategoryData
                ? <MultiTypeChart line={modelCategoryData.line} chart={modelCategoryData.chart} width={width}/>
                : <EmptyChart width={width}/>
              }

              <Grid item xs={12}>
                { modelCategoryDataLoading &&
                  <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
            </Paper>
          </InView>
        </Grid>

        <Grid item xs={12}>
          <InView onChange={(inView, entry) => handleModelCustomFetchChange(inView)}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 21,
                        marginLeft: 9
                      }}
                    >
                      Model<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 36,
                        marginLeft: 9
                      }}
                    >
                      Model Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={modelCustom}
                    onChange={handleModelCustomChange}
                    options={productModelsCustomData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Model" />}
                  />
                </FormControl>
              </Box>

              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 9,
                        marginRight: 9,
                        marginLeft: 9
                      }}
                    >
                      Kategori<br/>Produk
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 15,
                        marginLeft: 9
                      }}
                    >
                      Kategori Produk
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={categoryCustom}
                    onChange={handleCategoryCustomChange}
                    options={productCategoriesCustomData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                  />
                </FormControl>
              </Box>

              <FormControl style={{
                marginLeft: 9
              }}>
                <RadioGroup
                  row
                  value={modelCategoryCustomDataActive}
                  onChange={handleModelCategoryCustomDataActive}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Aktif" />
                  <FormControlLabel value={false} control={<Radio />} label="Tidak Aktif" />
                </RadioGroup>
              </FormControl>
              
              { modelCategoryCustomData &&
                <Grid container>
                  <Grid item xs={12} md={8}>
                    <Box className={classes.inline}>
                      { isMobile
                        ? <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 16,
                              fontWeight: 'bold',
                              marginTop: 9,
                              marginBottom: 16,
                              marginRight: 25,
                              marginLeft: 9
                            }}
                          >
                            Tanggal<br/>Awal
                          </Typography>
                        : <Typography 
                            style={{
                              color: "#000", 
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginTop: 22,
                              marginBottom: 30,
                              marginRight: 97,
                              marginLeft: 9
                            }}
                          >
                            Tanggal
                          </Typography>
                      }
                      <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="Start Date"
                          value={modelCategoryCustomStartDate}
                          onChange={handleModelCategoryCustomStartDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, marginRight: 10, width: 150}} {...props} />}
                        />
                        { !isMobile && 
                          <DatePicker
                            inputFormat="yyyy-MM-dd"
                            label="End Date"
                            value={modelCategoryCustomEndDate}
                            onChange={handleModelCategoryCustomEndDateChange}
                            renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                          />
                        }
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  { isMobile && 
                    <Grid item xs={12} md={8}>
                      <Box className={classes.inline}>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginTop: 9,
                            marginBottom: 16,
                            marginRight: 25,
                            marginLeft: 9
                          }}
                        >
                          Tanggal<br/>Akhir
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                          <DatePicker
                            inputFormat="yyyy-MM-dd"
                            label="End Date"
                            value={modelCategoryCustomEndDate}
                            onChange={handleModelCategoryCustomEndDateChange}
                            renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                  }
                  { totalModelCategoryCustomData && 
                    <Grid item xs={12} md={4} container justifyContent="flex-end">
                      <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            marginTop: isMobile ? 9 : 15,
                            marginBottom: 9,
                            marginRight: 9,
                            marginLeft: 9
                          }}
                        >
                          Total Penjualan: Rp. {Intl.NumberFormat('id').format(totalModelCategoryCustomData.value)}
                          <br/>
                          Total Jumlah: {Intl.NumberFormat('id').format(totalModelCategoryCustomData.quantity)}
                        </Typography>
                    </Grid>
                  }
                </Grid>
              }
              
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      margin: 9
                    }}
                  >
                    Grafik Penjualan Custom (Model & Kategori)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} container justifyContent="flex-end">
                  { modelCategoryCustomData
                    ? <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                        <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                        <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            marginRight: 8,
                            marginTop: 3,
                          }}
                        >
                          Penjualan
                        </Typography>
                      </Box>
                    : <Box className={classes.inline} style={{height: 27}}/>
                  }
                </Grid>
              </Grid>

              { modelCategoryCustomData
                ? <MultiTypeChart line={modelCategoryCustomData.line} chart={modelCategoryCustomData.chart} width={width}/>
                : <EmptyChart width={width}/>
              }

              <Grid item xs={12}>
                { modelCategoryCustomDataLoading &&
                  <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
            </Paper>
          </InView>
        </Grid>
            
        {/*
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={3}>
            <Box className={classes.inline}>
              { isMobile
                ? <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 9,
                      marginBottom: 9,
                      marginRight: 10,
                      marginLeft: 9
                    }}
                  >
                    Tier<br/>Kategori
                  </Typography>
                : <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 22,
                      marginBottom: 9,
                      marginRight: 42,
                      marginLeft: 9
                    }}
                  >
                    Tier Kategori
                  </Typography>
              }
              <FormControl variant="outlined" className={classes.formControl}>
                <Autocomplete
                  value={tierCustom}
                  onChange={handleTierCustomChange}
                  options={productTiersCustomData}
                  sx={{width: 295, height: 55}}
                  renderInput={(params) => <TextField {...params} label="Tier" />}
                />
              </FormControl>
            </Box>

            <Box className={classes.inline}>
              { isMobile
                ? <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 9,
                      marginBottom: 9,
                      marginRight: 9,
                      marginLeft: 9
                    }}
                  >
                    Kategori<br/>Produk
                  </Typography>
                : <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 22,
                      marginBottom: 9,
                      marginRight: 15,
                      marginLeft: 9
                    }}
                  >
                    Kategori Produk
                  </Typography>
              }
              <FormControl variant="outlined" className={classes.formControl}>
                <Autocomplete
                  value={tierCategoryCustom}
                  onChange={handleTierCategoryCustomChange}
                  options={productTierCategoriesCustomData}
                  sx={{width: 295, height: 55}}
                  renderInput={(params) => <TextField {...params} label="Category" />}
                />
              </FormControl>
            </Box>
            
            { tierCategoryCustomData &&
              <Grid container>
                <Grid item xs={12} md={8}>
                  <Box className={classes.inline}>
                    { isMobile
                      ? <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginTop: 9,
                            marginBottom: 16,
                            marginRight: 25,
                            marginLeft: 9
                          }}
                        >
                          Tanggal<br/>Awal
                        </Typography>
                      : <Typography 
                          style={{
                            color: "#000", 
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 22,
                            marginBottom: 30,
                            marginRight: 97,
                            marginLeft: 9
                          }}
                        >
                          Tanggal
                        </Typography>
                    }
                    <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                      <DatePicker
                        inputFormat="yyyy-MM-dd"
                        label="Start Date"
                        value={tierCategoryCustomStartDate}
                        onChange={handleTierCategoryCustomStartDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, marginRight: 10, width: 150}} {...props} />}
                      />
                      { !isMobile && 
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="End Date"
                          value={tierCategoryCustomEndDate}
                          onChange={handleTierCategoryCustomEndDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                        />
                      }
                    </LocalizationProvider>
                  </Box>
                </Grid>
                { isMobile && 
                  <Grid item xs={12} md={8}>
                    <Box className={classes.inline}>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 9,
                          marginBottom: 16,
                          marginRight: 25,
                          marginLeft: 9
                        }}
                      >
                        Tanggal<br/>Akhir
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          label="End Date"
                          value={tierCategoryCustomEndDate}
                          onChange={handleTierCategoryCustomEndDateChange}
                          renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                }
                { totalTierCategoryCustomData && 
                  <Grid item xs={12} md={4} container justifyContent="flex-end">
                    <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'right',
                          marginTop: isMobile ? 9 : 15,
                          marginBottom: 9,
                          marginRight: 9,
                          marginLeft: 9
                        }}
                      >
                        Total Penjualan: Rp. {Intl.NumberFormat('id').format(totalTierCategoryCustomData.value)}
                        <br/>
                        Total Jumlah: {Intl.NumberFormat('id').format(totalTierCategoryCustomData.quantity)}
                      </Typography>
                  </Grid>
                }
              </Grid>
            }
            
            <Grid container>
              <Grid item xs={12} md={4}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Grafik Penjualan Custom (Tier & Kategori)
                </Typography>
              </Grid>
              <Grid item xs={12} md={8} container justifyContent="flex-end">
                { tierCategoryCustomData
                  ? <Box className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                      <FiberManualRecordIcon style={{ color: '#367fe3', fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          marginRight: 8,
                          marginTop: 3,
                        }}
                      >
                        Penjualan
                      </Typography>
                    </Box>
                  : <Box className={classes.inline} style={{height: 27}}/>
                }
              </Grid>
            </Grid>

            { tierCategoryCustomData
              ? <MultiTypeChart line={tierCategoryCustomData.line} chart={tierCategoryCustomData.chart} width={width}/>
              : <EmptyChart width={width}/>
            }

            <Grid item xs={12}>
              { tierCategoryCustomDataLoading &&
                <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </Paper>
        </Grid>
        */}

        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={3}>
            <Box className={classes.inline}>
              { isMobile
                ? <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginTop: 9,
                      marginBottom: 9,
                      marginRight: 10,
                      marginLeft: 9
                    }}
                  >
                    Tier<br/>Kategori
                  </Typography>
                : <Typography 
                    style={{
                      color: "#000", 
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 22,
                      marginBottom: 9,
                      marginRight: 42,
                      marginLeft: 9
                    }}
                  >
                    Tier Kategori
                  </Typography>
              }
              <FormControl variant="outlined" className={classes.formControl}>
                <Autocomplete
                  value={tierMultipleCustom}
                  onChange={handleTierMultipleCustomChange}
                  options={productTiersMultipleCustomData}
                  sx={{width: 295, height: 55}}
                  renderInput={(params) => <TextField {...params} label="Tier" />}
                />
              </FormControl>
            </Box>

            { productTierMultipleCategoriesCustomData && 
              <Grid item xs={12} style={{ marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, height: 371, maxWidth: isMobile ? 377 : 457 }}>
                <DataGrid
                  rows={productTierMultipleCategoriesCustomData}
                  columns={columns}
                  pageSize={100}
                  rowsPerPageOptions={[100]}
                  onSelectionModelChange={handleSelection}
                  selectionModel={selectionModel}
                  checkboxSelection
                  sx={{
                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                      display: "none"
                    },
                    div: {
                      fontWeight: 400
                    }
                  }}
                />
              </Grid>
            }
            
            <Grid container>
              <Grid item xs={12} md={8}>
                <Box className={classes.inline}>
                  { isMobile
                    ? <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 9,
                          marginBottom: 16,
                          marginRight: 25,
                          marginLeft: 9
                        }}
                      >
                        Tanggal<br/>Awal
                      </Typography>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 22,
                          marginBottom: 30,
                          marginRight: 97,
                          marginLeft: 9
                        }}
                      >
                        Tanggal
                      </Typography>
                  }
                  <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                    <DatePicker
                      inputFormat="yyyy-MM-dd"
                      label="Start Date"
                      value={tierMultipleCategoryCustomStartDate}
                      onChange={handleTierMultipleCategoryCustomStartDateChange}
                      renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, marginRight: 10, width: 150}} {...props} />}
                    />
                    { !isMobile && 
                      <DatePicker
                        inputFormat="yyyy-MM-dd"
                        label="End Date"
                        value={tierMultipleCategoryCustomEndDate}
                        onChange={handleTierMultipleCategoryCustomEndDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                      />
                    }
                  </LocalizationProvider>
                  { !isMobile && 
                    <Button 
                      variant="outlined"
                      style={{
                        borderRadius: 4,
                        textTransform: "none",
                        marginLeft: 10,
                        marginTop: 10,
                        width: 100,
                        height: 50
                      }}
                      disableRipple
                      onClick={handleTierMultipleCategoryData}
                    >
                      Apply
                    </Button>
                  }
                </Box>
              </Grid>
              { isMobile && 
                <Grid item xs={12} md={8}>
                  <Box className={classes.inline}>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 9,
                        marginBottom: 16,
                        marginRight: 25,
                        marginLeft: 9
                      }}
                    >
                      Tanggal<br/>Akhir
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns} utils={MomentUtils}>
                      <DatePicker
                        inputFormat="yyyy-MM-dd"
                        label="End Date"
                        value={tierMultipleCategoryCustomEndDate}
                        onChange={handleTierMultipleCategoryCustomEndDateChange}
                        renderInput={(props) => <TextField variant="standard" style={{marginTop: 10, width: 150}} {...props} />}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Button 
                    variant="outlined"
                    style={{
                      borderRadius: 4,
                      textTransform: "none",
                      marginLeft: 10,
                      marginBottom: 16,
                      width: 80,
                      height: 40
                    }}
                    disableRipple
                    onClick={handleTierMultipleCategoryData}
                  >
                    Apply
                  </Button>
                </Grid>
              }
              { totalTierMultipleCategoryCustomData && 
                <Grid item xs={12} md={4} container justifyContent="flex-end">
                  <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'right',
                        marginTop: isMobile ? 9 : 15,
                        marginBottom: 9,
                        marginRight: 9,
                        marginLeft: 9
                      }}
                    >
                      Total Penjualan: Rp. {Intl.NumberFormat('id').format(totalTierMultipleCategoryCustomData.value)}
                      <br/>
                      Total Jumlah: {Intl.NumberFormat('id').format(totalTierMultipleCategoryCustomData.quantity)}
                    </Typography>
                </Grid>
              }
            </Grid>
            
            <Grid container>
              <Grid item xs={12} md={4}>
                <Typography 
                  style={{
                    color: "#000", 
                    fontSize: 18,
                    fontWeight: 'bold',
                    margin: 9
                  }}
                >
                  Grafik Penjualan Custom (Tier & Kategori)
                </Typography>
              </Grid>
              <Grid item xs={12} md={8} container justifyContent="flex-end">
                { tierMultipleCategoryLiveCustom && tierMultipleCategoryLiveCustom.map((value)=> (
                  <Box key={value} className={classes.inline} style={{marginTop: isMobile ? 0 : 7}}>
                    <FiberManualRecordIcon style={{ color: randomColorHSL(value), fontSize: 14, marginLeft: 9, marginRight: 9, marginTop: 7}}/>
                    <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        marginRight: 8,
                        marginTop: 3,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>

            { tierMultipleCategoryCustomData
              ? <MultiCategoryChart line={tierMultipleCategoryCustomData.line} chart={tierMultipleCategoryCustomData.chart} width={width}/>
              : <EmptyChart width={width}/>
            }

            <Grid item xs={12}>
              { tierMultipleCategoryCustomDataLoading &&
                <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <InView onChange={(inView, entry) => handleModelStockFetchChange(inView)}>
            <Paper className={classes.paper} elevation={3}>
              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 21,
                        marginLeft: 9
                      }}
                    >
                      Model
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 86,
                        marginLeft: 9
                      }}
                    >
                      Model
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={modelStock}
                    onChange={handleModelStockChange}
                    options={modelStockData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Model" />}
                  />
                </FormControl>
              </Box>

              <Box className={classes.inline}>
                { isMobile
                  ? <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 34,
                        marginLeft: 9
                      }}
                    >
                      Stok
                    </Typography>
                  : <Typography 
                      style={{
                        color: "#000", 
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 22,
                        marginBottom: 9,
                        marginRight: 101,
                        marginLeft: 9
                      }}
                    >
                      Stok
                    </Typography>
                }
                <FormControl variant="outlined" className={classes.formControl}>
                  <Autocomplete
                    value={stock}
                    onChange={handleStockChange}
                    options={stockData}
                    sx={{width: 295, height: 55}}
                    renderInput={(params) => <TextField {...params} label="Stock" />}
                  />
                </FormControl>
              </Box>
              
              { performanceData && 
                <Box className={classes.inline}>
                  { isMobile
                    ? <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 9,
                          marginBottom: 5,
                          marginRight: 25,
                          marginLeft: 9
                        }}
                      >
                        Launch<br/>Date
                      </Typography>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 22,
                          marginBottom: 5,
                          marginRight: 44,
                          marginLeft: 9
                        }}
                      >
                        Launch Date
                      </Typography>
                  }
                  { isMobile
                    ? <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginTop: 21,
                          marginBottom: 5,
                          marginRight: 5
                        }}
                      >
                        {performanceData.Data.find(o => o.Key === 'LaunchDate').Value ? moment(performanceData.Data.find(o => o.Key === 'LaunchDate').Value).format('LL') : '-'}
                      </Typography>
                    : <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 22,
                          marginBottom: 5,
                          marginRight: 5
                        }}
                      >
                        {performanceData.Data.find(o => o.Key === 'LaunchDate').Value ? moment(performanceData.Data.find(o => o.Key === 'LaunchDate').Value).format('LL') : '-'}
                      </Typography>
                  }
                </Box>
              }

              <Box style={{ display: 'flex', flexWrap: 'wrap', marginLeft: isMobile ? 9 : 33, marginRight: isMobile ? 9 : 33, marginTop: 15 }}>
                { performanceData && 
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#fd5151', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        45 Days Peformance
                      </Typography>
                      <Grid container style={{marginTop: 15}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value ? `${performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value}/${performanceData.Data.find(o => o.Key === 'StockQty').Value}` : "0/0"}
                            <br/>
                            terjual
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000",  
                              fontSize: 18,
                              textAlign: 'left',
                              fontWeight: 800,
                              display: 'inline'
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value ? `${Intl.NumberFormat('id').format((performanceData.Data.find(o => o.Key === 'StockSoldIn45Days').Value / performanceData.Data.find(o => o.Key === 'StockQty').Value * 100).toFixed(2))}%` : "NaN%"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                }

                { performanceData && 
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#aa88ff', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        60 Days Peformance
                      </Typography>
                      <Grid container style={{marginTop: 15}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value ? `${performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value}/${performanceData.Data.find(o => o.Key === 'StockQty').Value}` : "0/0"}
                            <br/>
                            terjual
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000",  
                              fontSize: 18,
                              textAlign: 'left',
                              fontWeight: 800,
                              display: 'inline'
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value ? `${Intl.NumberFormat('id').format((performanceData.Data.find(o => o.Key === 'StockSoldIn60Days').Value / performanceData.Data.find(o => o.Key === 'StockQty').Value * 100).toFixed(2))}%` : "NaN%"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                }

                { performanceData && 
                  <Card variant="elevation" style={{width: 220, height: 120, marginRight: 12, marginBottom: 12}}>
                    <div style={{backgroundColor: '#23aaab', height: 5, width: '100%'}}/>
                    <CardContent>
                      <Typography 
                        style={{
                          color: "#000", 
                          fontSize: 16,
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        90 Days Peformance
                      </Typography>
                      <Grid container style={{marginTop: 15}}>
                        <Grid item xs={7}>
                          <Typography 
                            style={{
                              color: "#888", 
                              fontSize: 13,
                              textAlign: 'left',
                              fontWeight: 500
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value ? `${performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value}/${performanceData.Data.find(o => o.Key === 'StockQty').Value}` : "0/0"}
                            <br/>
                            terjual
                          </Typography>
                        </Grid>
                        <Grid item xs={5} style={{marginTop: 5}} container justifyContent="flex-end">
                          <Typography 
                            style={{
                              color: "#000",  
                              fontSize: 18,
                              textAlign: 'left',
                              fontWeight: 800,
                              display: 'inline'
                            }}
                          >
                            {performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value ? `${Intl.NumberFormat('id').format((performanceData.Data.find(o => o.Key === 'StockSoldIn90Days').Value / performanceData.Data.find(o => o.Key === 'StockQty').Value * 100).toFixed(2))}%` : "NaN%"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                }
              </Box>

              <Grid item xs={12}>
                { performanceDataLoading &&
                  <Box className={classes.inline} style={{marginTop: 10, marginLeft: 20, marginBottom: 20}}>
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
            </Paper>
          </InView>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Home;