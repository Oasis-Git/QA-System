import { useState } from "react";
import { QuestionInfo as QuestionInfoType } from "../../../types/user/Chat";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Card,
} from "@mui/material";
import { Transition } from "../../../pages/admin/QuestionCensor";
import { styled } from "@mui/material/styles";
import Markdown from "../../general/Markdown";
import CloseIcon from "@mui/icons-material/Close";

interface QuestionerInfoProps {
  question: QuestionInfoType;
}

const StyledLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function QuestionInfo({
  question,
}: QuestionerInfoProps): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="text" onClick={handleDialogOpen}>
          查看问题详情
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        TransitionComponent={Transition}
        fullScreen
      >
        <AppBar position="relative">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDialogClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
              问题详情
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack spacing={3} sx={{ padding: 2 }}>
          <div>
            <StyledLabel>问题标题</StyledLabel>
            <Typography variant="h5" gutterBottom>
              {question.title}
            </Typography>
          </div>

          <div>
            <StyledLabel>问题描述</StyledLabel>
            <Card sx={{ padding: 2 }}>
              <Markdown>{question.description}</Markdown>
            </Card>
          </div>

          <div>
            <StyledLabel>回答</StyledLabel>
            <Card sx={{ padding: 2 }}>
              <Markdown>{question.answer}</Markdown>
            </Card>
          </div>
        </Stack>
      </Dialog>
    </>
  );
}
