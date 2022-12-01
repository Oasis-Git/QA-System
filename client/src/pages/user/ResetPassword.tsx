import { Icon } from "@iconify/react";
import checkmarkFill from "@iconify/icons-eva/checkmark-fill";
import {
  Container,
  Grid,
  Step,
  StepConnector,
  Stepper,
  Box,
  StepLabel,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Page from "../../components/general/Page";
import CheckEmail from "../../components/user/CheckEmail";
import SetPassword from "../../components/user/SetPassword";
import ResetPasswordComplete from "../../components/user/ResetPasswordComplete";

const STEPS = ["邮箱验证", "重置密码", "完成"];

const StyledConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  "&.Mui-active, &.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function StepIcon({
  active,
  completed,
}: {
  active: boolean;
  completed: boolean;
}) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "primary.main" : "text.disabled",
      }}
    >
      {completed ? (
        <Box
          component={Icon}
          icon={checkmarkFill}
          sx={{ zIndex: 1, width: 20, height: 20, color: "primary.main" }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </Box>
  );
}

export default function ResetPassword(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [username, setUsername] = useState("");

  const goToNextStep = () => {
    setActiveStep(activeStep => {
      return activeStep + 1;
    });
  };

  const setCurrentUsername = (username: string) => {
    setUsername(username);
  };

  return (
    <Page title="忘记密码">
      <Container>
        <Box sx={{ maxWidth: 480, mx: "auto", my: 5 }}>
          <Typography variant="h3" paragraph>
            忘记密码？
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            请完成以下步骤重新设置您的密码
          </Typography>
        </Box>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} sx={{ mb: 5 }}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<StyledConnector />}
            >
              {STEPS.map((label, idx) => (
                <Step key={idx}>
                  <StepLabel
                    StepIconComponent={StepIcon}
                    sx={{
                      "& .MuiStepLabel-label": {
                        typography: "subtitle2",
                        color: "text.disabled",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        <Box sx={{ maxWidth: 480, mx: "auto" }}>
          {activeStep === 0 && (
            <CheckEmail
              goToNextStep={goToNextStep}
              setCurrentUsername={setCurrentUsername}
            />
          )}
          {activeStep === 1 && (
            <SetPassword
              goToNextStep={goToNextStep}
              currentUsername={username}
            />
          )}
          {activeStep === 2 && <ResetPasswordComplete />}
        </Box>
      </Container>
    </Page>
  );
}
