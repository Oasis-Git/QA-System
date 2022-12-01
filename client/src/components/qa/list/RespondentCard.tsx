import React from "react";
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import Page from "../../general/Page";
import checkmarkFill from "@iconify/icons-eva/checkmark-fill";
import {
  Card,
  Box,
  CardMedia,
  Stack,
  Button,
  Typography,
  CardActionArea,
} from "@mui/material";

//styles
export const StyledPage = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const RootStyle = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(3),
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(5),
  },
}));

export default function RespondentCard(props: {
  username: string;
  specialities: string[];
  fee: number;
  briefIntroduction: string;
  pic: string;
}): JSX.Element {
  if (props.specialities.length > 3) {
    props.specialities = props.specialities.slice(0, 3);
  }
  while (props.specialities.length < 3) {
    props.specialities.push("...");
  }
  return (
    <RootStyle>
      <CardActionArea href={"/qa/" + props.username + "/profile"}>
        <Typography variant="h3" align="center" sx={{ color: "text.primary" }}>
          {props.username}
        </Typography>
      </CardActionArea>

      <Typography variant="overline" sx={{ color: "text.secondary" }}>
        {props.briefIntroduction}
      </Typography>
      <Card sx={{ maxWidth: 340 }} elevation={3}>
        <CardActionArea href={"/qa/" + props.username + "/profile"}>
          <CardMedia component="img" height="185" image={props.pic} />
        </CardActionArea>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          ￥
        </Typography>
        <Typography variant="h4" sx={{ mx: 1 }}>
          {props.fee}
        </Typography>
        <Typography
          gutterBottom
          component="span"
          variant="subtitle2"
          sx={{
            alignSelf: "flex-end",
            color: "text.secondary",
          }}
        >
          /ans
        </Typography>
      </Box>
      <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
        {props.specialities.map(item => (
          <Stack
            key={item}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.5}
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
      <Button
        fullWidth
        href={"/qa/" + props.username + "/post-question"}
        size="large"
        variant="contained"
        disabled={false}
      >
        {"向TA提问"}
      </Button>
    </RootStyle>
  );
}
