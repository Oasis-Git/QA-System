import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { Icon } from "@iconify/react";
import diagonalArrowLeftDownFill from "@iconify/icons-eva/diagonal-arrow-left-down-fill";
// material
import { styled } from "@mui/material/styles";
import { Card, Typography, Stack } from "@mui/material";
// utils
import { fCurrency } from "../../../utils/formatNumber";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  boxShadow: "none",
  position: "relative",
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  width: 48,
  height: 48,
  display: "flex",
  borderRadius: "50%",
  position: "absolute",
  alignItems: "center",
  top: theme.spacing(3),
  right: theme.spacing(3),
  justifyContent: "center",
  color: theme.palette.primary.lighter,
  backgroundColor: theme.palette.primary.dark,
}));

// ----------------------------------------------------------------------

const CHART_DATA = [{ data: [111, 136, 76, 108, 74, 54, 57, 84] }];

interface BankingIncomeProps {
  total: number; //总收入
}

export default function BankingIncome({
  total,
}: BankingIncomeProps): JSX.Element {
  const chartOptions = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    stroke: { width: 4 },
    legend: { show: false },
    grid: { show: false },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName: string) => fCurrency(seriesName),
        title: {
          formatter: () => "",
        },
      },
    },
    fill: { gradient: { opacityFrom: 0.56, opacityTo: 0.56 } },
  });

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={diagonalArrowLeftDownFill} width={24} height={24} />
      </IconWrapperStyle>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography sx={{ typography: "subtitle2" }}>收入</Typography>
        <Typography sx={{ typography: "h3" }}>¥{fCurrency(total)}</Typography>
      </Stack>

      <ReactApexChart
        type="area"
        series={CHART_DATA}
        options={chartOptions}
        height={120}
      />
    </RootStyle>
  );
}
