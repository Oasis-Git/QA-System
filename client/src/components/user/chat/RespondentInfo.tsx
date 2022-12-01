import { Icon } from "@iconify/react";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import emailFill from "@iconify/icons-eva/email-fill";
import roundWechat from "@iconify/icons-ic/round-wechat";
import pinFill from "@iconify/icons-eva/pin-fill";
import roundBusinessCenter from "@iconify/icons-ic/round-business-center";
import {
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { RespondentInfo as RespondentInfoType } from "../../../types/user/Chat";

export const StyledCollapseButton = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: "space-between",
  color: theme.palette.text.disabled,
}));

export const StyledRow = styled("div")(({ theme }) => ({
  display: "flex",
  margin: theme.spacing(1.5, 0),
}));

export const StyledRowIcon = styled(Icon)(({ theme }) => ({
  width: 16,
  height: 16,
  marginTop: 4,
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const StyledRowText = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  maxWidth: 160,
  wordWrap: "break-word",
  ...theme.typography.body2,
}));

interface RespondentInfoProps {
  respondent: RespondentInfoType;
  isContactCollapse: boolean;
  onContactCollapse: () => void;
  isSpecialtiesCollapse: boolean;
  onSpecialtiesCollapse: () => void;
}

export default function RespondentInfo({
  respondent,
  isContactCollapse,
  onContactCollapse,
  isSpecialtiesCollapse,
  onSpecialtiesCollapse,
}: RespondentInfoProps): JSX.Element {
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
          src={respondent.avatar}
          alt={respondent.username}
          sx={{ width: 96, height: 96 }}
        />
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="subtitle1">{respondent.username}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {respondent.description}
          </Typography>
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
            <StyledRowText>{respondent.email}</StyledRowText>
          </StyledRow>
          <StyledRow>
            <StyledRowIcon icon={roundWechat} />
            <StyledRowText>{respondent.wechat}</StyledRowText>
          </StyledRow>
          <StyledRow>
            <StyledRowIcon icon={pinFill} />
            <StyledRowText>{respondent.weibo}</StyledRowText>
          </StyledRow>
        </Box>
      </Collapse>

      <Divider />

      <StyledCollapseButton
        fullWidth
        color="inherit"
        onClick={onSpecialtiesCollapse}
        endIcon={
          <Icon
            icon={
              isSpecialtiesCollapse ? arrowIosDownwardFill : arrowIosForwardFill
            }
            width={16}
            height={16}
          />
        }
      >
        专长
      </StyledCollapseButton>

      <Collapse in={isSpecialtiesCollapse}>
        <Box sx={{ px: 2.5, pb: 1 }}>
          {respondent.specialities.map((specialty, idx) => (
            <StyledRow key={idx}>
              <StyledRowIcon icon={roundBusinessCenter} />
              <StyledRowText>{specialty}</StyledRowText>
            </StyledRow>
          ))}
        </Box>
      </Collapse>
    </>
  );
}
