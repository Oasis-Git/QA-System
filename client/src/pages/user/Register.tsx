import RegisterForm from "../../components/user/RegisterForm";
import { StyledPage, StyledCard, StyledDiv } from "./Login";
import { Container, Hidden, Typography, Box } from "@mui/material";

export default function Register(): JSX.Element {
  return (
    <StyledPage title="注册">
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
              新用户注册
            </Typography>
          </Box>

          <RegisterForm />
        </StyledDiv>
      </Container>
    </StyledPage>
  );
}
