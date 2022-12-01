import checkmarkFill from "@iconify/icons-eva/checkmark-fill";
import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { NavLink as RouterLink } from "react-router-dom";
import { fNumber } from "../../utils/formatNumber";

const RootStyle = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(2),
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(5),
  },
}));

interface ConfirmRespondentProps {
  avatar: string;
  goToNextStep: () => void;
  respondentName: string;
  description: string;
  fee: number;
  specialties: string[];
  ratings: number;
  questionNumber: number;
}

export default function ConfirmRespondent({
  avatar,
  goToNextStep,
  respondentName,
  description,
  fee,
  specialties,
  ratings,
  questionNumber,
}: ConfirmRespondentProps): JSX.Element {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <RootStyle>
            <Typography variant="h3" sx={{ mx: 1 }}>
              {respondentName}
            </Typography>
            <Typography variant="overline" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
            <Card sx={{ maxWidth: 340 }} elevation={3}>
              <CardMedia component="img" height="185" image={avatar} />
            </Card>
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                ￥
              </Typography>
              <Typography variant="h4" sx={{ mx: 1 }}>
                {fNumber(fee)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                评分
              </Typography>
              <Typography variant="h4" sx={{ mx: 1 }}>
                {fNumber(ratings)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                回答过的问题
              </Typography>
              <Typography variant="h4" sx={{ mx: 1 }}>
                {fNumber(questionNumber)}个
              </Typography>
            </Box>
            <Stack component="ul" spacing={1} sx={{ my: 2, width: 1 }}>
              {specialties.map(item => (
                <Stack
                  key={item}
                  component="li"
                  direction="row"
                  spacing={1}
                  sx={{ typography: "body2", color: "text.primary" }}
                >
                  <Box
                    component={Icon}
                    icon={checkmarkFill}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography variant="body2">{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </RootStyle>

          <Button
            onClick={goToNextStep}
            fullWidth
            variant="contained"
            size="large"
          >
            {"向TA提问"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            size="large"
            color="error"
            component={RouterLink}
            to={"/"}
          >
            {"放弃提问"}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
