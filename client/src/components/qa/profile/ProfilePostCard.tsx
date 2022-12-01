import { Avatar, Card, Typography, CardHeader, Stack } from "@mui/material";

interface ProfilePostCardProps {
  username: string;
  avatar: string;
  time: string;
  title: string;
}

export default function ProfilePostCard({
  username,
  avatar,
  time,
  title,
}: ProfilePostCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={<Avatar src={avatar}></Avatar>}
        title={
          <Typography variant="subtitle2" color="text.primary">
            {username} &nbsp;
            <Typography component="span" variant="body2" color="text.primary">
              回答了
            </Typography>
          </Typography>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {time}
          </Typography>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="h5"> {title}</Typography>
      </Stack>
    </Card>
  );
}
