import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { Icon } from "@iconify/react";
import diagonalArrowRightUpFill from "@iconify/icons-eva/diagonal-arrow-right-up-fill";
// material
import { styled, useTheme } from "@mui/material/styles";
import { Card, Typography, Stack } from "@mui/material";
// utils
import { fCurrency } from "../../../utils/formatNumber";
//
import BaseOptionChart from "./BaseOptionChart";

const RootStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  boxShadow: "none",
  position: "relative",
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter,
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
  color: theme.palette.warning.lighter,
  backgroundColor: theme.palette.warning.dark,
}));

// ----------------------------------------------------------------------

const CHART_DATA = [{ data: [76, 20, 84, 135, 56, 134, 122, 49] }];

interface BankingExpencesProps {
  total: number; //总开支
}

export default function BankingExpenses({
  total,
}: BankingExpencesProps): JSX.Element {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.warning.main],
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
        <Icon icon={diagonalArrowRightUpFill} width={24} height={24} />
      </IconWrapperStyle>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography sx={{ typography: "subtitle2" }}>支出</Typography>
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
