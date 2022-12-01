import { Icon } from "@iconify/react";
import pinFill from "@iconify/icons-eva/pin-fill";
import emailFill from "@iconify/icons-eva/email-fill";
import roundBusinessCenter from "@iconify/icons-ic/round-business-center";
// material
import { styled } from "@mui/material/styles";
import { Card, Typography, CardHeader, Stack } from "@mui/material";

interface ProfileAboutProps {
  isRespondent: boolean;
  description: string;
  location: string;
  email: string;
  specialties: string[];
}

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

export default function ProfileAbout({
  isRespondent,
  description,
  location,
  email,
  specialties,
}: ProfileAboutProps): JSX.Element {
  if (isRespondent) {
    return (
      <Card>
        <CardHeader title="About" />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="body2">{description}</Typography>

          <Stack direction="row">
            <IconStyle icon={pinFill} />
            <Typography variant="body2">
              现居 &nbsp;
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
              >
                {location}
              </Typography>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={emailFill} />
            <Typography variant="body2">{email}</Typography>
          </Stack>

          {specialties.map(post => (
            <Stack key={post} direction="row">
              <IconStyle icon={roundBusinessCenter} />
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
              >
                {post}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader title="About" />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="body2">{description}</Typography>

          <Stack direction="row">
            <IconStyle icon={pinFill} />
            <Typography variant="body2">
              现居 &nbsp;
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
              >
                {location}
              </Typography>
            </Typography>
          </Stack>

          <Stack direction="row">
            <IconStyle icon={emailFill} />
            <Typography variant="body2">{email}</Typography>
          </Stack>
        </Stack>
      </Card>
    );
  }
}
