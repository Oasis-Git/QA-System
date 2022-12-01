import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
import BaseOptionChart from "./BaseOptionChart";

interface StatisticProps {
  type: string; //“支出”或“收入”
  monthlyNumbers: number[]; //每月支出或收入
}

export default function BankingBalanceStatistics({
  type,
  monthlyNumbers,
}: StatisticProps): JSX.Element {
  const data = [{ name: type, data: monthlyNumbers }];
  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
      ],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `¥${val}`,
      },
    },
  });

  return (
    <Card>
      <CardHeader title={type + "统计"} />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={data}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
