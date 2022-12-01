import { Card, Stack, Typography, Divider } from "@mui/material";
// utils
import { fNumber } from "../../../utils/formatNumber";

interface ProfileStatisticsProps {
  answerNum: number;
  ratings: number;
}

export default function ProfileStatistics({
  answerNum,
  ratings,
}: ProfileStatisticsProps): JSX.Element {
  return (
    <Card sx={{ py: 3 }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(answerNum)}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            回答问题数
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(ratings)}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            评分
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
