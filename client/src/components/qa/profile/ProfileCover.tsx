import { styled } from "@mui/material/styles";
import { Avatar, Box, Typography } from "@mui/material";

const RootStyle = styled("div")(({ theme }) => ({
  "&:before": {
    top: 0,
    zIndex: 9,
    width: "100%",
    content: "''",
    height: "100%",
    position: "absolute",
  },
}));

const InfoStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: "absolute",
  marginTop: theme.spacing(5),
  [theme.breakpoints.up("md")]: {
    right: "auto",
    display: "flex",
    alignItems: "center",
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

//const isRespondent = false;
const identity = "用户";

const CoverImgStyle = styled("img")(({ theme }) => ({
  zIndex: 8,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
}));

interface ProfileCoverProps {
  avatar: string;
  username: string;
}

export default function ProfileCover({
  avatar,
  username,
}: ProfileCoverProps): JSX.Element {
  return (
    <RootStyle>
      <InfoStyle>
        <Avatar
          sx={{
            mx: "auto",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "common.white",
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
          src={avatar}
        />
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.black",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4">{username}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{identity}</Typography>
        </Box>
      </InfoStyle>
      <CoverImgStyle alt="profile cover" src="/background/IMG_5930.jpg" />
    </RootStyle>
  );
}
