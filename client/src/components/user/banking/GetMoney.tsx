import { useState, useEffect } from "react";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  Stack,
  Input,
  Button,
  Typography,
  CardHeader,
  InputProps,
  Slider as MuiSlider,
} from "@mui/material";
// utils
import { fCurrency } from "../../../utils/formatNumber";
import { useSnackbar } from "notistack";
import useDeposit from "../../../hooks/user/useDeposit";

// ----------------------------------------------------------------------

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 1000;
const STEP = 50;

const RootStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  boxShadow: "none",
  position: "relative",
  backgroundColor: theme.palette.background.neutral,
}));

type AmountProps = number | string | Array<number | string>;

interface InputAmountProps extends InputProps {
  autoWidth: number;
  amount: AmountProps;
}

function InputAmount({
  autoWidth,
  amount,
  onBlur,
  onChange,
  sx,
  ...other
}: InputAmountProps): JSX.Element {
  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={sx}>
      <Typography variant="h5">¥</Typography>
      <Input
        disableUnderline
        size="small"
        value={amount}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{
          step: STEP,
          min: MIN_AMOUNT,
          max: MAX_AMOUNT,
          type: "number",
        }}
        sx={{
          typography: "h3",
          "& input": {
            p: 0,
            textAlign: "center",
            width: autoWidth,
          },
        }}
        {...other}
      />
    </Stack>
  );
}

type CardItemProps = {
  balance: number; //余额
};

export default function GetMoney({ balance }: CardItemProps): JSX.Element {
  const [autoWidth, setAutoWidth] = useState(24);
  const [amount, setAmount] = useState<AmountProps>(0);
  const { enqueueSnackbar } = useSnackbar();
  const deposit = useDeposit();

  const handleClick = async () => {
    const message = await deposit(Number(amount));
    if (message === null) {
      enqueueSnackbar("充值成功", {
        variant: "success",
      });
    }
  };

  useEffect(() => {
    if (amount) {
      handleAutoWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const handleAutoWidth = () => {
    const getNumberLength = amount.toString().length;
    setAutoWidth(getNumberLength * 22);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAmount(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (amount < 0) {
      setAmount(0);
    } else if (amount > MAX_AMOUNT) {
      setAmount(MAX_AMOUNT);
    }
  };

  return (
    <>
      <RootStyle>
        <CardHeader title="充值中心" />
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="overline" sx={{ color: "text.secondary" }}>
              请输入数额
            </Typography>

            <InputAmount
              onBlur={handleBlur}
              onChange={handleInputChange}
              autoWidth={autoWidth}
              amount={amount}
            />

            <MuiSlider
              value={typeof amount === "number" ? amount : 0}
              valueLabelDisplay="auto"
              step={STEP}
              marks
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              onChange={handleSliderChange}
            />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                你的余额
              </Typography>
              <Typography variant="subtitle1">{fCurrency(balance)}</Typography>
            </Stack>

            <Button
              variant="contained"
              size="large"
              disabled={amount === 0}
              onClick={handleClick}
            >
              充值
            </Button>
          </Stack>
        </Box>
      </RootStyle>
    </>
  );
}
