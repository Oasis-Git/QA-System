import { useState } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import { styled } from "@mui/material/styles";
import { Box, Typography, Stack } from "@mui/material";
// utils
import { fCurrency } from "../../../utils/formatNumber";
import { MIconButton } from "../../@material-extend";

const HEIGHT = 276;

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  height: HEIGHT,
  "& .slick-list": {
    borderRadius: theme.shape.borderRadiusMd,
  },
}));

const CardItemStyle = styled("div")(({ theme }) => ({
  position: "relative",
  height: HEIGHT - 16,
  backgroundSize: "cover",
  padding: theme.spacing(3),
  backgroundRepeat: "no-repeat",
  color: theme.palette.common.white,
  backgroundImage: 'url("/static/bg_card.png")',
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const shadowStyle = {
  mx: "auto",
  width: "calc(100% - 16px)",
  borderRadius: 2,
  position: "absolute",
  height: 200,
  zIndex: 8,
  bottom: 8,
  left: 0,
  right: 0,
  bgcolor: "grey.500",
  opacity: 0.32,
} as const;

type CardItemProps = {
  balance: number; //余额
};

function CardItem({ balance }: CardItemProps): JSX.Element {
  const [showCurrency, setShowCurrency] = useState(true);

  const onToggleShowCurrency = () => {
    setShowCurrency(prev => !prev);
  };

  return (
    <>
      <CardItemStyle>
        <div>
          <Typography sx={{ mb: 2, typography: "subtitle2", opacity: 0.72 }}>
            我的钱包
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ typography: "h3" }}>
              {showCurrency ? "********" : "¥" + fCurrency(balance)}
            </Typography>
            <MIconButton
              color="inherit"
              onClick={onToggleShowCurrency}
              sx={{ opacity: 0.48 }}
            >
              <Icon icon={showCurrency ? eyeFill : eyeOffFill} />
            </MIconButton>
          </Stack>
        </div>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          <Box
            component="img"
            src={`/static/icons/ic_mastercard.svg`}
            sx={{ height: 24 }}
          />
          <Typography sx={{ typography: "subtitle1", textAlign: "right" }}>
            **** **** **** 2580
          </Typography>
        </Stack>

        <Stack direction="row" spacing={5}>
          <div>
            <Typography sx={{ mb: 1, typography: "caption", opacity: 0.48 }}>
              银行卡类型
            </Typography>
            <Typography sx={{ typography: "subtitle1" }}>金卡</Typography>
          </div>
          <div>
            <Typography sx={{ mb: 1, typography: "caption", opacity: 0.48 }}>
              有效日期
            </Typography>
            <Typography sx={{ typography: "subtitle1" }}>11/22</Typography>
          </div>
        </Stack>
      </CardItemStyle>
    </>
  );
}

interface CurrentBalanceProps {
  balance: number; //余额
}

export default function BankingCurrentBalance({
  balance,
}: CurrentBalanceProps): JSX.Element {
  return (
    <RootStyle>
      <Box sx={{ position: "relative", zIndex: 9 }}>
        <CardItem balance={balance} />
      </Box>

      <Box sx={{ ...shadowStyle }} />
      <Box
        sx={{
          ...shadowStyle,
          opacity: 0.16,
          bottom: 0,
          zIndex: 7,
          width: "calc(100% - 40px)",
        }}
      />
    </RootStyle>
  );
}
