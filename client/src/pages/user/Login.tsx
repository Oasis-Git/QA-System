import { Box, Card, Container, Hidden, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Page from "../../components/general/Page";
import LoginForm from "../../components/user/LoginForm";
import useAuth from "../../hooks/user/useAuth";

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

export const StyledDiv = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
}));

//component
export default function Login(): JSX.Element {
  const auth = useAuth();
  return (
    <StyledPage title="登录">
      <Hidden mdDown={true}>
        <StyledCard>
          <Typography variant="h4" sx={{ px: 5, mt: 5, mb: 0 }}>
            欢迎
          </Typography>
          <img src="/4957136.jpg" alt="login" />
        </StyledCard>
      </Hidden>

      <Container maxWidth="sm">
        <StyledDiv>
          <Box sx={{ flexGrow: 0.2 }}>
            <Typography variant="h5" gutterBottom>
              登录到&nbsp;Brace
            </Typography>
          </Box>

          <LoginForm auth={auth} isAdmin={false} />
        </StyledDiv>
      </Container>
    </StyledPage>
  );
}
