import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

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
        <Box
          sx={{
            mb: 0,
            ml: 60,
            height: 170,
            position: "relative",
          }}
        >
          <Typography variant="h3" align="center" paragraph>
            有问题
            <br />
            就会有答案
          </Typography>
        </Box>
      </InfoStyle>
      <CoverImgStyle alt="profile cover" src="/background/imageback.jpg" />
    </RootStyle>
  );
}
