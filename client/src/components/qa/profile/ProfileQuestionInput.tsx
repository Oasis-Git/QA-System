import { Link as RouterLink, useParams } from "react-router-dom";
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

export default function ProfileQuestionInput(): JSX.Element {
  const { name = "" } = useParams();
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <IconStyle icon={arrowCircleRightFill} />
          <TitleStyle
            to={`/qa/${name}/post-question`}
            sx={{
              ...{ typography: "h5", height: 60 },
              ...{
                color: "common.black",
              },
            }}
          >
            向TA提问
          </TitleStyle>
        </Stack>
      </Stack>
    </Card>
  );
}
