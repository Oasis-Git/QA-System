import { Icon } from "@iconify/react";
import messageFill from "@iconify/icons-eva/message-circle-fill";
import weiboFill from "@iconify/icons-eva/at-fill";
// material
import { styled } from "@mui/material/styles";
import { Typography, Card, CardHeader, Stack } from "@mui/material"; // @types

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

interface ProfileSocialProps {
  weChat: string;
  weibo: string;
}

export default function ProfileSocialInfo({
  weChat,
  weibo,
}: ProfileSocialProps): JSX.Element {
  return (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack key={"WeChat"} direction="row" alignItems="center">
          <IconStyle icon={messageFill} color="#04BE02" />
          <Typography
            component="span"
            variant="body2"
            color="text.primary"
            noWrap
          >
            {weChat}
          </Typography>
        </Stack>
        <Stack key={"Weibo"} direction="row" alignItems="center">
          <IconStyle icon={weiboFill} color="#FF9933" />
          <Typography
            component="span"
            variant="body2"
            color="text.primary"
            noWrap
          >
            {weibo}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
