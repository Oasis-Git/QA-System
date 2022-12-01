import checkmarkFill from "@iconify/icons-eva/checkmark-fill";
import { Icon } from "@iconify/react";
import {
  Box,
  Container,
  Grid,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
} from "@mui/material";
// material
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Page from "../../components/general/Page";
import ConfirmRespondent from "../../components/qa/ConfirmRespondent";
import PostNewQuestion from "../../components/qa/PostNewQuestion";
import PostSuccess from "../../components/qa/PostSuccess";
import useProfile from "../../hooks/user/useProfile";
// ----------------------------------------------------------------------

const STEPS = ["确认回答者", "提出问题", "支付成功"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
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

function QontoStepIcon({
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

export default function PostQuestion(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const { name = "" } = useParams();
  const profile = useProfile(name);
  const respondentProfile = profile.respondentProfile;
  if (respondentProfile === null) {
    throw Error(`\`${name}\` 不是回答者！`);
  }
  const goToNextStep = () => {
    setActiveStep(activeStep => {
      return activeStep + 1;
    });
  };

  return (
    <Page title="提交订单">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="提交订单"
          links={[{ name: "回答者列表", href: "/" }, { name: "提交订单" }]}
        />

        <Grid container justifyContent={"center"}>
          <Grid item xs={12} md={12} sx={{ mb: 5 }}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {STEPS.map(label => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
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

        <Box sx={{ maxWidth: 1080, mx: "auto" }}>
          {activeStep === 0 && (
            <ConfirmRespondent
              avatar={profile.avatar}
              goToNextStep={goToNextStep}
              respondentName={name}
              description={respondentProfile.description}
              fee={respondentProfile.fee}
              specialties={respondentProfile.specialities}
              ratings={respondentProfile.rating}
              questionNumber={respondentProfile.answerCount}
            />
          )}
          {activeStep === 1 && <PostNewQuestion goToNextStep={goToNextStep} />}
          {activeStep === 2 && <PostSuccess />}
        </Box>
      </Container>
    </Page>
  );
}
