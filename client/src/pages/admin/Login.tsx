import { Container, Hidden, Typography } from "@mui/material";
import { Box } from "@mui/system";
import LoginForm from "../../components/user/LoginForm";
import useAuth from "../../hooks/admin/useAuth";
import { StyledCard, StyledDiv, StyledPage } from "../user/Login";

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
              管理员登录
            </Typography>
          </Box>

          <LoginForm auth={auth} isAdmin={true} />
        </StyledDiv>
      </Container>
    </StyledPage>
  );
}
