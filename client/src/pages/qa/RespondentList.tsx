import { Box, Card, Container, Grid, Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import Page from "../../components/general/Page";
import { RespondentCard } from "../../components/qa/list";
import useRespondentList from "../../hooks/qa/useRespondentList";
import { Respondent } from "../../types/Respondent";
import RespondentPageHead from "../../components/qa/list/RespondentPageHead";

//styles
const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: "100%",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

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
  image: "https://img0.baidu.com/it/u=2653400155,1250711427&fm=26&fmt=auto",
}));

export const StyledDiv = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  image: "https://img0.baidu.com/it/u=2653400155,1250711427&fm=26&fmt=auto",
}));

export default function RespondentList(): JSX.Element {
  const [page, setpage] = useState(1);
  const [perPage] = useState(6);

  const [[respondentList, tot_page]] = useRespondentList(page - 1, perPage);

  return (
    <RootStyle title="回答者列表" id="move_top">
      <Container maxWidth="lg">
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <RespondentPageHead avatar={"/avatar.png"} username={"刘华强"} />
        </Card>
        <Box height={30}></Box>
        <Grid container spacing={3}>
          {respondentList.map((item: Respondent, index) => {
            return (
              <Grid key={index} xs={12} md={4} item>
                <RespondentCard
                  username={item["username"]}
                  specialities={String(item["specialities"]).split(",")}
                  fee={Number(item["fee"])}
                  briefIntroduction={item["briefIntroduction"]}
                  pic={item["pic"]}
                />
              </Grid>
            );
          })}
        </Grid>
        <Box height={30}></Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={tot_page}
            color="primary"
            onChange={(event, value) => setpage(value)}
            page={page}
          />
        </Box>
      </Container>
    </RootStyle>
  );
}
