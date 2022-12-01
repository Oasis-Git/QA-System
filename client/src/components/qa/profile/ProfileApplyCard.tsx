import { Link as RouterLink } from "react-router-dom";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Card, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import arrowCircleRightFill from "@iconify/icons-eva/arrow-circle-right-fill";

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 25,
  height: 25,
  marginTop: 1.5,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

const TitleStyle = styled(RouterLink)(({ theme }) => ({
  ...theme.typography.subtitle2,
  height: 44,
  color: "inherit",
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

export default function ProfileApplyCard(): JSX.Element {
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={arrowCircleRightFill} />
          <TitleStyle
            to={PATH_DASHBOARD.apply}
            sx={{
              ...{ typography: "h5", height: 60 },
              ...{
                color: "common.black",
              },
            }}
          >
            申请成为回答者
          </TitleStyle>
        </Stack>
      </Stack>
    </Card>
  );
}
