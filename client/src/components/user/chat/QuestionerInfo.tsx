import { Icon } from "@iconify/react";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import emailFill from "@iconify/icons-eva/email-fill";
import { Typography, Box, Avatar, Divider, Collapse } from "@mui/material";
import { QuestionerInfo as QuestionerInfoType } from "../../../types/user/Chat";
import {
  StyledCollapseButton,
  StyledRow,
  StyledRowIcon,
  StyledRowText,
} from "./RespondentInfo";

interface QuestionerInfoProps {
  questioner: QuestionerInfoType;
  isContactCollapse: boolean;
  onContactCollapse: () => void;
}

export default function QuestionerInfo({
  questioner,
  isContactCollapse,
  onContactCollapse,
}: QuestionerInfoProps): JSX.Element {
  return (
    <>
      <Box
        sx={{
          pt: 4,
          pb: 3,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Avatar
          src={questioner.avatar}
          alt={questioner.username}
          sx={{ width: 96, height: 96 }}
        />
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="subtitle1">{questioner.username}</Typography>
        </Box>
      </Box>

      <Divider />

      <StyledCollapseButton
        fullWidth
        color="inherit"
        onClick={onContactCollapse}
        endIcon={
          <Icon
            icon={
              isContactCollapse ? arrowIosDownwardFill : arrowIosForwardFill
            }
            width={16}
            height={16}
          />
        }
      >
        联系方式
      </StyledCollapseButton>

      <Collapse in={isContactCollapse}>
        <Box sx={{ px: 2.5, pb: 1 }}>
          <StyledRow>
            <StyledRowIcon icon={emailFill} />
            <StyledRowText>{questioner.email}</StyledRowText>
          </StyledRow>
        </Box>
      </Collapse>
    </>
  );
}
