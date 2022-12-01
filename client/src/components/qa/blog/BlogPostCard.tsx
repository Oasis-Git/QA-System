import { Link as RouterLink } from "react-router-dom";
// material
import { alpha, styled } from "@mui/material/styles";
import { Card, Grid, CardContent, CardActionArea } from "@mui/material";
import Markdown from "../../general/Markdown";
import { QuestionRepo } from "../../../types/qa/Question";
import SvgIconStyle from "../../general/SvgIconStyle";

// ----------------------------------------------------------------------

const CardMediaStyle = styled("div")(({ theme }) => ({
  position: "relative",
  paddingTop: "calc(100% * 3 / 4)",
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

// ----------------------------------------------------------------------

type BlogPostCardProps = {
  post: QuestionRepo;
  index: number;
};

export default function BlogPostCard({
  post,
  index,
}: BlogPostCardProps): JSX.Element {
  const { title, description, id } = post;
  const linkTo = "/qa/repo/" + id + "/detail";

  return (
    <Grid item xs={6} sm={2} md={6}>
      <Card sx={{ position: "relative" }}>
        <CardActionArea href={"/qa/repo/" + id + "/detail"}>
          <CardMediaStyle
            sx={{
              ...{
                pt: "calc(100% * 4 / 3)",
                "&:after": {
                  top: 0,
                  content: "''",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  bgcolor: theme => alpha(theme.palette.grey[200], 0.72),
                },
              },
              ...{
                pt: {
                  xs: "calc(100% * 4 / 3)",
                  sm: "calc(100% * 3 / 4.66)",
                },
              },
            }}
          >
            <SvgIconStyle
              color="paper"
              src="/static/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: "absolute",
                ...{ display: "none" },
              }}
            />
          </CardMediaStyle>

          <CardContent
            sx={{
              pt: 1,
              ...{
                top: 50,
                width: "100%",
                position: "absolute",
              },
            }}
          >
            <TitleStyle
              to={linkTo}
              sx={{
                ...{ typography: "h4", height: 60 },
                ...{
                  color: "common.black",
                },
              }}
            >
              {title}
            </TitleStyle>
            <Markdown>{description}</Markdown>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
